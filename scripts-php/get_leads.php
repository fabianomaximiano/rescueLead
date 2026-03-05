<?php
// scripts-php/get_leads.php
header('Content-Type: application/json');

try {
    // Sobe um nível para achar a pasta database na raiz
    $dbPath = dirname(__DIR__) . '/database/rescue_lead.db';
    
    if (!file_exists($dbPath)) {
        throw new Exception("Banco de dados não encontrado.");
    }

    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("SELECT id, nome, nota FROM leads ORDER BY id DESC");
    $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($leads);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}