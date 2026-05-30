export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Item {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  price: number;
  cost: number;
  supplier: string;
  unit: string;
  status: StockStatus;
  lastUpdated: string;
  categoryId: string;
  inventoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  inventoryId: string;
  itemCount: number;
}

export interface Inventory {
  id: string;
  name: string;
  description: string;
  categoryCount: number;
  itemCount: number;
  createdDate: string;
}

export const INVENTORIES: Inventory[] = [
  {
    id: 'inv-1',
    name: 'Main Warehouse',
    description: 'Primary storage facility for all electronic components and hardware supplies.',
    categoryCount: 2,
    itemCount: 10,
    createdDate: '2024-01-15',
  },
  {
    id: 'inv-2',
    name: 'Retail Store',
    description: 'Front-end retail inventory for consumer products and accessories.',
    categoryCount: 2,
    itemCount: 8,
    createdDate: '2024-02-20',
  },
  {
    id: 'inv-3',
    name: 'Cold Storage',
    description: 'Temperature-controlled storage for perishables and sensitive materials.',
    categoryCount: 2,
    itemCount: 6,
    createdDate: '2024-03-05',
  },
];

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics', description: 'Circuit boards, chips, and electronic components.', inventoryId: 'inv-1', itemCount: 5 },
  { id: 'cat-2', name: 'Hardware', description: 'Screws, bolts, brackets, and mechanical parts.', inventoryId: 'inv-1', itemCount: 5 },
  { id: 'cat-3', name: 'Apparel', description: 'Clothing items, accessories, and footwear.', inventoryId: 'inv-2', itemCount: 4 },
  { id: 'cat-4', name: 'Accessories', description: 'Phone cases, chargers, cables, and peripherals.', inventoryId: 'inv-2', itemCount: 4 },
  { id: 'cat-5', name: 'Beverages', description: 'Chilled drinks, juices, and dairy products.', inventoryId: 'inv-3', itemCount: 3 },
  { id: 'cat-6', name: 'Produce', description: 'Fresh fruits, vegetables, and herbs.', inventoryId: 'inv-3', itemCount: 3 },
];

