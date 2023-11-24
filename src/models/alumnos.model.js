const db = require('../configs/db.config');

class Alumno {

    constructor({ id, nombre, apellidoPaterno, apellidoMaterno,matricula, createdAt, updatedAt, deletedAt ,deleted}) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.deleted = deleted;
        this.matricula = matricula;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }) {
        const connection = await db.createConnection();
        let query = "SELECT id, nombre, apellidoPaterno, apellidoMaterno, matricula,deleted,createdAt, updatedAt, deletedAt FROM alumnos WHERE deleted = 0 ORDER BY createdAt DESC";

    
        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }

        const [rows] = await connection.query(query);
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, nombre, apellidoPaterno, apellidoMaterno, matricula,deleted,createdAt, updatedAt, deletedAt FROM alumnos WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Alumno({ id: row.id, nombre: row.nombre, apellidoPaterno: row.apellidoPaterno, apellidoMaterno: row.apellidoMaterno,matricula:row.matricula,deleted:row.deleted ,createdAt: row.createdAt, updatedAt: row.updatedAt, deletedAt: row.deletedAt });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE alumnos SET deleted = 0, deletedAt = ? WHERE id = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el Alumno");
        }

        return
    }


    static async updateById(id, { nombre, matricula }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE alumnos SET nombre = ?, matricula = ?, updatedAt = ? WHERE id = ?", [nombre, matricula, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("el alumno no pudo actualizarse");
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
        const [result] = await connection.execute("INSERT INTO alumnos (nombre, apellidoPaterno, apellidoMaterno, matricula, createdAt,deleted) VALUES (?, ?, ?,?,?,?)", [this.nombre, this.apellidoPaterno,this.apellidoMaterno,this.matricula, createdAt,0]);

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