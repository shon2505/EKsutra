const fs = require('fs');

let types = fs.readFileSync('lib/types.ts', 'utf8');
types = types.replace(/"LAND_RECORD"/g, '"LAND_RECORD" | "PROPERTY_TAX_RECEIPT"');
fs.writeFileSync('lib/types.ts', types);

let docCard = fs.readFileSync('components/DocumentCard.tsx', 'utf8');
docCard = docCard.replace(/LAND_RECORD: "Land Record",/g, 'LAND_RECORD: "7/12 Land Extract",\n  PROPERTY_TAX_RECEIPT: "Property Tax Receipt",');
docCard = docCard.replace(/LAND_RECORD: "LAND-DEMO-001",/g, 'LAND_RECORD: "LAND-DEMO-001",\n  PROPERTY_TAX_RECEIPT: "PROP-DEMO-001",');
fs.writeFileSync('components/DocumentCard.tsx', docCard);

console.log('types updated');
