USE sistema_de_votos;

-- Inserção de dados na tabela turno
INSERT INTO turno (nome_turno) VALUES ("Matutino");
INSERT INTO turno (nome_turno) VALUES ("Vespertino");
INSERT INTO turno (nome_turno) VALUES ("Noturno"); 

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Enfermagem", "034", "Saude e Tecnologia", "Saude e Tecnologia", "Leonardo", "034", 1);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Desenvolvimento de Sistemas", "035", "Gestão de Gastos", "Sistema web para controle de finanças pessoais", "Mariana", "035", 1);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Informática para Internet", "036", "Feira Online", "Plataforma digital para apresentação de cursos", "Carlos", "036", 1);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Administração", "037", "Gestão Sustentável", "Projeto de práticas de gestão ambiental", "Fernanda", "037" , 2);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Mecânica", "038", "Motores Elétricos", "Protótipo de motor sustentável para veículos", "Rafael", "038", 2);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Eletrotécnica", "039", "Energia Solar", "Sistema de captação de energia solar em residências", "Patrícia", "039", 2);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Logística", "040", "Entrega Inteligente", "Otimização de rotas para transporte de cargas", "João", "040", 2);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Segurança do Trabalho", "041", "Ambiente Seguro", "Aplicativo para monitoramento de riscos em empresas", "Ana", "041", 3);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Edificações", "042", "Construção Sustentável", "Materiais ecológicos para obras de baixo custo", "Roberto", "042", 3);

INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, professor_turma, fotos_turma, id_turno)
VALUES ("Design Gráfico", "043", "Identidade Visual", "Criação de logotipo e branding para eventos culturais", "Juliana", "043", 3);
