// public/js/main-ui.js
document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const statusDiv = document.getElementById('statusMessage');
    const formData = new FormData(e.target);

    // Estado de carregamento
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerText = "⏳ Gravando Configurações...";
    
    statusDiv.classList.remove('d-none', 'alert-success', 'alert-danger');
    statusDiv.classList.add('alert-info');
    statusDiv.innerText = "Comunicando com o servidor Docker...";

    try {
        const response = await fetch('../scripts-php/config_handler.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Falha no servidor');

        const result = await response.json();

        if (result.status === 'success') {
            statusDiv.className = "card-footer text-center alert-success text-success";
            statusDiv.innerText = "✅ Sucesso! O arquivo .env foi atualizado e o robô reiniciado.";
            e.target.reset();
        } else {
            throw new Error(result.message || 'Erro desconhecido');
        }

    } catch (error) {
        statusDiv.className = "card-footer text-center alert-danger text-danger";
        statusDiv.innerText = "❌ Erro: Não foi possível iniciar a captura.";
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerText = "Iniciar Captura";
    }
});