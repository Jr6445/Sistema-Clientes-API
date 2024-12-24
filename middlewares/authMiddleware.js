const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Token requerido');
  }

  const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"

  if (!token) {
    return res.status(401).send('Token no proporcionado');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido');
    }

    req.userId = decoded.id; // Guarda el ID del usuario para los siguientes controladores
    next();
  });
};
