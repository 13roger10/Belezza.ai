-- Belezza API - Migration V8
-- Seed initial data for development and testing

-- Create a demo salon for the admin user
INSERT INTO salons (
    nome, descricao, endereco, cidade, estado, cep, telefone,
    horario_abertura, horario_fechamento,
    intervalo_agendamento_minutos, antecedencia_minima_horas,
    cancelamento_minimo_horas, max_no_shows_permitidos,
    aceita_agendamento_online, ativo, admin_id,
    criado_em, atualizado_em
) SELECT
    'Belezza Studio Demo',
    'Salão de beleza demonstrativo para testes',
    'Rua das Flores, 123 - Centro',
    'São Paulo',
    'SP',
    '01001-000',
    '+5511999999999',
    '08:00',
    '20:00',
    30, 2, 2, 3,
    TRUE, TRUE, u.id,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM usuarios u WHERE u.email = 'admin@belezza.ai'
ON CONFLICT DO NOTHING;

-- Seed demo services
INSERT INTO servicos (nome, descricao, preco, duracao_minutos, tipo, salon_id, ativo, criado_em, atualizado_em)
SELECT
    s.nome, s.descricao, s.preco, s.duracao, s.tipo, sa.id, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM salons sa
CROSS JOIN (VALUES
    ('Corte Feminino', 'Corte de cabelo feminino com lavagem e secagem', 80.00, 60, 'CABELO'),
    ('Corte Masculino', 'Corte de cabelo masculino', 45.00, 30, 'CABELO'),
    ('Coloração', 'Coloração completa com produtos de qualidade', 150.00, 120, 'CABELO'),
    ('Escova Progressiva', 'Alisamento e tratamento capilar', 200.00, 180, 'CABELO'),
    ('Manicure', 'Manicure completa com esmaltação', 35.00, 45, 'UNHA'),
    ('Pedicure', 'Pedicure completa com esmaltação', 40.00, 50, 'UNHA'),
    ('Maquiagem Social', 'Maquiagem para eventos e festas', 120.00, 60, 'MAQUIAGEM'),
    ('Limpeza de Pele', 'Limpeza profunda com extração', 90.00, 75, 'ESTETICA'),
    ('Design de Sobrancelha', 'Design e modelagem de sobrancelha', 30.00, 20, 'SOBRANCELHA'),
    ('Barba', 'Corte e modelagem de barba', 35.00, 30, 'BARBA')
) AS s(nome, descricao, preco, duracao, tipo)
WHERE sa.nome = 'Belezza Studio Demo'
ON CONFLICT DO NOTHING;
