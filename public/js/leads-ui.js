document.addEventListener('DOMContentLoaded', () => {
    loadLeads();

    // Lógica para selecionar todos
    document.getElementById('selectAll').addEventListener('change', (e) => {
        document.querySelectorAll('.lead-checkbox').forEach(cb => cb.checked = e.target.checked);
    });

    // Lógica de Exportação
    document.getElementById('btnExport').addEventListener('click', exportToExcel);
});

async function loadLeads() {
    const tbody = document.getElementById('leadsTableBody');
    try {
        const response = await fetch('../scripts-php/get_leads.php');
        const leads = await response.json();

        if (!leads.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Nenhum lead encontrado.</td></tr>';
            return;
        }

        tbody.innerHTML = leads.map(lead => `
            <tr>
                <td><input type="checkbox" class="lead-checkbox" value="${lead.id}"></td>
                <td><strong>${lead.nome}</strong></td>
                <td><span class="badge badge-warning text-dark">${lead.nota} ⭐</span></td>
                <td class="text-center text-muted small">#${lead.id}</td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Erro ao carregar banco de dados.</td></tr>`;
    }
}

function exportToExcel() {
    const selectedIds = Array.from(document.querySelectorAll('.lead-checkbox:checked')).map(cb => cb.value);

    if (selectedIds.length === 0) {
        alert("Por favor, selecione pelo menos um lead para exportar.");
        return;
    }

    // Criamos um formulário oculto para enviar os IDs via POST e baixar o arquivo
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '../scripts-php/excel-gen.php';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'ids';
    input.value = JSON.stringify(selectedIds);

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}