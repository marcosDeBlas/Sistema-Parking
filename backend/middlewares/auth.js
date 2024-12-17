const jwt = require('jsonwebtoken'); // Importa JWT para verificar tokens

// Middleware para verificar y proteger rutas
const verifyToken = (req, res, next) => {
    // Extrae el token desde la cabecera Authorization
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token requerido.' });
    }

    try {
        // Verifica el token usando la clave secreta configurada
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Almacena la información del token decodificado en req.user
        next(); // Continúa con el siguiente middleware o función
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

module.exports = verifyToken;
