import { MOCK_PRODUCTS } from './mockData'

const CLINIC_PRODUCT_MAP = {
  general:    ['ppe', 'consumables', 'diagnostic'],
  dental:     ['dental', 'ppe', 'consumables'],
  icu:        ['ppe', 'consumables', 'surgical'],
  lab:        ['lab', 'diagnostic', 'ppe'],
  pediatric:  ['consumables', 'diagnostic', 'ppe'],
  surgical:   ['surgical', 'ppe', 'consumables'],
}

const BUDGET_MULTIPLIERS = {
  low:    0.5,
  medium: 1.0,
  high:   2.0,
}

const CASE_EXTRA_CATEGORIES = {
  wound_care:    'surgical',
  blood_tests:   'lab',
  injections:    'consumables',
  examinations:  'diagnostic',
  ppe_heavy:     'ppe',
}

export function generateRecommendations({ clinicType, patientVolume, budget, caseTypes = [] }) {
  const relevantCategories = new Set(CLINIC_PRODUCT_MAP[clinicType] || ['consumables', 'ppe'])

  caseTypes.forEach((c) => {
    const extra = CASE_EXTRA_CATEGORIES[c]
    if (extra) relevantCategories.add(extra)
  })

  const multiplier   = BUDGET_MULTIPLIERS[budget] || 1
  const baseQuantity = Math.max(1, Math.ceil(patientVolume / 50))

  const recommendations = MOCK_PRODUCTS
    .filter((p) => relevantCategories.has(p.category))
    .map((p) => {
      const qty         = Math.round(baseQuantity * multiplier * (p.category === 'ppe' ? 2 : 1))
      const itemTotal   = p.price * qty
      const cheaper     = MOCK_PRODUCTS.find((alt) => alt.category === p.category && alt.price < p.price && alt.id !== p.id) || null
      const premium     = MOCK_PRODUCTS.find((alt) => alt.category === p.category && alt.price > p.price && alt.id !== p.id) || null
      return {
        product:          p,
        recommendedQty:   qty,
        itemTotal,
        cheaperAlternative: cheaper,
        premiumAlternative: premium,
      }
    })
    .slice(0, 8)

  const totalCost     = recommendations.reduce((sum, r) => sum + r.itemTotal, 0)
  const savingsIfCheaper = recommendations.reduce((sum, r) => {
    if (r.cheaperAlternative) {
      return sum + (r.product.price - r.cheaperAlternative.price) * r.recommendedQty
    }
    return sum
  }, 0)

  return { recommendations, totalCost, savingsIfCheaper }
}

export const CLINIC_TYPES = [
  { value: 'general',   label: 'General Practice' },
  { value: 'dental',    label: 'Dental Clinic' },
  { value: 'icu',       label: 'ICU / Critical Care' },
  { value: 'lab',       label: 'Diagnostic Lab' },
  { value: 'pediatric', label: 'Pediatric Clinic' },
  { value: 'surgical',  label: 'Surgical Center' },
]

export const CASE_TYPES = [
  { value: 'wound_care',   label: 'Wound Care & Dressings' },
  { value: 'blood_tests',  label: 'Blood Tests & Lab Work' },
  { value: 'injections',   label: 'Injections & IV Therapy' },
  { value: 'examinations', label: 'General Examinations' },
  { value: 'ppe_heavy',    label: 'High-Risk / PPE-Heavy Procedures' },
]
