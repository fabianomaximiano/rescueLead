<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>RescueLead | Seleção de Leads</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light">

<div class="container-fluid py-5">
    <div class="card shadow border-0 mx-auto" style="max-width: 1000px;">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">🔍 Leads Encontrados</h4>
            <button onclick="window.location.href='index.php'" class="btn btn-sm btn-light">Nova Busca</button>
        </div>
        <div class="card-body">
            <p class="text-muted">Selecione os leads que deseja salvar no banco de dados e exportar.</p>
            
            <div class="table-responsive">
                <table class="table table-hover border">
                    <thead class="thead-light">
                        <tr>
                            <th><input type="checkbox" id="selectAll"></th>
                            <th>Empresa</th>
                            <th>Nota</th>
                            <th>Telefone</th>
                            <th>Bairro</th>
                        </tr>
                    </thead>
                    <tbody id="previewBody">
                        </tbody>
                </table>
            </div>

            <div class="mt-4 d-flex justify-content-end">
                <button id="btnSalvar" class="btn btn-primary btn-lg px-5 shadow-sm">
                    Gravar Selecionados
                </button>
            </div>
        </div>
    </div>
</div>

<script src="js/leads-ui.js"></script>
</body>
</html>