
# 🚀 RescueLead

Sistema híbrido de **prospecção ativa de leads via Google Maps**.

O RescueLead automatiza a busca de empresas em um nicho e cidade específicos, captura dados relevantes e permite selecionar e salvar leads em um banco de dados local.

---

# 🧠 Como o sistema funciona

Fluxo completo do sistema:

```
Interface Web
     ↓
PHP Backend
     ↓
Node.js (Puppeteer)
     ↓
Google Maps
     ↓
Captura de empresas
     ↓
JSON
     ↓
Tabela de Leads
     ↓
Seleção do usuário
     ↓
SQLite Database
```

---

# 🛠️ Tecnologias Utilizadas

### Backend

* **Node.js**
* **Puppeteer**
* **puppeteer-extra**
* **puppeteer-extra-plugin-stealth**

### Backend Web

* **PHP**

### Banco de Dados

* **SQLite**

### Infraestrutura

* **Docker**
* **Docker Compose**

### Frontend

* **HTML**
* **Bootstrap**
* **JavaScript**

---

# 📂 Estrutura do Projeto

```
rescueLead/
│
├── database/
│   ├── rescue_lead.db
│   └── schema.sql
│
├── public/
│   ├── index.php
│   ├── leads.php
│   ├── style.css
│   └── js/
│       ├── main-ui.js
│       └── leads-ui.js
│
├── scripts-js/
│   └── engine.js
│
├── scripts-php/
│   ├── run_bot.php
│   ├── save_leads.php
│   ├── init_db.php
│   └── test_db.php
│
├── controle_diario.json
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

# ⚙️ Funcionalidades Implementadas

## Scraping Google Maps

* Busca por **nicho + cidade + bairro**
* Abertura automática do Google Maps
* Captura da lista lateral de empresas
* Scroll automático para carregar mais resultados
* Limite de captura configurado

Dados capturados atualmente:

* Nome da empresa
* Nota
* Bairro aproximado

---

# 🧠 Proteções do Scraper

Para evitar bloqueios do Google:

* Stealth Plugin
* Flags seguras do Chromium
* Execução em container
* **Limite diário de capturas**

```
Limite atual: 50 empresas por dia
```

Controle feito via:

```
controle_diario.json
```

---

# 🖥️ Interface Web

A interface permite:

* Inserir **nicho**
* Inserir **cidade**
* Inserir **bairro**
* Iniciar captura
* Visualizar leads encontrados
* Selecionar leads manualmente
* Salvar leads no banco

---

# 💾 Banco de Dados

Banco utilizado:

```
SQLite
```

Arquivo:

```
database/rescue_lead.db
```

Tabela principal:

```
leads
```

Campos principais:

* id
* nome_empresa
* nicho
* nota
* telefone
* site
* endereco_completo
* bairro
* cidade
* cep
* data_captura
* horario_captura
* status_contato

---

# 🧾 Inicialização do Banco

Para criar a estrutura do banco:

```bash
php scripts-php/init_db.php
```

Isso aplica automaticamente o:

```
database/schema.sql
```

---

# ▶️ Executando o Projeto

Subir ambiente Docker:

```bash
docker compose up -d
```

Acessar interface:

```
http://localhost:8080
```

---

# 🔎 Fluxo de Uso

1️⃣ Acesse a interface web
2️⃣ Informe:

```
Nicho
Cidade
Bairro
```

3️⃣ Clique em:

```
Iniciar Captura
```

4️⃣ O sistema irá:

* abrir Google Maps
* capturar empresas
* retornar resultados

5️⃣ Na tela de resultados:

* selecione os leads desejados
* clique em **Gravar Selecionados**

6️⃣ Leads serão salvos no banco.

---

# 📊 Status Atual do Projeto

### Infraestrutura

✔ Docker
✔ Node.js
✔ Puppeteer
✔ Chromium
✔ PHP backend

### Captura

✔ Google Maps scraping
✔ Scroll automático
✔ Limite diário

### Interface

✔ Formulário de busca
✔ Tabela de leads
✔ Seleção de leads
✔ Loading durante captura

### Persistência

✔ SQLite
✔ Schema estruturado
✔ Salvamento de leads

---

# 🚧 Próximas Melhorias

Melhorias planejadas:

### Scraping avançado

Capturar dentro da página da empresa:

* telefone
* endereço completo
* website
* categoria

### Dados e Qualificação

* filtro por nota mínima
* filtro por presença de telefone
* filtro por website

### Exportação

* Exportar CSV
* Exportar Excel

### Interface

* dashboard de leads salvos
* busca por cidade/nicho
* histórico de capturas

---

# 📈 Visão do Projeto

O RescueLead é um **MVP de ferramenta de geração de leads via Google Maps**, com potencial para evoluir para:

* ferramenta SaaS
* prospecção automatizada para vendas
* enriquecimento de dados de empresas

---

# ⚠️ Aviso

Este projeto utiliza scraping do Google Maps para fins educacionais e de desenvolvimento.

Uso comercial deve considerar:

* termos de serviço do Google
* limites de automação
* boas práticas de scraping.
