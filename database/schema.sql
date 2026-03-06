DROP TABLE IF EXISTS leads; -- alterado: recria a tabela do zero porque o banco ainda está vazio

CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_empresa TEXT NOT NULL,
    nicho TEXT NOT NULL,
    nota REAL CHECK (nota IS NULL OR (nota >= 0 AND nota <= 5)),
    telefone TEXT,
    site TEXT,
    endereco_completo TEXT,
    bairro TEXT,
    cidade TEXT NOT NULL,
    cep TEXT,
    data_captura DATE NOT NULL DEFAULT CURRENT_DATE,
    horario_captura TIME NOT NULL DEFAULT CURRENT_TIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- alterado: facilita auditoria/ordenação
    status_contato TEXT NOT NULL DEFAULT 'Pendente'
        CHECK (status_contato IN ('Pendente', 'Em contato', 'Respondido', 'Descartado')),
    observacoes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_cidade
    ON leads (cidade);

CREATE INDEX IF NOT EXISTS idx_leads_status
    ON leads (status_contato);

CREATE INDEX IF NOT EXISTS idx_leads_data
    ON leads (data_captura, horario_captura);

CREATE INDEX IF NOT EXISTS idx_leads_nome
    ON leads (nome_empresa);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_unique_com_endereco
    ON leads (
        lower(trim(nome_empresa)),
        lower(trim(cidade)),
        lower(trim(endereco_completo))
    )
    WHERE endereco_completo IS NOT NULL AND trim(endereco_completo) <> '';