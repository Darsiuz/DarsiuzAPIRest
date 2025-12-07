import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';
import { Request, Response, NextFunction } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './routes/swagger.config';

const app = express();
// Middlewares
app.use(express.json());
app.use(cors());

// Auth Guard Middleware
const authGuard = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-secret-key'];
    if (apiKey === 'UTP2025') {
        console.log('Acceso autorizado');
        next();
    } else {
        res.status(401).json({ error: 'Acceso Denegado: Clave incorrecta' });
        console.warn('Intento de acceso no autorizado:');
    }
};

// Logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

// Swagger Config
const spec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));

app.use(logger);
app.use('/api/students', authGuard, studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
    console.log(`Documentacion de la API en http://localhost:${PORT}/api/docs`);
});
