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
    id INT PRIMARY KEY,
    numero_sala INT
);

-- Tabela de notebooks
CREATE TABLE IF NOT EXISTS NOTEBOOKS (
    id INT PRIMARY KEY,
    numero_notebook INT
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS FUNCIONARIOS (
    id INT PRIMARY KEY,
    nome VARCHAR(100),
    cargo VARCHAR(50),
    dia_responsavel VARCHAR(20),
    nascimento DATE
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS AGENDAMENTO (
    id INT PRIMARY KEY,
    usuario_id INT,
    funcionario_id INT,
    sala_id INT,
    notebook_id INT,
    disponibilidade_notebook BOOLEAN,
    disponibilidade_sala BOOLEAN,
    data_preenchimento DATE,
    horario TIME,
    cancelamento BOOLEAN,
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id),
    FOREIGN KEY (funcionario_id) REFERENCES FUNCIONARIOS(id),
    FOREIGN KEY (sala_id) REFERENCES SALAS(id),
    FOREIGN KEY (notebook_id) REFERENCES NOTEBOOKS(id)
);