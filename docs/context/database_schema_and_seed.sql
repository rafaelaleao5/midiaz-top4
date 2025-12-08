-- ============================================================================
-- MIDIAZ B2B - MVP: Event Brand Report
-- Script de Criação de Tabelas e Dados Artificiais
-- ============================================================================

-- ============================================================================
-- 1. CRIAÇÃO DAS TABELAS
-- ============================================================================

-- 1.1. Tabela: events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('corrida', 'triatlo', 'beach tennis', 'ciclismo')),
    event_date DATE NOT NULL,
    event_location VARCHAR(200) NOT NULL,
    total_photos INTEGER DEFAULT 0,
    total_athletes_estimated INTEGER,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('created', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    metadata JSONB,
    UNIQUE(event_name, event_date)
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- 1.2. Tabela: event_persons
-- Registro único de cada pessoa por evento (todas as pessoas estão cadastradas)
CREATE TABLE IF NOT EXISTS event_persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    cpf VARCHAR(11) NOT NULL, -- CPF da pessoa cadastrada na Midiaz
    person_id UUID NOT NULL, -- ID único da pessoa
    age INTEGER NOT NULL, -- Idade
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('M', 'F', 'Outro')), -- Gênero
    photo_count INTEGER DEFAULT 0, -- Quantas fotos a pessoa aparece
    first_seen TIMESTAMP, -- Primeira aparição no evento
    last_seen TIMESTAMP, -- Última aparição no evento
    is_registered BOOLEAN DEFAULT TRUE, -- Todas estão cadastradas
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, person_id),
    UNIQUE(event_id, cpf)
);

CREATE INDEX IF NOT EXISTS idx_persons_event ON event_persons(event_id);
CREATE INDEX IF NOT EXISTS idx_persons_cpf ON event_persons(cpf);
CREATE INDEX IF NOT EXISTS idx_persons_person_id ON event_persons(person_id);

-- 1.3. Tabela: person_items
-- Tabela central: um registro = um tipo de produto de uma pessoa em um evento
CREATE TABLE IF NOT EXISTS person_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    person_id UUID NOT NULL, -- Referência a event_persons.person_id
    
    -- SEMPRE PREENCHIDOS
    product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('tênis', 'camiseta', 'short', 'óculos', 'boné')),
    brand VARCHAR(200) NOT NULL CHECK (brand IN ('Nike', 'Adidas', 'Mizuno', 'Track&Field', 'Asics', 'Olympikus')),
    
    -- OPCIONAL (só se modelo foi treinado para identificar produto específico)
    product_name VARCHAR(200), -- Nome exato do produto (ex: "Air Zoom Pegasus", "Tênis Corre 4")
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraint: uma pessoa não pode ter o mesmo tipo de produto duplicado no mesmo evento
    UNIQUE(event_id, person_id, product_type)
);

CREATE INDEX IF NOT EXISTS idx_person_items_event ON person_items(event_id);
CREATE INDEX IF NOT EXISTS idx_person_items_person ON person_items(person_id);
CREATE INDEX IF NOT EXISTS idx_person_items_brand ON person_items(brand);
CREATE INDEX IF NOT EXISTS idx_person_items_product ON person_items(product_type);
CREATE INDEX IF NOT EXISTS idx_person_items_event_brand ON person_items(event_id, brand);

-- 1.4. Views Materializadas

-- 1.4.1. brand_event_summary
CREATE MATERIALIZED VIEW IF NOT EXISTS brand_event_summary AS
SELECT 
    e.id as event_id,
    e.event_name,
    e.event_date,
    pi.brand,
    COUNT(DISTINCT pi.person_id) as persons_with_brand,
    COUNT(DISTINCT pi.id) as total_items,
    ROUND(
        100.0 * COUNT(DISTINCT pi.id) / 
        NULLIF((SELECT COUNT(*) FROM person_items WHERE event_id = e.id), 0),
        2
    ) as brand_share_percent,
    ROUND(
        100.0 * COUNT(DISTINCT pi.person_id) / 
        NULLIF((SELECT COUNT(DISTINCT person_id) FROM event_persons WHERE event_id = e.id), 0),
        2
    ) as person_coverage_percent
FROM events e
JOIN person_items pi ON pi.event_id = e.id
WHERE pi.brand IS NOT NULL
GROUP BY e.id, e.event_name, e.event_date, pi.brand;

CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_summary_unique ON brand_event_summary(event_id, brand);
CREATE INDEX IF NOT EXISTS idx_brand_summary_event ON brand_event_summary(event_id);
CREATE INDEX IF NOT EXISTS idx_brand_summary_brand ON brand_event_summary(brand);

