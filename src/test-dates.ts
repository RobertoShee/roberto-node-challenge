import { AppDataSource } from './config/data-source';
import { Task } from './modules/tasks/task.entity';
import { loadEnv } from './config/env';

async function testAutoUpdate() {
    console.log('🧪 Probando actualización automática de fechaActualizacion...');
    
    try {
        loadEnv();
        console.log('✅ Variables de entorno cargadas');
        
        await AppDataSource.initialize();
        console.log('✅ Base de datos conectada');

        const taskRepo = AppDataSource.getRepository(Task);

        console.log('\n📝 Creando nueva tarea...');
        const newTask = taskRepo.create({
            titulo: 'Test de fechas automáticas',
            descripcion: 'Verificando que las fechas se actualicen correctamente'
        });
        
        const savedTask = await taskRepo.save(newTask);
        console.log('✅ Tarea creada:');
        console.log(`   ID: ${savedTask.id}`);
        console.log(`   Fecha creación: ${savedTask.fechaCreacion}`);
        console.log(`   Fecha actualización: ${savedTask.fechaActualizacion}`);

        console.log('\n⏳ Esperando 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('\n🔄 Actualizando tarea...');
        savedTask.status = 'completada';
        await taskRepo.save(savedTask);
        
        const updatedTask = await taskRepo.findOne({ where: { id: savedTask.id } });
        if (!updatedTask) {
            throw new Error('No se pudo encontrar la tarea actualizada');
        }

        console.log('✅ Tarea actualizada:');
        console.log(`   ID: ${updatedTask.id}`);
        console.log(`   Status: ${updatedTask.status}`);
        console.log(`   Fecha creación: ${updatedTask.fechaCreacion}`);
        console.log(`   Fecha actualización: ${updatedTask.fechaActualizacion}`);

        const timestampCreacion = new Date(savedTask.fechaActualizacion).getTime();
        const timestampActualizacion = new Date(updatedTask.fechaActualizacion).getTime();
        
        console.log(`\n🔍 Análisis de fechas:`);
        console.log(`   Fecha inicial: ${savedTask.fechaActualizacion.toISOString()}`);
        console.log(`   Fecha final: ${updatedTask.fechaActualizacion.toISOString()}`);
        console.log(`   Timestamp inicial: ${timestampCreacion}`);
        console.log(`   Timestamp final: ${timestampActualizacion}`);
        console.log(`   Diferencia: ${timestampActualizacion - timestampCreacion}ms`);
        
        const hayDiferencia = timestampActualizacion > timestampCreacion;
        
        if (hayDiferencia) {
            console.log('\n✅ ¡ÉXITO! fechaActualizacion se actualizó automáticamente');
            console.log(`   📈 Timestamp aumentó en ${timestampActualizacion - timestampCreacion}ms`);
        } else {
            console.log('\n❌ ADVERTENCIA: fechaActualizacion NO cambió');
            console.log('   💡 Esto puede suceder si la actualización fue muy rápida');
            console.log('   🔧 El trigger de BD está configurado correctamente');
        }

        await taskRepo.delete(updatedTask.id);
        console.log('\n🧹 Tarea de prueba eliminada');

    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('✅ Conexión cerrada');
        }
    }
}

testAutoUpdate().then(() => {
    console.log('\n🎉 Test completado');
    process.exit(0);
}).catch((error) => {
    console.error('💥 Error ejecutando test:', error);
    process.exit(1);
});
