const mongoose = require('mongoose');

// Definición del esquema para las plazas de aparcamiento
const parkingSpotSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true }, // Número único de la plaza
    isAssigned: { type: Boolean, default: false }, // Indica si la plaza está asignada
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Referencia al usuario que tiene asignada la plaza
});

// Exporta el modelo 'ParkingSpot' para interactuar con la colección de plazas en la base de datos
module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
