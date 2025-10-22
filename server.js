// Servidor HTTP e utilitários
const express = require('express');
const path = require('path');
const fs = require('fs');
// Driver MySQL com suporte a Promises
const mysql = require('mysql2/promise');

const app = express();

const PORT = process.env.PORT || 80;
const DB_HOST = process.env.DB_HOST || 'up-de-fra1-mysql-1.db.run-on-seenode.com';
const DB_USER = process.env.DB_USER || 'db_dtnidddiwulw';
const DB_PASSWORD = process.env.DB_PASSWORD || 'cI8C9O2nSwZ2ZmHfgJW5phzi';
const DB_NAME = process.env.DB_NAME || 'db_dtnidddiwulw';
const DB_PORT = Number(process.env.DB_PORT || 11550);

// Configuração básica via variáveis de ambiente teste
// const PORT = process.env.PORT || 3000;
// const DB_HOST = process.env.DB_HOST || 'localhost';
// const DB_USER = process.env.DB_USER || 'root';
// const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
// const DB_NAME = process.env.DB_NAME || 'sistema_de_votos';


// Modo de operação: 'database' ou 'memory' (fallback)
let OPERATION_MODE = 'database';
let memoryData = {
    turmas: [],
    usuarios: new Map(),
    votos: new Map()
};

// Cria um pool de conexões para eficiência e reuso (cada requisição pega uma, usa e devolve)
let pool = null;

try {
    pool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        ssl: {
            rejectUnauthorized: false
        }
    });
} catch (error) {
    console.log('⚠️ Erro ao criar pool de conexões, usando modo memória');
    OPERATION_MODE = 'memory';
}

