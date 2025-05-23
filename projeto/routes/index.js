// routes/index.js
const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Rotas para o CRUD de tarefas
router.post('/agendamento', agendamentoController.criarAgendamento);
router.get('/agendamento', agendamentoController.listarAgendamentos);
router.put('/agendamento/:id', agendamentoController.editarAgendamento);
router.delete('/agendamento/:id', agendamentoController.excluirAgendamento);

module.exports = router;