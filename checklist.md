
# Checklist do Projeto RescueLead

## Estrutura do Projeto

* [x] Criar estrutura de pastas do projeto
* [x] Separar scripts Node (`scripts-js`) e PHP (`scripts-php`)
* [x] Criar pasta `public` para interface
* [x] Criar `.env` para configurações

---

# Ambiente Docker

* [x] Criar `Dockerfile`
* [x] Criar `docker-compose.yml`
* [x] Instalar Node.js no container
* [x] Instalar dependências do Puppeteer
* [x] Instalar Chromium no container
* [x] Configurar variável `PUPPETEER_EXECUTABLE_PATH`
* [x] Validar execução do Puppeteer dentro do container
* [x] Corrigir contexto de build com `.dockerignore`
* [x] Corrigir conflito de `node_modules` entre host e container

---

# Puppeteer / Motor de Captura

* [x] Instalar `puppeteer`
* [x] Instalar `puppeteer-extra`
* [x] Instalar `puppeteer-extra-plugin-stealth`
* [x] Criar `engine.js`
* [x] Abrir navegador com Puppeteer
* [x] Testar retorno JSON de teste
* [x] Ler parâmetros reais enviados pelo formulário
* [x] Montar URL dinâmica do Google Maps
* [x] Abrir busca real no Maps
* [x] Capturar lista inicial de empresas
* [x] Ajustar seletores do Google Maps
* [x] Retornar leads reais em JSON
* [x] Implementar scroll automático
* [x] Limitar captura diária para evitar bloqueio (50)

---

# Integração PHP ↔ Node

* [x] Criar `run_bot.php`
* [x] Executar `engine.js` via PHP
* [x] Receber JSON no PHP
* [x] Validar JSON retornado pelo Node
* [x] Tratar erros do motor no backend
* [x] Exibir resultados na interface web

---

# Interface Web

* [x] Criar formulário de busca
* [x] Criar página de resultados (`leads.php`)
* [x] Exibir leads em tabela
* [x] Permitir seleção de leads
* [x] Salvar leads capturados no `localStorage`
* [x] Renderizar leads reais na tabela de resultados
* [x] Corrigir leitura/renderização do `leads-ui.js`
* [x] Criar loading visual durante captura
* [x] Melhorar layout e experiência da tabela
* [x] Adicionar seleção múltipla de leads

---

# Fluxo Validado

* [x] Frontend envia `nicho`, `cidade` e `bairro`
* [x] PHP recebe e repassa para o Node
* [x] Node executa o Puppeteer
* [x] Google Maps retorna resultados
* [x] Leads são convertidos em JSON
* [x] JSON chega ao frontend
* [x] Leads são listados na página `leads.php`
* [x] Usuário seleciona leads
* [x] Leads selecionados são enviados para o backend

---

# Scraping do Google Maps

* [x] Implementar captura inicial da lista lateral
* [x] Implementar scroll automático
* [x] Capturar até 50 resultados por busca
* [x] Extrair:

  * [x] Nome da empresa
  * [x] Nota
  * [x] Bairro aproximado

---

# Banco de Dados

* [x] Criar banco SQLite
* [x] Criar tabela `leads`
* [x] Criar `schema.sql`
* [x] Criar `init_db.php`
* [x] Inicializar banco automaticamente
* [x] Criar `save_leads.php`
* [x] Salvar leads selecionados
* [x] Evitar duplicados
* [x] Validar conexão com banco

---

# Estabilidade do Bot

* [x] Ajustar flags do Chromium para Docker
* [x] Melhorar estabilidade com `--disable-dev-shm-usage`
* [x] Implementar limite diário de captura
* [ ] Ajustar delays automáticos
* [ ] Melhorar tratamento de timeout
* [ ] Melhorar tratamento de mudanças no DOM do Maps

---

# Exportação

* [ ] Exportar leads para Excel
* [ ] Exportar CSV

---

# Scraping Avançado (Próximos Passos)

* [ ] Abrir cada empresa individualmente
* [ ] Extrair telefone real
* [ ] Extrair endereço completo
* [ ] Extrair website
* [ ] Extrair categoria do negócio

---

# Git

* [x] Criar `.gitignore`
* [x] Ignorar `node_modules`
* [x] Ignorar `.env`
* [ ] Criar workflow de commits

---

# Status Atual do Projeto

Infraestrutura:

* [x] Docker
* [x] Node
* [x] Puppeteer
* [x] Chromium
* [x] PHP → Node

Captura:

* [x] Google Maps → JSON
* [x] Scroll automático
* [x] Limite diário

Interface:

* [x] Formulário
* [x] Página de resultados
* [x] Seleção de leads
* [x] Loading visual

Persistência:

* [x] SQLite
* [x] Schema aplicado
* [x] Salvamento de leads

Scraping atual:

* [x] Nome
* [x] Nota
* [x] Bairro aproximado

Scraping futuro:

* [ ] Telefone
* [ ] Endereço
* [ ] Website
