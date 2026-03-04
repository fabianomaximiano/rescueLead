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

        // --- 1. AGUARDAR O FEED APARECER ---
        console.log("⏳ Aguardando a lista de resultados carregar...");
        const feedSelector = 'div[role="feed"]';
        await page.waitForSelector(feedSelector, { timeout: 30000 });

        console.log("✅ Lista encontrada! Iniciando Scroll...");

        // --- 2. FUNÇÃO DE SCROLL ---
        await page.evaluate(async (sel) => {
            const feed = document.querySelector(sel);
            let totalLeads = 0;
            
            while (totalLeads < 50) {
                feed.scrollBy(0, 500);
                await new Promise(r => setTimeout(r, 2000));
                
                totalLeads = document.querySelectorAll('.Nv2Y8').length;
                if (document.body.innerText.includes("fim da lista")) break;
            }
        }, feedSelector);

        console.log("🏁 Scroll finalizado. Iniciando extração...");

        // --- 3. EXTRAÇÃO DE DADOS (DENTRO DO TRY) ---
        const leads = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.Nv2Y8'));
            
            return items.map(item => {
                const linkElement = item.querySelector('.hfpxzc');
                const nome = linkElement?.ariaLabel;
                const notaStr = item.querySelector('.MW4T7d')?.innerText;
                
                // Verifica presença de Website
                const temSite = !!item.querySelector('a[aria-label*="Website"], a[aria-label*="Site"]');
                
                return {
                    nome: nome || "N/A",
                    nota: parseFloat(notaStr?.replace(',', '.') || "0"),
                    semSite: !temSite
                };
            }).filter(lead => lead.semSite && lead.nota < 4.0 && lead.nota > 0); 
        });

        console.log(`🎯 Encontrados ${leads.length} leads potenciais (sem site e nota < 4.0):`);
        console.table(leads);

    } catch (error) {
        console.error("❌ Ocorreu um erro:", error.message);
    }
    // browser.close(); // Mantenha comentado para validar visualmente primeiro
}

run();