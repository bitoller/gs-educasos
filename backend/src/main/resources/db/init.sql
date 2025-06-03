-- Criação das tabelas
CREATE TABLE users (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password VARCHAR2(100) NOT NULL,
    score NUMBER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content (
    content_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    disaster_type VARCHAR2(50) NOT NULL,
    title VARCHAR2(200) NOT NULL,
    description CLOB,
    video_url VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kits (
    kit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    house_type VARCHAR2(50) NOT NULL,
    num_residents NUMBER NOT NULL,
    has_children NUMBER(1) DEFAULT 0,
    has_elderly NUMBER(1) DEFAULT 0,
    has_pets NUMBER(1) DEFAULT 0,
    region VARCHAR2(50) NOT NULL,
    recommended_items CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quizzes (
    quiz_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR2(200) NOT NULL,
    disaster_type VARCHAR2(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    question_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quiz_id NUMBER NOT NULL,
    question_text CLOB NOT NULL,
    points NUMBER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

CREATE TABLE answer_choices (
    choice_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_id NUMBER NOT NULL,
    choice_text VARCHAR2(500) NOT NULL,
    is_correct NUMBER(1) DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Criação de índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_content_disaster_type ON content(disaster_type);
CREATE INDEX idx_kits_house_type ON kits(house_type);
CREATE INDEX idx_kits_region ON kits(region);
CREATE INDEX idx_quizzes_disaster_type ON quizzes(disaster_type);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_answer_choices_question_id ON answer_choices(question_id);

-- Criação de triggers para atualização automática do updated_at
CREATE OR REPLACE TRIGGER users_update_trigger
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER content_update_trigger
BEFORE UPDATE ON content
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER kits_update_trigger
BEFORE UPDATE ON kits
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Inserção de dados iniciais para conteúdo
INSERT INTO content (disaster_type, title, description, video_url) VALUES
('TERREMOTO', 'Como se Preparar para um Terremoto', 'Guia completo sobre preparação para terremotos, incluindo medidas preventivas e o que fazer durante e após o evento.', 'https://example.com/earthquake-prep'),
('ENCHENTE', 'Prevenção de Enchentes', 'Informações importantes sobre como prevenir e lidar com enchentes em sua região.', 'https://example.com/flood-prevention'),
('INCENDIO', 'Segurança contra Incêndios', 'Dicas essenciais de segurança contra incêndios para residências e locais de trabalho.', 'https://example.com/fire-safety'),
('FURACAO', 'Preparação para Furacões', 'Guia detalhado sobre como se preparar para a temporada de furacões.', 'https://example.com/hurricane-prep'),
('TORNADO', 'Segurança em Caso de Tornados', 'Procedimentos de segurança e abrigos adequados para tornados.', 'https://example.com/tornado-safety');

-- Inserção de dados iniciais para kits
INSERT INTO kits (house_type, num_residents, has_children, has_elderly, has_pets, region, recommended_items) VALUES
('APARTAMENTO', 2, 0, 0, 0, 'SUDESTE', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros"]}'),
('CASA', 4, 1, 1, 1, 'NORDESTE', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros", "Medicamentos específicos", "Ração para pets", "Fraldas e itens para bebê"]}'),
('DUPLEX', 3, 0, 0, 0, 'LESTE', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros"]}'),
('CASA', 5, 2, 0, 1, 'SUDOESTE', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros", "Ração para pets", "Fraldas e itens para crianças"]}'),
('APARTAMENTO', 1, 0, 1, 0, 'OESTE', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros", "Medicamentos específicos"]}');

-- Inserção de dados iniciais para quizzes, questions e answer_choices
INSERT INTO quizzes (title, disaster_type) VALUES ('Teste seus conhecimentos sobre Terremotos', 'TERREMOTO');

-- Assuming quiz_id 1 for the Terremotos quiz
INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'O que você deve fazer imediatamente durante um terremoto se estiver dentro de um edifício?', 10);
-- Assuming question_id 1 for the first question
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Correr para fora do edifício', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Ficar perto de janelas', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Abrigar-se sob uma mesa resistente e proteger a cabeça', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Usar o elevador para sair', 0);

INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'Qual é o principal perigo após um terremoto?', 10);
-- Assuming question_id 2 for the second question
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Tremores secundários (réplicas)', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Falta de comida', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Doenças', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Frio extremo', 0);

INSERT INTO quizzes (title, disaster_type) VALUES ('Quiz de Preparação para Enchentes', 'ENCHENTE');
-- Assuming quiz_id 2 for the Enchentes quiz
INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'O que você deve incluir em um kit de emergência para enchentes?', 10);
-- Assuming question_id 3 for the first question of quiz 2
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Apenas água e comida enlatada', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Água potável, alimentos não perecíveis, kit de primeiros socorros, lanterna, rádio portátil e documentos importantes', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Roupas de festa e joias', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Eletrônicos caros', 0);

INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'Qual é uma medida importante para proteger sua casa contra enchentes?', 10);
-- Assuming question_id 4 for the second question of quiz 2
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Construir muros de concreto ao redor da casa', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Elevar aparelhos e sistemas essenciais (como aquecedores de água)', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Deixar as janelas abertas para ventilação', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Plantar árvores grandes perto da fundação', 0);

-- Commit das alterações
COMMIT; 