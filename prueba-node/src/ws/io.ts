import { Server } from 'socket.io';
import { loadEnv } from '../config/env';
import { logger } from '../common/logger';

let io: any = null;

/**
 * Crea y configura la instancia de Socket.IO
 */
export function createIO(httpServer: any): Server {
  try {
    const env = loadEnv();
    io = new Server(httpServer, {
      cors: {
        origin: env.CORS_ORIGINS.split(',').map(s => s.trim()),
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      transports: ['websocket', 'polling']
    });

    // Manejar conexiones
    io.on?.('connection', (socket: any) => {
      try {
        // Log de conexión
        const connectionInfo = { 
          socketId: socket?.id,
          userAgent: socket?.handshake?.headers?.['user-agent'] || 'unknown',
          ip: socket?.handshake?.address || 'unknown'
        };
        logger.info('Nueva conexión WebSocket', connectionInfo);

        // Eventos del socket
        socket.on?.('disconnect', (reason: string) => {
          logger.info('Desconexión WebSocket', { socketId: socket?.id, reason });
        });

        socket.on?.('error', (err: Error) => {
          logger.error('Error en WebSocket', err, { socketId: socket?.id });
        });
      } catch (error: any) {
        logger.error('Error al manejar conexión WebSocket:', new Error(error?.message || 'Error desconocido'));
      }
    });

    return io;
  } catch (error: any) {
    const err = new Error(error?.message || 'Error desconocido');
    logger.error('Error al crear servidor WebSocket:', err);
    throw err;
  }
}

/**
 * Obtiene la instancia actual de Socket.IO
 * @returns La instancia de Socket.IO o undefined si no está inicializado
 */
export function getIO(): Server | undefined {
  if (!io) {
    logger.warn('Intento de acceso a Socket.IO no inicializado');
    return undefined;
  }
  return io;
}
