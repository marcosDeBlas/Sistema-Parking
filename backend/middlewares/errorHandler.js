// Middleware global para manejar errores en la aplicación
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500; // Establece el código de estado (500 si no se proporciona)
    
    // Devuelve una respuesta con el mensaje de error y, en desarrollo, la traza del error
    res.status(statusCode).json({
        message: err.message, // Mensaje del error
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Muestra la traza solo en desarrollo
    });
};

module.exports = errorHandler; // Exporta el middleware para usarlo en toda la aplicación
