const fs = require('fs');
const path = require('path');

// 1. Update src/data/products.json
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

products.forEach(p => {
  p.price = 599;
  if (!p.compare_at_price || p.compare_at_price <= 599) {
    p.compare_at_price = 999;
  } else if (p.compare_at_price === 799 || p.compare_at_price === 899) {
    p.compare_at_price = 999;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${products.length} products in products.json to price: 599.`);

// 2. Update src/data/siteData.ts
const siteDataPath = path.join(__dirname, '..', 'src', 'data', 'siteData.ts');
let siteData = fs.readFileSync(siteDataPath, 'utf8');

// Update announcement text
siteData = siteData.replace(/"text":\s*"Buy 1 @ [^"]*"/g, '"text": "Buy 1 @ 599 | Buy 2 @ 999 | Buy 3 @ 1399"');

// Update prices in siteData
siteData = siteData.replace(/"price":\s*(299|499|699|799),/g, '"price": 599,');
siteData = siteData.replace(/"compare_at_price":\s*(799|899),/g, '"compare_at_price": 999,');

fs.writeFileSync(siteDataPath, siteData, 'utf8');
console.log('Updated announcements and product prices in siteData.ts.');