export const ITEMS: Item[] = [
  // inv-1 / cat-1 Electronics
  { id: 'item-1', name: 'Arduino Uno R3', sku: 'EL-001', quantity: 45, minStock: 10, price: 29.99, cost: 14.50, supplier: 'SparkFun', unit: 'pcs', status: 'in-stock', lastUpdated: '2025-05-10', categoryId: 'cat-1', inventoryId: 'inv-1' },
  { id: 'item-2', name: 'Raspberry Pi 4B', sku: 'EL-002', quantity: 8, minStock: 10, price: 75.00, cost: 42.00, supplier: 'Adafruit', unit: 'pcs', status: 'low-stock', lastUpdated: '2025-05-12', categoryId: 'cat-1', inventoryId: 'inv-1' },
  { id: 'item-3', name: 'HDMI Cable 2m', sku: 'EL-003', quantity: 0, minStock: 5, price: 12.99, cost: 4.50, supplier: 'CablesDirect', unit: 'pcs', status: 'out-of-stock', lastUpdated: '2025-04-28', categoryId: 'cat-1', inventoryId: 'inv-1' },
  { id: 'item-4', name: 'USB-C Hub 7-in-1', sku: 'EL-004', quantity: 22, minStock: 5, price: 49.99, cost: 18.00, supplier: 'Anker', unit: 'pcs', status: 'in-stock', lastUpdated: '2025-05-15', categoryId: 'cat-1', inventoryId: 'inv-1' },
  { id: 'item-5', name: 'Breadboard 830pt', sku: 'EL-005', quantity: 3, minStock: 8, price: 8.99, cost: 2.25, supplier: 'SparkFun', unit: 'pcs', status: 'low-stock', lastUpdated: '2025-05-08', categoryId: 'cat-1', inventoryId: 'inv-1' },
  // inv-1 / cat-2 Hardware
  { id: 'item-6', name: 'M3 Hex Bolt Set', sku: 'HW-001', quantity: 200, minStock: 50, price: 6.99, cost: 2.10, supplier: 'BoltPro', unit: 'set', status: 'in-stock', lastUpdated: '2025-05-01', categoryId: 'cat-2', inventoryId: 'inv-1' },
  { id: 'item-7', name: 'Steel L-Bracket', sku: 'HW-002', quantity: 15, minStock: 20, price: 3.49, cost: 1.20, supplier: 'MetalWorks', unit: 'pcs', status: 'low-stock', lastUpdated: '2025-05-14', categoryId: 'cat-2', inventoryId: 'inv-1' },
  { id: 'item-8', name: 'Aluminum Sheet 1mm', sku: 'HW-003', quantity: 30, minStock: 10, price: 15.00, cost: 7.80, supplier: 'MetalWorks', unit: 'sheet', status: 'in-stock', lastUpdated: '2025-04-30', categoryId: 'cat-2', inventoryId: 'inv-1' },
  { id: 'item-9', name: 'Nylon Spacer Kit', sku: 'HW-004', quantity: 0, minStock: 25, price: 9.99, cost: 3.50, supplier: 'BoltPro', unit: 'kit', status: 'out-of-stock', lastUpdated: '2025-04-20', categoryId: 'cat-2', inventoryId: 'inv-1' },
  { id: 'item-10', name: 'Zip Ties 100pk', sku: 'HW-005', quantity: 80, minStock: 20, price: 4.99, cost: 1.50, supplier: 'ToolDepot', unit: 'pack', status: 'in-stock', lastUpdated: '2025-05-05', categoryId: 'cat-2', inventoryId: 'inv-1' },
  // inv-2 / cat-3 Apparel
  { id: 'item-11', name: 'Classic Tee Shirt', sku: 'AP-001', quantity: 60, minStock: 15, price: 24.99, cost: 8.00, supplier: 'FashionCo', unit: 'pcs', status: 'in-stock', lastUpdated: '2025-05-11', categoryId: 'cat-3', inventoryId: 'inv-2' },
  { id: 'item-12', name: 'Slim Fit Jeans', sku: 'AP-002', quantity: 7, minStock: 10, price: 59.99, cost: 22.00, supplier: 'DenimWorld', unit: 'pcs', status: 'low-stock', lastUpdated: '2025-05-09', categoryId: 'cat-3', inventoryId: 'inv-2' },
  { id: 'item-13', name: 'Leather Belt', sku: 'AP-003', quantity: 0, minStock: 5, price: 34.99, cost: 12.00, supplier: 'LeatherCraft', unit: 'pcs', status: 'out-of-stock', lastUpdated: '2025-04-22', categoryId: 'cat-3', inventoryId: 'inv-2' },
  { id: 'item-14', name: 'Running Sneakers', sku: 'AP-004', quantity: 18, minStock: 8, price: 89.99, cost: 35.00, supplier: 'SportGear', unit: 'pairs', status: 'in-stock', lastUpdated: '2025-05-13', categoryId: 'cat-3', inventoryId: 'inv-2' },
  // inv-2 / cat-4 Accessories
  { id: 'item-15', name: 'Phone Case Pro Max', sku: 'AC-001', quantity: 40, minStock: 10, price: 19.99, cost: 5.50, supplier: 'TechCases', unit: 'pcs', status: 'in-stock', lastUpdated: '2025-05-10', categoryId: 'cat-4', inventoryId: 'inv-2' },
  { id: 'item-16', name: '65W USB-C Charger', sku: 'AC-002', quantity: 4, minStock: 8, price: 39.99, cost: 14.00, supplier: 'Anker', unit: 'pcs', status: 'low-stock', lastUpdated: '2025-05-07', categoryId: 'cat-4', inventoryId: 'inv-2' },
  { id: 'item-17', name: 'Braided USB Cable', sku: 'AC-003', quantity: 55, minStock: 15, price: 14.99, cost: 3.80, supplier: 'CablesDirect', unit: 'pcs', status: 'in-stock', lastUpdated: '2025-05-14', categoryId: 'cat-4', inventoryId: 'inv-2' },
  { id: 'item-18', name: 'Wireless Earbuds', sku: 'AC-004', quantity: 0, minStock: 5, price: 79.99, cost: 28.00, supplier: 'AudioTech', unit: 'pcs', status: 'out-of-stock', lastUpdated: '2025-04-15', categoryId: 'cat-4', inventoryId: 'inv-2' },
  // inv-3 / cat-5 Beverages
  { id: 'item-19', name: 'Orange Juice 1L', sku: 'BV-001', quantity: 48, minStock: 20, price: 3.49, cost: 1.20, supplier: 'FreshFarm', unit: 'bottles', status: 'in-stock', lastUpdated: '2025-05-16', categoryId: 'cat-5', inventoryId: 'inv-3' },
  { id: 'item-20', name: 'Whole Milk 2L', sku: 'BV-002', quantity: 6, minStock: 12, price: 2.99, cost: 1.00, supplier: 'DairyPlus', unit: 'cartons', status: 'low-stock', lastUpdated: '2025-05-16', categoryId: 'cat-5', inventoryId: 'inv-3' },
  { id: 'item-21', name: 'Sparkling Water 500ml', sku: 'BV-003', quantity: 0, minStock: 24, price: 1.99, cost: 0.60, supplier: 'AquaCo', unit: 'bottles', status: 'out-of-stock', lastUpdated: '2025-05-10', categoryId: 'cat-5', inventoryId: 'inv-3' },
  // inv-3 / cat-6 Produce
  { id: 'item-22', name: 'Organic Apples 1kg', sku: 'PR-001', quantity: 25, minStock: 10, price: 4.99, cost: 2.00, supplier: 'GreenGrove', unit: 'kg', status: 'in-stock', lastUpdated: '2025-05-16', categoryId: 'cat-6', inventoryId: 'inv-3' },
  { id: 'item-23', name: 'Spinach 200g', sku: 'PR-002', quantity: 3, minStock: 8, price: 2.49, cost: 0.90, supplier: 'GreenGrove', unit: 'bags', status: 'low-stock', lastUpdated: '2025-05-15', categoryId: 'cat-6', inventoryId: 'inv-3' },
  { id: 'item-24', name: 'Cherry Tomatoes 500g', sku: 'PR-003', quantity: 14, minStock: 6, price: 3.99, cost: 1.40, supplier: 'FreshFarm', unit: 'punnets', status: 'in-stock', lastUpdated: '2025-05-16', categoryId: 'cat-6', inventoryId: 'inv-3' },
];

export const DASHBOARD_STATS = {
  totalItems: ITEMS.length,
  inStock: ITEMS.filter(i => i.status === 'in-stock').length,
  lowStock: ITEMS.filter(i => i.status === 'low-stock').length,
  outOfStock: ITEMS.filter(i => i.status === 'out-of-stock').length,
  totalValue: ITEMS.reduce((s, i) => s + i.price * i.quantity, 0),
  totalCost: ITEMS.reduce((s, i) => s + i.cost * i.quantity, 0),
  inventories: INVENTORIES.length,
  categories: CATEGORIES.length,
};
