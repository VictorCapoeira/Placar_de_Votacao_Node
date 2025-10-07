-- Cria o banco de dados
CREATE DATABASE IF NOT EXISTS sistema_de_votos;
-- Usa o banco de dados recém-criado
USE sistema_de_votos;
-- Tabela Usuario
CREATE TABLE usuario (
 id_usuario INT PRIMARY KEY AUTO_INCREMENT,
 cpf VARCHAR(11) UNIQUE NOT NULL
);
-- Tabela Votos
CREATE TABLE turno (
id_turno INT PRIMARY KEY AUTO_INCREMENT,
nome_turno VARCHAR(255) NOT NULL
);

-- Tabela turma 
CREATE TABLE turma (
id_turma INT PRIMARY KEY AUTO_INCREMENT,
nome_turma VARCHAR(255) NOT NULL,
codigo_turma VARCHAR(255) NOT NULL,
projeto_turma VARCHAR(255),
descricao_projeto_turma TEXT,
fotos_turma TEXT,
professor_turma VARCHAR(255) NOT NULL,
id_turno INT NOT NULL,
FOREIGN KEY (id_turno) REFERENCES turno(id_turno)
);
-- Tabela Votos
CREATE TABLE votos (
id_votos INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT NOT NULL,
id_turma INT NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);







