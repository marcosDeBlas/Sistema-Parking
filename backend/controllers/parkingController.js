const ParkingSpot = require('../models/ParkingSpot'); // Importa el modelo ParkingSpot
const User = require('../models/user'); // Importa el modelo de usuario

// Crear plaza
exports.createSpot = async (req, res) => {
    try {
        const { number } = req.body; // Extrae el número de la plaza desde el cuerpo de la solicitud

        // Verifica si la plaza ya existe en la base de datos
        const existingSpot = await ParkingSpot.findOne({ number });
        if (existingSpot) {
            return res.status(400).json({ message: 'La plaza ya existe.' }); // Error si la plaza ya existe
        }

        // Crea una nueva instancia del modelo ParkingSpot
        const spot = new ParkingSpot({ number });
        await spot.save(); // Guarda la nueva plaza en la base de datos
        res.status(201).json(spot); // Devuelve la plaza creada
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la plaza.', error: err.message });
    }
};

// Listar todas las plazas de parking
exports.listSpots = async (req, res) => {
    try {
        const userId = req.user.id; // Extrae el ID del usuario autenticado desde el token

        // Busca todas las plazas y asocia los nombres de usuario si la plaza está asignada
        const spots = await ParkingSpot.find().populate('user', 'username');

        console.log('Plazas obtenidas:', spots); // Log para depuración
        res.json({ spots }); // Devuelve todas las plazas obtenidas
    } catch (err) {
        res.status(500).json({ error: err.message }); // Devuelve un error si falla algo
    }
};

// Asignar plaza usando el ID del usuario autenticado
exports.assignSpot = async (req, res) => {
    try {
        const { spotId } = req.body; // ID de la plaza a asignar desde el cuerpo
        const userId = req.user.id; // ID del usuario autenticado extraído del token JWT

        // Verifica si el usuario ya tiene una plaza asignada
        const existingSpot = await ParkingSpot.findOne({ user: userId });
        if (existingSpot) {
            return res.status(400).json({ message: 'Ya tienes una plaza asignada.' });
        }

        // Verifica si la plaza existe en la base de datos
        const spot = await ParkingSpot.findById(spotId);
        if (!spot) {
            return res.status(404).json({ message: 'Plaza de parking no encontrada.' });
        }

        // Verifica si la plaza ya está asignada
        if (spot.isAssigned) {
            return res.status(400).json({ message: 'La plaza ya está asignada.' });
        }

        // Asigna la plaza al usuario autenticado
        spot.isAssigned = true;
        spot.user = userId;
        await spot.save(); // Guarda los cambios en la base de datos

        res.status(200).json({ message: `Plaza ${spot.number} asignada correctamente.` });
    } catch (err) {
        console.error('Error al asignar plaza:', err.message);
        res.status(500).json({ error: 'Hubo un problema al asignar la plaza.' });
    }
};
