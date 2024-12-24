const db = require('../config/db');

// Obtener clientes
exports.getClientes = async (req, res) => {
  try {
    const pool = await db;

    const result = await pool.request().query(`
      SELECT c.clienteid, c.nombre, c.apellido, c.telefono, c.correoelectronico,
             c.fechacreacion, c.fechaactualizacion,
             d.direccionid, d.direccion, d.ciudad, d.estado, d.codigopostal, d.pais,
             doc.documentoid, doc.tipodocumento, doc.numerodocumento
      FROM clientes c
      LEFT JOIN direcciones d ON c.clienteid = d.clienteid
      LEFT JOIN documentos doc ON c.clienteid = doc.clienteid
    `);

    const clientes = {};

    result.recordset.forEach(row => {
      if (!clientes[row.clienteid]) {
        clientes[row.clienteid] = {
          clienteid: row.clienteid,
          nombre: row.nombre,
          apellido: row.apellido,
          telefono: row.telefono,
          correoelectronico: row.correoelectronico,
          fechacreacion: row.fechacreacion,
          fechaactualizacion: row.fechaactualizacion,
          direcciones: [],
          documentos: []
        };
      }

      if (
        row.direccionid &&
        !clientes[row.clienteid].direcciones.some(d => d.direccionid === row.direccionid)
      ) {
        clientes[row.clienteid].direcciones.push({
          direccionid: row.direccionid,
          direccion: row.direccion,
          ciudad: row.ciudad,
          estado: row.estado,
          codigopostal: row.codigopostal,
          pais: row.pais
        });
      }

      if (
        row.documentoid &&
        !clientes[row.clienteid].documentos.some(d => d.documentoid === row.documentoid)
      ) {
        clientes[row.clienteid].documentos.push({
          documentoid: row.documentoid,
          tipodocumento: row.tipodocumento,
          numerodocumento: row.numerodocumento
        });
      }
    });

    res.status(200).json(Object.values(clientes));
  } catch (error) {
    console.error('Error al obtener clientes:', error.message);
    res.status(500).send('Error al obtener clientes');
  }
};

