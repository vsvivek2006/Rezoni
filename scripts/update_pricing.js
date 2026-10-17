const fs = require('fs');
const path = require('path');

// 1. Update src/data/products.json
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

products.forEach(p => {
  p.price = 299;
  p.compare_at_price = 799;
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${products.length} products in products.json to price: 299, compare_at_price: 799.`);

// 2. Update src/data/siteData.ts
const siteDataPath = path.join(__dirname, '..', 'src', 'data', 'siteData.ts');
let siteData = fs.readFileSync(siteDataPath, 'utf8');

// Update announcement text
siteData = siteData.replace('"text": "Buy 1 @ 699 | Buy 2 @ 899 | Buy 3 @ 999"', '"text": "Buy 1 @ 299 | Buy 2 @ 499 | Buy 3 @ 699"');
siteData = siteData.replace('"text": "Big Summer Sale \\u2013 Up to 60% Off Sitewide"', '"text": "🚚 100% Free Shipping Sitewide | Limited Time Only"');

// Update prices in siteData
siteData = siteData.replace(/"price":\s*699,/g, '"price": 299,');
siteData = siteData.replace(/"compare_at_price":\s*999,/g, '"compare_at_price": 799,');

fs.writeFileSync(siteDataPath, siteData, 'utf8');
console.log('Updated announcements and product prices in siteData.ts.');
