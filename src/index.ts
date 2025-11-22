import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';

const app = express();
// Middlewares
app.use(express.json());
app.use(cors());

app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
});
