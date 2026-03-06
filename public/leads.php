<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>RescueLead | Seleção de Leads</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css?v=3"> <!-- alterado: cache bust para garantir CSS atualizado -->
</head>
<body class="bg-light">

<div class="container-fluid py-4">
    <div class="card shadow border-0 mx-auto" style="max-width: 1400px;">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">🔍 Leads Encontrados</h4>
            <button onclick="window.location.href='index.php'" class="btn btn-sm btn-light">Nova Busca</button>
        </div>

        <div class="card-body">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                <p class="text-muted mb-2 mb-md-0">
                    Selecione os leads que deseja salvar no banco de dados e exportar.
                </p>
                <span id="contadorLeads" class="badge badge-primary px-3 py-2">0 leads</span> <!-- alterado: contador visual -->
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-bordered align-middle mb-0" id="tabelaLeads"> <!-- alterado: id explícito para renderização robusta -->
                    <thead class="thead-light">
                        <tr>
                            <th style="width: 60px;">
                                <input type="checkbox" id="selectAll">
                            </th>
                            <th>Empresa</th>
                            <th style="width: 110px;">Nota</th>
                            <th style="min-width: 160px;">Telefone</th>
                            <th style="min-width: 280px;">Endereço</th>
                            <th style="min-width: 150px;">Bairro</th>
                            <th style="min-width: 180px;">Site</th>
                        </tr>
                    </thead>
                    <tbody id="previewBody"></tbody>
                </table>
            </div>

            <div class="mt-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <small class="text-muted mb-2 mb-md-0">
                    Dica: use a seleção em massa para gravar vários leads de uma vez.
                </small>

                <button id="btnSalvar" class="btn btn-primary btn-lg px-5 shadow-sm">
                    Gravar Selecionados
                </button>
            </div>
        </div>
    </div>
</div>

<script src="js/leads-ui.js?v=3"></script> <!-- alterado: cache bust para garantir JS atualizado -->
</body>
</html>