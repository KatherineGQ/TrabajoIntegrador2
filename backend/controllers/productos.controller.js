const mongoose = require('mongoose');
const Producto = require('../models/Producto');

// Memoria local de respaldo cuando MongoDB Atlas no está conectado
let memoriaProductos = [
  {
    _id: '65f1a1000000000000000001',
    nombre: 'Auriculares Reductores de Ruido',
    precio: 24990,
    stock: 15,
    marca: 'AURA NEU',
    categoria: 'Auditivo',
    descCorta: 'Atenúan eficazmente el exceso de estímulos auditivos para protegerte de la fatiga sensorial en espacios concurridos.',
    descLarga: 'Auriculares ergonómicos diseñados especialmente para personas con hipersensibilidad auditiva.',
    envio: true,
    edadDesde: 6,
    edadHasta: 99,
    foto: 'img/audifonos.jpeg'
  },
  {
    _id: '65f1a1000000000000000002',
    nombre: 'Manta Sensorial con Peso',
    precio: 38500,
    stock: 10,
    marca: 'AURA NEU',
    categoria: 'Propioceptivo',
    descCorta: 'Diseñada para brindar una terapia de presión profunda que promueve la relajación profunda, alivia la ansiedad y optimiza el descanso.',
    descLarga: 'Manta sensorial de 5kg rellena de microesferas de cristal hipoalergénicas para estimulación propioceptiva.',
    envio: true,
    edadDesde: 12,
    edadHasta: 99,
    foto: 'img/mantas.jpeg'
  },
  {
    _id: '65f1a1000000000000000003',
    nombre: 'Anillo Fidget Giratorio',
    precio: 8990,
    stock: 30,
    marca: 'AURA NEU',
    categoria: 'Fidget',
    descCorta: 'Una solución elegante y discreta para canalizar la energía, facilitar la concentración y favorecer la autorregulación manual cotidiana.',
    descLarga: 'Anillo de acero inoxidable con banda giratoria suave y silenciosa.',
    envio: false,
    edadDesde: 10,
    edadHasta: 99,
    foto: 'img/fidget-toys.jpeg'
  },
  {
    _id: '65f1a1000000000000000004',
    nombre: 'Lentes para Fotosensibilidad',
    precio: 29990,
    stock: 12,
    marca: 'AURA NEU',
    categoria: 'Visual',
    descCorta: 'Filtran de manera precisa el exceso de luz natural y artificial para prevenir la fatiga visual y los dolores de cabeza asociados.',
    descLarga: 'Lentes con filtro FL-41 especializados para fotofobia y luces fluorescentes.',
    envio: true,
    edadDesde: 8,
    edadHasta: 99,
    foto: 'img/lentes.jpeg'
  },
  {
    _id: '65f1a1000000000000000005',
    nombre: 'Planificador Estructurado',
    precio: 19990,
    stock: 25,
    marca: 'AURA NEU',
    categoria: 'Organización',
    descCorta: 'Herramienta de organización visual diseñada para simplificar tu rutina, reducir la carga mental y estructurar tus metas diarias con claridad.',
    descLarga: 'Cuaderno planificador con apoyo visual para rutinas y gestión de sobrecarga cognitiva.',
    envio: false,
    edadDesde: 12,
    edadHasta: 99,
    foto: 'img/planificador.jpeg'
  },
  {
    _id: '65f1a1000000000000000006',
    nombre: 'Accesorios de estimulación táctil',
    precio: 2990,
    stock: 50,
    marca: 'AURA NEU',
    categoria: 'Táctil',
    descCorta: 'Elementos portátiles de apoyo sensorial ideales para favorecer la concentración y la calma en cualquier momento del día.',
    descLarga: 'Tiras táctiles adhesivas texturadas para dedos y autorregulación discreta.',
    envio: false,
    edadDesde: 4,
    edadHasta: 99,
    foto: 'img/accesorios.jpeg'
  }
];

// Normalizador de datos
const normalizarDatos = (datos) => {
  const normalizado = { ...datos };
  if (typeof normalizado.envio === 'string') {
    normalizado.envio = normalizado.envio === 'si' || normalizado.envio === 'true';
  }
  if (normalizado['desc-corta'] && !normalizado.descCorta) {
    normalizado.descCorta = normalizado['desc-corta'];
  }
  if (normalizado['desc-larga'] && !normalizado.descLarga) {
    normalizado.descLarga = normalizado['desc-larga'];
  }
  if (normalizado['edad-desde'] && !normalizado.edadDesde) {
    normalizado.edadDesde = Number(normalizado['edad-desde']);
  }
  if (normalizado['edad-hasta'] && !normalizado.edadHasta) {
    normalizado.edadHasta = Number(normalizado['edad-hasta']);
  }
  if (normalizado.precio) {
    normalizado.precio = Number(normalizado.precio);
  }
  if (normalizado.stock) {
    normalizado.stock = Number(normalizado.stock);
  }
  return normalizado;
};

// GET /api/productos - Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const productos = await Producto.find().sort({ createdAt: -1 });
      return res.json(productos);
    }
    // Fallback en memoria si aún no se conecta MongoDB
    res.json(memoriaProductos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos de la base de datos' });
  }
};

// GET /api/productos/:id - Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
      }
      return res.json(producto);
    }

    const prodMemoria = memoriaProductos.find(p => p._id.toString() === id);
    if (!prodMemoria) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }
    res.json(prodMemoria);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
};

// POST /api/productos - Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const datosProducto = normalizarDatos(req.body);

    if (mongoose.connection.readyState === 1) {
      const nuevoProducto = new Producto(datosProducto);
      const guardado = await nuevoProducto.save();
      return res.status(201).json(guardado);
    }

    // Guardado en memoria
    const nuevoEnMemoria = {
      _id: 'mem_' + Date.now(),
      ...datosProducto,
      createdAt: new Date().toISOString()
    };
    memoriaProductos.unshift(nuevoEnMemoria);
    res.status(201).json(nuevoEnMemoria);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: error.message || 'Error al guardar el producto' });
  }
};

// PUT /api/productos/:id - Actualizar un producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = normalizarDatos(req.body);

    if (mongoose.connection.readyState === 1) {
      const productoActualizado = await Producto.findByIdAndUpdate(id, datosActualizados, {
        new: true,
        runValidators: true
      });

      if (!productoActualizado) {
        return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
      }

      return res.json(productoActualizado);
    }

    // Actualización en memoria
    const index = memoriaProductos.findIndex(p => p._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }

    memoriaProductos[index] = { ...memoriaProductos[index], ...datosActualizados };
    res.json(memoriaProductos[index]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({ error: error.message || 'Error al actualizar el producto' });
  }
};

// DELETE /api/productos/:id - Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const productoEliminado = await Producto.findByIdAndDelete(id);

      if (!productoEliminado) {
        return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
      }

      return res.json({ mensaje: 'Producto eliminado correctamente', id });
    }

    // Eliminación en memoria
    const index = memoriaProductos.findIndex(p => p._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }

    memoriaProductos.splice(index, 1);
    res.json({ mensaje: 'Producto eliminado correctamente', id });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