-- 1.4.2. product_event_summary
CREATE MATERIALIZED VIEW IF NOT EXISTS product_event_summary AS
SELECT 
    e.id as event_id,
    e.event_name,
    pi.product_type,
    COUNT(DISTINCT pi.person_id) as persons_with_product,
    COUNT(DISTINCT pi.id) as total_items,
    ROUND(
        100.0 * COUNT(DISTINCT pi.id) / 
        NULLIF((SELECT COUNT(*) FROM person_items WHERE event_id = e.id), 0),
        2
    ) as product_share_percent
FROM events e
JOIN person_items pi ON pi.event_id = e.id
WHERE pi.product_type IS NOT NULL
GROUP BY e.id, e.event_name, pi.product_type;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_summary_unique ON product_event_summary(event_id, product_type);

-- ============================================================================
-- 2. DADOS ARTIFICIAIS
-- ============================================================================

-- 2.1. Limpar dados existentes (se necessário)
-- TRUNCATE TABLE person_items CASCADE;
-- TRUNCATE TABLE event_persons CASCADE;
-- TRUNCATE TABLE events CASCADE;

-- 2.2. Inserir Eventos
INSERT INTO events (id, event_name, event_type, event_date, event_location, total_photos, total_athletes_estimated, status, processed_at)
VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Maratona do Recife 2025', 'corrida', '2025-03-15', 'Recife, PE', 5000, 500, 'completed', '2025-03-15 18:00:00'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Corrida das Pontes 2025', 'corrida', '2025-04-20', 'Recife, PE', 3000, 300, 'completed', '2025-04-20 17:30:00'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Triatlo de Boa Viagem 2025', 'triatlo', '2025-05-10', 'Recife, PE', 2000, 150, 'completed', '2025-05-10 19:00:00');

-- 2.3. Função auxiliar para gerar CPF aleatório (formato: 11 dígitos)
CREATE OR REPLACE FUNCTION generate_random_cpf() RETURNS VARCHAR(11) AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 99999999999)::TEXT, 11, '0');
END;
$$ LANGUAGE plpgsql;

-- 2.4. Função auxiliar para gerar UUID aleatório para person_id
CREATE OR REPLACE FUNCTION generate_person_id() RETURNS UUID AS $$
BEGIN
    RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;

-- 2.5. Inserir Pessoas e Itens para o Evento 1 (Maratona do Recife 2025)
-- Vamos criar 500 pessoas com 2-5 itens cada

DO $$
DECLARE
    event_uuid UUID := '550e8400-e29b-41d4-a716-446655440000';
    person_uuid UUID;
    person_cpf VARCHAR(11);
    person_age INTEGER;
    person_gender VARCHAR(10);
    product_types TEXT[] := ARRAY['tênis', 'camiseta', 'short', 'óculos', 'boné'];
    brands TEXT[] := ARRAY['Nike', 'Adidas', 'Mizuno', 'Track&Field', 'Asics', 'Olympikus'];
    brand_weights INTEGER[] := ARRAY[30, 25, 15, 10, 10, 10]; -- Distribuição de probabilidade
    product_type_weights INTEGER[] := ARRAY[100, 80, 60, 20, 15]; -- tênis, camiseta, short, óculos, boné
    selected_brand VARCHAR(200);
    selected_product_type VARCHAR(50);
    product_name_val VARCHAR(200);
    i INTEGER;
    j INTEGER;
    num_items INTEGER;
    random_val INTEGER;
