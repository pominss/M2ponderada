const db = require('../config/db');

class Funcionario {
  static async getAll() {
    const result = await db.query('SELECT * FROM funcionarios');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO funcionarios (nome, cargo, dia_responsavel, nascimento) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.nome, data.cargo, data.dia_responsavel, data.nascimento]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE funcionarios SET nome = $1, cargo = $2, dia_responsavel = $3 WHERE id = $4 RETURNING *',
      [data.nome, data.cargo, data.dia_responsavel, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM funcionarios WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Funcionario;
