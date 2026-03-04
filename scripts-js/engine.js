const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config({ path: '../.env' });

puppeteer.use(StealthPlugin());

async function run() {
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--start-maximized'],
        defaultViewport: null 
    });

    try {
        const page = await browser.newPage();
        const busca = `${process.env.NICHO_ATUAL} em ${process.env.BAIRRO_ATUAL}, ${process.env.CIDADE_ATUAL}`;
        
        console.log(`🔎 Buscando: ${busca}`);
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(busca)}`, { 
            waitUntil: 'networkidle2' 
        });

        // --- AGUARDAR O FEED APARECER ---
        console.log("⏳ Aguardando a lista de resultados carregar...");
        const feedSelector = 'div[role="feed"]';
        await page.waitForSelector(feedSelector, { timeout: 30000 }); // Espera até 30 seg

        console.log("✅ Lista encontrada! Iniciando Scroll...");

        // --- FUNÇÃO DE SCROLL MELHORADA ---
        await page.evaluate(async (sel) => {
            const feed = document.querySelector(sel);
            let totalLeads = 0;
            
            while (totalLeads < 50) {
                feed.scrollBy(0, 500); // Rola 500 pixels
                await new Promise(r => setTimeout(r, 2000)); // Espera 2 seg para carregar novos
                
                totalLeads = document.querySelectorAll('.Nv2Y8').length;
                console.log(`Carregados: ${totalLeads}`);
                
                // Se encontrar o texto "Você chegou ao fim da lista", para.
                if (document.body.innerText.includes("fim da lista")) break;
            }
        }, feedSelector);

        console.log("🏁 Scroll finalizado com sucesso!");
        
    } catch (error) {
        console.error("❌ Ocorreu um erro inesperado:", error.message);
    }

    // REMOVI o browser.close() para você ver o resultado final parado na tela.
}

run();