<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>RescueLead | Gestão de Leads</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-light">

<div class="container py-5">
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h4 class="text-primary mb-0">📋 Leads Capturados</h4>
            <div>
                <button id="btnExport" class="btn btn-success btn-sm">📊 Exportar Selecionados (Excel)</button>
                <a href="index.php" class="btn btn-outline-secondary btn-sm ml-2">Painel</a>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="thead-light">
                    <tr>
                        <th width="50"><input type="checkbox" id="selectAll"></th>
                        <th>Estabelecimento</th>
                        <th>Nota</th>
                        <th class="text-center">ID</th>
                    </tr>
                </thead>
                <tbody id="leadsTableBody">
                    </tbody>
            </table>
        </div>
    </div>
</div>

<script src="./js/leads-ui.js"></script>
</body>
</html>