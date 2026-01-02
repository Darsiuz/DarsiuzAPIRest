import { Router, Request, Response } from 'express';
import pool from "../config/db";

const router = Router();

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Registrar una nota a un alumno
 *     tags:
 *       - Grades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - course
 *               - score
 *             properties:
 *               student_id:
 *                 type: integer
 *                 example: 1
 *               course:
 *                 type: string
 *                 example: Programacion
 *               score:
 *                 type: number
 *                 example: 18
 *     responses:
 *       201:
 *         description: Nota registrada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req: Request, res: Response) => {
    const { student_id, course, score } = req.body;

    if (!student_id || !course || score === undefined) {
        return res.status(400).json({
            error: 'student_id, course y score son obligatorios'
        });
    }
    try {
        const [result] = await pool.execute(
            `INSERT INTO grades (student_id, course, score) VALUES (?, ?, ?)`,
            [student_id, course, score]
        );

        res.status(201).json({
            message: 'Nota registrada correctamente',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la nota' });
    }
});

/**
 * @swagger
 * /api/grades/student/{student_id}:
 *   get:
 *     summary: Obtener todas las notas de un alumno
 *     tags:
 *       - Grades
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno
 *     responses:
 *       200:
 *         description: Lista de notas del alumno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   course:
 *                     type: string
 *                   score:
 *                     type: number
 *                   created_at:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/student/:student_id', async (req: Request, res: Response) => {
    const { student_id } = req.params;

    try {
        const [rows] = await pool.execute(
            `SELECT id, course, score, created_at
             FROM grades
             WHERE student_id = ?`,
            [student_id]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
});

export default router;