// Crear cliente
exports.createCliente = async (req, res) => {
  const { nombre, apellido, telefono, correoelectronico, direcciones, documentos } = req.body;
  try {
    const pool = await db;

    const clienteResult = await pool.request()
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('telefono', telefono)
      .input('correoelectronico', correoelectronico)
      .query(`
        INSERT INTO clientes (nombre, apellido, telefono, correoelectronico)
        OUTPUT INSERTED.clienteid
        VALUES (@nombre, @apellido, @telefono, @correoelectronico)
      `);

    const clienteid = clienteResult.recordset[0].clienteid;

    for (const direccion of direcciones) {
      await pool.request()
        .input('clienteid', clienteid)
        .input('direccion', direccion.direccion)
        .input('ciudad', direccion.ciudad)
        .input('estado', direccion.estado)
        .input('codigopostal', direccion.codigopostal)
        .input('pais', direccion.pais)
        .query(`
          INSERT INTO direcciones (clienteid, direccion, ciudad, estado, codigopostal, pais)
          VALUES (@clienteid, @direccion, @ciudad, @estado, @codigopostal, @pais)
        `);
    }

    for (const documento of documentos) {
      await pool.request()
        .input('clienteid', clienteid)
        .input('tipodocumento', documento.tipodocumento)
        .input('numerodocumento', documento.numerodocumento)
        .query(`
          INSERT INTO documentos (clienteid, tipodocumento, numerodocumento)
          VALUES (@clienteid, @tipodocumento, @numerodocumento)
        `);
    }

    res.status(201).send('Cliente creado con éxito');
  } catch (error) {
    console.error('Error al crear cliente:', error.message);
    res.status(500).send('Error al crear cliente');
  }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, correoelectronico, direcciones, documentos } = req.body;

  try {
    const pool = await db;

    const cliente = await pool.request()
      .input('id', id)
      .query('SELECT * FROM clientes WHERE clienteid = @id');

    if (cliente.recordset.length === 0) {
      return res.status(404).send('Cliente no encontrado');
    }

    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('telefono', telefono)
      .input('correoelectronico', correoelectronico)
      .query(`
        UPDATE clientes
        SET nombre = @nombre, apellido = @apellido, telefono = @telefono, correoelectronico = @correoelectronico
        WHERE clienteid = @id
      `);

    for (const direccion of direcciones) {
      if (direccion.direccionid) {
        await pool.request()
          .input('direccionid', direccion.direccionid)
          .input('direccion', direccion.direccion)
          .input('ciudad', direccion.ciudad)
          .input('estado', direccion.estado)
          .input('codigopostal', direccion.codigopostal)
          .input('pais', direccion.pais)
          .query(`
            UPDATE direcciones
            SET direccion = @direccion, ciudad = @ciudad, estado = @estado, codigopostal = @codigopostal, pais = @pais
            WHERE direccionid = @direccionid
          `);
      } else {
        await pool.request()
          .input('clienteid', id)
          .input('direccion', direccion.direccion)
          .input('ciudad', direccion.ciudad)
          .input('estado', direccion.estado)
          .input('codigopostal', direccion.codigopostal)
          .input('pais', direccion.pais)
          .query(`
            INSERT INTO direcciones (clienteid, direccion, ciudad, estado, codigopostal, pais)
            VALUES (@clienteid, @direccion, @ciudad, @estado, @codigopostal, @pais)
          `);
      }
    }

    for (const documento of documentos) {
      if (documento.documentoid) {
        await pool.request()
          .input('documentoid', documento.documentoid)
          .input('tipodocumento', documento.tipodocumento)
          .input('numerodocumento', documento.numerodocumento)
          .query(`
            UPDATE documentos
            SET tipodocumento = @tipodocumento, numerodocumento = @numerodocumento
            WHERE documentoid = @documentoid
          `);
      } else {
        await pool.request()
          .input('clienteid', id)
          .input('tipodocumento', documento.tipodocumento)
          .input('numerodocumento', documento.numerodocumento)
          .query(`
            INSERT INTO documentos (clienteid, tipodocumento, numerodocumento)
            VALUES (@clienteid, @tipodocumento, @numerodocumento)
          `);
      }
    }

    res.status(200).send('Cliente actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar cliente:', error.message);
    res.status(500).send('Error al actualizar cliente');
  }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
  const { id } = req.params; // ID del cliente a eliminar
  const userId = req.userId || 0; // Identificador del usuario que realiza la acción

  try {
    const pool = await db;

    // Obtener información del cliente antes de eliminarlo
    const cliente = await pool.request()
      .input('id', id)
      .query('SELECT * FROM clientes WHERE clienteid = @id');

    if (cliente.recordset.length === 0) {
      return res.status(404).send('Cliente no encontrado');
    }

    const clienteInfo = cliente.recordset[0];

    // Eliminar documentos relacionados
    await pool.request()
      .input('clienteid', id)
      .query('DELETE FROM documentos WHERE clienteid = @clienteid');

    // Eliminar direcciones relacionadas
    await pool.request()
      .input('clienteid', id)
      .query('DELETE FROM direcciones WHERE clienteid = @clienteid');

    // Eliminar cliente
    await pool.request()
      .input('id', id)
      .query('DELETE FROM clientes WHERE clienteid = @id');

    // Registrar auditoría
    await pool.request()
      .input('clienteID', id) // Guardamos el ID del cliente eliminado
      .input('usuarioID', userId) // Usuario que realizó la acción
      .input('accion', 'Eliminar') // Acción realizada
      .input('detalles', JSON.stringify(clienteInfo)) // Guardamos información del cliente eliminado
      .query(`
        INSERT INTO auditoria (ClienteID, UsuarioID, Accion, Detalles)
        VALUES (@clienteID, @usuarioID, @accion, @detalles)
      `);

    res.status(200).send('Cliente eliminado con éxito');
  } catch (error) {
    console.error('Error al eliminar cliente:', error.message);
    res.status(500).send('Error al eliminar cliente');
  }
};

