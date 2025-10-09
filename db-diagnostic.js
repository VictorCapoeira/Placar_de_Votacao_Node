const mysql = require('mysql2/promise');

// Configurações do banco
const DB_HOST = process.env.DB_HOST || 'up-de-fra1-mysql-1.db.run-on-seenode.com';
const DB_USER = process.env.DB_USER || 'db_dtnidddiwulw';
const DB_PASSWORD = process.env.DB_PASSWORD || 'cI8C9O2nSwZ2ZmHfgJW5phzi';
const DB_NAME = process.env.DB_NAME || 'db_dtnidddiwulw';

async function diagnosticoBanco() {
    console.log('🔍 DIAGNÓSTICO DE CONEXÃO COM BANCO DE DADOS');
    console.log('='.repeat(50));
    
    console.log('\n📋 Configurações:');
    console.log(`   Host: ${DB_HOST}`);
    console.log(`   User: ${DB_USER}`);
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   Password: ${'*'.repeat(DB_PASSWORD.length)}`);
    
    // Teste 1: Conexão simples
    console.log('\n🔗 Teste 1: Conexão simples...');
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            connectTimeout: 60000,
            acquireTimeout: 60000,
            timeout: 60000
        });
        
        console.log('✅ Conexão estabelecida com sucesso!');
        await connection.end();
    } catch (error) {
        console.error('❌ Erro na conexão simples:', error.message);
        console.error('   Código:', error.code);
    }
    
    // Teste 2: Conexão com SSL
    console.log('\n🔒 Teste 2: Conexão com SSL...');
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            connectTimeout: 60000,
            acquireTimeout: 60000,
            timeout: 60000,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        const [rows] = await connection.execute('SELECT 1 as test, NOW() as timestamp');
        console.log('✅ Conexão SSL estabelecida com sucesso!');
        console.log(`   Resultado: ${JSON.stringify(rows[0])}`);
        await connection.end();
    } catch (error) {
        console.error('❌ Erro na conexão SSL:', error.message);
        console.error('   Código:', error.code);
    }
    
    // Teste 3: Pool de conexões
    console.log('\n🏊 Teste 3: Pool de conexões...');
    try {
        const pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        const [rows] = await pool.query('SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = ?', [DB_NAME]);
        console.log('✅ Pool de conexões funcionando!');
        console.log(`   Tabelas no banco: ${rows[0].total_tables}`);
        
        await pool.end();
    } catch (error) {
        console.error('❌ Erro no pool de conexões:', error.message);
        console.error('   Código:', error.code);
    }
    
    console.log('\n🏁 Diagnóstico concluído!');
}

// Executa o diagnóstico
diagnosticoBanco().catch(console.error);