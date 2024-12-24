const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registrar usuario
exports.register = async (req, res) => {
  const { nombreUsuario, contrasena } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const pool = await db;

    const userExists = await pool.request()
      .input('nombreUsuario', nombreUsuario)
      .query('SELECT * FROM Usuarios WHERE NombreUsuario = @nombreUsuario');

    if (userExists.recordset.length > 0) {
      return res.status(400).send('El nombre de usuario ya está en uso');
    }

    await pool.request()
      .input('nombreUsuario', nombreUsuario)
      .input('contrasena', hashedPassword)
      .input('rol', 'User')
      .query('INSERT INTO Usuarios (NombreUsuario, Contrasena, Rol) VALUES (@nombreUsuario, @contrasena, @rol)');

    res.status(201).send('Usuario registrado con éxito');
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).send('Ocurrió un error al registrar el usuario');
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  const { nombreUsuario, contrasena } = req.body;
  try {
    const pool = await db;
    const result = await pool.request()
      .input('nombreUsuario', nombreUsuario)
      .query('SELECT * FROM Usuarios WHERE NombreUsuario = @nombreUsuario');

    const user = result.recordset[0];
    if (!user) return res.status(401).send('Usuario no encontrado');

    const isMatch = await bcrypt.compare(contrasena, user.Contrasena);
    if (!isMatch) return res.status(401).send('Contraseña incorrecta');

    const token = jwt.sign({ id: user.UsuarioID }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).send('Ocurrió un error al iniciar sesión');
  }
};
