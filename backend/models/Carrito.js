const mongoose = require('mongoose');

const ItemCarritoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    },
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      default: 1
    },
    foto: {
      type: String
    }
  },
  { _id: false }
);

const CarritoSchema = new mongoose.Schema(
  {
    productos: {
      type: [ItemCarritoSchema],
      required: true,
      validate: [val => val.length > 0, 'El carrito debe contener al menos un producto']
    },
    total: {
      type: Number,
      default: 0
    },
    estado: {
      type: String,
      default: 'confirmado'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Carrito', CarritoSchema);

