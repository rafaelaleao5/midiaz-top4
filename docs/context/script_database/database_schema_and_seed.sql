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
    event_type VARCHAR(50) NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_events_location ON events(event_location);

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

-- ============================================================================
-- 1.5. ALTERAÇÕES DE SCHEMA (executar ANTES das views materializadas)
-- ============================================================================

-- Adicionar coluna sport se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'events' 
                   AND column_name = 'sport') THEN
        ALTER TABLE events ADD COLUMN sport VARCHAR(50);
        ALTER TABLE events ADD CONSTRAINT events_sport_check 
            CHECK (sport IN ('corrida', 'triathlon', 'ciclismo', 'vôlei', 'futebol'));
        CREATE INDEX IF NOT EXISTS idx_events_sport ON events(sport);
    END IF;
END $$;

-- NOTA: A constraint de event_type será atualizada DEPOIS de limpar os dados

-- 1.4. Views Materializadas

-- 1.4.1. brand_event_summary
DROP MATERIALIZED VIEW IF EXISTS brand_event_summary;
CREATE MATERIALIZED VIEW brand_event_summary AS
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
DROP MATERIALIZED VIEW IF EXISTS product_event_summary;
CREATE MATERIALIZED VIEW product_event_summary AS
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
-- 2. LIMPAR DADOS EXISTENTES
-- ============================================================================

TRUNCATE TABLE person_items CASCADE;
TRUNCATE TABLE event_persons CASCADE;
TRUNCATE TABLE events CASCADE;

-- Atualizar constraint de event_type APÓS limpar dados
DO $$
BEGIN
    -- Remover constraint antiga se existir
    ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_type_check;
    -- Adicionar nova constraint (agora pode porque não há dados)
    ALTER TABLE events ADD CONSTRAINT events_event_type_check 
        CHECK (event_type IN ('prova', 'treino'));
END $$;

-- Tornar coluna sport NOT NULL após limpar dados
DO $$
BEGIN
    -- Se a coluna existe mas não é NOT NULL, alterar
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'events' 
               AND column_name = 'sport'
               AND is_nullable = 'YES') THEN
        ALTER TABLE events ALTER COLUMN sport SET NOT NULL;
    END IF;
END $$;

-- ============================================================================
-- 3. FUNÇÕES AUXILIARES
-- ============================================================================

-- 4.1. Função auxiliar para gerar CPF aleatório (formato: 11 dígitos)
CREATE OR REPLACE FUNCTION generate_random_cpf() RETURNS VARCHAR(11) AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 99999999999)::TEXT, 11, '0');
END;
$$ LANGUAGE plpgsql;

-- 4.2. Função auxiliar para gerar UUID aleatório para person_id
CREATE OR REPLACE FUNCTION generate_person_id() RETURNS UUID AS $$
BEGIN
    RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. GERAR 30 EVENTOS COM DADOS VARIADOS
-- ============================================================================

