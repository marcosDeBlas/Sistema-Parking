// Importa la librería mongoose para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');

// Función asíncrona para conectar con la base de datos MongoDB
const connectDB = async () => {
    try {
        // Conexión usando las variables de entorno
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Termina el proceso en caso de error
    }
};

// Exporta la función para ser usada en otros archivos
module.exports = connectDB;
