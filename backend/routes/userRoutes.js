const express = require('express');
const { register, login } = require('../controllers/userController'); // Importa los controladores de usuario

const router = express.Router();

// Rutas públicas para el registro y login de usuarios
router.post('/register', register); // Ruta para registrar un nuevo usuario
router.post('/login', login); // Ruta para iniciar sesión de un usuario

module.exports = router; // Exporta las rutas de usuario
