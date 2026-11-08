const mongoose = require('mongoose');
const Producto = require('../models/Producto');

const productosIniciales = [
  {
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

const seedProductos = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return;
    }
    const total = await Producto.countDocuments();
    if (total === 0) {
      await Producto.insertMany(productosIniciales);
      console.log('🌱 Base de datos poblada inicialmente con 6 productos.');
    }
  } catch (error) {
    console.error('Error al inicializar productos de prueba:', error.message);
  }
};

module.exports = seedProductos;
