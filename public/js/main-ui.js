document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('formCaptura');
    const btn = document.getElementById('btnIniciar');

    form.addEventListener('submit', async function (e) {

        e.preventDefault();

        btn.disabled = true;
        btn.innerText = 'Capturando...';

        const formData = new FormData(form);

        try {

            const response = await fetch('../scripts-php/run_bot.php', {
                method: 'POST',
                body: formData
            });

            // alteração: primeiro pegamos texto para evitar quebra se vier HTML
            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (err) {

                // alteração: mostra erro real retornado pelo servidor
                throw new Error('Resposta inválida do servidor:\n\n' + text);
            }

            if (data.error) {
                throw new Error(data.error);
            }

            // salva dados no localStorage para usar na tela de leads
            localStorage.setItem('leads', JSON.stringify(data));

            // redireciona para página de resultados
            window.location.href = 'leads.php';

        } catch (error) {

            alert(error.message);

        } finally {

            btn.disabled = false;
            btn.innerText = 'Iniciar Captura';

        }

    });

});