const db = require('../config/db');

class Agendamento {
  static async getAll() {
    const result = await db.query('SELECT * FROM agendamento');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM agendamento WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO agendamento (usuario_id, funcionario_id, sala_id, notebook_id, disponibilidade_notebook, disponibilidade_sala, data_preenchimento, horario, cancelamento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [data.usuário_id, data.funcionario_id, data.sala_id, data.notebook_id, data.disponibilidade_notebook, data.disponibilidade_sala, data.data_preenchimento, data.horario, data.cancelamento]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE agendamento SET horario = $1 WHERE id = $2 RETURNING *',
      [data.horario, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM agendamento WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Agendamento;
