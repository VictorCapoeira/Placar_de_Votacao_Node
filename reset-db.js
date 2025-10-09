const knex = require('knex');
const config = require('./knexfile.js');

// Usa a configuração de desenvolvimento por padrão
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

/**
 * Remove todas as tabelas do sistema se existirem
 */
async function dropAllTables() {
  try {
    console.log('🗑️ Removendo tabelas existentes...');
    
    // Desabilita verificação de foreign keys temporariamente
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    
    // Remove as tabelas na ordem correta (respeitando foreign keys)
    const tables = ['votos', 'turma', 'turno', 'usuario'];
    
    for (const table of tables) {
      const exists = await db.schema.hasTable(table);
      if (exists) {
        await db.schema.dropTable(table);
        console.log(`  ✅ Tabela '${table}' removida`);
      }
    }
    
    // Reabilita verificação de foreign keys
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Todas as tabelas foram removidas com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover tabelas:', error.message);
    return false;
  }
}

/**
 * Reseta completamente o banco de dados
 */
async function resetDatabase() {
  try {
    console.log('🔄 Resetando banco de dados completamente...\n');
    
    // Remove todas as tabelas
    const dropSuccess = await dropAllTables();
    if (!dropSuccess) {
      throw new Error('Falha ao remover tabelas existentes');
    }
    
    console.log('');
    
    // Remove registros de migrations do Knex
    try {
      await db.schema.dropTableIfExists('knex_migrations');
      await db.schema.dropTableIfExists('knex_migrations_lock');
      console.log('✅ Registros de migrations removidos');
    } catch (err) {
      console.log('ℹ️ Nenhum registro de migration encontrado');
    }
    
    console.log('');
    
    // Agora executa as migrations
    const { runMigrations, runSeeds } = require('./migrate');
    
    const migrationsSuccess = await runMigrations();
    if (!migrationsSuccess) {
      throw new Error('Falha ao executar migrations');
    }
    
    console.log('');
    
    // Executa os seeds
    const seedsSuccess = await runSeeds();
    if (!seedsSuccess) {
      throw new Error('Falha ao executar seeds');
    }
    
    console.log('\n🎉 Banco de dados resetado e inicializado com sucesso!');
    return true;
    
  } catch (error) {
    console.error('\n💥 Erro no reset:', error.message);
    return false;
  } finally {
    await db.destroy();
  }
}

// Se executado diretamente
if (require.main === module) {
  resetDatabase();
}

module.exports = {
  dropAllTables,
  resetDatabase
};