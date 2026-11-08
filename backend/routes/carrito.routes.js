const express = require('express');
const router = express.Router();
const {
  guardarCarrito,
  obtenerCarritos
} = require('../controllers/carrito.controller');

// Rutas de carrito
router.post('/', guardarCarrito);
router.get('/', obtenerCarritos);

module.exports = router;

