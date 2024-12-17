const User = require('../models/user'); // Importa el modelo de usuario
const jwt = require('jsonwebtoken'); // Importa la librería JWT para autenticación

// Registro de un nuevo usuario
exports.register = async (req, res) => {
    const { username, password } = req.body; // Extrae username y password desde el cuerpo

    // Validación de los campos obligatorios
    if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validación de la longitud de la contraseña
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        // Verifica si el usuario ya existe en la base de datos
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crea una nueva instancia del modelo User con la contraseña encriptada
        const user = new User({ username, password });
        await user.save();

        // Genera un token JWT para el usuario
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
    }
};

// Inicio de sesión de un usuario
exports.login = async (req, res) => {
    const { username, password } = req.body; // Extrae username y password desde el cuerpo

    if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Busca el usuario por nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Compara la contraseña proporcionada con la encriptada en la base de datos
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Genera un token JWT válido
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
    }
};
