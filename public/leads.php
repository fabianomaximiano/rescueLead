<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>RescueLead | Seleção de Leads</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-light">

<div class="container py-5">
    <div class="card shadow border-0">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">🔍 Resultados Encontrados</h4>
            <div>
                <button id="btnSalvarExportar" class="btn btn-success font-weight-bold">💾 Salvar Selecionados e Excel</button>
                <a href="index.php" class="btn btn-light btn-sm ml-2">Nova Busca</a>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover mb-0" id="tabelaPreview">
                <thead class="thead-light">
                    <tr>
                        <th width="40"><input type="checkbox" id="checkAll"></th>
                        <th>Empresa</th>
                        <th>Nota</th>
                        <th>Telefone</th>
                        <th>Cidade/Bairro</th>
                    </tr>
                </thead>
                <tbody id="previewBody">
                    <tr>
                        <td colspan="5" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2">Aguardando resultados do robô...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="./js/leads-ui.js"></script>
</body>
</html>