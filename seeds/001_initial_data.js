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
      nome_turma: 'Técnico em Administração ',
      codigo_turma: '3.420.240.185',
      projeto_turma: 'Caça ao Tesouro da Administração',
      descricao_projeto_turma: 'Atividade de caça ao tesouro com desafios e pistas para promover aprendizado de forma lúdica e interativa.',
      professor_turma: 'Angélica Fonseca',
      fotos_turma: '3.420.240.185',
      id_turno: 3
    },
    {
      nome_turma: 'Técnico em Guia de Turismo ',
      codigo_turma: '3.420.240.081',
      projeto_turma: 'Ipatinga Além do Aço ',
      descricao_projeto_turma: 'Totens com descrições dos pontos turísticos da cidade de Ipatinga. ',
      professor_turma: 'Regiane Martins Faustino',
      fotos_turma: '3.420.240.081',
      id_turno: 3
    },
    {
      nome_turma: 'Técnico em Recursos Humanos',
      codigo_turma: '3.420.240.186',
      projeto_turma: 'Trilha do RH',
      descricao_projeto_turma: 'Jogo de tabuleiro humano sobre RH, onde os participantes respondem perguntas e competem de forma divertida e educativa para integrar a equipe.',
      professor_turma: 'Michele Cristina Oliveira',
      fotos_turma: '3.420.240.186',
      id_turno: 3
    },
    {
      nome_turma: 'Técnico em Administração ',
      codigo_turma: '3.420.250.049',
      projeto_turma: 'Startups',
      descricao_projeto_turma: 'Empresas inovadoras de base tecnológica com foco em crescimento rápido e soluções diferenciadas.',
      professor_turma: 'Adriana ',
      fotos_turma: '3.420.250.049',
      id_turno: 1
    },
    {
      nome_turma: 'Técnico em Informática',
      codigo_turma: '20.240.031',
      projeto_turma: 'Bits do Passado: A História Viva dos Sistemas Operacionais',
      descricao_projeto_turma: 'Exposição interativa sobre a evolução dos sistemas operacionais e da computação pessoal.',
      professor_turma: 'Aquiles Brum',
      fotos_turma: '20.240.031',
      id_turno: 2
    },
    {
      nome_turma: 'Técnico em Desenvolvimento de Sistemas',
      codigo_turma: '2.024.068',
      projeto_turma: 'SmartVote & Quiz: Tecnologia que Conecta',
      descricao_projeto_turma: 'Uma aplicação de votação, um quiz com Arduino e o site oficial da feira, unindo tecnologia e inovação em uma experiência interativa.',
      professor_turma: 'Aquiles Brum',
      fotos_turma: '2.024.068',
      id_turno: 3
    },
    {
      nome_turma: 'Técnico em Administração ',
      codigo_turma: '3.420.250.048',
      projeto_turma: 'Missão Estratégica - A porta do sucesso',
      descricao_projeto_turma: 'Projeto prático e interativo de Administração, com jogos e dinâmicas que unem teoria e prática, estimulando raciocínio lógico, trabalho em equipe e gestão estratégica.',
      professor_turma: 'Mônica Sousa',
      fotos_turma: '3.420.250.048',
      id_turno: 2
    },
     {
      nome_turma: 'Técnico em Administração ',
      codigo_turma: '3.420.250.071',
      projeto_turma: 'Missão Estratégica - A porta para o Sucesso ',
      descricao_projeto_turma: 'Projeto prático e interativo de Administração, com jogos e dinâmicas que unem teoria e prática, estimulando raciocínio lógico, trabalho em equipe e gestão estratégica.',
      professor_turma: 'Mônica Sousa ',
      fotos_turma: '3.420.250.071',
      id_turno: 3
    },
     {
      nome_turma: 'Técnico em Segurança do Trabalho',
      codigo_turma: '3.420.240.070',
      projeto_turma: 'Inovação Tecnológica em SST ',
      descricao_projeto_turma: 'Desenvolvimento de soluções inovadoras baseadas em NRs para melhorar a segurança no trabalho em diferentes setores.',
      professor_turma: 'Daniele Patrícia Lima Marçal',
      fotos_turma: '3.420.240.070',
      id_turno: 3
    },
     {
      nome_turma: 'Técnico de Enfermagem',
      codigo_turma: '0034',
      projeto_turma: 'Do Virtual ao Real: A Formação do Técnico em Enfermagem na atualidade.',
      descricao_projeto_turma: 'Simulação realística que mostra o impacto da tecnologia no aprendizado e nas práticas assistenciais da enfermagem.',
      professor_turma: 'Leonardo Santiago de Figueiredo',
      fotos_turma: '0034',
      id_turno: 3
    },
     {
      nome_turma: 'Técnico de Enfermagem ',
      codigo_turma: '0072',
      projeto_turma: 'Do virtual ao real: a formação do técnico de enfermagem na atualidade.',
      descricao_projeto_turma: 'Feira técnica de enfermagem com simulações realísticas de urgência e emergência, promovendo aprendizado prático, desenvolvimento técnico e psicológico dos estudantes.',
      professor_turma: 'Eduardo Alexandre',
      fotos_turma: '20240074',
      id_turno: 3
    } 
  ]);
};
