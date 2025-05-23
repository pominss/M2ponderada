// controllers/salaController.js
const pool = require('../config/database');

// Criar uma nova sala
exports.criarSala = async (req, res) => {
  const { numero_sala } = req.body;

  const query = 'INSERT INTO salas (numero_sala) VALUES ($1) RETURNING *';
  const values = [numero_sala];

  try {
    const result = await pool.query(query, values);
    const sala = result.rows[0];
    res.status(201).json(sala);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todas as salas
exports.listarSala = async (req, res) => {
  const query = 'SELECT * FROM salas';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir uma sala
exports.excluirSala = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM salas WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }
    res.status(200).json({ message: 'Sala excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }};