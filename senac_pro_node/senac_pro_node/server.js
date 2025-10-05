// Servidor HTTP e utilitários
const express = require('express');
const path = require('path');
const fs = require('fs');
// Driver MySQL com suporte a Promises
const mysql = require('mysql2/promise');

const app = express();

// Configuração básica via variáveis de ambiente (com padrões para desenvolvimento local)
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'sistema_de_votos';

// Cria um pool de conexões para eficiência e reuso (cada requisição pega uma, usa e devolve)
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Função para validar CPF
function isValidCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = String(cpf).replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (casos inválidos)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf[9]) !== digit1) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf[10]) !== digit2) return false;
    
    return true;
}

// Habilita parse de JSON no corpo das requisições
app.use(express.json());
// Servir os arquivos estáticos da pasta public (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Health check simples para verificar se o servidor está no ar
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});

// GET /api/imagens -> retorna lista de imagens disponíveis (suporta pastas por turma)
app.get('/api/imagens', (_req, res) => {
    const imagensPath = path.join(__dirname, 'public', 'imagens');
    
    try {
        if (!fs.existsSync(imagensPath)) {
            return res.json([]);
        }
        
        const imagens = [];
        const items = fs.readdirSync(imagensPath);
        
        items.forEach(item => {
            const itemPath = path.join(imagensPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // É uma pasta - busca imagens dentro dela
                const turmaId = extractTurmaIdFromFolder(item);
                try {
                    const files = fs.readdirSync(itemPath);
                    files.forEach(file => {
                        const ext = path.extname(file).toLowerCase();
                        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(ext)) {
                            imagens.push({
                                nome: file,
                                url: `/imagens/${item}/${file}`,
                                turmaId: turmaId,
                                pasta: item,
                                tipo: 'pasta'
                            });
                        }
                    });
                } catch (err) {
                    console.error(`Erro ao ler pasta ${item}:`, err);
                }
            } else {
                // É um arquivo - verifica se é imagem
                const ext = path.extname(item).toLowerCase();
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(ext)) {
                    imagens.push({
                        nome: item,
                        url: `/imagens/${item}`,
                        turmaId: extractTurmaId(item),
                        pasta: null,
                        tipo: 'arquivo'
                    });
                }
            }
        });
        
        res.json(imagens);
    } catch (error) {
        console.error('Erro ao listar imagens:', error);
        res.status(500).json({ error: 'Erro ao acessar pasta de imagens.' });
    }
});

// Função auxiliar para extrair ID da turma do nome do arquivo
function extractTurmaId(filename) {
    const name = filename.toLowerCase();
    
    // Múltiplos padrões para extrair ID da turma
    const patterns = [
        /turma(\d+)/,     // turma1.jpg, turma01.png
        /t(\d+)/,         // t1.jpg, t01.png
        /projeto(\d+)/,   // projeto1.jpg
        /^(\d+)[._]/      // 1.jpg, 1_foto.png
    ];
    
    for (const pattern of patterns) {
        const match = name.match(pattern);
        if (match) {
            return parseInt(match[1]);
        }
    }
    
    return null;
}

// Função auxiliar para extrair ID da turma do nome da pasta
function extractTurmaIdFromFolder(foldername) {
    const name = foldername.toLowerCase();
    
    // Padrões para pastas
    const patterns = [
        /^turma(\d+)$/,   // turma1, turma01
        /^t(\d+)$/,       // t1, t01
        /^(\d+)$/         // 1, 01
    ];
    
    for (const pattern of patterns) {
        const match = name.match(pattern);
        if (match) {
            return parseInt(match[1]);
        }
    }
    
    return null;
}

// Função para buscar imagens de uma turma específica usando codigo_turma como nome da pasta
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

