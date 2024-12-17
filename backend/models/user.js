const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Librería para hashear y comparar contraseñas

// Esquema para los usuarios
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Nombre de usuario único y obligatorio
    password: { type: String, required: true }, // Contraseña obligatoria
});

// Middleware que se ejecuta antes de guardar un usuario: Hashear la contraseña
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Si la contraseña no ha sido modificada, pasa al siguiente middleware
    
    const salt = await bcrypt.genSalt(10); // Genera un salt para encriptar
    this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña
    next();
});

// Método personalizado para comparar contraseñas ingresadas con la almacenada en la base de datos
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password); // Devuelve true si coinciden
};

// Exporta el modelo 'User' para interactuar con la colección de usuarios en la base de datos
module.exports = mongoose.model('User', userSchema);
