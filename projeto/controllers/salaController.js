// controllers/salaController.js
const pool = require('../config/database');

// Criar uma nova sala
exports.criarSala = async (req, res) => {
  const { numero_sala, nome, andar, capacidade, descricao, disponibilidade } = req.body;

  const query = 'INSERT INTO salas (numero_sala, nome, andar, capacidade, descricao, disponibilidade) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [numero_sala, nome, andar, capacidade, descricao, disponibilidade];

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
  const query = 'SELECT s.*, (SELECT COUNT(*) FROM agendamento a WHERE a.sala_id = s.id) as num_agendamentos FROM salas s ORDER BY s.id';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter sala por ID
exports.obterSalaPorId = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM salas WHERE id = $1';

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }
    
    // Buscar agendamentos relacionados a esta sala
    const agendamentosQuery = 'SELECT a.*, f.nome as funcionario_nome FROM agendamento a JOIN funcionario f ON a.funcionario_id = f.id WHERE a.sala_id = $1 ORDER BY data_preenchimento DESC';
    const agendamentosResult = await pool.query(agendamentosQuery, [id]);
    
    res.status(200).json({ 
      sala: result.rows[0], 
      agendamentos: agendamentosResult.rows 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar uma sala existente
exports.editarSala = async (req, res) => {
  const { id } = req.params;
  const { numero_sala, nome, andar, capacidade, descricao, disponibilidade } = req.body;

  const query = 'UPDATE salas SET numero_sala = $1, nome = $2, andar = $3, capacidade = $4, descricao = $5, disponibilidade = $6 WHERE id = $7 RETURNING *';
  const values = [numero_sala, nome, andar, capacidade, descricao, disponibilidade, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }
    res.status(200).json(result.rows[0]);
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