// GET /api/check-cpf/:cpf -> verifica se CPF já votou e se é administrador
app.get('/api/check-cpf/:cpf', async (req, res) => {
    const { cpf } = req.params;
    
    if (!cpf || !isValidCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido. Verifique os números e tente novamente.' });
    }
    
    // Remove formatação para consistência no banco
    const cleanCPF = String(cpf).replace(/\D/g, '');
    
    // Verifica se é o CPF administrativo
    const isAdmin = cleanCPF === ADMIN_CPF;

    try {
        // Busca se existe usuário com este CPF
        const [[user]] = await pool.query('SELECT id_usuario FROM usuario WHERE cpf = ?', [cleanCPF]);
        
        if (!user) {
            // CPF não existe na base, pode votar (ou é admin)
            return res.json({ 
                hasVoted: false, 
                isAdmin,
                canAccessPlacar: isAdmin 
            });
        }

        // Verifica se já votou
        const [[vote]] = await pool.query('SELECT id_votos FROM votos WHERE id_usuario = ?', [user.id_usuario]);
        
        if (vote) {
            return res.json({ 
                hasVoted: true, 
                message: 'Este CPF já votou!',
                isAdmin,
                canAccessPlacar: isAdmin 
            });
        }
        
        res.json({ 
            hasVoted: false,
            isAdmin,
            canAccessPlacar: isAdmin 
        });
    } catch (err) {
        console.error('Erro ao verificar CPF:', err.message, err.code || '', err.sqlMessage || '');
        res.status(500).json({ error: 'Falha ao verificar CPF.' });
    }
});

// GET /api/check-admin/:cpf -> verifica se CPF é administrativo (endpoint específico)
app.get('/api/check-admin/:cpf', async (req, res) => {
    const { cpf } = req.params;
    
    if (!cpf || !isValidCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido.' });
    }
    
    const cleanCPF = String(cpf).replace(/\D/g, '');
    const isAdmin = cleanCPF === ADMIN_CPF;
    
    res.json({ 
        isAdmin,
        canAccessPlacar: isAdmin 
    });
});

// GET /api/turmas -> retorna turmas do banco conforme schema fornecido
// Observação: fotos_turma pode ser JSON (array) ou string com URLs separadas por vírgula
app.get('/api/turmas', async (_req, res) => {
    try {
        const sql = `
            SELECT t.id_turma,
                   t.nome_turma,
                   t.codigo_turma,
                   t.projeto_turma,
                   t.descricao_projeto_turma,
                   t.fotos_turma,
                   t.professor_turma
            FROM turma t
            ORDER BY t.id_turma ASC
        `;
        const [rows] = await pool.query(sql);

        // Mapeia para o formato esperado pelo frontend
        const turmas = rows.map(r => {
            // SEMPRE busca imagens usando codigo_turma como nome da pasta (NOVO COMPORTAMENTO)
            let images = getImagensParaTurma(r.codigo_turma, r.id_turma); // Passa codigo_turma e id_turma para compatibilidade
            
            // Se não encontrou imagens locais, usa placeholder personalizado
            if (images.length === 0) {
                images = [
                    `https://placehold.co/600x400/004A8D/white?text=${encodeURIComponent(r.nome_turma)}`
                ];
            }

            return {
                id: r.id_turma,
                code: r.codigo_turma,
                name: r.nome_turma,
                description: r.descricao_projeto_turma || r.projeto_turma || '',
                teacher: r.professor_turma || '',
                images,
                imageSource: images[0].includes('placehold.co') ? 'placeholder' : 'local'
            };
        });

        res.json(turmas);
    } catch (err) {
        // Log detalhado para diagnóstico de problemas de banco
        console.error('Erro ao buscar turmas:', err.message, err.code || '', err.sqlMessage || '');
        res.status(500).json({ error: 'Falha ao buscar turmas no banco de dados.' });
    }
});

