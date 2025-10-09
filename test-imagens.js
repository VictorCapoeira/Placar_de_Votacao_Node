// Script de teste para verificar se as imagens estão sendo carregadas corretamente
// com base no codigo_turma

const path = require('path');
const fs = require('fs');

// Copia da função modificada para teste
function getImagensParaTurma(codigoTurma, turmaId = null) {
    const imagensPath = path.join(__dirname, 'public', 'imagens');
    
    try {
        // Cria a pasta principal se não existir
        if (!fs.existsSync(imagensPath)) {
            fs.mkdirSync(imagensPath, { recursive: true });
            console.log(`Pasta criada: ${imagensPath}`);
            return [];
        }
        
        let imageFiles = [];
        
        // MÉTODO 1: Busca em pasta específica da turma usando codigo_turma (NOVO - PREFERENCIAL)
        const turmaPastas = [
            codigoTurma, // Usa o código da turma diretamente (ex: ENG-01, MED-02)
            codigoTurma.toLowerCase(), // Versão minúscula
            codigoTurma.toUpperCase(), // Versão maiúscula
            codigoTurma.replace(/[-_]/g, ''), // Remove hífens e underscores (ex: ENG01)
        ];
        
        // Se turmaId for fornecido, também tenta os padrões antigos para compatibilidade
        if (turmaId) {
            const turmaIdStr = String(turmaId);
            turmaPastas.push(
                `turma${turmaIdStr}`,
                `turma${turmaIdStr.padStart(2, '0')}`,
                `t${turmaIdStr}`,
                `${turmaIdStr}`
            );
        }
        
        for (const turmaPasta of turmaPastas) {
            const turmaPath = path.join(imagensPath, turmaPasta);
            if (fs.existsSync(turmaPath) && fs.statSync(turmaPath).isDirectory()) {
                console.log(`📁 Encontrada pasta para turma ${codigoTurma}: ${turmaPasta}`);
                const files = fs.readdirSync(turmaPath);
                const turmaImages = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(ext);
                }).map(file => `/imagens/${turmaPasta}/${file}`);
                
                imageFiles = imageFiles.concat(turmaImages);
                break; // Para no primeiro match para evitar duplicatas
            }
        }
        
        // MÉTODO 2: Busca na pasta raiz (método antigo - fallback)
        if (imageFiles.length === 0) {
            const files = fs.readdirSync(imagensPath);
            const rootImages = files.filter(file => {
                const filePath = path.join(imagensPath, file);
                if (fs.statSync(filePath).isDirectory()) return false;
                
                const ext = path.extname(file).toLowerCase();
                const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(ext);
                
                if (!isImage) return false;
                
                // Múltiplas formas de identificar a turma usando codigo_turma:
                const fileName = file.toLowerCase();
                const codigoLower = codigoTurma.toLowerCase();
                const codigoSemSeparador = codigoTurma.replace(/[-_]/g, '').toLowerCase();
                
                return (
                    fileName.includes(`${codigoLower}.`) ||
                    fileName.includes(`${codigoLower}_`) ||
                    fileName.includes(`${codigoSemSeparador}.`) ||
                    fileName.includes(`${codigoSemSeparador}_`) ||
                    fileName.startsWith(`${codigoLower}.`) ||
                    fileName.startsWith(`${codigoLower}_`) ||
                    fileName.startsWith(`${codigoSemSeparador}.`) ||
                    fileName.startsWith(`${codigoSemSeparador}_`)
                );
            });
            
            imageFiles = rootImages.map(file => `/imagens/${file}`);
        }
        
        // Ordena os arquivos para consistência
        imageFiles.sort();
        
        console.log(`🖼️ Turma ${codigoTurma}: encontradas ${imageFiles.length} imagem(s)`);
        return imageFiles;
        
    } catch (error) {
        console.error(`Erro ao buscar imagens para turma ${codigoTurma}:`, error);
        return [];
    }
}

// Testes
console.log('=== TESTE DAS IMAGENS POR CÓDIGO DE TURMA ===\n');

// Simula as turmas do banco de dados
const turmasExemplo = [
    { id_turma: 1, codigo_turma: 'ENG-01', nome_turma: 'Turma de Engenharia' },
    { id_turma: 2, codigo_turma: 'MED-02', nome_turma: 'Turma de Medicina' },
    { id_turma: 3, codigo_turma: 'DIR-03', nome_turma: 'Turma de Direito' }
];

turmasExemplo.forEach(turma => {
    console.log(`\n--- Teste para ${turma.nome_turma} (${turma.codigo_turma}) ---`);
    const imagens = getImagensParaTurma(turma.codigo_turma, turma.id_turma);
    
    if (imagens.length > 0) {
        console.log(`✅ Encontradas imagens:`);
        imagens.forEach(img => console.log(`   • ${img}`));
    } else {
        console.log(`❌ Nenhuma imagem encontrada`);
    }
});

console.log('\n=== TESTE DE COMPATIBILIDADE COM PASTAS ANTIGAS ===\n');

// Teste de compatibilidade com as pastas antigas (turma1, turma2, turma3)
const turmasAntigas = [
    { id_turma: 1, codigo_turma: 'TURMA-01' }, // Não existe pasta, deve buscar em turma1
    { id_turma: 2, codigo_turma: 'TURMA-02' }, // Não existe pasta, deve buscar em turma2
    { id_turma: 3, codigo_turma: 'TURMA-03' }  // Não existe pasta, deve buscar em turma3
];

turmasAntigas.forEach(turma => {
    console.log(`\n--- Compatibilidade para ID ${turma.id_turma} (${turma.codigo_turma}) ---`);
    const imagens = getImagensParaTurma(turma.codigo_turma, turma.id_turma);
    
    if (imagens.length > 0) {
        console.log(`✅ Encontradas imagens (compatibilidade):`);
        imagens.forEach(img => console.log(`   • ${img}`));
    } else {
        console.log(`❌ Nenhuma imagem encontrada`);
    }
});