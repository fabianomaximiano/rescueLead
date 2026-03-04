$(document).ready(function() {
    $('#formCaptura').on('submit', function(e) {
        e.preventDefault();
        
        const btn = $('#btnIniciar');
        const status = $('#statusArea');
        
        btn.prop('disabled', true).text('Gravando Configurações...');
        
        $.ajax({
            url: 'config_handler.php',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                status.removeClass('d-none');
                $('#statusTexto').text('Configurações salvas! O motor Node.js já pode ser iniciado.');
                btn.text('Configurado!').addClass('btn-success');
            },
            error: function() {
                alert('Erro ao salvar configurações.');
                btn.prop('disabled', false).text('Tentar Novamente');
            }
        });
    });
});