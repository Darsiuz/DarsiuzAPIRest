import express from 'express';
import cors from 'cors';
import { RowDataPacket } from 'mysql2';
import pool from './config/db';

const app = express();
// Middlewares
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
});

// ENDPOINT 1: Obtener todos los alumnos
app.get('/api/students', async (req, res) => {
    try {
        const query = "SELECT * FROM student ORDER BY createdAt DESC";
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
});

// ENDPOINT 2: Crear un nuevo alumno
app.post('/api/students', async (req, res) => {
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
// ENDPOINT 3: Obtener un alumno por ID
app.get('/api/students/:id', async (req, res) => {
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

// ENDPOINT 4: Actualizar un alumno
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, course, edad } = req.body;
        const query = "UPDATE student SET name = ?, email = ?, course = ?, edad = ? WHERE id = ?";
        const [result] = await pool.query(query, [name, course, id]);
        res.status(200).json({ id, name, course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
});

// ENDPOINT 5: Eliminar un alumno
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM student WHERE id = ?";
        const [result] = await pool.query(query, [id]);
        res.status(200).json({ message: 'Alumno eliminado', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el alumno' });
    }
});