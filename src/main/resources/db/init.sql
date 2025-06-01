-- Criação das tabelas
CREATE TABLE users (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password VARCHAR2(100) NOT NULL,
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

-- Criação de índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_content_disaster_type ON content(disaster_type);
CREATE INDEX idx_kits_house_type ON kits(house_type);
CREATE INDEX idx_kits_region ON kits(region);

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
('EARTHQUAKE', 'Como se Preparar para um Terremoto', 'Guia completo sobre preparação para terremotos, incluindo medidas preventivas e o que fazer durante e após o evento.', 'https://example.com/earthquake-prep'),
('FLOOD', 'Prevenção de Enchentes', 'Informações importantes sobre como prevenir e lidar com enchentes em sua região.', 'https://example.com/flood-prevention'),
('FIRE', 'Segurança contra Incêndios', 'Dicas essenciais de segurança contra incêndios para residências e locais de trabalho.', 'https://example.com/fire-safety'),
('HURRICANE', 'Preparação para Furacões', 'Guia detalhado sobre como se preparar para a temporada de furacões.', 'https://example.com/hurricane-prep'),
('TORNADO', 'Segurança em Caso de Tornados', 'Procedimentos de segurança e abrigos adequados para tornados.', 'https://example.com/tornado-safety');

-- Inserção de dados iniciais para kits
INSERT INTO kits (house_type, num_residents, has_children, has_elderly, has_pets, region, recommended_items) VALUES
('APARTMENT', 2, 0, 0, 0, 'SOUTHEAST', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros"]}'),
('HOUSE', 4, 1, 1, 1, 'NORTHEAST', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros", "Medicamentos específicos", "Ração para pets", "Fraldas e itens para bebê"]}'),
('CONDO', 3, 0, 0, 0, 'MIDWEST', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros"]}'),
('HOUSE', 5, 2, 0, 1, 'SOUTHWEST', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros", "Ração para pets", "Fraldas e itens para crianças"]}'),
('APARTMENT', 1, 0, 1, 0, 'WEST', '{"items": ["Água (4L por pessoa)", "Alimentos não perecíveis", "Lanterna", "Rádio portátil", "Kit de primeiros socorros", "Medicamentos específicos"]}');

-- Commit das alterações
COMMIT; 