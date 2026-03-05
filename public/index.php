<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RescueLead | Painel de Controle</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-light">

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">🚀 Configurar Captura de Leads</h4>
                </div>
                <div class="card-body">
                    <form id="configForm">
                        <div class="form-group">
                            <label for="nicho">Nicho de Mercado</label>
                            <input type="text" class="form-control" id="nicho" name="nicho" placeholder="Ex: Padaria, Oficina, Academia..." required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="cidade">Cidade</label>
                                <input type="text" class="form-control" id="cidade" name="cidade" placeholder="Ex: São Paulo" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="bairro">Bairro</label>
                                <input type="text" class="form-control" id="bairro" name="bairro" placeholder="Ex: Centro" required>
                            </div>
                        </div>

                        <button type="submit" id="btnSubmit" class="btn btn-primary btn-block btn-lg">
                            Iniciar Captura
                        </button>
                    </form>
                </div>
                <div id="statusMessage" class="card-footer text-center d-none">
                    </div>
            </div>
            
            <p class="text-center text-muted mt-4 small">RescueLead v3.0 - Sistema de Prospecção Ativa</p>
        </div>
    </div>
</div>

<script src="./js/main-ui.js"></script>
</body>
</html>