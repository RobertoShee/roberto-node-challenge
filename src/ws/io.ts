import { Server } from 'socket.io';
import { loadEnv } from '../config/env';
import { logger } from '../common/logger';

let io: Server | null = null;

export function createIO(httpServer: any): Server {
    const env = loadEnv();
    io = new Server(httpServer, {
        cors: {
            origin: env.CORS_ORIGINS.split(',').map(s => s.trim()),
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
        transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
        logger.info('Nueva conexión WebSocket', { 
            socketId: socket.id,
            userAgent: socket.handshake.headers['user-agent'],
            ip: socket.handshake.address
        });

        socket.on('disconnect', (reason) => {
            logger.info('Desconexión WebSocket', { 
                socketId: socket.id,
                reason 
            });
        });

        socket.on('error', (error) => {
            logger.error('Error en WebSocket', error, { 
                socketId: socket.id 
            });
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        const error = new Error('Socket.IO no inicializado');
        logger.error('Intento de acceso a Socket.IO no inicializado', error);
        throw error;
    }
    return io;
}
