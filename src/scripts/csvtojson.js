const fs = require('fs');
const csv = require('csvtojson');

csv()
  .fromFile('src/scripts/ec_products.csv')
  .then((jsonObj) => {
    fs.writeFileSync('src/seeders/productos.json', JSON.stringify(jsonObj, null, 2));
    console.log('¡Conversión completa! Revisa src/seeders/productos.json');
  });
