# Usa uma imagem oficial do Node.js estável
FROM node:20-slim

# Instala as dependências necessárias para rodar o Chromium no Linux
# Isso é essencial para o Puppeteer não falhar ao iniciar
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências (incluindo puppeteer-extra e sqlite3)
# O comando 'rebuild' garante que o sqlite3 seja compilado para Linux, 
# corrigindo o erro de "invalid ELF header"
RUN npm install && npm rebuild sqlite3

# Copia o restante dos arquivos do projeto
COPY . .

# Cria a pasta de banco de dados e garante permissão de escrita
RUN mkdir -p /app/database && chmod -R 777 /app/database

# Comando para rodar o robô
# Aponta para o caminho correto baseado na sua estrutura: scripts-js/engine.js
CMD ["node", "scripts-js/engine.js"]