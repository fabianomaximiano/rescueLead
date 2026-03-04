<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RescueLead - Painel de Controle</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light">

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="card shadow border-0">
                <div class="card-header bg-primary text-white text-center">
                    <h4 class="mb-0">🚀 Configurar Captura</h4>
                </div>
                <div class="card-body p-4">
                    <form id="formCaptura">
                        <div class="form-group">
                            <label for="nicho">Nicho de Mercado</label>
                            <input type="text" class="form-control" id="nicho" name="nicho" placeholder="Ex: Oficina Mecânica" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="cidade">Cidade</label>
                                <input type="text" class="form-control" id="cidade" name="cidade" placeholder="Ex: São Paulo" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="bairro">Bairro</label>
                                <input type="text" class="form-control" id="bairro" name="bairro" placeholder="Ex: Tatuapé" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block btn-lg" id="btnIniciar">
                            Iniciar Extração
                        </button>
                    </form>
                </div>
                <div id="statusArea" class="card-footer bg-white d-none">
                    <div class="d-flex align-items-center">
                        <div class="spinner-border spinner-border-sm text-primary mr-2"></div>
                        <span id="statusTexto">O robô está trabalhando...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/script.js"></script>
</body>
</html>