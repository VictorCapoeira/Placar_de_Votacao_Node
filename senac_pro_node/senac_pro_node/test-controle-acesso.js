// Script de teste para verificar o sistema de controle de acesso ao placar

const ADMIN_CPF = '12345678912';
const USER_CPF = '11111111111'; // CPF comum para teste

console.log('=== TESTE DO SISTEMA DE CONTROLE DE ACESSO AO PLACAR ===\n');

// Função para simular requisições HTTP
async function testRequest(url, description, expectedStatus = 200) {
    try {
        console.log(`🔍 Testando: ${description}`);
        console.log(`   URL: ${url}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Resposta:`, JSON.stringify(data, null, 2));
        
        if (response.status === expectedStatus) {
            console.log(`   ✅ PASSOU - Status esperado: ${expectedStatus}\n`);
        } else {
            console.log(`   ❌ FALHOU - Esperado: ${expectedStatus}, Recebido: ${response.status}\n`);
        }
        
        return { status: response.status, data };
    } catch (error) {
        console.log(`   ❌ ERRO: ${error.message}\n`);
        return { status: 'ERROR', data: null };
    }
}

// Função principal de teste
async function runTests() {
    const baseUrl = 'http://localhost:3000';
    
    console.log('1. TESTE DE VERIFICAÇÃO DE CPF ADMINISTRATIVO\n');
    
    // Teste 1: Verificar CPF administrativo
    await testRequest(
        `${baseUrl}/api/check-admin/${ADMIN_CPF}`,
        'Verificação de CPF administrativo válido',
        200
    );
    
    // Teste 2: Verificar CPF comum
    await testRequest(
        `${baseUrl}/api/check-admin/${USER_CPF}`,
        'Verificação de CPF comum (não admin)',
        200
    );
    
    console.log('2. TESTE DE ACESSO AO PLACAR\n');
    
    // Teste 3: Acesso com CPF administrativo
    await testRequest(
        `${baseUrl}/api/placar?cpf=${ADMIN_CPF}`,
        'Acesso ao placar com CPF administrativo',
        200
    );
    
    // Teste 4: Acesso com CPF comum (deve falhar)
    await testRequest(
        `${baseUrl}/api/placar?cpf=${USER_CPF}`,
        'Acesso ao placar com CPF comum (deve ser negado)',
        403
    );
    
    // Teste 5: Acesso sem CPF (deve falhar)
    await testRequest(
        `${baseUrl}/api/placar`,
        'Acesso ao placar sem CPF (deve ser negado)',
        401
    );
    
    console.log('3. TESTE DE VERIFICAÇÃO DE CPF GERAL\n');
    
    // Teste 6: Verificar CPF administrativo no endpoint geral
    await testRequest(
        `${baseUrl}/api/check-cpf/${ADMIN_CPF}`,
        'Verificação geral do CPF administrativo',
        200
    );
    
    // Teste 7: Verificar CPF comum no endpoint geral
    await testRequest(
        `${baseUrl}/api/check-cpf/${USER_CPF}`,
        'Verificação geral do CPF comum',
        200
    );
    
    console.log('4. TESTE DE VALIDAÇÃO DE CPF\n');
    
    // Teste 8: CPF inválido
    await testRequest(
        `${baseUrl}/api/check-cpf/123`,
        'Verificação com CPF inválido (deve falhar)',
        400
    );
    
    console.log('=== RESUMO DOS TESTES ===');
    console.log('✅ Se todos os testes passaram, o sistema está funcionando corretamente');
    console.log('❌ Se algum teste falhou, verifique a implementação');
    console.log('\n💡 Para testar a interface web:');
    console.log(`   1. Acesse: ${baseUrl}`);
    console.log(`   2. Use o CPF: ${ADMIN_CPF} (admin) ou outro CPF (usuário comum)`);
    console.log(`   3. Observe se o link do placar aparece apenas para o admin`);
    console.log(`   4. Tente acessar: ${baseUrl}/placar.html diretamente`);
}

// Verifica se está sendo executado em ambiente Node.js
if (typeof window === 'undefined') {
    // Ambiente Node.js - usa fetch nativo ou polyfill
    const fetch = require('node-fetch');
    runTests();
} else {
    // Ambiente navegador - pode executar diretamente
    console.log('Para executar este teste no navegador, abra o console e chame runTests()');
    window.runTests = runTests;
}

module.exports = { runTests };