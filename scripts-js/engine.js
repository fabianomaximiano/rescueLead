if (qualificados.length > 0) {
            const sqlite3 = require('sqlite3').verbose();
            // CORREÇÃO: Definindo o caminho absoluto para o banco dentro do contentor
            const dbPath = path.resolve(__dirname, '../database/rescue_lead.db');
            const db = new sqlite3.Database(dbPath);
            
            db.serialize(() => {
                const stmt = db.prepare("INSERT OR IGNORE INTO leads (nome, nota) VALUES (?, ?)");
                qualificados.forEach(lead => {
                    stmt.run(lead.nome, lead.nota);
                });
                stmt.finalize();
            });
            db.close();
            console.log("💾 Dados guardados com sucesso no banco de dados!");
        }