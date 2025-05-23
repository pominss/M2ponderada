// controllers/FuncionarioController.js
const pool = require('../config/database');

// Criar uma nova tarefa
exports.criarFuncionario = async (req, res) => {
  const { nome, cargo, dia_responsavel, nascimento } = req.body;

  const query = 'INSERT INTO funcionarios (nome, cargo, dia_responsavel, nascimento) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [nome, cargo, dia_responsavel, nascimento];

  try {
    const result = await pool.query(query, values);
    const funcionario = result.rows[0];
    res.status(201).json(funcionario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os funcionarios
exports.listarFuncionario = async (req, res) => {
  const query = 'SELECT * FROM funcionarios';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar um funcionario
exports.editarFuncionario = async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, dia_responsavel } = req.body;

  const query = `UPDATE funcionarios SET nome = $1, cargo = $2, dia_responsavel = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 RETURNING *`;
  const values = [nome, cargo, dia_responsavel, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Funcionário(a) não encontrado(a)' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir uma tarefa
exports.excluirFuncionario = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM funcionarios WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Funcionário(a) não encontrado(a)' });
    }
    res.status(200).json({ message: 'Funcionário(a) excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};