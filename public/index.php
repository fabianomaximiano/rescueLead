<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>RescueLead | Painel de Controle</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light">
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div id="erroMensagem" class="alert alert-danger shadow-sm mb-4">
                <strong>⚠️ Erro:</strong> <span id="erroTexto"></span>
            </div>
            <div class="card shadow border-0">
                <div class="card-header bg-primary text-white text-center py-3">
                    <h3 class="mb-0">🚀 Captura de Leads</h3>
                </div>
                <div class="card-body p-4">
                    <form id="formCaptura">
                        <div class="form-group">
                            <label>Nicho</label>
                            <input type="text" class="form-control" name="nicho" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6"><input type="text" class="form-control" name="cidade" placeholder="Cidade" required></div>
                            <div class="col-md-6"><input type="text" class="form-control" name="bairro" placeholder="Bairro"></div>
                        </div>
                        <button type="submit" id="btnIniciar" class="btn btn-primary btn-block btn-lg mt-3">Iniciar Captura</button>
                    </form>
                    <div id="statusMensagem" class="py-5 text-center">
                        <div class="loader-azul"></div>
                        <h4 class="mt-4">O robô está no Google Maps...</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="js/main-ui.js"></script>
</body>
</html>