// routes/index.js
const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Rotas para o CRUD de agendamentos
router.post('/agendamento', agendamentoController.criarAgendamento);
router.get('/agendamento', agendamentoController.listarAgendamentos);
router.put('/agendamento/:id', agendamentoController.editarAgendamento);
router.delete('/agendamento/:id', agendamentoController.excluirAgendamento);

module.exports = router;

// routes/index.js
const express = require('express');
const funcionarioController = require('../controllers/funcionarioController');

// Rotas para o CRUD de funionarios
router.post('/funcionario', funcionarioController.criarFuncionario);
router.get('/funcionario', funcionarioController.listarFuncionario);
router.put('/funcionario/:id', funcionarioController.editarFuncionario);
router.delete('/funcionario/:id', funcionarioController.excluirFuncionario);

module.exports = router;

// routes/index.js
const express = require('express');
const notebookController = require('../controllers/notebookController');

// Rotas para o CRUD de notebooks
router.post('/notebooks', notebookController.criarNotebook);
router.get('/notebooks', notebookController.listarNotebook);
router.delete('/notebooks/:id', notebookController.excluirNotebook);

module.exports = router;