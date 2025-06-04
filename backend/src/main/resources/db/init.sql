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

-- Inserção de dados iniciais para o quiz de Terremotos
INSERT INTO quizzes (title, disaster_type) VALUES ('Teste seus conhecimentos sobre Terremotos', 'EARTHQUAKE');

-- Pergunta 1
INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'O que você deve fazer imediatamente durante um terremoto se estiver dentro de um edifício?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Correr para fora do edifício', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Ficar perto de janelas', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Abrigar-se sob uma mesa resistente e proteger a cabeça', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (1, 'Usar o elevador para sair', 0);

-- Pergunta 2
INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'Qual é o principal perigo após um terremoto?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Tremores secundários (réplicas)', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Falta de comida', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Doenças', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (2, 'Frio extremo', 0);

-- Pergunta 3
INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'Se estiver dirigindo durante um terremoto, o que você deve fazer?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Acelerar para sair da área', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Parar o carro em local seguro e permanecer dentro', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Parar sob uma ponte', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (3, 'Sair correndo do carro', 0);

-- Pergunta 4
INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'Após um terremoto, o que você NÃO deve fazer?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Checar se há vazamento de gás', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Usar elevadores para sair do prédio', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Verificar ferimentos em si mesmo e nos outros', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (4, 'Ouvir o rádio para atualizações', 0);

