import { Router } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";

const router = Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Obtener todos los alumnos
 *     responses:
 *       200:
 *         description: Lista de alumnos
 */
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

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Crear un nuevo alumno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *               edad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Alumno creado
 */
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

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Obtener un alumno por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del alumno
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alumno encontrado
 *       404:
 *         description: Alumno no encontrado
 */
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

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Eliminar un alumno por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del alumno
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alumno eliminado
 *       404:
 *         description: Alumno no encontrado
 */
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

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Actualizar un alumno por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del alumno
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *               edad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Alumno actualizado
 *       404:
 *         description: Alumno no encontrado
 */
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

/**
 * @swagger
 * /api/students/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un alumno por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del alumno
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *               edad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Alumno actualizado parcialmente
 *       404:
 *         description: Alumno no encontrado
 */
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

/**
 * @swagger
 * /api/students/total/count:
 *   get:
 *     summary: Obtener el total de alumnos
 *     responses:
 *       200:
 *         description: Total de alumnos
 *       500:
 *         description: Error al obtener el total de alumnos
 */
router.get('/total/count', async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS total FROM student";
        const [rows] = await pool.query<RowDataPacket[]>(query);
        const total = (rows[0] as RowDataPacket | undefined)?.total ?? 0;
        res.json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el total de alumnos' });
    }
});

export default router;
