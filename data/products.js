const products = [
  {
    id: 'prod-001',
    sku: 'LAPTOP-PRO-15',
    name: 'ProBook Laptop 15"',
    description: 'High-performance laptop with 16GB RAM, 512GB SSD, and Intel i7 processor. Perfect for professionals and creators.',
    category: 'electronics',
    subcategory: 'laptops',
    price: 1299.99,
    salePrice: null,
    inventory: 25,
    images: ['/images/products/laptop-pro.jpg'],
    attributes: {
      brand: 'TechPro',
      screen: '15 inch',
      ram: '16GB',
      storage: '512GB SSD'
    },
    tags: ['bestseller', 'featured', 'professional']
  },
  {
    id: 'prod-002',
    sku: 'PHONE-SMART-X',
    name: 'SmartPhone X',
    description: 'Latest flagship smartphone with 6.5" OLED display, 5G connectivity, and advanced camera system.',
    category: 'electronics',
    subcategory: 'phones',
    price: 899.99,
    salePrice: 799.99,
    inventory: 50,
    images: ['/images/products/phone-x.jpg'],
    attributes: {
      brand: 'PhoneCo',
      screen: '6.5 inch',
      storage: '256GB',
      camera: '108MP'
    },
    tags: ['sale', 'featured', '5g']
  },
  {
    id: 'prod-003',
    sku: 'HEADPHONE-NC-PRO',
    name: 'Noise Cancelling Headphones Pro',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.',
    category: 'electronics',
    subcategory: 'audio',
    price: 349.99,
    salePrice: null,
    inventory: 75,
    images: ['/images/products/headphones-nc.jpg'],
    attributes: {
      brand: 'AudioMax',
      type: 'Over-ear',
      wireless: 'Yes',
      battery: '30 hours'
    },
    tags: ['bestseller', 'premium']
  },
  {
    id: 'prod-004',
    sku: 'WATCH-SMART-FIT',
    name: 'FitWatch Smart Watch',
    description: 'Fitness-focused smartwatch with heart rate monitoring, GPS tracking, and 7-day battery life.',
    category: 'electronics',
    subcategory: 'wearables',
    price: 249.99,
    salePrice: 199.99,
    inventory: 100,
    images: ['/images/products/smartwatch.jpg'],
    attributes: {
      brand: 'FitTech',
      display: 'AMOLED',
      waterproof: 'Yes',
      battery: '7 days'
    },
    tags: ['sale', 'fitness', 'featured']
  },
  {
    id: 'prod-005',
    sku: 'TABLET-PRO-11',
    name: 'ProTab Tablet 11"',
    description: 'Versatile tablet with stylus support, 11-inch display, and all-day battery. Perfect for work and entertainment.',
    category: 'electronics',
    subcategory: 'tablets',
    price: 649.99,
    salePrice: null,
    inventory: 40,
    images: ['/images/products/tablet-pro.jpg'],
    attributes: {
      brand: 'TechPro',
      screen: '11 inch',
      storage: '128GB',
      stylus: 'Included'
    },
    tags: ['professional', 'creative']
  },
  {
    id: 'prod-006',
    sku: 'CAMERA-MIRRORLESS',
    name: 'Mirrorless Camera MX-500',
    description: 'Professional mirrorless camera with 24MP sensor, 4K video recording, and interchangeable lens system.',
    category: 'electronics',
    subcategory: 'cameras',
    price: 1499.99,
    salePrice: null,
    inventory: 15,
    images: ['/images/products/camera-mirrorless.jpg'],
    attributes: {
      brand: 'PhotoPro',
      megapixels: '24MP',
      video: '4K',
      lens: 'Interchangeable'
    },
    tags: ['professional', 'photography']
  },
  {
    id: 'prod-007',
    sku: 'KEYBOARD-MECH-RGB',
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Premium mechanical keyboard with customizable RGB lighting, tactile switches, and programmable keys.',
    category: 'electronics',
    subcategory: 'peripherals',
    price: 159.99,
    salePrice: 129.99,
    inventory: 80,
    images: ['/images/products/keyboard-gaming.jpg'],
    attributes: {
      brand: 'GameGear',
      type: 'Mechanical',
      lighting: 'RGB',
      switches: 'Cherry MX'
    },
    tags: ['sale', 'gaming', 'rgb']
  },
  {
    id: 'prod-008',
    sku: 'MOUSE-WIRELESS-ERGO',
    name: 'Ergonomic Wireless Mouse',
    description: 'Comfortable wireless mouse with ergonomic design, precision tracking, and 6-month battery life.',
    category: 'electronics',
    subcategory: 'peripherals',
    price: 59.99,
    salePrice: null,
    inventory: 120,
    images: ['/images/products/mouse-ergo.jpg'],
    attributes: {
      brand: 'ErgoTech',
      type: 'Wireless',
      dpi: '4000',
      battery: '6 months'
    },
    tags: ['ergonomic', 'comfortable']
  },
  {
    id: 'prod-009',
    sku: 'SPEAKER-BLUETOOTH-PORTABLE',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360° sound, 20-hour battery, and voice assistant support.',
    category: 'electronics',
    subcategory: 'audio',
    price: 99.99,
    salePrice: 79.99,
    inventory: 90,
    images: ['/images/products/speaker-bluetooth.jpg'],
    attributes: {
      brand: 'SoundWave',
      waterproof: 'IPX7',
      battery: '20 hours',
      assistant: 'Yes'
    },
    tags: ['sale', 'portable', 'outdoor']
  },
  {
    id: 'prod-010',
    sku: 'MONITOR-4K-27',
    name: '4K Monitor 27" Professional',
    description: 'Ultra HD 4K monitor with HDR support, 99% sRGB color accuracy, and USB-C connectivity.',
    category: 'electronics',
    subcategory: 'monitors',
    price: 549.99,
    salePrice: null,
    inventory: 35,
    images: ['/images/products/monitor-4k.jpg'],
    attributes: {
      brand: 'ViewPro',
      resolution: '4K UHD',
      size: '27 inch',
      hdr: 'Yes'
    },
    tags: ['professional', '4k', 'creative']
  },
  {
    id: 'prod-011',
    sku: 'CHARGER-WIRELESS-FAST',
    name: 'Fast Wireless Charger',
    description: 'Qi-certified wireless charger with 15W fast charging, LED indicator, and universal compatibility.',
    category: 'electronics',
    subcategory: 'accessories',
    price: 39.99,
    salePrice: 29.99,
    inventory: 150,
    images: ['/images/products/charger-wireless.jpg'],
    attributes: {
      brand: 'ChargeTech',
      power: '15W',
      standard: 'Qi',
      indicator: 'LED'
    },
    tags: ['sale', 'essential', 'fast-charge']
  },
  {
    id: 'prod-012',
    sku: 'CABLE-USB-C-PREMIUM',
    name: 'Premium USB-C Cable 2m',
    description: 'Durable braided USB-C cable with 100W power delivery and 10Gbps data transfer speed.',
    category: 'electronics',
    subcategory: 'accessories',
    price: 24.99,
    salePrice: null,
    inventory: 200,
    images: ['/images/products/cable-usbc.jpg'],
    attributes: {
      brand: 'CableMax',
      length: '2m',
      power: '100W',
      speed: '10Gbps'
    },
    tags: ['essential', 'durable']
  }
];

module.exports = products;
