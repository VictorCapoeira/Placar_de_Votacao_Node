/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Criar tabela usuario
    .createTable('usuario', function (table) {
      table.increments('id_usuario').primary();
      table.string('cpf', 11).unique().notNullable();
    })
    // Criar tabela turno
    .createTable('turno', function (table) {
      table.increments('id_turno').primary();
      table.string('nome_turno', 255).notNullable();
    })
    // Criar tabela turma
    .createTable('turma', function (table) {
      table.increments('id_turma').primary();
      table.string('nome_turma', 255).notNullable();
      table.string('codigo_turma', 255).notNullable();
      table.string('projeto_turma', 255);
      table.text('descricao_projeto_turma');
      table.text('fotos_turma');
      table.string('professor_turma', 255).notNullable();
      table.integer('id_turno').unsigned().notNullable();
      table.foreign('id_turno').references('id_turno').inTable('turno');
    })
    // Criar tabela votos
    .createTable('votos', function (table) {
      table.increments('id_votos').primary();
      table.integer('id_usuario').unsigned().notNullable();
      table.integer('id_turma').unsigned().notNullable();
      table.foreign('id_usuario').references('id_usuario').inTable('usuario');
      table.foreign('id_turma').references('id_turma').inTable('turma');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('votos')
    .dropTableIfExists('turma')
    .dropTableIfExists('turno')
    .dropTableIfExists('usuario');
};