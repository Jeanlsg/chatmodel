-- Create the table for triage records
-- We are dropping the table to ensure the schema is updated correctly for this development phase.
-- In a real production environment, we would use ALTER TABLE.
DROP TABLE IF EXISTS public.triage_records;

CREATE TABLE IF NOT EXISTS public.triage_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_name TEXT NOT NULL,
    cpf TEXT,
    phone TEXT,
    symptoms TEXT, -- General symptoms or summary
    sintoma_febre TEXT,
    tipo_lesao_pele TEXT,
    detalhes_pele TEXT,
    sintoma_neurite TEXT,
    classificacao_ia TEXT, -- 'Cenário A', 'Cenário B', 'Cenário C', or 'Indeterminado'
    risk_level TEXT CHECK (risk_level IN ('red', 'orange', 'yellow', 'green', 'blue')),
    status TEXT DEFAULT 'Aguardando',
    wait_time TEXT DEFAULT '0 min',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.triage_records ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read/write (for development purposes)
CREATE POLICY "Enable read access for all users" ON public.triage_records
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.triage_records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.triage_records
    FOR UPDATE USING (true);

-- Insert sample data covering all scenarios and risk levels

INSERT INTO public.triage_records (patient_name, cpf, phone, symptoms, sintoma_febre, tipo_lesao_pele, detalhes_pele, sintoma_neurite, classificacao_ia, risk_level, status, wait_time)
VALUES
    -- CENÁRIO C: EMERGÊNCIA NEURAL (RED)
    ('Carlos Mendes', '111.222.333-44', '(11) 91111-1111', 'Dor insuportável no braço e perda de força', 'Não tenho febre', 'Não, pele está normal', NULL, 'Sim, dor insuportável / Perda de força', 'Cenário C (Neurite Aguda)', 'red', 'Atendimento Imediato', '00 min'),
    
    -- CENÁRIO A: REAÇÃO TIPO 2 (ORANGE)
    ('Ana Souza', '222.333.444-55', '(21) 92222-2222', 'Febre alta e caroços novos dolorosos', 'Sim, febre alta (> 38°C)', 'Sim, apareceram caroços novos', 'Estão quentes ao tocar, Doem espontaneamente', 'Não', 'Cenário A (Reação Tipo 2)', 'orange', 'Aguardando Médico', '05 min'),
    
    -- CENÁRIO B: REAÇÃO TIPO 1 (YELLOW)
    ('Roberto Lima', '333.444.555-66', '(31) 93333-3333', 'Manchas antigas ficaram vermelhas e inchadas', 'Não tenho febre', 'Sim, manchas antigas mudaram', 'Ficaram muito vermelhas, Estão inchadas (alto relevo)', 'Não', 'Cenário B (Reação Tipo 1)', 'yellow', 'Em Espera', '15 min'),
    
    -- CENÁRIO C: NEURITE MODERADA (YELLOW/ORANGE - Example variation)
    ('Fernanda Costa', '444.555.666-77', '(41) 94444-4444', 'Formigamento constante na mão', 'Não tenho febre', 'Não, pele está normal', NULL, 'Sim, dor moderada / Formigamento', 'Cenário C (Neurite Aguda)', 'orange', 'Aguardando', '10 min'),

    -- CENÁRIO A: REAÇÃO TIPO 2 LEVE (YELLOW - Example variation)
    ('Lucas Pereira', '555.666.777-88', '(51) 95555-5555', 'Febre baixa e alguns caroços', 'Sim, febre baixa/moderada', 'Sim, apareceram caroços novos', 'Doem apenas ao tocar', 'Não', 'Cenário A (Reação Tipo 2)', 'yellow', 'Em Espera', '20 min'),

    -- SEM RISCO IMEDIATO (GREEN)
    ('Mariana Santos', '666.777.888-99', '(61) 96666-6666', 'Manchas na pele sem dor ou febre', 'Não tenho febre', 'Sim, manchas antigas mudaram', 'Nenhuma das opções', 'Não', 'Indeterminado', 'green', 'Fila Básica', '45 min'),

    -- SEM RISCO IMEDIATO (BLUE)
    ('Paulo Oliveira', '777.888.999-00', '(71) 97777-7777', 'Renovação de receita', 'Não tenho febre', 'Não, pele está normal', NULL, 'Não', 'Indeterminado', 'blue', 'Triagem Concluída', '1h 00m'),
    
    -- CASO COMPLEXO (RED - Multiple symptoms)
    ('Julia Rocha', '888.999.000-11', '(81) 98888-8888', 'Febre alta, caroços e dor neural intensa', 'Sim, febre alta (> 38°C)', 'Sim, apareceram caroços novos', 'Estão quentes ao tocar', 'Sim, dor insuportável / Perda de força', 'Cenário C (Neurite Aguda)', 'red', 'Atendimento Imediato', '00 min');
