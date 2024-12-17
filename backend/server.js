const express = require('express'); // Framework para construir el servidor
const mongoose = require('mongoose'); // Conexión con MongoDB
const dotenv = require('dotenv'); // Cargar variables de entorno desde el archivo .env
const cors = require('cors'); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const path = require('path'); // Módulo para manejar rutas de archivos

dotenv.config(); // Cargar configuración desde el archivo .env

const app = express(); // Crear una instancia de la aplicación Express

app.use(cors()); // Permite solicitudes de diferentes dominios
app.use(express.json()); // Habilita el manejo de JSON en el cuerpo de las solicitudes

// Conexión a la base de datos MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Importación de rutas
const userRoutes = require('./routes/userRoutes'); // Rutas de usuario (login y registro)
const parkingRoutes = require('./routes/parkingRoutes'); // Rutas de gestión de plazas

// Uso de rutas
app.use('/api/users', userRoutes); // Rutas relacionadas con usuarios
app.use('/api/parking', parkingRoutes); // Rutas relacionadas con las plazas

// Configuración para servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta principal (carga la página principal del frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Puerto donde se ejecuta el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
