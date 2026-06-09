/**
 * Supabase → Cloudinary Image Migration Script
 *
 * Usage:
 *   node scripts/migrate-images.js
 *
 * Before running:
 *   1. Fill in scripts/.env.migration with your credentials
 *   2. Run: npm install @supabase/supabase-js cloudinary dotenv --save-dev
 *   3. First run uses limit:1 (safe test). Check the output, then set limit:null for full migration.
 */

require('dotenv').config({ path: __dirname + '/.env.migration' })
const { createClient } = require('@supabase/supabase-js')
const cloudinary = require('cloudinary').v2

// ── Clients ──────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY   // Service role bypasses RLS — never use in browser
)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

// ── Core migration function ───────────────────────────────────────────────────

/**
 * @param {string} tableName   - Supabase table name, e.g. 'products' or 'bundle'
 * @param {string} columnName  - Image column name, e.g. 'image_url' or 'image'
 * @param {object} options
 * @param {number|null} options.limit   - Rows to process. Use 1 for a safe test run, null for all.
 * @param {boolean}     options.dryRun  - If true, prints what would happen without touching the DB.
 */
async function migrateImages(tableName, columnName, { limit = 1, dryRun = false } = {}) {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Table: ${tableName}  |  Column: ${columnName}  |  Limit: ${limit ?? 'ALL'}  |  DryRun: ${dryRun}`)
  console.log('─'.repeat(60))

  // 1. Fetch rows that have a non-null image value
  let query = supabase
    .from(tableName)
    .select(`id, ${columnName}`)
    .not(columnName, 'is', null)
    .neq(columnName, '')

  if (limit !== null) query = query.limit(limit)

  const { data: rows, error: fetchError } = await query

  if (fetchError) {
    console.error(`[FETCH ERROR] ${tableName}: ${fetchError.message}`)
    return
  }

  if (!rows || rows.length === 0) {
    console.log(`[SKIP] No rows with images found in "${tableName}".`)
    return
  }

  console.log(`Found ${rows.length} row(s) to process.\n`)

  let successCount = 0
  let skipCount    = 0
  let errorCount   = 0

  // 2. Process each row
  for (const row of rows) {
    const originalUrl = row[columnName]?.trim()
    const rowId       = row.id

    // Skip obviously broken URLs
    if (!originalUrl || !originalUrl.startsWith('http')) {
      console.log(`  [SKIP]  id=${rowId} — URL missing or invalid: "${originalUrl}"`)
      skipCount++
      continue
    }

    try {
      console.log(`  [UPLOAD] id=${rowId} — ${originalUrl.slice(0, 80)}...`)

      if (dryRun) {
        console.log(`  [DRY RUN] Would upload and update id=${rowId}`)
        successCount++
        continue
      }

      // 3. Upload directly from URL to Cloudinary
      const result = await cloudinary.uploader.upload(originalUrl, {
        folder:         `tebk/${tableName}`,
        resource_type:  'image',
        overwrite:      false,
        // Optional: auto-format + quality on upload
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      })

      const newUrl = result.secure_url
      console.log(`  [DONE]   id=${rowId} → ${newUrl}`)

      // 4. Update Supabase row with the new Cloudinary URL
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [columnName]: newUrl })
        .eq('id', rowId)

      if (updateError) {
        console.error(`  [UPDATE ERROR] id=${rowId}: ${updateError.message}`)
        errorCount++
      } else {
        successCount++
      }

    } catch (err) {
      // Per-row error — log and continue, never crash the script
      const msg = err?.message || String(err)
      console.warn(`  [ERROR]  id=${rowId} — ${msg}`)
      errorCount++
    }
  }

  console.log(`\nSummary for "${tableName}": ✅ ${successCount} done | ⏭ ${skipCount} skipped | ❌ ${errorCount} errors`)
}

// ── Run migrations ────────────────────────────────────────────────────────────
//
// STEP 1 — Test with limit:1 (default). Inspect the output before continuing.
// STEP 2 — When satisfied, change limit to null to migrate all rows.
//
//   ⚠️  SAFETY FLAG: limit:1 means only ONE row is processed per table.
//       Change to limit:null when ready for full migration.
//

async function main() {
  await migrateImages('products', 'image', { limit: null });
  await migrateImages('bundle',            'image',     { limit: null })
  await migrateImages('product-variants', 'image', { limit: null });

  // Add more tables here as needed:
  // await migrateImages('other_table', 'image_url', { limit: 1 })

  console.log('\n✅ Migration script finished.')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
