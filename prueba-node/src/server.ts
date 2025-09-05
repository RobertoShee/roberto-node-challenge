import http from 'http';
import { app } from './app';
import { createIO, getIO } from './ws/io';
import { AppDataSource } from './config/data-source';
import { loadEnv } from './config/env';

// Gestor del ciclo de vida del servidor
class ServerManager {
  private server: http.Server | null = null;
  private isShuttingDown = false;

  // Inicializa y arranca el servidor
  async start(): Promise<void> {
    try {
      const env = loadEnv();
      
  await AppDataSource.initialize();
  this.server = http.createServer(app);
  createIO(this.server);
  this.setupGracefulShutdown();
      await new Promise<void>((resolve, reject) => {
        this.server!.listen(env.PORT, (err?: Error) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(`API escuchando en http://localhost:${env.PORT}`);
          resolve();
        });
      });

    } catch (error) {
      console.error('❌ Error al inicializar el servidor:', error);
      await this.shutdown(1);
    }
  }

  // Configura los handlers para graceful shutdown
  private setupGracefulShutdown(): void {
  // Señales de terminación
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
    
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n🛑 Señal ${signal} recibida. Iniciando graceful shutdown...`);
        await this.shutdown(0);
      });
    });

  // Errores no capturados
    process.on('uncaughtException', async (error) => {
      console.error('💥 Excepción no capturada:', error);
      await this.shutdown(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      console.error('🚫 Promise rechazada no manejada:', reason, 'en', promise);
      await this.shutdown(1);
    });
  }

  // Realiza un shutdown graceful del servidor
  private async shutdown(exitCode: number): Promise<void> {
    if (this.isShuttingDown) {
      console.log('⚠️ Shutdown ya en progreso...');
      return;
    }

    this.isShuttingDown = true;
    console.log('🔄 Iniciando proceso de cierre graceful...');

    try {
  // Dejar de aceptar nuevas conexiones
      if (this.server) {
        console.log('📡 Cerrando servidor HTTP...');
        await new Promise<void>((resolve) => {
          this.server!.close(() => {
            console.log('✅ Servidor HTTP cerrado');
            resolve();
          });
        });
      }

  // Cerrar conexiones WebSocket
      const io = getIO();
      if (io) {
        console.log('🔌 Cerrando conexiones WebSocket...');
        io.close();
        console.log('✅ WebSockets cerrados');
      }

  // Cerrar conexión a base de datos
      if (AppDataSource.isInitialized) {
        console.log('🗄️ Cerrando conexión a base de datos...');
        await AppDataSource.destroy();
        console.log('✅ Base de datos desconectada');
      }

      console.log('🎉 Graceful shutdown completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error durante el shutdown:', error);
      exitCode = 1;
    } finally {
      process.exit(exitCode);
    }
  }
}

// Inicializar y arrancar el servidor
const serverManager = new ServerManager();
serverManager.start().catch((error) => {
  console.error('💥 Error fatal al arrancar el servidor:', error);
  process.exit(1);
});
