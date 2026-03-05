<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ids'])) {
    $ids = json_decode($_POST['ids']);
    $dbPath = dirname(__DIR__) . '/database/rescue_lead.db';
    $db = new PDO("sqlite:$dbPath");

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    // Busca os dados completos conforme o seu schema
    $stmt = $db->prepare("SELECT nome_empresa, telefone, site, nota, cidade FROM leads WHERE id IN ($placeholders)");
    $stmt->execute($ids);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=leads_completos.csv');

    $output = fopen('php://output', 'w');
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // Suporte a acentos
    
    // Cabeçalho atualizado
    fputcsv($output, ['Empresa', 'Telefone', 'Website', 'Avaliação', 'Cidade']);

    foreach ($results as $row) { fputcsv($output, $row); }
    fclose($output);
    exit;
}