// Inicializa o banco automaticamente quando tabelas essenciais não existem
async function ensureDatabaseInitialized() {
    try {
        if (!pool) return { initialized: false };
        const [tables] = await pool.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name IN ('usuario','turno','turma','votos')`,
            [DB_NAME]
        );
        const existing = new Set(tables.map(t => t.TABLE_NAME || t.table_name));
        const required = ['usuario', 'turno', 'turma', 'votos'];
        const missing = required.filter(t => !existing.has(t));

        if (missing.length === 0) {
            console.log('🧱 Estrutura do banco OK (tabelas encontradas).');
            return { initialized: true, created: false };
        }

        console.log(`🧩 Tabelas ausentes: ${missing.join(', ')} → executando migrations + seeds...`);
        // Passa a configuração atual para o script de migração
        process.env.DB_HOST = DB_HOST;
        process.env.DB_PORT = String(DB_PORT);
        process.env.DB_USER = DB_USER;
        process.env.DB_PASSWORD = DB_PASSWORD;
        process.env.DB_NAME = DB_NAME;
        process.env.NODE_ENV = 'production';

        const { initializeDatabase } = require('./migrate');
        const ok = await initializeDatabase();
        if (!ok) {
            console.error('❌ Falha ao inicializar banco via migrations.');
            return { initialized: false, created: false };
        }
        console.log('✅ Banco inicializado com sucesso (migrations + seeds).');
        return { initialized: true, created: true };
    } catch (err) {
        console.error('❌ Erro ao validar/inicializar banco:', err.message);
        return { initialized: false, error: err.message };
    }
}

// Dados em memória para modo fallback
function initMemoryData() {
    memoryData.turmas = [
        {
            id_turma: 1, nome_turma: 'Enfermagem', codigo_turma: '034',
            projeto_turma: 'Saude e Tecnologia', descricao_projeto_turma: 'Saude e Tecnologia',
            professor_turma: 'Leonardo', fotos_turma: '034', id_turno: 1, nome_turno: 'Matutino'
        },
        {
            id_turma: 2, nome_turma: 'Desenvolvimento de Sistemas', codigo_turma: '035',
            projeto_turma: 'Gestão de Gastos', descricao_projeto_turma: 'Sistema web para controle de finanças pessoais',
            professor_turma: 'Mariana', fotos_turma: '035', id_turno: 1, nome_turno: 'Matutino'
        },
        {
            id_turma: 3, nome_turma: 'Informática para Internet', codigo_turma: '036',
            projeto_turma: 'Feira Online', descricao_projeto_turma: 'Plataforma digital para apresentação de cursos',
            professor_turma: 'Carlos', fotos_turma: '036', id_turno: 1, nome_turno: 'Matutino'
        },
        {
            id_turma: 4, nome_turma: 'Administração', codigo_turma: '037',
            projeto_turma: 'Gestão Sustentável', descricao_projeto_turma: 'Projeto de práticas de gestão ambiental',
            professor_turma: 'Fernanda', fotos_turma: '037', id_turno: 2, nome_turno: 'Vespertino'
        },
        {
            id_turma: 5, nome_turma: 'Mecânica', codigo_turma: '038',
            projeto_turma: 'Motores Elétricos', descricao_projeto_turma: 'Protótipo de motor sustentável para veículos',
            professor_turma: 'Rafael', fotos_turma: '038', id_turno: 2, nome_turno: 'Vespertino'
        },
        {
            id_turma: 6, nome_turma: 'Eletrotécnica', codigo_turma: '039',
            projeto_turma: 'Energia Solar', descricao_projeto_turma: 'Sistema de captação de energia solar em residências',
            professor_turma: 'Patrícia', fotos_turma: '039', id_turno: 2, nome_turno: 'Vespertino'
        },
        {
            id_turma: 7, nome_turma: 'Logística', codigo_turma: '040',
            projeto_turma: 'Entrega Inteligente', descricao_projeto_turma: 'Otimização de rotas para transporte de cargas',
            professor_turma: 'João', fotos_turma: '040', id_turno: 2, nome_turno: 'Vespertino'
        },
        {
            id_turma: 8, nome_turma: 'Segurança do Trabalho', codigo_turma: '041',
            projeto_turma: 'Ambiente Seguro', descricao_projeto_turma: 'Aplicativo para monitoramento de riscos em empresas',
            professor_turma: 'Ana', fotos_turma: '041', id_turno: 3, nome_turno: 'Noturno'
        },
        {
            id_turma: 9, nome_turma: 'Edificações', codigo_turma: '042',
            projeto_turma: 'Construção Sustentável', descricao_projeto_turma: 'Materiais ecológicos para obras de baixo custo',
            professor_turma: 'Roberto', fotos_turma: '042', id_turno: 3, nome_turno: 'Noturno'
        },
        {
            id_turma: 10, nome_turma: 'Design Gráfico', codigo_turma: '043',
            projeto_turma: 'Identidade Visual', descricao_projeto_turma: 'Criação de logotipo e branding para eventos culturais',
            professor_turma: 'Juliana', fotos_turma: '043', id_turno: 3, nome_turno: 'Noturno'
        }
    ];
}

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
    res.json({ 
        ok: true, 
        time: new Date().toISOString(),
        mode: OPERATION_MODE,
        database: OPERATION_MODE === 'database' ? 'Connected' : 'Memory fallback'
    });
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
    try {
        console.log('🔍 Testando conexão com o banco...');
    console.log(`Host: ${DB_HOST}`);
    console.log(`Port: ${DB_PORT}`);
        console.log(`User: ${DB_USER}`);
        console.log(`Database: ${DB_NAME}`);
        
        const [rows] = await pool.query('SELECT 1 as test');
        console.log('✅ Conexão com banco estabelecida com sucesso!');
        
        res.json({ 
            ok: true, 
            message: 'Conexão com banco estabelecida com sucesso!',
            config: {
                host: DB_HOST,
                port: DB_PORT,
                user: DB_USER,
                database: DB_NAME
            },
            testResult: rows[0]
        });
    } catch (error) {
        console.error('❌ Erro na conexão com banco:', error.message);
        console.error('Código do erro:', error.code);
        console.error('Detalhes:', error);
        
        res.status(500).json({ 
            ok: false, 
            error: error.message,
            code: error.code,
            config: {
                host: DB_HOST,
                port: DB_PORT,
                user: DB_USER,
                database: DB_NAME
            }
        });
    }
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
        // Se é admin, retorna informações específicas para redirecionamento
        if (isAdmin) {
            return res.json({ 
                hasVoted: false, 
                isAdmin: true,
                canAccessPlacar: true,
                redirectToDashboard: true,
                message: `Acesso administrativo autorizado (Modo: ${OPERATION_MODE})`
            });
        }

        // Modo memória
        if (OPERATION_MODE === 'memory') {
            const hasVoted = memoryData.usuarios.has(cleanCPF);
            return res.json({ 
                hasVoted,
                isAdmin: false,
                canAccessPlacar: false,
                message: hasVoted ? 'Este CPF já votou! (Modo memória)' : null
            });
        }

        // Modo banco de dados
        const [[user]] = await pool.query('SELECT id_usuario FROM usuario WHERE cpf = ?', [cleanCPF]);
        
        if (!user) {
            return res.json({ 
                hasVoted: false, 
                isAdmin: false,
                canAccessPlacar: false 
            });
        }
//Teste teste
        const [[vote]] = await pool.query('SELECT id_votos FROM votos WHERE id_usuario = ?', [user.id_usuario]);
        
        res.json({ 
            hasVoted: !!vote,
            isAdmin: false,
            canAccessPlacar: false,
            message: vote ? 'Este CPF já votou!' : null
        });
    } catch (err) {
        console.error('Erro ao verificar CPF:', err.message, err.code || '', err.sqlMessage || '');
        
        // Fallback para modo memória em caso de erro de conexão
        if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
            console.log('🔄 Alternando para modo memória devido a erro de conexão');
            OPERATION_MODE = 'memory';
            initMemoryData();
            
            const hasVoted = memoryData.usuarios.has(cleanCPF);
            return res.json({ 
                hasVoted,
                isAdmin: false,
                canAccessPlacar: false,
                message: hasVoted ? 'Este CPF já votou! (Modo memória)' : null,
                fallback: true
            });
        }
        
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

// GET /api/stats -> retorna estatísticas gerais do sistema (apenas para admin)
app.get('/api/stats', async (req, res) => {
    try {
        let stats = {
            totalTurmas: 0,
            totalVotos: 0,
            votosMatutino: 0,
            votosVespertino: 0,
            votosNoturno: 0,
            turnoAtivo: TURNO_ATIVO,
            mode: OPERATION_MODE
        };

        // Modo memória
        if (OPERATION_MODE === 'memory') {
            stats.totalTurmas = memoryData.turmas.length;
            stats.totalVotos = Array.from(memoryData.votos.values()).reduce((acc, votos) => acc + votos, 0);
            
            // Conta votos por turno
            memoryData.turmas.forEach(turma => {
                const votos = memoryData.votos.get(turma.id_turma) || 0;
                const nomeTurno = turma.nome_turno.toLowerCase();
                
                if (nomeTurno === 'matutino') {
                    stats.votosMatutino += votos;
                } else if (nomeTurno === 'vespertino') {
                    stats.votosVespertino += votos;
                } else if (nomeTurno === 'noturno') {
                    stats.votosNoturno += votos;
                }
            });
        } else {
            // Modo banco de dados
            const [totalTurmasResult] = await pool.query('SELECT COUNT(*) as count FROM turma');
            const [totalVotosResult] = await pool.query('SELECT COUNT(*) as count FROM votos');
            
            const [estatisticasPorTurno] = await pool.query(`
                SELECT tn.nome_turno, COUNT(v.id_votos) as votos
                FROM turno tn
                LEFT JOIN turma t ON tn.id_turno = t.id_turno
                LEFT JOIN votos v ON t.id_turma = v.id_turma
                GROUP BY tn.id_turno, tn.nome_turno
                ORDER BY tn.nome_turno ASC
            `);
            
            stats.totalTurmas = totalTurmasResult[0]?.count || 0;
            stats.totalVotos = totalVotosResult[0]?.count || 0;
            
            estatisticasPorTurno.forEach(turno => {
                const nomeTurno = turno.nome_turno.toLowerCase();
                if (nomeTurno === 'matutino') {
                    stats.votosMatutino = turno.votos;
                } else if (nomeTurno === 'vespertino') {
                    stats.votosVespertino = turno.votos;
                } else if (nomeTurno === 'noturno') {
                    stats.votosNoturno = turno.votos;
                }
            });
        }
        
        res.json(stats);
    } catch (err) {
        console.error('Erro ao obter estatísticas:', err.message, err.code || '', err.sqlMessage || '');
        
        // Fallback para memória
        if ((err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') && OPERATION_MODE === 'database') {
            console.log('🔄 Alternando para modo memória para estatísticas');
            OPERATION_MODE = 'memory';
            initMemoryData();
            
            // Rechama recursivamente
            return app._router.handle(req, res, () => {});
        }
        
        res.status(500).json({ error: 'Falha ao obter estatísticas.' });
    }
});

// GET /api/turno-ativo -> retorna o turno atualmente ativo no sistema
app.get('/api/turno-ativo', (req, res) => {
    res.json({ 
        turnoAtivo: TURNO_ATIVO,
        message: TURNO_ATIVO ? `Turno ativo: ${TURNO_ATIVO}` : 'Todos os turnos estão disponíveis'
const DB_PORT = Number(process.env.DB_PORT || 11550);
    });
});

// POST /api/set-turno-ativo -> define o turno ativo (apenas admin)
app.post('/api/set-turno-ativo', async (req, res) => {
    const { cpf, turno } = req.body;
    
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
        console.log(`Tentativa de alteração não autorizada do turno ativo com CPF: ${cleanCPF}`);
        return res.status(403).json({ 
            error: 'Acesso negado. Apenas administradores podem alterar o turno ativo.',
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        ssl: {
            rejectUnauthorized: false
        }
    
    // Define o turno ativo globalmente
    TURNO_ATIVO = turnoNormalizado;
    
    const message = TURNO_ATIVO 
        ? `Turno ativo alterado para: ${TURNO_ATIVO}` 
        : 'Sistema configurado para exibir todos os turnos';
    
    console.log(`${message} (Admin: ${cleanCPF})`);
    
    res.json({ 
        ok: true, 
        turnoAtivo: TURNO_ATIVO,
        message
    });
});

// GET /api/turmas -> retorna turmas do banco conforme turno ativo definido pelo admin
app.get('/api/turmas', async (req, res) => {
    try {
        let turmas = [];

        // Modo memória
        if (OPERATION_MODE === 'memory') {
            let filteredTurmas = memoryData.turmas;
            
            if (TURNO_ATIVO) {
                filteredTurmas = memoryData.turmas.filter(t => 
                    t.nome_turno.toLowerCase() === TURNO_ATIVO.toLowerCase()
                );
            }
            
            turmas = filteredTurmas.map(r => {
                let images = getImagensParaTurma(r.codigo_turma, r.id_turma);
                
                if (images.length === 0) {
                    images = [`https://placehold.co/600x400/004A8D/white?text=${encodeURIComponent(r.nome_turma)}`];
                }

                return {
                    id: r.id_turma,
                    code: r.codigo_turma,
                    name: r.nome_turma,
                    description: r.descricao_projeto_turma || r.projeto_turma || '',
                    teacher: r.professor_turma || '',
                    turno: r.nome_turno || '',
                    turnoId: r.id_turno || null,
                    images,
                    imageSource: images[0].includes('placehold.co') ? 'placeholder' : 'local'
                };
        console.log(`Port: ${DB_PORT}`);
            });
        } else {
            // Modo banco de dados
            let sql = `
                SELECT t.id_turma, t.nome_turma, t.codigo_turma, t.projeto_turma,
                       t.descricao_projeto_turma, t.fotos_turma, t.professor_turma,
                       t.id_turno, tn.nome_turno
                FROM turma t
                LEFT JOIN turno tn ON t.id_turno = tn.id_turno
            `;
            
                port: DB_PORT,
            let params = [];
            
            if (TURNO_ATIVO) {
                sql += ` WHERE LOWER(tn.nome_turno) = LOWER(?)`;
                params.push(TURNO_ATIVO);
            }
            
            sql += ` ORDER BY t.id_turma ASC`;
            
            const [rows] = await pool.query(sql, params);

            turmas = rows.map(r => {
                let images = getImagensParaTurma(r.codigo_turma, r.id_turma);
                
                if (images.length === 0) {
                    images = [`https://placehold.co/600x400/004A8D/white?text=${encodeURIComponent(r.nome_turma)}`];
                }

                return {
                    id: r.id_turma,
                    code: r.codigo_turma,
                    name: r.nome_turma,
                    description: r.descricao_projeto_turma || r.projeto_turma || '',
                    teacher: r.professor_turma || '',
                    turno: r.nome_turno || '',
                    turnoId: r.id_turno || null,
                    images,
                    imageSource: images[0].includes('placehold.co') ? 'placeholder' : 'local'
                };
            });
        }

        res.json({
            turmas,
            turnoAtivo: TURNO_ATIVO,
            totalTurmas: turmas.length,
            mode: OPERATION_MODE,
            message: TURNO_ATIVO ? `Exibindo turmas do turno: ${TURNO_ATIVO} (${OPERATION_MODE})` : `Exibindo todas as turmas (${OPERATION_MODE})`
        });
    } catch (err) {
        console.error('Erro ao buscar turmas:', err.message, err.code || '', err.sqlMessage || '');
        
        // Fallback para modo memória
        if ((err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') && OPERATION_MODE === 'database') {
            console.log('🔄 Alternando para modo memória devido a erro de conexão');
            OPERATION_MODE = 'memory';
            initMemoryData();
            
            // Rechama a função recursivamente no modo memória
            return app._router.handle(req, res, () => {});
        }
        
        res.status(500).json({ error: 'Falha ao buscar turmas no banco de dados.' });
    }
});

