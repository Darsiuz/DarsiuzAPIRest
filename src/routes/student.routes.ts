import { Router } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";

const router = Router();

// Obtener todos los alumnos
router.get('/', async (req, res) => {
    try {
        const query = "SELECT * FROM student ORDER BY id DESC";
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
});

// Crear alumno
router.post('/', async (req, res) => {
    try {
        const { name, email, course, edad } = req.body;
        const query = "INSERT INTO student (name, email, course, edad) VALUES (?, ?, ?, ?)";
        const [result] = await pool.query(query, [name, email, course, edad]);
        res.status(201).json({ newId: (result as any).insertId, name, email, course, edad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el alumno' });
    }
});

// Obtener alumno por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM student WHERE id = ?";
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el alumno' });
    }
});

// Eliminar alumno
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM student WHERE id = ?";
        await pool.query(query, [id]);

        res.status(200).json({ message: 'Alumno eliminado', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el alumno' });
    }
});

// Actualizar alumno
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, course, edad } = req.body;

        const query = "UPDATE student SET name = ?, email = ?, course = ?, edad = ? WHERE id = ?";
        await pool.query(query, [name, email, course, edad, id]);

        res.status(200).json({ id, name, email, course, edad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        const keys = Object.keys(fields);
        const values = Object.values(fields);

        if (keys.length === 0) {
            return res.status(400).json({ error: "No se enviaron campos a actualizar" });
        }

        const setQuery = keys.map(key => `${key} = ?`).join(', ');

        const query = `UPDATE student SET ${setQuery} WHERE id = ?`;

        await pool.query(query, [...values, id]);

        res.status(200).json({ message: "Alumno actualizado parcialmente", fields });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar" });
    }
});


export default router;