-- 5.1. Inserir 30 eventos variados
INSERT INTO events (id, event_name, event_type, sport, event_date, event_location, total_photos, total_athletes_estimated, status, processed_at)
VALUES
    -- Provas de Corrida
    ('550e8400-e29b-41d4-a716-446655440000', 'Maratona do Recife 2025', 'prova', 'corrida', '2025-01-15', 'Recife, PE', 0, 0, 'completed', '2025-01-15 18:00:00'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Corrida das Pontes 2025', 'prova', 'corrida', '2025-02-20', 'Recife, PE', 0, 0, 'completed', '2025-02-20 17:30:00'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Meia Maratona de Olinda 2025', 'prova', 'corrida', '2025-03-10', 'Olinda, PE', 0, 0, 'completed', '2025-03-10 19:00:00'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Corrida de Rua de Jaboatão 2025', 'prova', 'corrida', '2025-04-05', 'Jaboatão dos Guararapes, PE', 0, 0, 'completed', '2025-04-05 16:30:00'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Corrida Noturna do Recife 2025', 'prova', 'corrida', '2025-05-18', 'Recife, PE', 0, 0, 'completed', '2025-05-18 20:00:00'),
    
    -- Provas de Triathlon
    ('550e8400-e29b-41d4-a716-446655440005', 'Triatlo de Boa Viagem 2025', 'prova', 'triathlon', '2025-01-25', 'Recife, PE', 0, 0, 'completed', '2025-01-25 19:00:00'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Triatlo de Porto de Galinhas 2025', 'prova', 'triathlon', '2025-03-20', 'Ipojuca, PE', 0, 0, 'completed', '2025-03-20 18:30:00'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Triatlo de Caruaru 2025', 'prova', 'triathlon', '2025-05-12', 'Caruaru, PE', 0, 0, 'completed', '2025-05-12 17:00:00'),
    
    -- Provas de Ciclismo
    ('550e8400-e29b-41d4-a716-446655440008', 'Pedal do Recife 2025', 'prova', 'ciclismo', '2025-02-10', 'Recife, PE', 0, 0, 'completed', '2025-02-10 16:00:00'),
    ('550e8400-e29b-41d4-a716-446655440009', 'Ciclismo de Estrada de Garanhuns 2025', 'prova', 'ciclismo', '2025-04-22', 'Garanhuns, PE', 0, 0, 'completed', '2025-04-22 15:30:00'),
    
    -- Provas de Vôlei
    ('550e8400-e29b-41d4-a716-446655440010', 'Torneio de Vôlei de Praia 2025', 'prova', 'vôlei', '2025-01-30', 'Recife, PE', 0, 0, 'completed', '2025-01-30 14:00:00'),
    ('550e8400-e29b-41d4-a716-446655440011', 'Campeonato de Vôlei de Quadra 2025', 'prova', 'vôlei', '2025-03-25', 'Olinda, PE', 0, 0, 'completed', '2025-03-25 18:00:00'),
    
    -- Provas de Futebol
    ('550e8400-e29b-41d4-a716-446655440012', 'Copa de Futebol Society 2025', 'prova', 'futebol', '2025-02-15', 'Recife, PE', 0, 0, 'completed', '2025-02-15 19:30:00'),
    ('550e8400-e29b-41d4-a716-446655440013', 'Torneio de Futebol de Campo 2025', 'prova', 'futebol', '2025-04-28', 'Jaboatão dos Guararapes, PE', 0, 0, 'completed', '2025-04-28 16:00:00'),
    
    -- Treinos de Corrida
    ('550e8400-e29b-41d4-a716-446655440014', 'treino Praia de Boa Viagem 2025-01-05', 'treino', 'corrida', '2025-01-05', 'Recife, PE', 0, 0, 'completed', '2025-01-05 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440015', 'treino Parque da Jaqueira 2025-01-12', 'treino', 'corrida', '2025-01-12', 'Recife, PE', 0, 0, 'completed', '2025-01-12 06:00:00'),
    ('550e8400-e29b-41d4-a716-446655440016', 'treino Praia de Boa Viagem 2025-01-19', 'treino', 'corrida', '2025-01-19', 'Recife, PE', 0, 0, 'completed', '2025-01-19 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440017', 'treino Parque Dona Lindu 2025-02-02', 'treino', 'corrida', '2025-02-02', 'Recife, PE', 0, 0, 'completed', '2025-02-02 06:15:00'),
    ('550e8400-e29b-41d4-a716-446655440018', 'treino Praia de Boa Viagem 2025-02-09', 'treino', 'corrida', '2025-02-09', 'Recife, PE', 0, 0, 'completed', '2025-02-09 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440019', 'treino Parque da Jaqueira 2025-02-16', 'treino', 'corrida', '2025-02-16', 'Recife, PE', 0, 0, 'completed', '2025-02-16 06:00:00'),
    ('550e8400-e29b-41d4-a716-446655440020', 'treino Praia de Boa Viagem 2025-03-02', 'treino', 'corrida', '2025-03-02', 'Recife, PE', 0, 0, 'completed', '2025-03-02 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440021', 'treino Parque Dona Lindu 2025-03-09', 'treino', 'corrida', '2025-03-09', 'Recife, PE', 0, 0, 'completed', '2025-03-09 06:15:00'),
    ('550e8400-e29b-41d4-a716-446655440022', 'treino Praia de Boa Viagem 2025-03-16', 'treino', 'corrida', '2025-03-16', 'Recife, PE', 0, 0, 'completed', '2025-03-16 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440023', 'treino Parque da Jaqueira 2025-04-06', 'treino', 'corrida', '2025-04-06', 'Recife, PE', 0, 0, 'completed', '2025-04-06 06:00:00'),
    ('550e8400-e29b-41d4-a716-446655440024', 'treino Praia de Boa Viagem 2025-04-13', 'treino', 'corrida', '2025-04-13', 'Recife, PE', 0, 0, 'completed', '2025-04-13 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440025', 'treino Parque Dona Lindu 2025-04-20', 'treino', 'corrida', '2025-04-20', 'Recife, PE', 0, 0, 'completed', '2025-04-20 06:15:00'),
    ('550e8400-e29b-41d4-a716-446655440026', 'treino Praia de Boa Viagem 2025-05-04', 'treino', 'corrida', '2025-05-04', 'Recife, PE', 0, 0, 'completed', '2025-05-04 06:30:00'),
    ('550e8400-e29b-41d4-a716-446655440027', 'treino Parque da Jaqueira 2025-05-11', 'treino', 'corrida', '2025-05-11', 'Recife, PE', 0, 0, 'completed', '2025-05-11 06:00:00'),
    
    -- Treinos de Triathlon
    ('550e8400-e29b-41d4-a716-446655440028', 'treino Praia de Boa Viagem 2025-02-23', 'treino', 'triathlon', '2025-02-23', 'Recife, PE', 0, 0, 'completed', '2025-02-23 07:00:00'),
    ('550e8400-e29b-41d4-a716-446655440029', 'treino Praia de Boa Viagem 2025-04-27', 'treino', 'triathlon', '2025-04-27', 'Recife, PE', 0, 0, 'completed', '2025-04-27 07:00:00');

