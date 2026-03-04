const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config({ path: '../.env' }); // 

puppeteer.use(StealthPlugin());

async function run() {
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--start-maximized'],
        defaultViewport: null 
    });

    try {
        const page = await browser.newPage();
        
        // Carrega variáveis do .env
        const nicho = process.env.NICHO_ATUAL;
        const cidade = process.env.CIDADE_ATUAL;
        const bairro = process.env.BAIRRO_ATUAL;
        
        const busca = `${nicho} em ${bairro}, ${cidade}`;
        console.log(`🔎 Iniciando busca: ${busca}`);

        // URL corrigida
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(busca)}`, { 
            waitUntil: 'networkidle2' 
        });

        // --- 1. AGUARDAR O FEED APARECER ---
        const feedSelector = 'div[role="feed"]';
        await page.waitForSelector(feedSelector, { timeout: 30000 });
        console.log("✅ Lista encontrada! Iniciando Scroll...");

        // --- 2. FUNÇÃO DE SCROLL AUTOMÁTICO ---
        await page.evaluate(async (sel) => {
            const feed = document.querySelector(sel);
            let lastHeight = 0;
            
            while (true) {
                feed.scrollBy(0, 1000);
                await new Promise(r => setTimeout(r, 2000));
                
                if (feed.scrollHeight === lastHeight) break;
                lastHeight = feed.scrollHeight;
                
                if (document.querySelectorAll('.Nv2Y8').length >= 50) break;
            }
        }, feedSelector);

        console.log("🏁 Scroll finalizado. Extraindo dados filtrados...");

        // --- 3. EXTRAÇÃO DE DADOS ---
        const leads = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.Nv2Y8'));
            
            return items.map(item => {
                const linkElement = item.querySelector('.hfpxzc');
                const nome = linkElement?.ariaLabel;
                const notaStr = item.querySelector('.MW4T7d')?.innerText;
                
                // Verifica presença de site
                const temSite = !!item.querySelector('a[aria-label*="Website"], a[aria-label*="Site"]');
                
                return {
                    nome: nome || "N/A",
                    nota: parseFloat(notaStr?.replace(',', '.') || "0"),
                    semSite: !temSite
                };
            }).filter(lead => lead.semSite && lead.nota < 4.0 && lead.nota > 0);
        });

        console.log(`🎯 Sucesso! Encontrados ${leads.length} leads potenciais:`);
        console.table(leads);

    } catch (error) {
        console.error("❌ Erro na execução:", error.message);
    }
    // O navegador permanece aberto para inspeção
}

run();