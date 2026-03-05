document.addEventListener('DOMContentLoaded', () => {
    // Simula o carregamento dos dados que o robô cuspiu (em um cenário real, viria via fetch)
    renderPreview();

    document.getElementById('checkAll').addEventListener('change', (e) => {
        document.querySelectorAll('.lead-check').forEach(c => c.checked = e.target.checked);
    });

    document.getElementById('btnSalvarExportar').addEventListener('click', salvarSelecionados);
});

let dadosTemporarios = []; // Armazena o que o robô achou antes de salvar

async function renderPreview() {
    const tbody = document.getElementById('previewBody');
    try {
        // Aqui chamamos o script PHP que executa o robô e traz o JSON
        const response = await fetch('../scripts-php/run_bot.php');
        dadosTemporarios = await response.json();

        if (dadosTemporarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-5">Nenhum resultado encontrado para este filtro.</td></tr>';
            return;
        }

        tbody.innerHTML = dadosTemporarios.map((item, index) => `
            <tr>
                <td><input type="checkbox" class="lead-check" value="${index}"></td>
                <td><strong>${item.nome_empresa}</strong></td>
                <td><span class="badge badge-warning">${item.nota} ⭐</span></td>
                <td>${item.telefone || 'N/A'}</td>
                <td><small>${item.cidade} / ${item.bairro}</small></td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-5">Erro ao comunicar com o robô.</td></tr>';
    }
}

async function salvarSelecionados() {
    const selecionados = Array.from(document.querySelectorAll('.lead-check:checked'))
        .map(cb => dadosTemporarios[cb.value]);

    if (selecionados.length === 0) {
        alert("Selecione ao menos um item para salvar!");
        return;
    }

    // Envia apenas os selecionados para gravar no banco e gerar o Excel
    const response = await fetch('../scripts-php/save_and_export.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selecionados)
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_qualificados.csv';
        document.body.appendChild(a);
        a.click();
        alert("✅ Dados salvos no banco e Excel gerado!");
    }
}