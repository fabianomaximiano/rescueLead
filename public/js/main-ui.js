// public/js/main-ui.js
$(document).ready(function() {
    $('#formCaptura').on('submit', function(e) {
        e.preventDefault();
        const btn = $('#btnIniciar');
        btn.prop('disabled', true).text('Gravando...');

        $.ajax({
            // Sobe uma pasta e entra em scripts-php
            url: '../scripts-php/config_handler.php', 
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#statusArea').removeClass('d-none');
                $('#statusTexto').text('Pronto! O arquivo .env foi atualizado.');
                btn.text('Salvo!').addClass('btn-success');
            },
            error: function() {
                alert('Erro ao acessar o config_handler.php');
                btn.prop('disabled', false).text('Tentar Novamente');
            }
        });
    });
});