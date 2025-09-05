import http from 'http';
import { app } from './app';
import { createIO, getIO } from './ws/io';
import { AppDataSource } from './config/data-source';
import { loadEnv } from './config/env';

class ServerManager {
    private server: http.Server | null = null;
    private isShuttingDown = false;

    async start(): Promise<void> {
        try {
            const env = loadEnv();
            
            console.log('🔄 Inicializando base de datos...');
            await AppDataSource.initialize();
            console.log('✅ Base de datos inicializada correctamente');

            this.server = http.createServer(app);
            
            createIO(this.server);
            console.log('✅ Socket.IO configurado');

            this.setupGracefulShutdown();

            await new Promise<void>((resolve, reject) => {
                this.server!.listen(env.PORT, (err?: Error) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log(`🚀 API escuchando en http://localhost:${env.PORT}`);
                    console.log(`🌐 Frontend disponible en http://localhost:${env.PORT}`);
                    console.log('📡 WebSockets habilitados para tiempo real');
                    resolve();
                });
            });

        } catch (error) {
            console.error('❌ Error al inicializar el servidor:', error);
            await this.shutdown(1);
        }
    }

    private setupGracefulShutdown(): void {
        const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
        
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n🛑 Señal ${signal} recibida. Iniciando graceful shutdown...`);
                await this.shutdown(0);
            });
        });

        process.on('uncaughtException', async (error) => {
            console.error('💥 Excepción no capturada:', error);
            await this.shutdown(1);
        });

        process.on('unhandledRejection', async (reason, promise) => {
            console.error('🚫 Promise rechazada no manejada:', reason, 'en', promise);
            await this.shutdown(1);
        });
    }

    private async shutdown(exitCode: number): Promise<void> {
        if (this.isShuttingDown) {
            console.log('⚠️ Shutdown ya en progreso...');
            return;
        }

        this.isShuttingDown = true;
        console.log('🔄 Iniciando proceso de cierre graceful...');

        try {
            if (this.server) {
                console.log('📡 Cerrando servidor HTTP...');
                await new Promise<void>((resolve) => {
                    this.server!.close(() => {
                        console.log('✅ Servidor HTTP cerrado');
                        resolve();
                    });
                });
            }

            const io = getIO();
            if (io) {
                console.log('🔌 Cerrando conexiones WebSocket...');
                io.close();
                console.log('✅ WebSockets cerrados');
            }

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

const serverManager = new ServerManager();
serverManager.start().catch((error) => {
    console.error('💥 Error fatal al arrancar el servidor:', error);
    process.exit(1);
});
