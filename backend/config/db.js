const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('⚠️ AVISO: MONGODB_URI no está definida en el archivo .env.');
      console.warn('⚠️ Por favor agrega tu cadena de conexión de MongoDB Atlas en el archivo .env');
      return;
    }

    await mongoose.connect(uri);
    console.log('✅ Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  }
};

module.exports = connectDB;

