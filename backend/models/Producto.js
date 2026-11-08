const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    marca: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true
    },
    descCorta: {
      type: String,
      required: [true, 'La descripción corta es obligatoria'],
      trim: true
    },
    descLarga: {
      type: String,
      required: [true, 'La descripción larga es obligatoria'],
      trim: true
    },
    envio: {
      type: Boolean,
      default: false
    },
    edadDesde: {
      type: Number,
      default: 0
    },
    edadHasta: {
      type: Number,
      default: 99
    },
    foto: {
      type: String,
      default: 'img/logo.jpeg'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Producto', ProductoSchema);