BEGIN
    -- Criar 500 pessoas
    FOR i IN 1..500 LOOP
        person_uuid := gen_random_uuid();
        person_cpf := generate_random_cpf();
        person_age := 18 + FLOOR(RANDOM() * 50)::INTEGER; -- Idade entre 18 e 68
        person_gender := CASE WHEN RANDOM() < 0.55 THEN 'M' ELSE 'F' END; -- 55% homens, 45% mulheres
        
        -- Inserir pessoa
        INSERT INTO event_persons (event_id, cpf, person_id, age, gender, photo_count, first_seen, last_seen, is_registered)
        VALUES (
            event_uuid,
            person_cpf,
            person_uuid,
            person_age,
            person_gender,
            FLOOR(RANDOM() * 10 + 1)::INTEGER, -- 1-10 fotos
            NOW() - (RANDOM() * INTERVAL '2 hours'),
            NOW() - (RANDOM() * INTERVAL '30 minutes'),
            TRUE
        );
        
        -- Criar 2-5 itens por pessoa
        num_items := 2 + FLOOR(RANDOM() * 4)::INTEGER; -- 2, 3, 4 ou 5 itens
        
        -- Garantir que sempre tenha tênis
        -- Escolher marca primeiro
        random_val := FLOOR(RANDOM() * 100)::INTEGER;
        IF random_val < 30 THEN
            selected_brand := 'Nike';
        ELSIF random_val < 55 THEN
            selected_brand := 'Adidas';
        ELSIF random_val < 70 THEN
            selected_brand := 'Mizuno';
        ELSIF random_val < 80 THEN
            selected_brand := 'Track&Field';
        ELSIF random_val < 90 THEN
            selected_brand := 'Asics';
        ELSE
            selected_brand := 'Olympikus';
        END IF;
        
        -- Escolher product_name baseado na marca (se tiver)
        IF RANDOM() < 0.15 THEN -- 15% chance de ter product_name
            CASE selected_brand
                WHEN 'Nike' THEN product_name_val := 'Air Zoom Pegasus';
                WHEN 'Adidas' THEN product_name_val := 'Ultraboost 22';
                WHEN 'Mizuno' THEN product_name_val := 'Wave Rider';
                WHEN 'Track&Field' THEN product_name_val := 'Corre 4';
                WHEN 'Asics' THEN product_name_val := 'Gel-Nimbus';
                WHEN 'Olympikus' THEN product_name_val := 'Corre 3';
                ELSE product_name_val := NULL;
            END CASE;
        ELSE
            product_name_val := NULL;
        END IF;
        
        INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
        VALUES (
            event_uuid,
            person_uuid,
            'tênis',
            selected_brand,
            product_name_val
        );
        
        -- Adicionar outros itens (camiseta, short, óculos, boné)
        FOR j IN 2..num_items LOOP
            random_val := FLOOR(RANDOM() * 100)::INTEGER;
            
            -- Escolher tipo de produto baseado em pesos
            IF random_val < 80 THEN
                selected_product_type := 'camiseta';
            ELSIF random_val < 95 THEN
                selected_product_type := 'short';
            ELSIF random_val < 98 THEN
                selected_product_type := 'óculos';
            ELSE
                selected_product_type := 'boné';
            END IF;
            
            -- Escolher marca baseado em pesos
            random_val := FLOOR(RANDOM() * 100)::INTEGER;
            IF random_val < 30 THEN
                selected_brand := 'Nike';
            ELSIF random_val < 55 THEN
                selected_brand := 'Adidas';
            ELSIF random_val < 70 THEN
                selected_brand := 'Mizuno';
            ELSIF random_val < 80 THEN
                selected_brand := 'Track&Field';
            ELSIF random_val < 90 THEN
                selected_brand := 'Asics';
            ELSE
                selected_brand := 'Olympikus';
            END IF;
            
            -- Inserir item (usando ON CONFLICT para evitar duplicatas)
            INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
            VALUES (
                event_uuid,
                person_uuid,
                selected_product_type,
                selected_brand,
                NULL -- product_name só para tênis treinados
            )
            ON CONFLICT (event_id, person_id, product_type) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 2.6. Inserir Pessoas e Itens para o Evento 2 (Corrida das Pontes 2025)
-- 300 pessoas

DO $$
DECLARE
    event_uuid UUID := '550e8400-e29b-41d4-a716-446655440001';
    person_uuid UUID;
    person_cpf VARCHAR(11);
    person_age INTEGER;
    person_gender VARCHAR(10);
    selected_brand VARCHAR(200);
    selected_product_type VARCHAR(50);
    product_name_val VARCHAR(200);
    i INTEGER;
    j INTEGER;
    num_items INTEGER;
    random_val INTEGER;
