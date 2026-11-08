const mongoose = require('mongoose');
const Carrito = require('../models/Carrito');

// Almacén en memoria de pedidos
let memoriaPedidos = [];

// POST /api/carrito - Guardar pedido del carrito
const guardarCarrito = async (req, res) => {
  try {
    const payload = req.body;
    const listaProductos = Array.isArray(payload) ? payload : (payload.productos || []);

    console.log('====================================================');
    console.log('🛒 NUEVO PEDIDO RECIBIDO EN EL BACKEND (POST /api/carrito):');
    console.log(JSON.stringify(listaProductos, null, 2));
    console.log('====================================================');

    if (!listaProductos || listaProductos.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío o el formato no es válido.' });
    }

    // Calcular total
    const total = listaProductos.reduce((acc, item) => {
      const precio = Number(item.precio) || 0;
      const cant = Number(item.cantidad) || 1;
      return acc + (precio * cant);
    }, 0);

    if (mongoose.connection.readyState === 1) {
      const nuevoPedido = new Carrito({
        productos: listaProductos,
        total
      });
      const guardado = await nuevoPedido.save();
      console.log(`✅ Pedido guardado exitosamente en MongoDB Atlas con ID: ${guardado._id}`);

      return res.status(201).json({
        mensaje: 'Pedido procesado y almacenado correctamente en MongoDB Atlas',
        pedido: guardado
      });
    }

    // Guardado en memoria
    const pedidoEnMemoria = {
      _id: 'pedido_' + Date.now(),
      productos: listaProductos,
      total,
      fecha: new Date().toISOString()
    };
    memoriaPedidos.push(pedidoEnMemoria);
    console.log(`ℹ️ Pedido registrado en memoria temporal (Esperando conexión Atlas)`);

    res.status(201).json({
      mensaje: 'Pedido recibido con éxito y mostrado en la consola del servidor',
      pedido: pedidoEnMemoria
    });
  } catch (error) {
    console.error('❌ Error al procesar el pedido del carrito:', error);
    res.status(500).json({ error: error.message || 'Error al guardar el pedido' });
  }
};

// GET /api/carrito - Obtener historial de pedidos guardados
const obtenerCarritos = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pedidos = await Carrito.find().sort({ createdAt: -1 });
      return res.json(pedidos);
    }
    res.json(memoriaPedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del carrito:', error);
    res.status(500).json({ error: 'Error al consultar los pedidos' });
  }
};

module.exports = {
  guardarCarrito,
  obtenerCarritos
};
