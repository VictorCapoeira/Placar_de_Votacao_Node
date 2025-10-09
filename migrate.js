const knex = require('knex');
const config = require('./knexfile.js');

// Usa a configuração de desenvolvimento por padrão
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

/**
 * Executa as migrations para criar/atualizar o banco de dados
 */
async function runMigrations() {
  try {
    console.log('🔧 Executando migrations...');
    
    // Executa as migrations
    await db.migrate.latest();
    console.log('✅ Migrations executadas com sucesso!');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error.message);
    return false;
  }
}

/**
 * Executa os seeds para popular o banco com dados iniciais
 */
async function runSeeds() {
  try {
    console.log('🌱 Executando seeds...');
    
    // Executa os seeds
    await db.seed.run();
    console.log('✅ Seeds executados com sucesso!');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error.message);
    return false;
  }
}

/**
 * Reverte as migrations (desfaz as alterações)
 */
async function rollbackMigrations() {
  try {
    console.log('🔄 Revertendo migrations...');
    
    // Reverte a última migração
    await db.migrate.rollback();
    console.log('✅ Rollback executado com sucesso!');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao fazer rollback:', error.message);
    return false;
  }
}

/**
 * Verifica o status das migrations
 */
async function checkMigrationStatus() {
  try {
    const [completed, pending] = await db.migrate.list();
    
    console.log('📊 Status das migrations:');
    console.log(`✅ Completadas: ${completed.length}`);
    console.log(`⏳ Pendentes: ${pending.length}`);
    
    if (completed.length > 0) {
      console.log('\n✅ Migrations completadas:');
      completed.forEach(migration => console.log(`  - ${migration}`));
    }
    
    if (pending.length > 0) {
      console.log('\n⏳ Migrations pendentes:');
      pending.forEach(migration => console.log(`  - ${migration}`));
    }
    
    return { completed, pending };
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
    return null;
  }
}

/**
 * Inicializa o banco de dados completo (migrations + seeds)
 */
async function initializeDatabase() {
  try {
    console.log('🚀 Inicializando banco de dados...\n');
    
    // Primeiro executa as migrations
    const migrationsSuccess = await runMigrations();
    if (!migrationsSuccess) {
      throw new Error('Falha ao executar migrations');
    }
    
    console.log('');
    
    // Depois executa os seeds
    const seedsSuccess = await runSeeds();
    if (!seedsSuccess) {
      throw new Error('Falha ao executar seeds');
    }
    
    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('📋 O banco agora contém:');
    console.log('  - Tabelas: usuario, turno, turma, votos');
    console.log('  - Dados iniciais: 3 turnos e 10 turmas');
    
    return true;
  } catch (error) {
    console.error('\n💥 Erro na inicialização:', error.message);
    return false;
  } finally {
    // Fecha a conexão
    await db.destroy();
  }
}

// Exporta as funções para uso em outros módulos
module.exports = {
  runMigrations,
  runSeeds,
  rollbackMigrations,
  checkMigrationStatus,
  initializeDatabase,
  db
};

// Se executado diretamente (não importado), executa a inicialização
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      runMigrations().then(() => db.destroy());
      break;
    case 'seed':
      runSeeds().then(() => db.destroy());
      break;
    case 'rollback':
      rollbackMigrations().then(() => db.destroy());
      break;
    case 'status':
      checkMigrationStatus().then(() => db.destroy());
      break;
    case 'init':
    default:
      initializeDatabase();
      break;
  }
}