BEGIN
    FOR i IN 1..300 LOOP
        person_uuid := gen_random_uuid();
        person_cpf := generate_random_cpf();
        person_age := 18 + FLOOR(RANDOM() * 50)::INTEGER;
        person_gender := CASE WHEN RANDOM() < 0.55 THEN 'M' ELSE 'F' END;
        
        INSERT INTO event_persons (event_id, cpf, person_id, age, gender, photo_count, first_seen, last_seen, is_registered)
        VALUES (
            event_uuid,
            person_cpf,
            person_uuid,
            person_age,
            person_gender,
            FLOOR(RANDOM() * 8 + 1)::INTEGER,
            NOW() - (RANDOM() * INTERVAL '2 hours'),
            NOW() - (RANDOM() * INTERVAL '30 minutes'),
            TRUE
        );
        
        num_items := 2 + FLOOR(RANDOM() * 4)::INTEGER;
        
        -- Tênis obrigatório
        random_val := FLOOR(RANDOM() * 100)::INTEGER;
        IF random_val < 30 THEN
            selected_brand := 'Nike';
        ELSIF random_val < 55 THEN
            selected_brand := 'Adidas';
        ELSIF random_val < 70 THEN
            selected_brand := 'Mizuno';
        ELSIF random_val < 80 THEN
            selected_brand := 'Track&Field';
        ELSIF random_val < 90 THEN
            selected_brand := 'Asics';
        ELSE
            selected_brand := 'Olympikus';
        END IF;
        
        -- Escolher product_name baseado na marca (se tiver)
        IF RANDOM() < 0.12 THEN -- 12% chance de ter product_name
            CASE selected_brand
                WHEN 'Nike' THEN product_name_val := 'Air Zoom Pegasus';
                WHEN 'Adidas' THEN product_name_val := 'Ultraboost 22';
                WHEN 'Mizuno' THEN product_name_val := 'Wave Rider';
                WHEN 'Track&Field' THEN product_name_val := 'Corre 4';
                WHEN 'Asics' THEN product_name_val := 'Gel-Nimbus';
                WHEN 'Olympikus' THEN product_name_val := 'Corre 3';
                ELSE product_name_val := NULL;
            END CASE;
        ELSE
            product_name_val := NULL;
        END IF;
        
        INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
        VALUES (
            event_uuid,
            person_uuid,
            'tênis',
            selected_brand,
            product_name_val
        );
        
        FOR j IN 2..num_items LOOP
            random_val := FLOOR(RANDOM() * 100)::INTEGER;
            IF random_val < 80 THEN
                selected_product_type := 'camiseta';
            ELSIF random_val < 95 THEN
                selected_product_type := 'short';
            ELSIF random_val < 98 THEN
                selected_product_type := 'óculos';
            ELSE
                selected_product_type := 'boné';
            END IF;
            
            random_val := FLOOR(RANDOM() * 100)::INTEGER;
            IF random_val < 30 THEN
                selected_brand := 'Nike';
            ELSIF random_val < 55 THEN
                selected_brand := 'Adidas';
            ELSIF random_val < 70 THEN
                selected_brand := 'Mizuno';
            ELSIF random_val < 80 THEN
                selected_brand := 'Track&Field';
            ELSIF random_val < 90 THEN
                selected_brand := 'Asics';
            ELSE
                selected_brand := 'Olympikus';
            END IF;
            
            INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
            VALUES (event_uuid, person_uuid, selected_product_type, selected_brand, NULL)
            ON CONFLICT (event_id, person_id, product_type) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 2.7. Inserir Pessoas e Itens para o Evento 3 (Triatlo de Boa Viagem 2025)
-- 150 pessoas

DO $$
DECLARE
    event_uuid UUID := '550e8400-e29b-41d4-a716-446655440002';
    person_uuid UUID;
    person_cpf VARCHAR(11);
    person_age INTEGER;
    person_gender VARCHAR(10);
    selected_brand VARCHAR(200);
    selected_product_type VARCHAR(50);
    product_name_val VARCHAR(200);
    i INTEGER;
    j INTEGER;
    num_items INTEGER;
    random_val INTEGER;
