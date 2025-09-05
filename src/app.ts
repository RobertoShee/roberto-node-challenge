import express from 'express';
import cors from 'cors';
import path from 'path';
import { loadEnv } from './config/env';
import { taskRouter } from './modules/tasks/controllers';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares/error-handler';
import { logger } from './common/logger';

const env = loadEnv();
export const app = express();

// Middleware de logging de requests
app.use(requestLogger);

// CORS
app.use(cors({ origin: env.CORS_ORIGINS.split(',').map(s => s.trim()) }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static('public'));

// Routes
app.get('/health', (_req, res) => {
  logger.info('Health check requested');
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/tasks', taskRouter);

// Middleware para rutas no encontradas (debe ir antes del error handler)
app.use(notFoundHandler);

// Middleware global de manejo de errores (debe ir al final)
app.use(errorHandler);
