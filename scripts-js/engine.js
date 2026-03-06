// scripts-js/engine.js

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function iniciarCaptura() {
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

        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium', // fallback caso a ENV não carregue
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // melhora estabilidade do Chromium no Docker
                '--disable-gpu' // reduz falhas gráficas em ambiente headless
            ]
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });

        await page.setUserAgent(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36'
        );

        await page.goto(urlBusca, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await page.waitForSelector('div[role="feed"]', { timeout: 25000 }); // mantém espera da lista lateral do Maps
        await new Promise(resolve => setTimeout(resolve, 5000)); // pequena pausa para renderização inicial

        const feedSelector = 'div[role="feed"]';

        // scroll adicionado para forçar o Maps a renderizar melhor os cards antes da leitura
        await page.evaluate(async (selector) => {
            const feed = document.querySelector(selector);
            if (!feed) return;

            for (let i = 0; i < 6; i++) {
                feed.scrollTop += 1200;
                await new Promise(resolve => setTimeout(resolve, 1200));
            }

            feed.scrollTop = 0;
            await new Promise(resolve => setTimeout(resolve, 1500));
        }, feedSelector);

        // espera flexível: o Maps alterna entre Nv2PK e role=article dependendo da renderização
        await page.waitForFunction(() => {
            return document.querySelectorAll('div.Nv2PK, div[role="article"], a.hfpxzc').length > 0;
        }, { timeout: 20000 });

        const empresas = await page.evaluate(() => {
            const resultados = [];
            const vistos = new Set();

            // seletor ampliado porque o DOM do Maps varia bastante
            const cards = Array.from(document.querySelectorAll('div.Nv2PK, div[role="article"]'));

            const extrairTexto = (el) => {
                return el?.innerText?.trim() || null;
            };

            const extrairNota = (card) => {
                const notaDireta = extrairTexto(card.querySelector('.MW4etd'));
                if (notaDireta) return notaDireta;

                const roleImg = card.querySelector('span[role="img"]')?.getAttribute('aria-label') || '';
                const match = roleImg.match(/(\d+[.,]?\d*)/);
                return match ? match[1].replace(',', '.') : null;
            };

            const extrairNome = (card) => {
                return (
                    card.querySelector('a.hfpxzc')?.getAttribute('aria-label') ||
                    extrairTexto(card.querySelector('.qBF1Pd')) ||
                    extrairTexto(card.querySelector('.fontHeadlineSmall')) ||
                    extrairTexto(card.querySelector('[aria-label][href*="/maps/place/"]')) ||
                    null
                );
            };

            const extrairBairro = (card) => {
                const texto = extrairTexto(card);
                if (!texto) return null;

                const linhas = texto
                    .split('\n')
                    .map(l => l.trim())
                    .filter(Boolean);

                // heurística: tenta encontrar linha com bairro/região sem pegar nome/nota
                const candidata = linhas.find(l =>
                    !l.includes('★') &&
                    !/^\d+[.,]?\d*$/.test(l) &&
                    l.length > 2 &&
                    l.length < 80
                );

                return candidata || null;
            };

            cards.forEach(card => {
                const nome = extrairNome(card);
                const nota = extrairNota(card);
                const bairro = extrairBairro(card);

                if (nome && !vistos.has(nome)) {
                    vistos.add(nome);

                    resultados.push({
                        nome_empresa: nome,
                        nota: nota,
                        telefone: null, // telefone ficará para a próxima etapa, quando abrirmos cada empresa
                        bairro: bairro
                    });
                }
            });

            // fallback extra: se cards não vierem completos, tenta capturar nomes direto dos links
            if (!resultados.length) {
                const links = Array.from(document.querySelectorAll('a.hfpxzc'));

                links.forEach(link => {
                    const nome = link.getAttribute('aria-label') || link.innerText?.trim() || null;

                    if (nome && !vistos.has(nome)) {
                        vistos.add(nome);

                        resultados.push({
                            nome_empresa: nome,
                            nota: null,
                            telefone: null,
                            bairro: null
                        });
                    }
                });
            }

            return resultados;
        });

        if (!empresas.length) {
            process.stdout.write(JSON.stringify([{
                nome_empresa: 'Nenhum resultado capturado',
                nota: null,
                telefone: null,
                bairro: null
            }]));
            return;
        }

        process.stdout.write(JSON.stringify(empresas));
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