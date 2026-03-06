// public/js/main-ui.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCaptura');
    const btn = document.getElementById('btnIniciar');
    const erroMensagem = document.getElementById('erroMensagem');
    const erroTexto = document.getElementById('erroTexto');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingTitulo = document.getElementById('loadingTitulo');
    const loadingTexto = document.getElementById('loadingTexto');

    let intervaloStatus = null;

    const etapasLoading = [
        {
            titulo: 'Preparando captura...',
            texto: 'Estamos iniciando o robô e conectando ao Google Maps.'
        },
        {
            titulo: 'Abrindo Google Maps...',
            texto: 'O robô está acessando o ambiente de pesquisa.'
        },
        {
            titulo: 'Buscando empresas...',
            texto: 'Estamos localizando resultados relevantes para sua consulta.'
        },
        {
            titulo: 'Processando leads...',
            texto: 'Estamos organizando os dados encontrados para exibir na tabela.'
        }
    ];

    function mostrarErro(mensagem) {
        erroTexto.textContent = mensagem;
        erroMensagem.style.display = 'block';
        erroMensagem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function esconderErro() {
        erroTexto.textContent = '';
        erroMensagem.style.display = 'none';
    }

    function iniciarLoading() {
        let indice = 0;

        loadingTitulo.textContent = etapasLoading[0].titulo;
        loadingTexto.textContent = etapasLoading[0].texto;
        loadingOverlay.classList.add('ativo'); // alterado: loading só aparece após envio do formulário
        loadingOverlay.setAttribute('aria-hidden', 'false');

        intervaloStatus = setInterval(() => {
            indice = (indice + 1) % etapasLoading.length;
            loadingTitulo.textContent = etapasLoading[indice].titulo;
            loadingTexto.textContent = etapasLoading[indice].texto;
        }, 2200);
    }

    function pararLoading() {
        if (intervaloStatus) {
            clearInterval(intervaloStatus);
            intervaloStatus = null;
        }

        loadingOverlay.classList.remove('ativo');
        loadingOverlay.setAttribute('aria-hidden', 'true');
    }

    esconderErro();
    pararLoading(); // alterado: garante que o overlay fique escondido no carregamento inicial

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        esconderErro();

        btn.disabled = true;
        btn.innerText = 'Capturando...';
        iniciarLoading();

        const formData = new FormData(form);

        try {
            const response = await fetch('../scripts-php/run_bot.php', {
                method: 'POST',
                body: formData
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error('Resposta inválida do servidor.');
            }

            if (!response.ok) {
                throw new Error(data.error || data.debug || 'Falha ao processar a captura.');
            }

            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem('leads', JSON.stringify(data));
            localStorage.setItem('ultimoNicho', formData.get('nicho') || ''); // alterado: guarda nicho da última busca para gravação no banco
            localStorage.setItem('ultimaCidade', formData.get('cidade') || ''); // alterado: guarda cidade da última busca para gravação no banco
            localStorage.setItem('ultimoBairro', formData.get('bairro') || ''); // alterado: guarda bairro da última busca para uso futuro

            loadingTitulo.textContent = 'Concluído!';
            loadingTexto.textContent = 'Leads encontrados. Redirecionando para a tela de resultados...';

            setTimeout(() => {
                window.location.href = 'leads.php';
            }, 900);
        } catch (error) {
            pararLoading();
            mostrarErro(error.message || 'Ocorreu um erro inesperado.');
            btn.disabled = false;
            btn.innerText = 'Iniciar Captura';
        }
    });
});