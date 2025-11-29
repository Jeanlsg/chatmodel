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

-- Insert sample data
INSERT INTO public.triage_records (patient_name, cpf, phone, symptoms, sintoma_febre, tipo_lesao_pele, detalhes_pele, sintoma_neurite, classificacao_ia, risk_level, status, wait_time)
VALUES
    ('João Silva', '123.456.789-00', '(11) 98765-4321', 'Dor torácica intensa', 'Sim, febre alta', 'Não, pele está normal', NULL, 'Não', 'Indeterminado', 'red', 'Atendimento Imediato', '00 min'),
    ('Maria Oliveira', '234.567.890-11', '(21) 99876-5432', 'Manchas vermelhas e febre', 'Sim, febre baixa/moderada', 'Sim, caroços novos', 'Ficaram muito vermelhas', 'Não', 'Cenário A', 'orange', 'Aguardando Médico', '05 min'),
    ('Pedro Santos', '345.678.901-22', '(31) 97654-3210', 'Dor no braço e perda de força', 'Não tenho febre', 'Não, pele está normal', NULL, 'Sim, dor insuportável / Perda de força', 'Cenário C', 'red', 'Em Espera', '25 min');
