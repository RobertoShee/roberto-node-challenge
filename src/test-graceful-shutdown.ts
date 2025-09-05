import { spawn, ChildProcess } from 'child_process';
import { setTimeout } from 'timers/promises';

async function testGracefulShutdown(): Promise<void> {
    console.log('🧪 Iniciando test de graceful shutdown...');
    
    return new Promise((resolve, reject) => {
        let serverProcess: ChildProcess;
        let shutdownStarted = false;
        let shutdownCompleted = false;
        const timeout = 10000;

        try {
            console.log('🚀 Iniciando servidor...');
            serverProcess = spawn('yarn', ['dev'], {
                cwd: process.cwd(),
                stdio: 'pipe',
                shell: true
            });

            const startTime = Date.now();
            
            serverProcess.stdout?.on('data', (data) => {
                const output = data.toString();
                console.log('📋 Server output:', output.trim());
                
                if (output.includes('API escuchando en')) {
                    console.log('✅ Servidor iniciado correctamente');
                    
                    setTimeout(2000).then(() => {
                        console.log('🛑 Enviando señal SIGINT para graceful shutdown...');
                        shutdownStarted = true;
                        serverProcess.kill('SIGINT');
                    });
                }
                
                if (output.includes('Señal SIGINT recibida')) {
                    console.log('✅ Graceful shutdown iniciado correctamente');
                }
                
                if (output.includes('Graceful shutdown completado')) {
                    shutdownCompleted = true;
                    console.log('✅ Graceful shutdown completado exitosamente');
                }
            });

            serverProcess.stderr?.on('data', (data) => {
                console.log('❌ Server error:', data.toString());
            });

            serverProcess.on('exit', (code, signal) => {
                const duration = Date.now() - startTime;
                console.log(`🔚 Servidor terminado - Código: ${code}, Señal: ${signal}, Duración: ${duration}ms`);
                
                if (shutdownStarted) {
                    console.log('✅ Test de graceful shutdown: EXITOSO');
                    console.log(`   📊 Tiempo total de shutdown: ${duration - 2000}ms`);
                    resolve();
                } else {
                    reject(new Error('El servidor terminó antes de completar el test'));
                }
            });

            setTimeout(timeout).then(() => {
                if (!shutdownCompleted) {
                    console.log('⏰ Timeout del test, terminando servidor...');
                    serverProcess.kill('SIGKILL');
                    reject(new Error(`Test timeout después de ${timeout}ms`));
                }
            });

        } catch (error) {
            console.error('💥 Error en test de graceful shutdown:', error);
            reject(error);
        }
    });
}

testGracefulShutdown()
    .then(() => {
        console.log('\n🎉 Test de graceful shutdown completado exitosamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test de graceful shutdown falló:', error);
        process.exit(1);
    });
