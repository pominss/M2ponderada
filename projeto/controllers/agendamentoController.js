// controllers/TarefaController.js
const pool = require('../config/database');

// Criar uma nova tarefa
exports.criarAgendamento = async (req, res) => {
  const { usuario_id, funcionario_id, sala_id, notebook_id, disponibilidade_notebook, disponibilidade_sala, data_preenchimento, horario, cancelamento} = req.body;

  const query = 'INSERT INTO agendamento (usuario_id, funcionario_id, sala_id, notebook_id, disponibilidade_notebook, disponibilidade_sala, data_preenchimento, horario, cancelamento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
  const values = [usuario_id, funcionario_id, sala_id, notebook_id, disponibilidade_notebook, disponibilidade_sala, data_preenchimento, horario, cancelamento];

  try {
    const result = await pool.query(query, values);
    const agendamento = result.rows[0];
    res.status(201).json(agendamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarAgendamentos = async (req, res) => {
  const query = 'SELECT * FROM agendamento';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar um agendamento
exports.editarAgendamento = async (req, res) => {
  const { id } = req.params;
  const { horario } = req.body;

  const query = `
    UPDATE agendamento SET horario = $1
    WHERE id = $2 RETURNING *`;
  const values = [horario, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'agendamento não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir um agendamento
exports.excluirAgendamento = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM agendamento WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrada' });
    }
    res.status(200).json({ message: 'Agendamento excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};