-- Tabela de usuários
CREATE TABLE IF NOT EXISTS USUARIOS (
    id INT PRIMARY KEY,
    nome VARCHAR(100),
    sobrenome VARCHAR(100),
    telefone VARCHAR(20),
    idade INT
);

-- Tabela de salas
CREATE TABLE IF NOT EXISTS SALAS (
    id SERIAL PRIMARY KEY,
    numero_sala INT NOT NULL,
    nome VARCHAR(100),
    andar INT,
    capacidade INT,
    descricao TEXT,
    disponibilidade BOOLEAN DEFAULT TRUE
);

-- Tabela de notebooks
CREATE TABLE IF NOT EXISTS NOTEBOOKS (
    id SERIAL PRIMARY KEY,
    numero_notebook INT NOT NULL,
    modelo VARCHAR(100),
    especificacao TEXT,
    estado VARCHAR(50),
    disponibilidade BOOLEAN DEFAULT TRUE
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS FUNCIONARIOS (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    dia_responsavel VARCHAR(20),
    nascimento DATE,
    email VARCHAR(100),
    departamento VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE
);

-- Inserir dados de exemplo para funcionários
INSERT INTO FUNCIONARIOS (nome, cargo, dia_responsavel, nascimento, email, departamento)
VALUES 
('João Silva', 'Gerente', 'Segunda', '1985-03-15', 'joao.silva@empresa.com', 'Administrativo'),
('Maria Oliveira', 'Analista', 'Terça', '1990-07-22', 'maria.oliveira@empresa.com', 'RH'),
('Carlos Santos', 'Coordenador', 'Quarta', '1988-11-10', 'carlos.santos@empresa.com', 'TI'),
('Ana Souza', 'Assistente', 'Quinta', '1995-05-03', 'ana.souza@empresa.com', 'Financeiro'),
('Pedro Costa', 'Estagiário', 'Sexta', '2000-01-25', 'pedro.costa@empresa.com', 'Marketing');

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS AGENDAMENTO (
    id SERIAL PRIMARY KEY,
    usuario_id INT,
    funcionario_id INT,
    sala_id INT,
    notebook_id INT,
    disponibilidade_notebook BOOLEAN DEFAULT TRUE,
    disponibilidade_sala BOOLEAN DEFAULT TRUE,
    data_preenchimento DATE,
    horario TIME,
    cancelamento BOOLEAN DEFAULT FALSE,
    observacao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id),
    FOREIGN KEY (funcionario_id) REFERENCES FUNCIONARIOS(id),
    FOREIGN KEY (sala_id) REFERENCES SALAS(id),
    FOREIGN KEY (notebook_id) REFERENCES NOTEBOOKS(id)
);

-- Inserir dados de exemplo para salas
INSERT INTO SALAS (numero_sala, nome, andar, capacidade, descricao, disponibilidade)
VALUES 
(101, 'Sala de Reuniões A', 1, 8, 'Sala equipada com projetor e quadro branco', TRUE),
(102, 'Sala de Reuniões B', 1, 6, 'Sala pequena para reuniões rápidas', TRUE),
(201, 'Sala de Conferência', 2, 15, 'Sala grande com sistema de videoconferência', TRUE),
(301, 'Sala de Treinamento', 3, 20, 'Sala com computadores para treinamentos', TRUE),
(302, 'Auditório', 3, 50, 'Auditório para apresentações e eventos', TRUE);

-- Inserir dados de exemplo para notebooks
INSERT INTO NOTEBOOKS (numero_notebook, modelo, especificacao, estado, disponibilidade)
VALUES 
(1001, 'Dell Latitude', 'Intel i5, 16GB RAM, 256GB SSD', 'Novo', TRUE),
(1002, 'HP EliteBook', 'Intel i7, 16GB RAM, 512GB SSD', 'Bom', TRUE),
(1003, 'Lenovo ThinkPad', 'Intel i5, 8GB RAM, 256GB SSD', 'Bom', TRUE),
(1004, 'MacBook Pro', 'M1, 16GB RAM, 512GB SSD', 'Novo', TRUE),
(1005, 'Dell XPS', 'Intel i7, 32GB RAM, 1TB SSD', 'Novo', TRUE);