BEGIN
    FOR i IN 1..150 LOOP
        person_uuid := gen_random_uuid();
        person_cpf := generate_random_cpf();
        person_age := 20 + FLOOR(RANDOM() * 45)::INTEGER; -- Triatlo: atletas mais experientes
        person_gender := CASE WHEN RANDOM() < 0.60 THEN 'M' ELSE 'F' END; -- Mais homens em triatlo
        
        INSERT INTO event_persons (event_id, cpf, person_id, age, gender, photo_count, first_seen, last_seen, is_registered)
        VALUES (
            event_uuid,
            person_cpf,
            person_uuid,
            person_age,
            person_gender,
            FLOOR(RANDOM() * 12 + 2)::INTEGER, -- Mais fotos em triatlo
            NOW() - (RANDOM() * INTERVAL '3 hours'),
            NOW() - (RANDOM() * INTERVAL '20 minutes'),
            TRUE
        );
        
        num_items := 3 + FLOOR(RANDOM() * 3)::INTEGER; -- 3-5 itens (triatlo tem mais equipamentos)
        
        -- Tênis obrigatório
        random_val := FLOOR(RANDOM() * 100)::INTEGER;
        IF random_val < 35 THEN
            selected_brand := 'Nike';
        ELSIF random_val < 60 THEN
            selected_brand := 'Adidas';
        ELSIF random_val < 75 THEN
            selected_brand := 'Mizuno';
        ELSIF random_val < 85 THEN
            selected_brand := 'Track&Field';
        ELSIF random_val < 93 THEN
            selected_brand := 'Asics';
        ELSE
            selected_brand := 'Olympikus';
        END IF;
        
        -- Escolher product_name baseado na marca (se tiver)
        IF RANDOM() < 0.18 THEN -- 18% chance de ter product_name
            CASE selected_brand
                WHEN 'Nike' THEN product_name_val := 'Air Zoom Pegasus';
                WHEN 'Adidas' THEN product_name_val := 'Ultraboost 22';
                WHEN 'Mizuno' THEN product_name_val := 'Wave Rider';
                WHEN 'Track&Field' THEN product_name_val := 'Corre 4';
                WHEN 'Asics' THEN product_name_val := 'Gel-Nimbus';
                WHEN 'Olympikus' THEN product_name_val := 'Corre 3';
                ELSE product_name_val := NULL;
            END CASE;
        ELSE
            product_name_val := NULL;
        END IF;
        
        INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
        VALUES (
            event_uuid,
            person_uuid,
            'tênis',
            selected_brand,
            product_name_val
        );
        
        FOR j IN 2..num_items LOOP
            random_val := FLOOR(RANDOM() * 100)::INTEGER;
            IF random_val < 75 THEN
                selected_product_type := 'camiseta';
            ELSIF random_val < 92 THEN
                selected_product_type := 'short';
            ELSIF random_val < 97 THEN
                selected_product_type := 'óculos';
            ELSE
                selected_product_type := 'boné';
            END IF;
            
            random_val := FLOOR(RANDOM() * 100)::INTEGER;
            IF random_val < 35 THEN
                selected_brand := 'Nike';
            ELSIF random_val < 60 THEN
                selected_brand := 'Adidas';
            ELSIF random_val < 75 THEN
                selected_brand := 'Mizuno';
            ELSIF random_val < 85 THEN
                selected_brand := 'Track&Field';
            ELSIF random_val < 93 THEN
                selected_brand := 'Asics';
            ELSE
                selected_brand := 'Olympikus';
            END IF;
            
            INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
            VALUES (event_uuid, person_uuid, selected_product_type, selected_brand, NULL)
            ON CONFLICT (event_id, person_id, product_type) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 2.8. Atualizar contadores de fotos nos eventos
UPDATE events 
SET total_photos = (
    SELECT SUM(photo_count) 
    FROM event_persons 
    WHERE event_id = events.id
)
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002'
);

UPDATE events 
SET total_athletes_estimated = (
    SELECT COUNT(DISTINCT person_id) 
    FROM event_persons 
    WHERE event_id = events.id
)
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002'
);

-- 2.9. Atualizar Views Materializadas
REFRESH MATERIALIZED VIEW CONCURRENTLY brand_event_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY product_event_summary;

-- ============================================================================
-- 3. QUERIES DE VALIDAÇÃO
-- ============================================================================

-- 3.1. Verificar total de pessoas por evento
SELECT 
    e.event_name,
    COUNT(DISTINCT ep.person_id) as total_pessoas,
    COUNT(DISTINCT pi.id) as total_itens,
    ROUND(AVG(pi_count.items_per_person), 2) as media_itens_por_pessoa
FROM events e
LEFT JOIN event_persons ep ON ep.event_id = e.id
LEFT JOIN person_items pi ON pi.event_id = e.id
LEFT JOIN (
    SELECT event_id, person_id, COUNT(*) as items_per_person
    FROM person_items
    GROUP BY event_id, person_id
) pi_count ON pi_count.event_id = e.id AND pi_count.person_id = ep.person_id
GROUP BY e.id, e.event_name
ORDER BY e.event_date;

-- 3.2. Share de marcas por evento
SELECT 
    event_name,
    brand,
    persons_with_brand,
    total_items,
    brand_share_percent,
    person_coverage_percent
FROM brand_event_summary
ORDER BY event_name, brand_share_percent DESC;

-- 3.3. Share de tipos de produto por evento
SELECT 
    event_name,
    product_type,
    persons_with_product,
    total_items,
    product_share_percent
FROM product_event_summary
ORDER BY event_name, product_share_percent DESC;

-- 3.4. Produtos específicos (com product_name)
SELECT 
    e.event_name,
    pi.brand,
    pi.product_name,
    COUNT(*) as quantidade
FROM person_items pi
JOIN events e ON e.id = pi.event_id
WHERE pi.product_name IS NOT NULL
GROUP BY e.event_name, pi.brand, pi.product_name
ORDER BY e.event_name, quantidade DESC;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