-- ============================================================================
-- 5. FUNÇÃO PARA GERAR PESSOAS E ITENS PARA UM EVENTO
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_event_data(
    p_event_id UUID,
    p_num_pessoas INTEGER,
    p_sport VARCHAR(50)
) RETURNS VOID AS $$
DECLARE
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
    v_event_date DATE;
    photo_count_base INTEGER;
BEGIN
    -- Buscar data do evento para calcular timestamps relativos
    SELECT e.event_date INTO v_event_date FROM events e WHERE e.id = p_event_id;
    
    -- Ajustar base de fotos por esporte
    CASE p_sport
        WHEN 'triathlon' THEN photo_count_base := 8;
        WHEN 'futebol' THEN photo_count_base := 6;
        WHEN 'vôlei' THEN photo_count_base := 5;
        ELSE photo_count_base := 4;
    END CASE;
    
    FOR i IN 1..p_num_pessoas LOOP
        person_uuid := gen_random_uuid();
        person_cpf := generate_random_cpf();
        
        -- Ajustar idade por esporte
        CASE p_sport
            WHEN 'triathlon' THEN person_age := 20 + FLOOR(RANDOM() * 45)::INTEGER;
            WHEN 'futebol' THEN person_age := 18 + FLOOR(RANDOM() * 35)::INTEGER;
            WHEN 'vôlei' THEN person_age := 16 + FLOOR(RANDOM() * 40)::INTEGER;
            ELSE person_age := 18 + FLOOR(RANDOM() * 50)::INTEGER;
        END CASE;
        
        -- Ajustar gênero por esporte
        CASE p_sport
            WHEN 'triathlon' THEN person_gender := CASE WHEN RANDOM() < 0.60 THEN 'M' ELSE 'F' END;
            WHEN 'futebol' THEN person_gender := CASE WHEN RANDOM() < 0.70 THEN 'M' ELSE 'F' END;
            WHEN 'vôlei' THEN person_gender := CASE WHEN RANDOM() < 0.45 THEN 'M' ELSE 'F' END;
            ELSE person_gender := CASE WHEN RANDOM() < 0.55 THEN 'M' ELSE 'F' END;
        END CASE;
        
        -- Inserir pessoa
        INSERT INTO event_persons (event_id, cpf, person_id, age, gender, photo_count, first_seen, last_seen, is_registered)
        VALUES (
            p_event_id,
            person_cpf,
            person_uuid,
            person_age,
            person_gender,
            photo_count_base + FLOOR(RANDOM() * 8)::INTEGER,
            (v_event_date::timestamp + (RANDOM() * INTERVAL '2 hours')),
            (v_event_date::timestamp + (RANDOM() * INTERVAL '2 hours') + INTERVAL '30 minutes'),
            TRUE
        );
        
        -- Número de itens varia por esporte
        CASE p_sport
            WHEN 'triathlon' THEN num_items := 3 + FLOOR(RANDOM() * 3)::INTEGER; -- 3-5 itens
            WHEN 'futebol' THEN num_items := 2 + FLOOR(RANDOM() * 3)::INTEGER; -- 2-4 itens
            WHEN 'vôlei' THEN num_items := 2 + FLOOR(RANDOM() * 3)::INTEGER; -- 2-4 itens
            ELSE num_items := 2 + FLOOR(RANDOM() * 4)::INTEGER; -- 2-5 itens
        END CASE;
        
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
            p_event_id,
            person_uuid,
            'tênis',
            selected_brand,
            product_name_val
        );
        
        -- Adicionar outros itens
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
            
            INSERT INTO person_items (event_id, person_id, product_type, brand, product_name)
            VALUES (p_event_id, person_uuid, selected_product_type, selected_brand, NULL)
            ON CONFLICT (event_id, person_id, product_type) DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. GERAR DADOS PARA CADA EVENTO
-- ============================================================================

