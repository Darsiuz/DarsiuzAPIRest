import express from 'express';
import cors from 'cors';
import pool from './config/db.js';

const app = express();
// Middlewares
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
});

// ENDPOINT 1: Obtener todos los alumnos (Read)
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

// ENDPOINT 2: Crear un nuevo alumno (Create) - MODO SEGURO
app.post('/api/students', async (req, res) => {
    try {
        const { name, course } = req.body;
        // 1. Definimos el SQL con Placeholders (?)
        const query = "INSERT INTO student (name, course) VALUES (?, ?)";
        // 2. Pasamos los valores en un array separado
        const [result] = await pool.query(query, [name, course]);
        // 3. Respondemos con el nuevo ID (opcional)
        res.status(201).json({ newId: (result as any).insertId, name, course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el alumno' });
    }
});

// ENDPOINT 3: Actualizar un alumno (Update) - MODO SEGURO
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, course } = req.body;
        const query = "UPDATE student SET name = ?, course = ? WHERE id = ?";
        const [result] = await pool.query(query, [name, course, id]);
        res.status(200).json({ id, name, course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
});

// ENDPOINT 4: Eliminar un alumno (Delete) - MODO SEGURO
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