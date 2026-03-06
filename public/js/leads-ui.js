document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('previewBody');
    const selectAll = document.getElementById('selectAll');
    const contadorLeads = document.getElementById('contadorLeads');
    const btnSalvar = document.getElementById('btnSalvar');

    if (!tbody) {
        console.error('previewBody não encontrado'); // alterado: evita falha silenciosa se o HTML mudar
        return;
    }

    let leads = [];

    try {
        leads = JSON.parse(localStorage.getItem('leads') || '[]');
    } catch (error) {
        console.error('Erro ao ler leads do localStorage:', error);
        leads = [];
    }

    tbody.innerHTML = '';

    if (!Array.isArray(leads) || leads.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center p-4">
                    Nenhum lead encontrado
                </td>
            </tr>
        `;

        if (contadorLeads) {
            contadorLeads.textContent = '0 leads';
        }

        return;
    }

    if (contadorLeads) {
        contadorLeads.textContent = `${leads.length} ${leads.length === 1 ? 'lead' : 'leads'}`;
    }

    const normalizarSite = (site) => {
        if (!site) return null;

        const siteLimpo = String(site).trim();

        if (!siteLimpo) return null;

        if (siteLimpo.startsWith('http://') || siteLimpo.startsWith('https://')) {
            return siteLimpo;
        }

        return `https://${siteLimpo}`; // alterado: garante link clicável mesmo sem protocolo
    };

    const escaparHtml = (valor) => {
        return String(valor)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    leads.forEach((lead, index) => {
        const tr = document.createElement('tr');

        const nomeEmpresa = lead.nome_empresa || '-';
        const nota = lead.nota || null;
        const telefone = lead.telefone || 'Sem telefone';
        const endereco = lead.endereco || '-';
        const bairro = lead.bairro || '-';
        const siteOriginal = lead.site || null;
        const siteUrl = normalizarSite(siteOriginal);

        tr.innerHTML = `
            <td class="text-center align-middle">
                <input type="checkbox" class="lead-check" data-index="${index}">
            </td>

            <td class="align-middle font-weight-semibold">
                ${escaparHtml(nomeEmpresa)}
            </td>

            <td class="align-middle">
                ${
                    nota
                        ? `<span style="display:inline-flex; align-items:center; gap:4px; white-space:nowrap;">
                               <span>${escaparHtml(nota)}</span>
                               <span style="color:#f4b400;">⭐</span>
                           </span>`
                        : 'N/A'
                }
            </td>

            <td class="align-middle">
                ${escaparHtml(telefone)}
            </td>

            <td class="align-middle">
                ${escaparHtml(endereco)}
            </td>

            <td class="align-middle">
                ${escaparHtml(bairro)}
            </td>

            <td class="align-middle">
                ${
                    siteUrl
                        ? `<a href="${escaparHtml(siteUrl)}" target="_blank" rel="noopener noreferrer">
                               ${escaparHtml(siteOriginal)}
                           </a>`
                        : '-'
                }
            </td>
        `;

        tbody.appendChild(tr);
    });

    if (selectAll) {
        selectAll.addEventListener('change', function () {
            const checks = document.querySelectorAll('.lead-check');
            checks.forEach((check) => {
                check.checked = this.checked;
            });
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener('click', async () => {
            const selecionados = Array.from(document.querySelectorAll('.lead-check:checked'))
                .map((check) => leads[Number(check.dataset.index)])
                .filter(Boolean);

            if (!selecionados.length) {
                alert('Selecione pelo menos um lead para gravar.');
                return;
            }

            const ultimoNicho = localStorage.getItem('ultimoNicho') || ''; // alterado: envia nicho da última busca para o banco
            const ultimaCidade = localStorage.getItem('ultimaCidade') || ''; // alterado: envia cidade da última busca para o banco

            if (!ultimoNicho || !ultimaCidade) {
                alert('Nicho ou cidade da última busca não encontrados.');
                return;
            }

            btnSalvar.disabled = true;
            btnSalvar.textContent = 'Gravando...'; // alterado: feedback visual durante a gravação

            try {
                const response = await fetch('../scripts-php/save_leads.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        leads: selecionados,
                        nicho: ultimoNicho,
                        cidade: ultimaCidade
                    })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Falha ao gravar leads.');
                }

                localStorage.setItem('leadsSelecionados', JSON.stringify(selecionados));

                alert(`Gravação concluída. Inseridos: ${data.inseridos}. Ignorados: ${data.ignorados}.`);
            } catch (error) {
                alert(error.message || 'Erro ao gravar leads.');
            } finally {
                btnSalvar.disabled = false;
                btnSalvar.textContent = 'Gravar Selecionados';
            }
        });
    }
});