DO $$
BEGIN
    -- Provas de Corrida (500-800 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440000', 500 + FLOOR(RANDOM() * 300)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440001', 300 + FLOOR(RANDOM() * 200)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440002', 400 + FLOOR(RANDOM() * 200)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440003', 250 + FLOOR(RANDOM() * 150)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440004', 350 + FLOOR(RANDOM() * 200)::INTEGER, 'corrida');

    -- Provas de Triathlon (150-300 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440005', 150 + FLOOR(RANDOM() * 150)::INTEGER, 'triathlon');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440006', 200 + FLOOR(RANDOM() * 100)::INTEGER, 'triathlon');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440007', 180 + FLOOR(RANDOM() * 120)::INTEGER, 'triathlon');

    -- Provas de Ciclismo (200-400 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440008', 200 + FLOOR(RANDOM() * 200)::INTEGER, 'ciclismo');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440009', 250 + FLOOR(RANDOM() * 150)::INTEGER, 'ciclismo');

    -- Provas de Vôlei (100-200 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440010', 100 + FLOOR(RANDOM() * 100)::INTEGER, 'vôlei');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440011', 120 + FLOOR(RANDOM() * 80)::INTEGER, 'vôlei');

    -- Provas de Futebol (150-300 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440012', 150 + FLOOR(RANDOM() * 150)::INTEGER, 'futebol');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440013', 180 + FLOOR(RANDOM() * 120)::INTEGER, 'futebol');

    -- Treinos de Corrida (50-150 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440014', 50 + FLOOR(RANDOM() * 100)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440015', 60 + FLOOR(RANDOM() * 90)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440016', 55 + FLOOR(RANDOM() * 95)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440017', 70 + FLOOR(RANDOM() * 80)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440018', 65 + FLOOR(RANDOM() * 85)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440019', 50 + FLOOR(RANDOM() * 100)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440020', 60 + FLOOR(RANDOM() * 90)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440021', 55 + FLOOR(RANDOM() * 95)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440022', 70 + FLOOR(RANDOM() * 80)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440023', 65 + FLOOR(RANDOM() * 85)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440024', 50 + FLOOR(RANDOM() * 100)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440025', 60 + FLOOR(RANDOM() * 90)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440026', 55 + FLOOR(RANDOM() * 95)::INTEGER, 'corrida');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440027', 70 + FLOOR(RANDOM() * 80)::INTEGER, 'corrida');

    -- Treinos de Triathlon (80-150 pessoas cada)
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440028', 80 + FLOOR(RANDOM() * 70)::INTEGER, 'triathlon');
    PERFORM generate_event_data('550e8400-e29b-41d4-a716-446655440029', 90 + FLOOR(RANDOM() * 60)::INTEGER, 'triathlon');
END $$;

-- ============================================================================
-- 7. ATUALIZAR CONTADORES NOS EVENTOS
-- ============================================================================

UPDATE events 
SET total_photos = (
    SELECT SUM(photo_count) 
    FROM event_persons 
    WHERE event_id = events.id
);

UPDATE events 
SET total_athletes_estimated = (
    SELECT COUNT(DISTINCT person_id) 
    FROM event_persons 
    WHERE event_id = events.id
);

-- ============================================================================
-- 9. ATUALIZAR VIEWS MATERIALIZADAS
-- ============================================================================

REFRESH MATERIALIZED VIEW CONCURRENTLY brand_event_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY product_event_summary;

-- ============================================================================
-- 10. QUERIES DE VALIDAÇÃO
-- ============================================================================

-- 10.1. Verificar total de eventos, pessoas e itens
SELECT 
    COUNT(DISTINCT e.id) as total_eventos,
    COUNT(DISTINCT ep.person_id) as total_pessoas,
    COUNT(DISTINCT pi.id) as total_itens
FROM events e
LEFT JOIN event_persons ep ON ep.event_id = e.id
LEFT JOIN person_items pi ON pi.event_id = e.id;

-- 10.2. Verificar distribuição por tipo de evento
SELECT 
    event_type,
    COUNT(*) as quantidade_eventos,
    SUM(total_athletes_estimated) as total_atletas
FROM events
GROUP BY event_type
ORDER BY event_type;

-- 10.3. Verificar distribuição por esporte
SELECT 
    sport,
    COUNT(*) as quantidade_eventos,
    SUM(total_athletes_estimated) as total_atletas
FROM events
GROUP BY sport
ORDER BY sport;

-- 10.4. Verificar distribuição temporal
SELECT 
    DATE_TRUNC('month', event_date) as mes,
    COUNT(*) as quantidade_eventos,
    SUM(total_athletes_estimated) as total_atletas
FROM events
GROUP BY DATE_TRUNC('month', event_date)
ORDER BY mes;

-- 10.5. Verificar distribuição geográfica
SELECT 
    event_location,
    COUNT(*) as quantidade_eventos,
    SUM(total_athletes_estimated) as total_atletas
FROM events
GROUP BY event_location
ORDER BY quantidade_eventos DESC;

-- 10.6. Verificar total de pessoas por evento
SELECT 
    e.event_name,
    e.event_type,
    e.sport,
    e.event_date,
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
GROUP BY e.id, e.event_name, e.event_type, e.sport, e.event_date
ORDER BY e.event_date;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
