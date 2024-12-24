const express = require('express');
const { getClientes, createCliente, updateCliente, deleteCliente } = require('../controllers/clientes');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, getClientes);
router.post('/', verifyToken, createCliente);
router.put('/:id', verifyToken, updateCliente);
router.delete('/:id', verifyToken, deleteCliente);

module.exports = router;
