const Product = require('../models/product.model');
const axios = require('axios');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
};

// Crear un producto
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, url, supplier } = req.body;
    const product = await Product.create({ name, description, price, stock, url, supplier });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto', details: error.message });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, url, supplier } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    await product.update({ name, description, price, stock, url, supplier });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    await product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
};

// Sincronizar precios y enlaces desde la API externa
exports.syncProductPrices = async (req, res) => {
  const EXTERNAL_URL = 'https://www.hamse.mx/html/api/products.php?api_key=HAMSE-5b8e6d9f2c1a4e7d3f6b9a8c5d2e1f0';
  try {
    const response = await axios.get(EXTERNAL_URL);
    const externalProducts = response.data;

    let updated = 0;
    let notFound = [];
    let errors = [];
    const total = externalProducts.length;

    console.log(`[SYNC] Sincronizando 0/${total} productos...`);

    for (let i = 0; i < total; i++) {
      const extProd = externalProducts[i];
      try {
        const localProd = await Product.findByPk(extProd.id);
        if (localProd) {
          await localProd.update({
            price: extProd.price,
            url: extProd.enlace
          });
          updated++;
        } else {
          notFound.push(extProd.id);
        }
      } catch (err) {
        errors.push({ id: extProd.id, error: err.message });
      }
      if ((i + 1) % 25 === 0 || i === total - 1) {
        console.log(`[SYNC] Sincronizando ${i + 1}/${total} productos...`);
      }
    }

    console.log(`[SYNC] Sincronización completada. Actualizados: ${updated}, No encontrados: ${notFound.length}, Errores: ${errors.length}`);
    res.json({
      message: 'Sincronización completada',
      updated,
      notFound,
      errors
    });
  } catch (error) {
    console.error('[SYNC] Error al sincronizar productos:', error.message);
    res.status(500).json({ error: 'Error al sincronizar productos', details: error.message });
  }
}; 