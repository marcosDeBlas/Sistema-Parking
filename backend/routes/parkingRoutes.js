const express = require('express');
const { createSpot, listSpots, assignSpot } = require('../controllers/parkingController'); // Importa los controladores
const verifyToken = require('../middlewares/auth'); // Middleware para proteger las rutas mediante JWT

const router = express.Router();

// Rutas protegidas por el middleware verifyToken
router.post('/', verifyToken, createSpot); // Ruta para crear una nueva plaza
router.get('/', verifyToken, listSpots); // Ruta para listar todas las plazas existentes
router.post('/assign', verifyToken, assignSpot); // Ruta para asignar una plaza a un usuario

module.exports = router; // Exporta las rutas de parking
