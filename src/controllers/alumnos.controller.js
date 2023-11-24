const Alumno = require('../models/alumnos.model');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const alumnos = await Alumno.getAll({offset, limit}, {sort, order});

        let response = {
            message: "alumnos obtenidos exitosamente",
            data: alumnos
        };
        
        if (page && limit) {
            const totalalumnos = await Alumno.count();
            response = {
                ...response,
                total: totalalumnos,
                totalPages: Math.ceil(totalalumnos / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los alumnos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idAlumno = req.params.id;
        const alumno = await Alumno.getById(idAlumno);

        if (!alumno) {
            return res.status(404).json({
                message: `no se encontró el Alumno con id ${idAlumno}`
            });
        };

        return res.status(200).json({
            message: "Alumno encontrado exitosamente",
            alumno
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el Alumno",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const alumno = new Alumno({
            nombre: req.body.nombre,
            apellidoPaterno: req.body.apellidoPaterno,
            apellidoMaterno: req.body.apellidoMaterno,
            matricula: req.body.matricula,
            
        });

        await alumno.save()

        return res.status(201).json({
            message: "alumno creado exitosamente",
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el Alumno",
            error: error.message
        });
    }
}

const deleteLogico = async (req, res) => {
    try {
        const idAlumno = req.params.id;

        await Alumno.deleteLogicoById(idAlumno);

        return res.status(200).json({
            message: "se eliminó el Alumno correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el Alumno",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idAlumno = req.params.id;

        await Alumno.deleteFisicoById(idAlumno);

        return res.status(200).json({
            message: "se eliminó el Alumno correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el Alumno",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idAlumno = req.params.id;
        const datosActualizar = {
            email: req.body.email,
            password: req.body.password
        }

        await Alumno.updateById(idAlumno, datosActualizar);

        return res.status(200).json({
            message: "el Alumno se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el Alumno",
            error: error.message
        })
    }
}

module.exports = {
    index,
    getById,
    create,
    delete: deleteLogico,
    update
}