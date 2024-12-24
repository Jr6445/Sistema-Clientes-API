const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');


// Rutas
const authRoutes = require('./routes/auth');
const clienteRoutes = require('./routes/clientes');

const app = express();

// Middleware
app.use(bodyParser.json());


// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000', // Dirección del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));


// Rutas
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
