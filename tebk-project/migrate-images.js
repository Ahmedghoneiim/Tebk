/**
 * migrate-images.js
 *
 * Migrates all image URLs stored in Supabase tables to Cloudinary.
 * For each row that has a non-Cloudinary image URL:
 *   1. Uploads the image to Cloudinary (Cloudinary fetches it directly by URL)
 *   2. Updates the database row with the new optimised Cloudinary URL
 *
 * Usage:
 *   node migrate-images.js                   — migrate all tables
 *   node migrate-images.js --dry-run         — preview only, no changes made
 *   node migrate-images.js --table=products  — one table only
 *
 * Requires a .env.migrate file in the same directory (see .env.migrate.example).
 */

import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'
import { config }         from 'dotenv'
import { createClient }   from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

// Load env from .env.migrate (separate from Vite's .env.local)
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env.migrate') })

// ─── Environment variables ──────────────────────────────────────────────────
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env

function validateEnv() {
  const required = {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  }
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables in .env.migrate:')
    missing.forEach(v => console.error(`   • ${v}`))
    console.error('\nCopy .env.migrate.example → .env.migrate and fill in your credentials.')
    process.exit(1)
  }
}

// ─── Table definitions ───────────────────────────────────────────────────────
// table       — Supabase table name
// imageColumn — column that holds the image URL
// idColumn    — primary key column (used as Cloudinary public_id)
// folder      — Cloudinary folder path for organised storage
const TABLES = [
  { table: 'products', imageColumn: 'image',  idColumn: 'id', folder: 'tebk/products' },
  { table: 'bundle',   imageColumn: 'image',       idColumn: 'id', folder: 'tebk/bundles'  },
  { table: 'profiles', imageColumn: 'avatar_url',  idColumn: 'id', folder: 'tebk/profiles' },
  { table: 'order_items', imageColumn: 'image_url',  idColumn: 'id', folder: 'tebk/order_items' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isCloudinaryUrl = (url) =>
  typeof url === 'string' && url.includes('res.cloudinary.com')

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  try { new URL(url); return true } catch { return false }
}

const safePublicId = (id) => String(id).replace(/[^a-zA-Z0-9_-]/g, '_')

/**
 * Upload a remote image URL directly to Cloudinary.
 * Cloudinary fetches the source URL itself — no local buffering needed.
 * Returns the secure_url of the uploaded/existing asset.
 */
async function uploadToCloudinary(sourceUrl, folder, publicId) {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder,
    public_id:     publicId,
    overwrite:     true,
    resource_type: 'image',
    fetch_format:  'auto',
    quality:       'auto',
  })
  return result.secure_url
}

// ─── Per-table migration ──────────────────────────────────────────────────────
async function migrateTable(supabase, config, isDryRun) {
  const { table, imageColumn, idColumn, folder } = config

  console.log(`\n${'─'.repeat(62)}`)
  console.log(`📦  Table: ${table}   column: ${imageColumn}   folder: ${folder}`)
  console.log(`${'─'.repeat(62)}`)

  // Fetch only rows that have an image URL but it's not already on Cloudinary
  const { data: rows, error: fetchError } = await supabase
    .from(table)
    .select(`${idColumn}, ${imageColumn}`)
    .not(imageColumn, 'is', null)
    .not(imageColumn, 'ilike', '%cloudinary.com%')

  if (fetchError) {
    // Table might not exist or RLS might block it — log and continue
    console.warn(`  ⚠️  Could not query "${table}": ${fetchError.message}`)
    return { migrated: 0, skipped: 0, errors: 0 }
  }

  if (!rows || rows.length === 0) {
    console.log('  ✓  No rows need migration.')
    return { migrated: 0, skipped: 0, errors: 0 }
  }

  console.log(`  Found ${rows.length} row(s) to process.\n`)

  let migrated = 0
  let skipped  = 0
  let errors   = 0

  for (const row of rows) {
    const id       = row[idColumn]
    const imageUrl = row[imageColumn]

    if (!isValidUrl(imageUrl)) {
      console.log(`  ⏭   [${id}] Skipped — not a valid URL: "${imageUrl}"`)
      skipped++
      continue
    }

    const truncated = imageUrl.length > 70 ? imageUrl.slice(0, 70) + '…' : imageUrl
    console.log(`  ⬆   [${id}] ${truncated}`)

    if (isDryRun) {
      console.log(`       🔍  DRY RUN — would upload to Cloudinary folder "${folder}"`)
      migrated++
      continue
    }

    try {
      const cloudinaryUrl = await uploadToCloudinary(
        imageUrl,
        folder,
        safePublicId(id),
      )

      console.log(`       ✓  Uploaded  → ${cloudinaryUrl}`)

      const { error: updateError } = await supabase
        .from(table)
        .update({ [imageColumn]: cloudinaryUrl })
        .eq(idColumn, id)

      if (updateError) {
        console.error(`       ❌  DB update failed: ${updateError.message}`)
        errors++
      } else {
        console.log('       ✓  Database updated.')
        migrated++
      }
    } catch (err) {
      console.error(`       ❌  Upload failed: ${err.message || err}`)
      errors++
    }
  }

  console.log(
    `\n  Result — ✅ ${migrated} migrated | ⏭  ${skipped} skipped | ❌ ${errors} errors`,
  )
  return { migrated, skipped, errors }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args     = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  const tableArg = args.find(a => a.startsWith('--table='))?.split('=')[1]

  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║      TEBK — Supabase → Cloudinary Image Migration           ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')

  if (isDryRun) {
    console.log('\n⚠️   DRY RUN — no uploads or database changes will be made.\n')
  }

  validateEnv()

  // Service role key bypasses Row Level Security so the script can
  // read and update every row without being blocked by auth policies.
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key:    CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure:     true,
  })

  const targets = tableArg
    ? TABLES.filter(t => t.table === tableArg)
    : TABLES

  if (targets.length === 0) {
    console.error(`❌  No table config found for: "${tableArg}"`)
    console.error(`   Available: ${TABLES.map(t => t.table).join(', ')}`)
    process.exit(1)
  }

  let totalMigrated = 0
  let totalSkipped  = 0
  let totalErrors   = 0

  for (const cfg of targets) {
    const { migrated, skipped, errors } = await migrateTable(supabase, cfg, isDryRun)
    totalMigrated += migrated
    totalSkipped  += skipped
    totalErrors   += errors
  }

  console.log('\n' + '═'.repeat(62))
  console.log('FINAL SUMMARY')
  console.log('═'.repeat(62))
  console.log(`  ✅  Migrated : ${totalMigrated}`)
  console.log(`  ⏭   Skipped  : ${totalSkipped}`)
  console.log(`  ❌  Errors   : ${totalErrors}`)

  if (totalErrors > 0) {
    console.log('\n⚠️   Some images failed. Re-run the script — succeeded rows are')
    console.log('    already updated and will be skipped automatically next time.')
    process.exit(1)
  } else {
    console.log('\n🎉  Migration complete!')
  }
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message || err)
  process.exit(1)
})