// POST /api/vote -> body: { cpf: string (11 dígitos), id_turma: number }
// Regras:
// - Cria o usuário (CPF) se não existir
// - Apenas um voto por CPF (bloqueia voto duplicado)
// - Usa transação para consistência
app.post('/api/vote', async (req, res) => {
    const { cpf, id_turma } = req.body || {};
    if (!cpf || !isValidCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido. Verifique os números e tente novamente.' });
    }
    
    // Remove formatação para consistência no banco
    const cleanCPF = String(cpf).replace(/\D/g, '');
    if (!id_turma || isNaN(Number(id_turma))) {
        return res.status(400).json({ error: 'id_turma inválido.' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction(); // inicia transação

        // Garante que a turma existe
        const [[turma]] = await conn.query('SELECT id_turma FROM turma WHERE id_turma = ?', [id_turma]);
        if (!turma) {
            await conn.rollback();
            return res.status(404).json({ error: 'Turma não encontrada.' });
        }

        // Busca/cria usuário
        let [[user]] = await conn.query('SELECT id_usuario FROM usuario WHERE cpf = ?', [cleanCPF]);
        if (!user) {
            const [result] = await conn.query('INSERT INTO usuario (cpf) VALUES (?)', [cleanCPF]);
            user = { id_usuario: result.insertId };
        }

        // Verifica se já votou (uma vez por usuário)
        const [[already]] = await conn.query('SELECT id_votos FROM votos WHERE id_usuario = ?', [user.id_usuario]);
        if (already) {
            await conn.rollback();
            return res.status(409).json({ error: 'Este CPF já votou!', hasVoted: true });
        }

        // Registra voto
        await conn.query('INSERT INTO votos (id_usuario, id_turma) VALUES (?, ?)', [user.id_usuario, id_turma]);
        await conn.commit(); // finaliza transação com sucesso
        res.status(201).json({ ok: true });
    } catch (err) {
        await conn.rollback(); // desfaz alterações em caso de erro
        // Log detalhado para diagnóstico
        console.error('Erro ao registrar voto:', err.message, err.code || '', err.sqlMessage || '');
        res.status(500).json({ error: 'Falha ao registrar voto.' });
    } finally {
        conn.release(); // devolve a conexão ao pool
    }
});

// CPF do administrador que tem acesso ao placar
const ADMIN_CPF = '81112848029';

// GET /api/placar -> retorna votos agregados por turma (ordem decrescente)
// REQUER AUTENTICAÇÃO: apenas CPF administrativo pode acessar
app.get('/api/placar', async (req, res) => {
    const { cpf } = req.query;
    
    // Verifica se o CPF foi fornecido e se é válido
    if (!cpf || !isValidCPF(cpf)) {
        return res.status(401).json({ 
            error: 'Acesso negado. CPF inválido ou não fornecido.',
            code: 'INVALID_CPF'
        });
    }
    
    // Remove formatação para comparação
    const cleanCPF = String(cpf).replace(/\D/g, '');
    
    // Verifica se é o CPF administrativo
    if (cleanCPF !== ADMIN_CPF) {
        console.log(`Tentativa de acesso não autorizado ao placar com CPF: ${cleanCPF}`);
        return res.status(403).json({ 
            error: 'Acesso negado. Apenas administradores podem visualizar o placar.',
            code: 'ACCESS_DENIED'
        });
    }
    
    try {
        const sql = `
            SELECT t.id_turma,
                   t.nome_turma,
                   t.professor_turma,
                   COUNT(v.id_votos) AS votos
            FROM turma t
            LEFT JOIN votos v ON v.id_turma = t.id_turma
            GROUP BY t.id_turma, t.nome_turma, t.professor_turma
            ORDER BY votos DESC, t.nome_turma ASC
        `;
        const [rows] = await pool.query(sql);
        const total = rows.reduce((acc, r) => acc + Number(r.votos || 0), 0);
        
        console.log(`Placar acessado pelo administrador (CPF: ${cleanCPF})`);
        res.json({ total, results: rows });
    } catch (err) {
        console.error('Erro ao obter placar:', err.message, err.code || '', err.sqlMessage || '');
        res.status(500).json({ error: 'Falha ao obter placar.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

