const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedProductos = require('./config/seed');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Rutas de la API (RESTful)
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/carrito', require('./routes/carrito.routes'));

// Ruta raíz que sirve index.html del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Inicialización de la base de datos y arranque del servidor
const iniciarServidor = async () => {
  await connectDB();
  await seedProductos();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  });
};

iniciarServidor();
