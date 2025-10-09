// Configuração alternativa para testar sem o banco UpCloud

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 11550;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dados mockados para teste
const mockData = {
    turmas: [
        {
            id: 1,
            code: '034',
            name: 'Enfermagem',
            description: 'Saude e Tecnologia',
            teacher: 'Leonardo',
            turno: 'Matutino',
            turnoId: 1,
            images: ['https://placehold.co/600x400/004A8D/white?text=Enfermagem']
        },
        {
            id: 2,
            code: '035',
            name: 'Desenvolvimento de Sistemas',
            description: 'Sistema web para controle de finanças pessoais',
            teacher: 'Mariana',
            turno: 'Matutino',
            turnoId: 1,
            images: ['https://placehold.co/600x400/004A8D/white?text=Dev+Sistemas']
        }
    ],
    votos: {},
    usuarios: {}
};

const ADMIN_CPF = '81112848029';

// Routes de teste
app.get('/api/health', (req, res) => {
    res.json({ ok: true, mode: 'MOCK', time: new Date().toISOString() });
});

app.get('/api/turmas', (req, res) => {
    res.json({
        turmas: mockData.turmas,
        turnoAtivo: null,
        totalTurmas: mockData.turmas.length,
        message: 'Modo MOCK - dados de teste'
    });
});

app.get('/api/check-cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const cleanCPF = String(cpf).replace(/\D/g, '');
    
    if (cleanCPF === ADMIN_CPF) {
        return res.json({
            hasVoted: false,
            isAdmin: true,
            canAccessPlacar: true,
            redirectToDashboard: true,
            message: 'Modo MOCK - Admin detectado'
        });
    }
    
    res.json({
        hasVoted: !!mockData.usuarios[cleanCPF],
        isAdmin: false,
        canAccessPlacar: false
    });
});

app.post('/api/vote', (req, res) => {
    const { cpf, id_turma } = req.body;
    const cleanCPF = String(cpf).replace(/\D/g, '');
    
    if (mockData.usuarios[cleanCPF]) {
        return res.status(409).json({ error: 'CPF já votou (MOCK)' });
    }
    
    mockData.usuarios[cleanCPF] = id_turma;
    mockData.votos[id_turma] = (mockData.votos[id_turma] || 0) + 1;
    
    res.json({ ok: true, mode: 'MOCK' });
});

app.get('/api/placar', (req, res) => {
    const { cpf } = req.query;
    const cleanCPF = String(cpf).replace(/\D/g, '');
    
    if (cleanCPF !== ADMIN_CPF) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const results = mockData.turmas.map(turma => ({
        id_turma: turma.id,
        nome_turma: turma.name,
        professor_turma: turma.teacher,
        nome_turno: turma.turno,
        votos: mockData.votos[turma.id] || 0
    })).sort((a, b) => b.votos - a.votos);
    
    res.json({
        total: Object.values(mockData.votos).reduce((a, b) => a + b, 0),
        results,
        turno: 'geral',
        mode: 'MOCK'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor MOCK rodando na porta ${PORT}`);
    console.log(`🔧 Modo de teste - SEM banco de dados`);
    console.log(`📋 Use este modo enquanto resolve o problema de rede`);
});