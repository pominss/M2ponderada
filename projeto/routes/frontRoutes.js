const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../config/database');

// Roteamento para páginas dinâmicas
router.get('/', async (req, res) => {
  try {
    const agendamentosResult = await pool.query('SELECT * FROM agendamento ORDER BY data_preenchimento DESC LIMIT 5');
    const agendamentos = agendamentosResult.rows;
    
    // Obter contagens para o dashboard
    const salasResult = await pool.query('SELECT COUNT(*) as total_salas FROM salas');
    const notebooksResult = await pool.query('SELECT COUNT(*) as total_notebooks FROM notebook');
    const totalSalas = salasResult.rows[0].total_salas;
    const totalNotebooks = notebooksResult.rows[0].total_notebooks;
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Sistema de Agendamentos',
      content: path.join(__dirname, '../views/pages/page1'),
      agendamentos: agendamentos,
      totalSalas: totalSalas,
      totalNotebooks: totalNotebooks
    });
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Sistema de Agendamentos',
      content: path.join(__dirname, '../views/pages/page1'),
      agendamentos: [],
      totalSalas: 0,
      totalNotebooks: 0,
      error: 'Não foi possível carregar os agendamentos.'
    });
  }
});

router.get('/agendamentos', async (req, res) => {
  try {
    const agendamentosResult = await pool.query('SELECT a.*, s.nome as sala_nome, n.modelo as notebook_modelo, f.nome as funcionario_nome FROM agendamento a LEFT JOIN sala s ON a.sala_id = s.id LEFT JOIN notebook n ON a.notebook_id = n.id LEFT JOIN funcionario f ON a.funcionario_id = f.id ORDER BY data_preenchimento DESC');
    const agendamentos = agendamentosResult.rows;
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Lista de Agendamentos',
      content: path.join(__dirname, '../views/pages/agendamentos/index'),
      agendamentos: agendamentos
    });
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Lista de Agendamentos',
      content: path.join(__dirname, '../views/pages/agendamentos/index'),
      agendamentos: [],
      error: 'Não foi possível carregar os agendamentos.'
    });
  }
});

router.get('/novo-agendamento', async (req, res) => {
  try {
    const salasResult = await pool.query('SELECT * FROM sala WHERE disponibilidade = true');
    const notebooksResult = await pool.query('SELECT * FROM notebook WHERE disponibilidade = true');
    const funcionariosResult = await pool.query('SELECT * FROM funcionario');
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Novo Agendamento',
      content: path.join(__dirname, '../views/pages/agendamentos/novo'),
      salas: salasResult.rows,
      notebooks: notebooksResult.rows,
      funcionarios: funcionariosResult.rows
    });
  } catch (error) {
    console.error('Erro ao carregar formulário:', error);
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Novo Agendamento',
      content: path.join(__dirname, '../views/pages/agendamentos/novo'),
      salas: [],
      notebooks: [],
      funcionarios: [],
      error: 'Não foi possível carregar os dados para o formulário.'
    });
  }
});

router.get('/seus-agendamentos/:funcionarioId', async (req, res) => {
  try {
    const { funcionarioId } = req.params;
    const agendamentosResult = await pool.query(
      'SELECT a.*, s.nome as sala_nome, n.modelo as notebook_modelo FROM agendamento a LEFT JOIN sala s ON a.sala_id = s.id LEFT JOIN notebook n ON a.notebook_id = n.id WHERE a.funcionario_id = $1 ORDER BY data_preenchimento DESC',
      [funcionarioId]
    );
    
    const funcionarioResult = await pool.query('SELECT * FROM funcionario WHERE id = $1', [funcionarioId]);
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Seus Agendamentos',
      content: path.join(__dirname, '../views/pages/agendamentos/seusAgendamentos'),
      agendamentos: agendamentosResult.rows,
      funcionario: funcionarioResult.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter agendamentos do funcionário:', error);
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Seus Agendamentos',
      content: path.join(__dirname, '../views/pages/agendamentos/seusAgendamentos'),
      agendamentos: [],
      funcionario: null,
      error: 'Não foi possível carregar os agendamentos.'
    });
  }
});

// Rota para listar salas
router.get('/salas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, COUNT(a.id) as num_agendamentos 
      FROM sala s 
      LEFT JOIN agendamento a ON s.id = a.sala_id 
      GROUP BY s.id 
      ORDER BY s.numero_sala
    `);
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Salas Disponíveis',
      content: path.join(__dirname, '../views/pages/salas/index'),
      salas: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Salas Disponíveis',
      content: path.join(__dirname, '../views/pages/salas/index'),
      salas: [], 
      error: 'Erro ao carregar salas'
    });
  }
});

// Rota para o formulário de nova sala
router.get('/nova-sala', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Nova Sala',
    content: path.join(__dirname, '../views/pages/salas/nova')
  });
});

// Rota para o formulário de edição de sala
router.get('/editar-sala/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const salaResult = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
    
    if (salaResult.rows.length === 0) {
      return res.status(404).send('Sala não encontrada');
    }
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Editar Sala',
      content: path.join(__dirname, '../views/pages/salas/editar'),
      sala: salaResult.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter dados da sala para edição:', error);
    res.status(500).send('Erro ao carregar dados da sala');
  }
});

// Rota para visualizar detalhes de uma sala
router.get('/sala/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const salaResult = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
    
    if (salaResult.rows.length === 0) {
      return res.status(404).send('Sala não encontrada');
    }
    
    const agendamentosResult = await pool.query(
      'SELECT a.*, f.nome as funcionario_nome FROM agendamento a JOIN funcionario f ON a.funcionario_id = f.id WHERE a.sala_id = $1 ORDER BY data_preenchimento DESC',
      [id]
    );
    
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Detalhes da Sala',
      content: path.join(__dirname, '../views/pages/salas/detalhes'),
      sala: salaResult.rows[0],
      agendamentos: agendamentosResult.rows
    });
  } catch (error) {
    console.error('Erro ao obter detalhes da sala:', error);
    res.status(500).send('Erro ao carregar detalhes da sala');
  }
});

module.exports = router;