-- Pergunta 5
INSERT INTO questions (quiz_id, question_text, points) VALUES (1, 'O que são réplicas em terremotos?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (5, 'Explosões de gás após o terremoto', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (5, 'Tremores menores que ocorrem após o principal', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (5, 'Alarmes falsos de terremoto', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (5, 'Ondas sísmicas artificiais', 0);

-- Inserção de dados iniciais para o quiz de Enchentes
INSERT INTO quizzes (title, disaster_type) VALUES ('Quiz de Preparação para Enchentes', 'FLOOD');

-- Pergunta 1
INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'O que você deve incluir em um kit de emergência para enchentes?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (6, 'Apenas água e comida enlatada', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (6, 'Água potável, alimentos não perecíveis, kit de primeiros socorros, lanterna, rádio portátil e documentos importantes', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (6, 'Roupas de festa e joias', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (6, 'Eletrônicos caros', 0);

-- Pergunta 2
INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'Qual é uma medida importante para proteger sua casa contra enchentes?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (7, 'Construir muros de concreto ao redor da casa', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (7, 'Elevar aparelhos e sistemas essenciais (como aquecedores de água)', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (7, 'Deixar as janelas abertas para ventilação', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (7, 'Plantar árvores grandes perto da fundação', 0);

-- Pergunta 3
INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'O que você deve fazer ao encontrar uma rua alagada?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (8, 'Atravessar com cuidado', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (8, 'Evitar entrar na água, mesmo com carro', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (8, 'Filmar a enchente para as redes sociais', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (8, 'Caminhar na água com sapatos impermeáveis', 0);

-- Pergunta 4
INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'Qual destes é um risco comum em enchentes?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (9, 'Radiação solar', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (9, 'Contaminação da água por esgoto', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (9, 'Ataques de animais silvestres', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (9, 'Incêndios florestais', 0);

-- Pergunta 5
INSERT INTO questions (quiz_id, question_text, points) VALUES (2, 'Como agir se sua casa começar a alagar?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (10, 'Tentar salvar os móveis', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (10, 'Desligar a energia elétrica e buscar local alto', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (10, 'Abrir as janelas para a água sair', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (10, 'Ficar em casa e esperar ajuda', 0);

-- Inserção de dados iniciais para o quiz de Incêndios
INSERT INTO quizzes (title, disaster_type) VALUES ('Quiz de Prevenção a Incêndios', 'FIRE');

-- Pergunta 1
INSERT INTO questions (quiz_id, question_text, points) VALUES (3, 'Qual é a primeira coisa que você deve fazer ao notar um incêndio em casa?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (11, 'Pegar seus pertences mais valiosos', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (11, 'Tentar apagar sozinho o fogo com balde de água', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (11, 'Evacuar imediatamente e acionar o corpo de bombeiros', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (11, 'Abrir todas as janelas para reduzir a fumaça', 0);

-- Pergunta 2
INSERT INTO questions (quiz_id, question_text, points) VALUES (3, 'Qual medida ajuda a prevenir incêndios em casa?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (12, 'Deixar velas acesas quando sair de casa', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (12, 'Evitar sobrecarregar tomadas e revisar instalações elétricas', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (12, 'Guardar fósforos ao lado do fogão', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (12, 'Usar extensões longas para ligar vários aparelhos juntos', 0);

-- Pergunta 3
INSERT INTO questions (quiz_id, question_text, points) VALUES (3, 'O que você deve fazer se houver fumaça no ambiente?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (13, 'Andar normalmente', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (13, 'Agachar-se ou rastejar perto do chão', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (13, 'Abrir todas as janelas', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (13, 'Usar perfume para disfarçar o cheiro', 0);

-- Pergunta 4
INSERT INTO questions (quiz_id, question_text, points) VALUES (3, 'Qual destes é um item importante em caso de incêndio?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (14, 'Extintor de incêndio', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (14, 'Cortina blackout', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (14, 'Espelho grande', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (14, 'Umidificador de ar', 0);

-- Pergunta 5
INSERT INTO questions (quiz_id, question_text, points) VALUES (3, 'Se suas roupas pegarem fogo, o que você deve fazer?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (15, 'Correr', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (15, 'Parar, deitar e rolar no chão', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (15, 'Pedir ajuda gritando', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (15, 'Tirar a roupa o mais rápido possível', 0);

-- Inserção de dados iniciais para o quiz de Furacões
INSERT INTO quizzes (title, disaster_type) VALUES ('Quiz de Preparação para Furacões', 'HURRICANE');

-- Pergunta 1
INSERT INTO questions (quiz_id, question_text, points) VALUES (4, 'O que você deve fazer antes da chegada de um furacão?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (16, 'Ignorar os avisos e seguir a rotina normal', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (16, 'Estocar alimentos e água, reforçar janelas e seguir orientações oficiais', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (16, 'Viajar para locais turísticos próximos', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (16, 'Deixar portas e janelas abertas para evitar pressão', 0);

-- Pergunta 2
INSERT INTO questions (quiz_id, question_text, points) VALUES (4, 'Durante um furacão, qual é o local mais seguro para se abrigar?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (17, 'Varanda com vista para o mar', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (17, 'Próximo à janela para observar o progresso da tempestade', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (17, 'Cômodo interior sem janelas e longe de objetos soltos', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (17, 'Porão de casas alagáveis', 0);

-- Pergunta 3
INSERT INTO questions (quiz_id, question_text, points) VALUES (4, 'O que significa um "alerta de furacão"?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (18, 'Um furacão já passou', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (18, 'Condições de furacão são possíveis na área nas próximas 48 horas', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (18, 'Está chovendo forte', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (18, 'Ventos fortes estão previstos', 0);

-- Pergunta 4
INSERT INTO questions (quiz_id, question_text, points) VALUES (4, 'Qual desses itens é indispensável em um abrigo contra furacões?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (19, 'Ar condicionado portátil', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (19, 'Lanterna com baterias extras', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (19, 'Comida perecível', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (19, 'Cadeiras de praia', 0);

-- Pergunta 5
INSERT INTO questions (quiz_id, question_text, points) VALUES (4, 'Após o furacão, o que você deve evitar?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (20, 'Evacuar conforme instruções das autoridades', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (20, 'Entrar em áreas inundadas ou com fios soltos', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (20, 'Checar o estado da casa', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (20, 'Usar rádio para ouvir alertas', 0);

-- Inserção de dados iniciais para o quiz de Tornados
INSERT INTO quizzes (title, disaster_type) VALUES ('Quiz de Segurança em Tornados', 'TORNADO');

-- Pergunta 1
INSERT INTO questions (quiz_id, question_text, points) VALUES (5, 'O que é mais seguro fazer durante um tornado?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (21, 'Ficar perto de janelas para ver o que está acontecendo', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (21, 'Ir para o porão ou cômodo interno sem janelas', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (21, 'Sair de casa e correr para um campo aberto', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (21, 'Dirigir até longe do tornado', 0);

-- Pergunta 2
INSERT INTO questions (quiz_id, question_text, points) VALUES (5, 'Qual sinal pode indicar que um tornado está se aproximando?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (22, 'Céu muito claro e sol forte', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (22, 'Som alto parecido com locomotiva', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (22, 'Brisa suave e constante', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (22, 'Nevoeiro espesso', 0);

-- Pergunta 3
INSERT INTO questions (quiz_id, question_text, points) VALUES (5, 'Qual a melhor atitude se você estiver em um carro durante um tornado?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (23, 'Dirigir em direção contrária ao tornado', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (23, 'Estacionar embaixo de uma ponte', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (23, 'Abandonar o carro e procurar abrigo em local mais baixo', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (23, 'Fechar as janelas e esperar dentro do carro', 0);

-- Pergunta 4
INSERT INTO questions (quiz_id, question_text, points) VALUES (5, 'Quando é seguro sair após um tornado?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (24, 'Assim que o vento diminuir', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (24, 'Após confirmação das autoridades', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (24, 'Quando não houver barulho', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (24, 'Depois de 10 minutos', 0);

-- Pergunta 5
INSERT INTO questions (quiz_id, question_text, points) VALUES (5, 'O que você deve incluir em um kit para tornados?', 10);

INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (25, 'TV e videogame', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (25, 'Documentos, lanternas, água e rádio com pilhas', 1);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (25, 'Roupas de banho', 0);
INSERT INTO answer_choices (question_id, choice_text, is_correct) VALUES (25, 'Fogão portátil', 0);

-- Commit das alterações
COMMIT; 