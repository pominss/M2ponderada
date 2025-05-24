const db = require('../config/db');

class Notebook {
  static async getAll() {
    const result = await db.query('SELECT * FROM notebooks');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM notebooks WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO notebooks (numero_notebook) VALUES ($1) RETURNING *',
      [data.numero_notebook]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM notebooks WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Notebook;
