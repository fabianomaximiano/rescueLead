// scripts-js/engine.js

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs'); // NOVO: usado para controle do limite diário
const path = require('path');

puppeteer.use(StealthPlugin());

const LIMITE_DIARIO = 50; // NOVO: limite de segurança contra bloqueio

const controlePath = path.join(__dirname, '../controle_diario.json'); // NOVO: arquivo simples de controle

function verificarLimiteDiario() {
    const hoje = new Date().toISOString().slice(0, 10);

    if (!fs.existsSync(controlePath)) {
        fs.writeFileSync(controlePath, JSON.stringify({ data: hoje, total: 0 }));
    }

    const dados = JSON.parse(fs.readFileSync(controlePath));

    if (dados.data !== hoje) {
        fs.writeFileSync(controlePath, JSON.stringify({ data: hoje, total: 0 }));
        return { permitido: true, total: 0 };
    }

    if (dados.total >= LIMITE_DIARIO) {
        return { permitido: false, total: dados.total };
    }

    return { permitido: true, total: dados.total };
}

function registrarCaptura(qtd) {
    const dados = JSON.parse(fs.readFileSync(controlePath));
    dados.total += qtd;
    fs.writeFileSync(controlePath, JSON.stringify(dados));
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function iniciarCaptura() {

    const limite = verificarLimiteDiario(); // NOVO: verifica limite

    if (!limite.permitido) {
        process.stdout.write(JSON.stringify({
            error: "Limite diário atingido",
            limite: LIMITE_DIARIO
        }));
        return;
    }

    let browser;

    try {

        const nicho = process.argv[2] || '';
        const cidade = process.argv[3] || '';
        const bairro = process.argv[4] || '';

        const termoBusca = [nicho, bairro, cidade].filter(Boolean).join(' ');

        const url = `https://www.google.com/maps/search/${encodeURIComponent(termoBusca)}`;

        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // melhora estabilidade no Docker
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await page.waitForSelector('div[role="feed"]');

        await delay(4000);

        const feedSelector = 'div[role="feed"]';

        // NOVO: scroll automático para carregar mais empresas
        await page.evaluate(async (selector) => {

            const feed = document.querySelector(selector);

            if (!feed) return;

            let scrollCount = 0;

            while (scrollCount < 20) { // limite de scrolls para evitar loop infinito

                feed.scrollTop += 1200;

                await new Promise(r => setTimeout(r, 1200));

                scrollCount++;

            }

        }, feedSelector);

        await delay(2000);

        const empresas = await page.evaluate(() => {

            const resultados = [];

            const cards = document.querySelectorAll('div.Nv2PK');

            cards.forEach(card => {

                const nome =
                    card.querySelector('.qBF1Pd')?.innerText ||
                    card.querySelector('a.hfpxzc')?.getAttribute('aria-label') ||
                    null;

                const nota =
                    card.querySelector('.MW4etd')?.innerText ||
                    null;

                const texto = card.innerText || '';

                const linhas = texto.split('\n');

                const bairro = linhas.find(l => l.length > 3 && l.length < 80) || null;

                if (nome) {
                    resultados.push({
                        nome_empresa: nome,
                        nota: nota,
                        telefone: null,
                        bairro: bairro
                    });
                }

            });

            return resultados;

        });

        const capturados = empresas.slice(0, LIMITE_DIARIO - limite.total); // NOVO: respeita limite diário

        registrarCaptura(capturados.length); // NOVO: registra captura no controle diário

        process.stdout.write(JSON.stringify(capturados));

    } catch (error) {

        process.stderr.write(JSON.stringify({
            error: error.message,
            stack: error.stack
        }));

    } finally {

        if (browser) {
            await browser.close();
        }

    }

}

iniciarCaptura();