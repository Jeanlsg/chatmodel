-- Create table for Triages
create table if not exists public.triages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_name text,
  patient_age integer,
  patient_phone text,
  complaint text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'archived')),
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent'))
);

-- Create table for Messages within a Triage
create table if not exists public.triage_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  triage_id uuid references public.triages(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'bot', 'agent')),
  content text not null
);

-- Enable RLS (Row Level Security)
alter table public.triages enable row level security;
alter table public.triage_messages enable row level security;

-- Create policies (for development, allowing all access - PROD SHOULD BE STRICTER)
create policy "Enable read access for all users" on public.triages for select using (true);
create policy "Enable insert access for all users" on public.triages for insert with check (true);
create policy "Enable update access for all users" on public.triages for update using (true);

create policy "Enable read access for all users" on public.triage_messages for select using (true);
create policy "Enable insert access for all users" on public.triage_messages for insert with check (true);

-- Seed Data: Example Completed Triage
do $$
declare
  triage_id uuid;
begin
  insert into public.triages (patient_name, patient_age, patient_phone, complaint, status, priority)
  values ('João da Silva', 45, '5511999999999', 'Dor de cabeça forte e febre', 'completed', 'high')
  returning id into triage_id;

  insert into public.triage_messages (triage_id, sender, content)
  values 
    (triage_id, 'bot', 'Olá! Sou o Triagem-IA. Por favor, me diga seu nome completo e idade.'),
    (triage_id, 'user', 'João da Silva, 45 anos'),
    (triage_id, 'bot', 'Obrigado, João. O que você está sentindo?'),
    (triage_id, 'user', 'Estou com muita dor de cabeça e acho que estou com febre.'),
    (triage_id, 'bot', 'Entendi. Há quanto tempo você está com esses sintomas?'),
    (triage_id, 'user', 'Começou ontem a noite.');
end $$;
