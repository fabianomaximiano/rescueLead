<?php
// scripts-php/excel-gen.php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ids'])) {
    $ids = JSON_decode($_POST['ids']);
    
    $dbPath = dirname(__DIR__) . '/database/rescue_lead.db';
    $db = new PDO("sqlite:$dbPath");

    // Prepara a consulta para os IDs selecionados
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $db->prepare("SELECT nome, nota FROM leads WHERE id IN ($placeholders)");
    $stmt->execute($ids);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Configura headers para download de CSV (Excel reconhece)
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=leads_exportados.csv');

    $output = fopen('php://output', 'w');
    // Adiciona o BOM para o Excel identificar caracteres especiais (acentos)
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Cabeçalho do Excel
    fputcsv($output, ['Nome do Estabelecimento', 'Nota Avaliação']);

    foreach ($results as $row) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}