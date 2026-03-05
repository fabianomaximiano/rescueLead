<?php
header('Content-Type: application/json');
try {
    $dbPath = dirname(__DIR__) . '/database/rescue_lead.db';
    if (!file_exists($dbPath)) { echo json_encode([]); exit; }

    $db = new PDO("sqlite:$dbPath");
    // nome_empresa é o nome correto conforme o seu schema.sql
    $stmt = $db->query("SELECT id, nome_empresa, nota, telefone FROM leads ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}