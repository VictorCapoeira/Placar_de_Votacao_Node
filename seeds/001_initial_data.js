/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('votos').del();
  await knex('turma').del();
  await knex('turno').del();
  await knex('usuario').del();

  // Inserts seed entries para turno
  await knex('turno').insert([
    { nome_turno: 'Matutino' },
    { nome_turno: 'Vespertino' },
    { nome_turno: 'Noturno' }
  ]);

  // Inserts seed entries para turma
  await knex('turma').insert([
    {
      nome_turma: 'Enfermagem',
      codigo_turma: '034',
      projeto_turma: 'Saude e Tecnologia',
      descricao_projeto_turma: 'Saude e Tecnologia',
      professor_turma: 'Leonardo',
      fotos_turma: '034',
      id_turno: 1
    },
    {
      nome_turma: 'Desenvolvimento de Sistemas',
      codigo_turma: '035',
      projeto_turma: 'Gestão de Gastos',
      descricao_projeto_turma: 'Sistema web para controle de finanças pessoais',
      professor_turma: 'Mariana',
      fotos_turma: '035',
      id_turno: 1
    },
    {
      nome_turma: 'Informática para Internet',
      codigo_turma: '036',
      projeto_turma: 'Feira Online',
      descricao_projeto_turma: 'Plataforma digital para apresentação de cursos',
      professor_turma: 'Carlos',
      fotos_turma: '036',
      id_turno: 1
    },
    {
      nome_turma: 'Administração',
      codigo_turma: '037',
      projeto_turma: 'Gestão Sustentável',
      descricao_projeto_turma: 'Projeto de práticas de gestão ambiental',
      professor_turma: 'Fernanda',
      fotos_turma: '037',
      id_turno: 2
    },
    {
      nome_turma: 'Mecânica',
      codigo_turma: '038',
      projeto_turma: 'Motores Elétricos',
      descricao_projeto_turma: 'Protótipo de motor sustentável para veículos',
      professor_turma: 'Rafael',
      fotos_turma: '038',
      id_turno: 2
    },
    {
      nome_turma: 'Eletrotécnica',
      codigo_turma: '039',
      projeto_turma: 'Energia Solar',
      descricao_projeto_turma: 'Sistema de captação de energia solar em residências',
      professor_turma: 'Patrícia',
      fotos_turma: '039',
      id_turno: 2
    },
    {
      nome_turma: 'Logística',
      codigo_turma: '040',
      projeto_turma: 'Entrega Inteligente',
      descricao_projeto_turma: 'Otimização de rotas para transporte de cargas',
      professor_turma: 'João',
      fotos_turma: '040',
      id_turno: 2
    },
    {
      nome_turma: 'Segurança do Trabalho',
      codigo_turma: '041',
      projeto_turma: 'Ambiente Seguro',
      descricao_projeto_turma: 'Aplicativo para monitoramento de riscos em empresas',
      professor_turma: 'Ana',
      fotos_turma: '041',
      id_turno: 3
    },
    {
      nome_turma: 'Edificações',
      codigo_turma: '042',
      projeto_turma: 'Construção Sustentável',
      descricao_projeto_turma: 'Materiais ecológicos para obras de baixo custo',
      professor_turma: 'Roberto',
      fotos_turma: '042',
      id_turno: 3
    },
    {
      nome_turma: 'Design Gráfico',
      codigo_turma: '043',
      projeto_turma: 'Identidade Visual',
      descricao_projeto_turma: 'Criação de logotipo e branding para eventos culturais',
      professor_turma: 'Juliana',
      fotos_turma: '043',
      id_turno: 3
    }
  ]);
};