-- Cria o banco de dados
CREATE DATABASE IF NOT EXISTS sistema_de_votos;
-- Usa o banco de dados recém-criado
USE sistema_de_votos;

-- Tabela Usuario
CREATE TABLE IF NOT EXISTS usuario (
 id_usuario INT PRIMARY KEY AUTO_INCREMENT,
 cpf VARCHAR(11) UNIQUE NOT NULL
);

-- Tabela turma 
CREATE TABLE IF NOT EXISTS turma (
  id_turma INT PRIMARY KEY AUTO_INCREMENT,
  nome_turma VARCHAR(255) NOT NULL,
  codigo_turma VARCHAR(255) NOT NULL,
  projeto_turma VARCHAR(255),
  descricao_projeto_turma TEXT,
  fotos_turma TEXT,
  professor_turma VARCHAR(255) NOT NULL
);

-- Tabela Votos
CREATE TABLE IF NOT EXISTS votos (
  id_votos INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_turma INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);

-- Inserts de exemplo (opcionais)
INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, fotos_turma, professor_turma) VALUES
('Turma de Engenharia', 'ENG-01', 'Ponte Sustentável', 'Projeto de ponte sustentável construída com materiais reciclados.', '["https://placehold.co/600x400/004A8D/white?text=Engenharia+1","https://placehold.co/600x400/F7941D/white?text=Engenharia+2"]', 'Prof. Carlos Silva'),
('Turma de Medicina', 'MED-02', 'Simulação Cirúrgica', 'Simulação de procedimentos cirúrgicos com tecnologia de realidade virtual.', 'https://placehold.co/600x400/004A8D/white?text=Medicina+1, https://placehold.co/600x400/F7941D/white?text=Medicina+2', 'Prof. Ana Santos'),
('Turma de Direito', 'DIR-03', 'Tribunal Simulado', 'Simulação de tribunal com caso real trabalhado pelos alunos.', NULL, 'Prof. Roberto Almeida');
-- Criação do banco (execute se ainda não existir)
CREATE DATABASE IF NOT EXISTS sistema_de_votos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_de_votos;

-- Tabela de turmas/projetos
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher VARCHAR(255)
);

-- Tabela de imagens das turmas
CREATE TABLE IF NOT EXISTS class_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  url VARCHAR(1000) NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Seeds de exemplo
INSERT INTO classes (name, description, teacher) VALUES
('Turma de Engenharia', 'Projeto de ponte sustentável construída com materiais reciclados.', 'Prof. Carlos Silva'),
('Turma de Medicina', 'Simulação de procedimentos cirúrgicos com tecnologia de realidade virtual.', 'Prof. Ana Santos'),
('Turma de Direito', 'Simulação de tribunal com caso real trabalhado pelos alunos.', 'Prof. Roberto Almeida');

INSERT INTO class_images (class_id, url) VALUES
(1, 'https://placehold.co/600x400/004A8D/white?text=Engenharia+1'),
(1, 'https://placehold.co/600x400/F7941D/white?text=Engenharia+2'),
(1, 'https://placehold.co/600x400/FDC180/black?text=Engenharia+3'),
(2, 'https://placehold.co/600x400/004A8D/white?text=Medicina+1'),
(2, 'https://placehold.co/600x400/F7941D/white?text=Medicina+2'),
(3, 'https://placehold.co/600x400/004A8D/white?text=Direito+1');
