const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const MAX_LEADS = 50;
const MAX_SCROLLS = 12;
const controlePath = path.join(__dirname, '../controle_diario.json');

function log(mensagem) {
    process.stderr.write(`[engine] ${mensagem}\n`); // motivo: facilitar diagnóstico sem misturar com o JSON final
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min = 900, max = 1800) {
    const tempo = Math.floor(Math.random() * (max - min + 1)) + min;
    return delay(tempo); // motivo: reduzir padrão robótico no Maps
}

function verificarLimiteDiario() {
    const hoje = new Date().toISOString().slice(0, 10);

    if (!fs.existsSync(controlePath)) {
        fs.writeFileSync(controlePath, JSON.stringify({ data: hoje, total: 0 }, null, 2));
    }

    const dados = JSON.parse(fs.readFileSync(controlePath, 'utf8'));

    if (dados.data !== hoje) {
        const resetado = { data: hoje, total: 0 };
        fs.writeFileSync(controlePath, JSON.stringify(resetado, null, 2));
        return { permitido: true, total: 0 };
    }

    if (dados.total >= MAX_LEADS) {
        return { permitido: false, total: dados.total };
    }

    return { permitido: true, total: dados.total };
}

function registrarCaptura(qtd) {
    const hoje = new Date().toISOString().slice(0, 10);
    const dados = fs.existsSync(controlePath)
        ? JSON.parse(fs.readFileSync(controlePath, 'utf8'))
        : { data: hoje, total: 0 };

    if (dados.data !== hoje) {
        dados.data = hoje;
        dados.total = 0;
    }

    dados.total += qtd;
    fs.writeFileSync(controlePath, JSON.stringify(dados, null, 2));
}

async function iniciarCaptura() {
    const limite = verificarLimiteDiario();

    if (!limite.permitido) {
        process.stdout.write(JSON.stringify({
            error: 'Limite diário atingido',
            limite: MAX_LEADS
        }));
        return;
    }

    let browser;

    try {
        const nicho = (process.argv[2] || '').trim();
        const cidade = (process.argv[3] || '').trim();
        const bairro = (process.argv[4] || '').trim();

        if (!nicho || !cidade) {
            process.stdout.write(JSON.stringify({
                error: 'Parâmetros obrigatórios ausentes',
                detalhes: 'Informe pelo menos nicho e cidade'
            }));
            return;
        }

        const termoBusca = [nicho, bairro, cidade].filter(Boolean).join(' ');
        const urlBusca = `https://www.google.com/maps/search/${encodeURIComponent(termoBusca)}`;

        log(`Iniciando navegador para busca: ${termoBusca}`);

        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36'
        );

        log('Abrindo Google Maps');
        await page.goto(urlBusca, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        log('Aguardando lista lateral');
        await page.waitForSelector('div[role="feed"]', { timeout: 25000 });
        await delay(4000);

        const feedSelector = 'div[role="feed"]';

        log('Executando scroll automático');
        for (let i = 0; i < MAX_SCROLLS; i++) {
            await page.evaluate((selector) => {
                const feed = document.querySelector(selector);
                if (feed) {
                    feed.scrollBy(0, 1200);
                }
            }, feedSelector);

            await randomDelay(1000, 1800);
        }

        log('Retornando ao topo da lista');
        await page.evaluate((selector) => {
            const feed = document.querySelector(selector);
            if (feed) {
                feed.scrollTop = 0;
            }
        }, feedSelector);

        await delay(1500);

        log('Lendo cards do Maps');
        const empresas = await page.evaluate(() => {
            const resultados = [];
            const vistos = new Set();

            const cards = Array.from(document.querySelectorAll('div.Nv2PK, div[role="article"]'));

            const texto = (el) => el?.innerText?.trim() || null;

            const extrairNome = (card) => {
                return (
                    card.querySelector('a.hfpxzc')?.getAttribute('aria-label') ||
                    texto(card.querySelector('.qBF1Pd')) ||
                    texto(card.querySelector('.fontHeadlineSmall')) ||
                    null
                );
            };

            const extrairNota = (card) => {
                const direta = texto(card.querySelector('.MW4etd'));
                if (direta) return direta.replace(',', '.');

                const aria = card.querySelector('span[role="img"]')?.getAttribute('aria-label') || '';
                const match = aria.match(/(\d+[.,]?\d*)/);
                return match ? match[1].replace(',', '.') : null;
            };

            cards.forEach(card => {
                const nome = extrairNome(card);
                const nota = extrairNota(card);

                if (nome && !vistos.has(nome)) {
                    vistos.add(nome);

                    resultados.push({
                        nome_empresa: nome,
                        nota: nota,
                        telefone: null, // motivo: etapa de detalhe foi removida para estabilizar o motor
                        endereco: null, // motivo: etapa de detalhe foi removida para estabilizar o motor
                        bairro: null,   // motivo: heurística anterior estava inconsistente
                        site: null      // motivo: etapa de detalhe foi removida para estabilizar o motor
                    });
                }
            });

            return resultados;
        });

        const disponiveisHoje = Math.max(0, MAX_LEADS - limite.total);
        const capturados = empresas.slice(0, disponiveisHoje);

        log(`Empresas capturadas: ${capturados.length}`);

        if (!capturados.length) {
            process.stdout.write(JSON.stringify([]));
            return;
        }

        registrarCaptura(capturados.length);
        process.stdout.write(JSON.stringify(capturados));
    } catch (error) {
        process.stdout.write(JSON.stringify({
            error: 'Falha no motor Node',
            debug: error.message
        })); // motivo: devolver JSON válido para o frontend mesmo em erro
        log(`Erro: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
            log('Navegador fechado');
        }
    }
}

iniciarCaptura();