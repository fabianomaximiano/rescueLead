const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function iniciarCaptura() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {
        // --- Lógica de busca aqui ---
        // Exemplo de retorno simulado para teste:
        const resultados = [
            { nome_empresa: "Oficina do João", nota: 4.8, telefone: "11999999999", site: "http://joao.com", bairro: "Centro", cidade: "São Paulo" },
            { nome_empresa: "Mecânica Rápida", nota: 4.2, telefone: "11988888888", site: "", bairro: "Centro", cidade: "São Paulo" }
        ];

        // O console.log envia os dados para o PHP capturar
        console.log(JSON.stringify(resultados));
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

iniciarCaptura();