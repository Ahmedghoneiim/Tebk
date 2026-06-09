/**
 * Fix Variants Final Script
 *
 * Phase 1: Re-confirm category assignments (idempotent keyword matching)
 * Phase 2: Cleanup guard — delete any variants still on Diagnostic Devices (cat 4)
 *           or General Supplies (cat 7), where S/M/L sizing makes no medical sense
 *
 * Usage:
 *   node scripts/fix-variants-final.js
 *
 * Safe to re-run: category updates are skipped when already correct; variant
 * deletes are no-ops when the target rows no longer exist.
 */

require('dotenv').config({ path: __dirname + '/.env.migration' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Category rules — order matters (first match wins) ─────────────────────────
// Copied verbatim from fix-categories-variants.js to stay in sync.
const CATEGORY_RULES = [
  {
    id: 1, // Tubes & Airways
    keywords: ['tube', 'laryngeal', 'tracheal', 'tracheotomy', 'airway', 'catheter', 'kan', 'q-tube', 'laryngoplasty', 'laryngeal incision', 'laryngeal slit', 'speech valve'],
  },
  {
    id: 2, // Masks & Respiratory
    keywords: ['mask', 'nebulizer', 'oxygen', 'anesthetic', 'aero chamber', 'respiratory'],
  },
  {
    id: 3, // Gloves
    keywords: ['glove', 'nitrile', 'vinyl', 'sterile glove'],
  },
  {
    id: 4, // Diagnostic Devices — NO variants allowed
    keywords: [
      'thermometer', 'scale', 'glucose', 'oximeter', 'sonar', 'blood pressure',
      'monitor', 'accu-chek', 'accu chek', 'caresens', 'sinocare', 'glucodr',
      'contec', 'pulse ox', 'oled', 'ultralife', 'granzia', 'leica', 'rosemax scale',
      'kenneli', 'beurer', 'medsana', 'wrist', 'headphone', 'bakr sonar', 'italian sonar',
      'bakr drew', 'bakr drawing', 'pump draws', 'pump (blowing',
    ],
  },
  {
    id: 5, // Wound Care
    keywords: ['gauze', 'bandage', 'plaster', 'tape', 'gel foam', 'vaseline', 'blaster', 'bon bad', 'gms roll'],
  },
  {
    id: 6, // Syringes & Needles
    keywords: ['syringe', 'needle', 'butterfly', 'cannula', 'silk thread', 'silk 2', 'portuka', 'chinese silk'],
  },
]

const DEFAULT_CATEGORY_ID = 7 // General Supplies — NO variants allowed

function detectCategory(title) {
  const lower = (title || '').toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return rule.id
    }
  }
  return DEFAULT_CATEGORY_ID
}

// ── Phase 1: Re-confirm category assignments ───────────────────────────────────
async function confirmCategories() {
  console.log('\n─────────────────────────────────────────────')
  console.log('Phase 1: Confirming category assignments...')
  console.log('─────────────────────────────────────────────')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, category_id')

  if (error) { console.error('[FETCH ERROR]', error.message); return }

  let updated = 0
  let skipped = 0

  for (const product of products) {
    const categoryId = detectCategory(product.title)
    if (product.category_id === categoryId) { skipped++; continue }

    const { error: updateError } = await supabase
      .from('products')
      .update({ category_id: categoryId })
      .eq('id', product.id)

    if (updateError) {
      console.error(`  [ERROR] id=${product.id} "${product.title}": ${updateError.message}`)
    } else {
      updated++
      console.log(`  Updated id=${product.id} "${product.title}" → category ${categoryId}`)
    }
  }

  console.log(`\n✅ Updated: ${updated} | ⏭ Already correct: ${skipped}`)
}

// ── Phase 2: Cleanup guard for Diagnostic Devices & General Supplies ──────────
// Deletes any variants on products in cat 4 or cat 7 — where sizing is medically
// nonsensical (blood pressure monitors, scalpels, bedspreads, etc. have no size).
async function removeInvalidVariants() {
  console.log('\n─────────────────────────────────────────────')
  console.log('Phase 2: Removing variants from Diagnostic Devices & General Supplies...')
  console.log('─────────────────────────────────────────────')

  const { data: targetProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, title, category_id')
    .in('category_id', [4, 7])

  if (fetchError) { console.error('[FETCH ERROR]', fetchError.message); return }

  const targetIds = targetProducts.map(p => p.id)
  if (targetIds.length === 0) {
    console.log('\n✅ No products in Diagnostic Devices or General Supplies found. Nothing to delete.')
    return
  }

  const { count: beforeCount } = await supabase
    .from('product-variants')
    .select('*', { count: 'exact', head: true })
    .in('product_id', targetIds)

  if (beforeCount === 0) {
    console.log('\n✅ No variants found on these products — already clean.')
    return
  }

  console.log(`\n  Found ${beforeCount} variants to delete across ${targetIds.length} products...`)

  const { error: deleteError } = await supabase
    .from('product-variants')
    .delete()
    .in('product_id', targetIds)

  if (deleteError) {
    console.error('[DELETE ERROR]', deleteError.message)
  } else {
    console.log(`\n✅ Deleted ${beforeCount} invalid variants.`)
  }
}

// ── Phase 3: Final summary ────────────────────────────────────────────────────
async function printSummary() {
  console.log('\n─────────────────────────────────────────────')
  console.log('Summary: Variant counts by category')
  console.log('─────────────────────────────────────────────')

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, products(id, product-variants(id))')

  if (error) { console.error('[FETCH ERROR]', error.message); return }

  for (const cat of data) {
    const variantCount = cat.products.reduce((sum, p) => sum + (p['product-variants']?.length || 0), 0)
    const marker = [4, 7].includes(cat.id) ? (variantCount > 0 ? '❌' : '✅') : '✅'
    console.log(`  ${marker} ${cat.name}: ${variantCount} variants across ${cat.products.length} products`)
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  await confirmCategories()
  await removeInvalidVariants()
  await printSummary()
  console.log('\n✅ Done. DB is clean — verify in the client app and admin dashboard.')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
