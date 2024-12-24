const sql = require('mssql');

// Configuración de conexión
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  port: parseInt(process.env.DB_PORT, 10),
};

const pool = new sql.ConnectionPool(config);
pool.connect()
  .then(() => console.log('Conexión exitosa a SQL Server'))
  .catch(err => console.error('Error al conectar con SQL Server:', err));

  
module.exports = pool;
