export const MOCK_CATEGORIES = [
  { id: 'ppe',        name: 'PPE & Protection' },
  { id: 'diagnostic', name: 'Diagnostic' },
  { id: 'consumables',name: 'Consumables' },
  { id: 'lab',        name: 'Laboratory' },
  { id: 'surgical',   name: 'Surgical' },
  { id: 'dental',     name: 'Dental' },
]

export const MOCK_PRODUCTS = [
  { id: 'p1',  name: 'Nitrile Examination Gloves (Box 100)',  category: 'ppe',        price: 120,  unit: 'box',   stock: 500, featured: true,  image_url: null, description: 'Powder-free, non-sterile nitrile gloves. Suitable for examination and diagnostic procedures.' },
  { id: 'p2',  name: 'Surgical Face Masks (Box 50)',          category: 'ppe',        price: 85,   unit: 'box',   stock: 300, featured: true,  image_url: null, description: '3-ply surgical face masks with earloop design. FDA-cleared.' },
  { id: 'p3',  name: 'N95 Respirator Masks (Box 20)',         category: 'ppe',        price: 210,  unit: 'box',   stock: 150, featured: false, image_url: null, description: 'NIOSH-approved N95 respirators for healthcare workers.' },
  { id: 'p4',  name: 'Disposable Syringes 5ml (Box 100)',     category: 'consumables',price: 95,   unit: 'box',   stock: 800, featured: true,  image_url: null, description: 'Sterile, single-use syringes with Luer-Lock tip.' },
  { id: 'p5',  name: 'IV Cannula 20G (Box 50)',               category: 'consumables',price: 175,  unit: 'box',   stock: 400, featured: false, image_url: null, description: 'Safety IV cannula with injection port and wings.' },
  { id: 'p6',  name: 'Blood Collection Tubes EDTA (Box 100)',  category: 'lab',       price: 145,  unit: 'box',   stock: 600, featured: true,  image_url: null, description: 'Purple-cap EDTA tubes for complete blood count tests.' },
  { id: 'p7',  name: 'Blood Glucose Meter',                   category: 'diagnostic', price: 850,  unit: 'piece', stock: 80,  featured: true,  image_url: null, description: 'Portable glucometer with 5-second reading. Includes 10 test strips.' },
  { id: 'p8',  name: 'Digital Thermometer',                   category: 'diagnostic', price: 120,  unit: 'piece', stock: 200, featured: false, image_url: null, description: 'Fast-reading digital thermometer, accurate to ±0.1°C.' },
  { id: 'p9',  name: 'Stethoscope Dual Head',                 category: 'diagnostic', price: 650,  unit: 'piece', stock: 60,  featured: false, image_url: null, description: 'Dual-head stethoscope for adult and pediatric use.' },
  { id: 'p10', name: 'Sterile Gauze Swabs 10x10 (Box 100)',   category: 'surgical',   price: 110,  unit: 'box',   stock: 700, featured: false, image_url: null, description: 'Non-woven sterile gauze swabs for wound care.' },
  { id: 'p11', name: 'Surgical Drapes (Box 10)',              category: 'surgical',   price: 320,  unit: 'box',   stock: 120, featured: false, image_url: null, description: 'Sterile disposable surgical drapes for procedure fields.' },
  { id: 'p12', name: 'Dental Examination Kit',                category: 'dental',     price: 280,  unit: 'kit',   stock: 90,  featured: true,  image_url: null, description: 'Complete dental examination kit: mirror, probe, tweezers.' },
  { id: 'p13', name: 'PPE Protective Gowns (Box 10)',         category: 'ppe',        price: 195,  unit: 'box',   stock: 250, featured: false, image_url: null, description: 'Level 2 isolation gowns, fluid-resistant.' },
  { id: 'p14', name: 'Urine Test Strips (Pack 100)',          category: 'lab',        price: 180,  unit: 'pack',  stock: 400, featured: false, image_url: null, description: '10-parameter urine analysis strips.' },
  { id: 'p15', name: 'Sterile Dressings 10x20cm (Box 10)',   category: 'consumables',price: 145,  unit: 'box',   stock: 350, featured: false, image_url: null, description: 'Non-adherent sterile wound dressings.' },
  { id: 'p16', name: 'Tongue Depressors (Box 100)',           category: 'consumables',price: 45,   unit: 'box',   stock: 1000,featured: false, image_url: null, description: 'Wooden tongue depressors, sterile-packed.' },
]

export const MOCK_ORDERS = [
  {
    id: 'o1',
    status: 'delivered',
    total: 1250,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    shipping_name: 'Dr. Ahmed Mohamed',
    order_items: [
      { id: 'oi1', product_id: 'p1', name: 'Nitrile Examination Gloves (Box 100)', price: 120, quantity: 5 },
      { id: 'oi2', product_id: 'p4', name: 'Disposable Syringes 5ml (Box 100)',    price: 95,  quantity: 4 },
    ],
  },
  {
    id: 'o2',
    status: 'processing',
    total: 850,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    shipping_name: 'Dr. Ahmed Mohamed',
    order_items: [
      { id: 'oi3', product_id: 'p7', name: 'Blood Glucose Meter', price: 850, quantity: 1 },
    ],
  },
]

