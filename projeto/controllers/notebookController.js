// controllers/notebookController.js
const pool = require('../config/database');

// Criar uma novo notebook
exports.criarNotebook = async (req, res) => {
  const { nome, numero_notebook } = req.body;

  const query = 'INSERT INTO notebooks (nome, numero_notebook) VALUES ($1, $2) RETURNING *';
  const values = [nome, numero_notebook];

  try {
    const result = await pool.query(query, values);
    const notebook = result.rows[0];
    res.status(201).json(notebook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todas os notebooks
exports.listarNotebook = async (req, res) => {
  const query = 'SELECT * FROM notebooks';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Excluir um notebook
exports.excluirNotebook = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM notebooks WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Notebook não encontrado' });
    }
    res.status(200).json({ message: 'Notebook excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};