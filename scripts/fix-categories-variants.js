/**
 * Fix Categories & Variants Script
 *
 * Phase 1: assignCategories() — keyword matching on product title → sets category_id
 * Phase 2: removeWrongVariants() — deletes S/M/L variants from Diagnostic Devices
 *
 * Usage:
 *   node scripts/fix-categories-variants.js
 *
 * Safe to re-run: uses ON CONFLICT / category_id check before deleting.
 */

require('dotenv').config({ path: __dirname + '/.env.migration' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Category rules — order matters (first match wins) ─────────────────────────
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
    id: 4, // Diagnostic Devices — THESE will have variants removed
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

const DEFAULT_CATEGORY_ID = 7 // General Supplies

function detectCategory(title) {
  const lower = (title || '').toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return rule.id
    }
  }
  return DEFAULT_CATEGORY_ID
}

// ── Phase 1: Assign categories ─────────────────────────────────────────────────
async function assignCategories() {
  console.log('\n─────────────────────────────────────────────')
  console.log('Phase 1: Assigning categories to products...')
  console.log('─────────────────────────────────────────────')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, category_id')

  if (error) { console.error('[FETCH ERROR]', error.message); return }

  const byCategory = {}
  let updated = 0
  let skipped = 0

  for (const product of products) {
    const categoryId = detectCategory(product.title)
    byCategory[categoryId] = (byCategory[categoryId] || [])
    byCategory[categoryId].push(product.title)

    // Skip if already correctly assigned
    if (product.category_id === categoryId) { skipped++; continue }

    const { error: updateError } = await supabase
      .from('products')
      .update({ category_id: categoryId })
      .eq('id', product.id)

    if (updateError) {
      console.error(`  [ERROR] id=${product.id} "${product.title}": ${updateError.message}`)
    } else {
      updated++
    }
  }

  console.log(`\n✅ Updated: ${updated} | ⏭ Already set: ${skipped}`)
  console.log('\nCategory breakdown:')
  const categoryNames = {
    1: 'Tubes & Airways',
    2: 'Masks & Respiratory',
    3: 'Gloves',
    4: 'Diagnostic Devices',
    5: 'Wound Care',
    6: 'Syringes & Needles',
    7: 'General Supplies',
  }
  for (const [id, titles] of Object.entries(byCategory)) {
    console.log(`  ${categoryNames[id] || id} (${titles.length}): ${titles.slice(0, 3).join(' | ')}${titles.length > 3 ? ` ...+${titles.length - 3} more` : ''}`)
  }
}

// ── Phase 2: Remove wrong variants from Diagnostic Devices ────────────────────
async function removeWrongVariants() {
  console.log('\n─────────────────────────────────────────────')
  console.log('Phase 2: Removing S/M/L variants from Diagnostic Devices...')
  console.log('─────────────────────────────────────────────')

  // First: show what will be deleted
  const { data: preview, error: previewError } = await supabase
    .from('products')
    .select('id, title')
    .eq('category_id', 4)

  if (previewError) { console.error('[FETCH ERROR]', previewError.message); return }

  console.log(`\nFound ${preview.length} Diagnostic Device products with variants to remove:`)
  preview.forEach(p => console.log(`  id=${p.id}: ${p.title}`))

  const productIds = preview.map(p => p.id)
  if (productIds.length === 0) {
    console.log('\n[SKIP] No diagnostic products found.')
    return
  }

  // Count variants before deletion
  const { count: beforeCount } = await supabase
    .from('product-variants')
    .select('*', { count: 'exact', head: true })
    .in('product_id', productIds)

  console.log(`\n  Variants to delete: ${beforeCount}`)

  // Delete
  const { error: deleteError } = await supabase
    .from('product-variants')
    .delete()
    .in('product_id', productIds)

  if (deleteError) {
    console.error('[DELETE ERROR]', deleteError.message)
  } else {
    console.log(`\n✅ Deleted ${beforeCount} wrong variants from Diagnostic Devices.`)
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  await assignCategories()
  await removeWrongVariants()
  console.log('\n✅ Done. Run your Frontend to verify category filters and size selectors.')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
