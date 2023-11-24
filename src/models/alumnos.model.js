const db = require('../configs/db.config');

class Alumno {

    constructor({ id, email, password, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, email, password, deleted, created_at, updated_at, deleted_at FROM alumnos WHERE deleted = 0";

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
        }

        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }

        const [rows] = await connection.query(query);
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, email, password, deleted, created_at, updated_at, deleted_at FROM alumnos WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Alumno({ id: row.id, email: row.email, password: row.password, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE alumnos SET deleted = 0, deleted_at = ? WHERE id = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el Alumno");
        }

        return
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM alumnos WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el Alumno");
        }

        return
    }

    static async updateById(id, { email, password }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE alumnos SET email = ?, password = ?, updated_at = ? WHERE id = ?", [email, password, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("no se actualizó el Alumno");
        }

        return
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM alumnos WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO alumnos (email, password, created_at) VALUES (?, ?, ?)", [this.email, this.password, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el Alumno");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = createdAt;
        this.updatedAt = null;
        this.deletedAt = null;

        return
    }
}

module.exports = Alumno;