// POST /api/vote -> body: { cpf: string (11 dígitos), id_turma: number }
app.post('/api/vote', async (req, res) => {
    const { cpf, id_turma } = req.body || {};
    if (!cpf || !isValidCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido. Verifique os números e tente novamente.' });
    }
    
    const cleanCPF = String(cpf).replace(/\D/g, '');
    if (!id_turma || isNaN(Number(id_turma))) {
        return res.status(400).json({ error: 'id_turma inválido.' });
    }

    try {
        // Modo memória
        if (OPERATION_MODE === 'memory') {
            // Verifica se turma existe
            const turmaExists = memoryData.turmas.find(t => t.id_turma === Number(id_turma));
            if (!turmaExists) {
                return res.status(404).json({ error: 'Turma não encontrada.' });
            }

            // Verifica se já votou
            if (memoryData.usuarios.has(cleanCPF)) {
                return res.status(409).json({ error: 'Este CPF já votou!', hasVoted: true });
            }

            // Registra voto
            memoryData.usuarios.set(cleanCPF, Number(id_turma));
            const currentVotes = memoryData.votos.get(Number(id_turma)) || 0;
            memoryData.votos.set(Number(id_turma), currentVotes + 1);
            
            console.log(`✅ Voto registrado (Memória): CPF ${cleanCPF} → Turma ${id_turma}`);
            return res.status(201).json({ ok: true, mode: 'memory' });
        }

        // Modo banco de dados
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [[turma]] = await conn.query('SELECT id_turma FROM turma WHERE id_turma = ?', [id_turma]);
            if (!turma) {
                await conn.rollback();
                return res.status(404).json({ error: 'Turma não encontrada.' });
            }

            let [[user]] = await conn.query('SELECT id_usuario FROM usuario WHERE cpf = ?', [cleanCPF]);
            if (!user) {
                const [result] = await conn.query('INSERT INTO usuario (cpf) VALUES (?)', [cleanCPF]);
                user = { id_usuario: result.insertId };
            }

            const [[already]] = await conn.query('SELECT id_votos FROM votos WHERE id_usuario = ?', [user.id_usuario]);
            if (already) {
                await conn.rollback();
                return res.status(409).json({ error: 'Este CPF já votou!', hasVoted: true });
            }

            await conn.query('INSERT INTO votos (id_usuario, id_turma) VALUES (?, ?)', [user.id_usuario, id_turma]);
            await conn.commit();
            
            console.log(`✅ Voto registrado (Database): CPF ${cleanCPF} → Turma ${id_turma}`);
            res.status(201).json({ ok: true, mode: 'database' });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    } catch (err) {
        console.error('Erro ao registrar voto:', err.message, err.code || '', err.sqlMessage || '');
        
        // Fallback para memória em caso de erro de conexão
        if ((err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') && OPERATION_MODE === 'database') {
            console.log('🔄 Alternando para modo memória para registrar voto');
            OPERATION_MODE = 'memory';
            initMemoryData();
            
            // Tenta registrar voto em memória
            if (memoryData.usuarios.has(cleanCPF)) {
                return res.status(409).json({ error: 'Este CPF já votou!', hasVoted: true, fallback: true });
            }
            
            memoryData.usuarios.set(cleanCPF, Number(id_turma));
            const currentVotes = memoryData.votos.get(Number(id_turma)) || 0;
            memoryData.votos.set(Number(id_turma), currentVotes + 1);
            
            return res.status(201).json({ ok: true, mode: 'memory', fallback: true });
        }
        
        res.status(500).json({ error: 'Falha ao registrar voto.' });
    }
});

// CPF do administrador que tem acesso ao placar
const ADMIN_CPF = '81112848029';

// Configuração global do turno ativo (controlado apenas pelo admin)
let TURNO_ATIVO = null; // null = todos os turnos, ou 'matutino', 'vespertino', 'noturno'

// GET /api/placar -> retorna votos agregados por turma (ordem decrescente)
app.get('/api/placar', async (req, res) => {
    const { cpf, turno } = req.query;
    
    if (!cpf || !isValidCPF(cpf)) {
        return res.status(401).json({ 
            error: 'Acesso negado. CPF inválido ou não fornecido.',
            code: 'INVALID_CPF'
        });
    }
    
    const cleanCPF = String(cpf).replace(/\D/g, '');
    
    if (cleanCPF !== ADMIN_CPF) {
        console.log(`Tentativa de acesso não autorizado ao placar com CPF: ${cleanCPF}`);
        return res.status(403).json({ 
            error: 'Acesso negado. Apenas administradores podem visualizar o placar.',
            code: 'ACCESS_DENIED'
        });
    }
    
    try {
        let results = [];
        let total = 0;
        
        // Filtro de turno: prioriza parâmetro da query, senão usa TURNO_ATIVO
        const turnoFiltro = turno || TURNO_ATIVO;

        // Modo memória
        if (OPERATION_MODE === 'memory') {
            let filteredTurmas = memoryData.turmas;
            
            if (turnoFiltro) {
                filteredTurmas = memoryData.turmas.filter(t => 
                    t.nome_turno.toLowerCase() === turnoFiltro.toLowerCase()
                );
            }
            
            results = filteredTurmas.map(turma => ({
                id_turma: turma.id_turma,
                nome_turma: turma.nome_turma,
                professor_turma: turma.professor_turma,
                nome_turno: turma.nome_turno,
                turno: turma.nome_turno,
                votos: memoryData.votos.get(turma.id_turma) || 0
            })).sort((a, b) => b.votos - a.votos || a.nome_turma.localeCompare(b.nome_turma));
            
            total = results.reduce((acc, r) => acc + r.votos, 0);
        } else {
            // Modo banco de dados
            let sql = `
                SELECT t.id_turma, t.nome_turma, t.professor_turma,
                       tn.nome_turno, COUNT(v.id_votos) AS votos
                FROM turma t
                LEFT JOIN turno tn ON t.id_turno = tn.id_turno
                LEFT JOIN votos v ON v.id_turma = t.id_turma
            `;
            
            let params = [];
            
            if (turnoFiltro) {
                sql += ` WHERE LOWER(tn.nome_turno) = LOWER(?)`;
                params.push(turnoFiltro);
            }
            
            sql += `
                GROUP BY t.id_turma, t.nome_turma, t.professor_turma, tn.nome_turno
                ORDER BY votos DESC, t.nome_turma ASC
            `;
            
            const [rows] = await pool.query(sql, params);
            total = rows.reduce((acc, r) => acc + Number(r.votos || 0), 0);
            
            results = rows.map(row => ({
                ...row,
                turno: row.nome_turno || 'Não definido'
            }));
        }
        
        const filtroInfo = turno ? `Filtro: ${turno}` : (TURNO_ATIVO ? `Turno ativo: ${TURNO_ATIVO}` : 'Todos os turnos');
        console.log(`Placar acessado pelo administrador (CPF: ${cleanCPF}, Modo: ${OPERATION_MODE}, ${filtroInfo})`);
        
        res.json({ 
            total, 
            results,
            turno: turnoFiltro || 'geral',
            filtroAtivo: !!turnoFiltro,
            turnoAtivo: turnoFiltro,
            mode: OPERATION_MODE
        });
    } catch (err) {
        console.error('Erro ao obter placar:', err.message, err.code || '', err.sqlMessage || '');
        
        // Fallback para memória
        if ((err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') && OPERATION_MODE === 'database') {
            console.log('🔄 Alternando para modo memória para exibir placar');
            OPERATION_MODE = 'memory';
            initMemoryData();
            
            // Rechama recursivamente no modo memória
            return app._router.handle(req, res, () => {});
        }
        
        res.status(500).json({ error: 'Falha ao obter placar.' });
    }
});

// Test database connection on startup
async function testDatabaseConnection() {
    if (!pool) {
        console.log('⚠️ Pool de conexão não criado, usando modo memória');
        OPERATION_MODE = 'memory';
        initMemoryData();
        return false;
    }

    try {
        console.log('🔍 Testando conexão com banco de dados...');
    console.log(`📍 Host: ${DB_HOST}`);
    console.log(`🔌 Port: ${DB_PORT}`);
        console.log(`👤 User: ${DB_USER}`);
        console.log(`🗃️ Database: ${DB_NAME}`);
        
        const [rows] = await pool.query('SELECT 1 as connected, NOW() as timestamp');
    console.log('✅ Conexão com banco estabelecida com sucesso!');
        console.log(`⏰ Timestamp do banco: ${rows[0].timestamp}`);
        OPERATION_MODE = 'database';
    // Garante que a estrutura exista
    await ensureDatabaseInitialized();
    return true;
    } catch (error) {
        console.error('❌ ERRO na conexão com banco de dados:');
        console.error(`   Mensagem: ${error.message}`);
        console.error(`   Código: ${error.code}`);
        console.error(`   Host tentado: ${DB_HOST}`);
        console.error('   🔄 Alternando para modo MEMÓRIA como fallback');
        
        OPERATION_MODE = 'memory';
        initMemoryData();
        return false;
    }
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    
    console.log(`🎯 Modo de operação: ${OPERATION_MODE.toUpperCase()}`);
    if (OPERATION_MODE === 'memory') {
        console.log('📝 Dados serão armazenados em memória (temporário)');
        console.log('🔧 Para resolver: configure whitelist no UpCloud Database');
    } else {
        console.log('🗄️ Conectado ao banco MySQL com sucesso!');
    }
});