export const MOCK_BUNDLES = [
  {
    id: 'b1',
    name: 'General Clinic Starter Bundle',
    description: 'Everything a new general clinic needs to get started. Includes PPE, diagnostics, and essential consumables.',
    original_price: 3200,
    bundle_price:   2560,
    savings_pct:    20,
    category: 'general',
    featured: true,
    items: [
      { product_id: 'p1', name: 'Nitrile Gloves Box 100', quantity: 5,  price: 120 },
      { product_id: 'p2', name: 'Surgical Masks Box 50',  quantity: 3,  price: 85  },
      { product_id: 'p4', name: 'Syringes 5ml Box 100',   quantity: 4,  price: 95  },
      { product_id: 'p7', name: 'Blood Glucose Meter',    quantity: 1,  price: 850 },
      { product_id: 'p8', name: 'Digital Thermometer',    quantity: 2,  price: 120 },
    ],
  },
  {
    id: 'b2',
    name: 'ICU Starter Kit',
    description: 'Critical care essentials for ICU setup. IV supplies, monitoring, and protective equipment.',
    original_price: 5500,
    bundle_price:   4290,
    savings_pct:    22,
    category: 'icu',
    featured: true,
    items: [
      { product_id: 'p3', name: 'N95 Respirators Box 20', quantity: 5,  price: 210 },
      { product_id: 'p5', name: 'IV Cannula 20G Box 50',  quantity: 6,  price: 175 },
      { product_id: 'p6', name: 'Blood Collection EDTA',  quantity: 4,  price: 145 },
      { product_id: 'p13',name: 'Protective Gowns Box 10',quantity: 3,  price: 195 },
    ],
  },
  {
    id: 'b3',
    name: 'Dental Clinic Bundle',
    description: 'Complete dental supply package for a busy dental clinic.',
    original_price: 2800,
    bundle_price:   2240,
    savings_pct:    20,
    category: 'dental',
    featured: false,
    items: [
      { product_id: 'p1', name: 'Nitrile Gloves Box 100',  quantity: 4,  price: 120 },
      { product_id: 'p2', name: 'Surgical Masks Box 50',   quantity: 2,  price: 85  },
      { product_id: 'p12',name: 'Dental Examination Kit',  quantity: 4,  price: 280 },
    ],
  },
  {
    id: 'b4',
    name: 'Laboratory Setup Bundle',
    description: 'Essential lab supplies for diagnostic laboratories.',
    original_price: 2100,
    bundle_price:   1680,
    savings_pct:    20,
    category: 'lab',
    featured: false,
    items: [
      { product_id: 'p6', name: 'Blood Collection EDTA',  quantity: 5,  price: 145 },
      { product_id: 'p14',name: 'Urine Test Strips',      quantity: 3,  price: 180 },
      { product_id: 'p1', name: 'Nitrile Gloves Box 100', quantity: 3,  price: 120 },
    ],
  },
]

export const MOCK_SUBS = [
  { id: 's1', product: 'Nitrile Gloves Box 100', product_id: 'p1', price: 120, qty: 5, frequency: 'monthly',    status: 'active', next_delivery: '2026-06-01' },
  { id: 's2', product: 'Surgical Masks Box 50',   product_id: 'p2', price: 85,  qty: 3, frequency: 'bi-monthly', status: 'paused', next_delivery: null },
  { id: 's3', product: 'Syringes 5ml Box 100',    product_id: 'p4', price: 95,  qty: 4, frequency: 'monthly',    status: 'active', next_delivery: '2026-06-15' },
]

export const MOCK_INVENTORY = MOCK_PRODUCTS.slice(0, 8).map((p, i) => ({
  ...p,
  current_stock: [45, 12, 80, 8, 55, 30, 19, 100][i],
  min_threshold: 20,
  monthly_usage: [15, 20, 10, 25, 8, 12, 18, 5][i],
}))

export const MOCK_PURCHASE_REQUESTS = [
  { id: 'pr1', title: 'Monthly PPE Restock',      description: 'Regular monthly PPE order for all staff.', status: 'approved', total: 3200, items: 4, created_at: '2026-05-01' },
  { id: 'pr2', title: 'Lab Equipment Refresh',    description: 'Replace aging diagnostic equipment.',      status: 'pending',  total: 8500, items: 6, created_at: '2026-05-10' },
  { id: 'pr3', title: 'Urgent Surgical Supplies', description: 'Emergency restock for upcoming procedure.', status: 'rejected', total: 1200, items: 2, created_at: '2026-04-28' },
]

export const MOCK_RETURNS = [
  { id: 'r1', order_id: 'o1', product: 'Nitrile Gloves Box 100', reason: 'Wrong size delivered', status: 'approved', created_at: '2026-04-20' },
  { id: 'r2', order_id: 'o2', product: 'Blood Glucose Meter',    reason: 'Defective unit',       status: 'pending',  created_at: '2026-05-12' },
]
