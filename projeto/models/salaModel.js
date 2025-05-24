const db = require('../config/db');

class Sala {
  static async getAll() {
    const result = await db.query('SELECT * FROM salas');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM salas WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO salas (numero_sala) VALUES ($1) RETURNING *',
      [data.numero_sala]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM salas WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Sala;
