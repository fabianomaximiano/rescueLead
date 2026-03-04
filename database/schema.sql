CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_empresa TEXT NOT NULL,
    nicho TEXT,
    nota REAL,
    telefone TEXT,
    site TEXT,
    endereco_completo TEXT,
    bairro TEXT,
    cidade TEXT,
    cep TEXT,
    data_captura DATE DEFAULT CURRENT_DATE,
    horario_captura TIME DEFAULT CURRENT_TIME,
    status_contato TEXT DEFAULT 'Pendente'
);