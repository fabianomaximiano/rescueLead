document.getElementById('formCaptura').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = "Buscando no Google Maps...";

    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('../scripts-php/run_bot.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Armazena os dados temporariamente e redireciona
        localStorage.setItem('temp_leads', JSON.stringify(data));
        window.location.href = 'leads.php';
        
    } catch (err) {
        alert("Erro ao executar robô: " + err.message);
        btn.disabled = false;
        btn.innerText = "Iniciar Captura";
    }
});