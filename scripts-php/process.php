<?php
// scripts-php/process.php
header("Content-Type: application/json");

// Captura o JSON enviado pelo Node.js
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Nenhum dado recebido"]);
    exit;
}

try {
    // Conecta ao banco definido no .env
    $dbPath = __DIR__ . '/../database/rescue_lead.db';
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Cria a tabela se não existir
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        nota REAL,
        data_captura DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt = $pdo->prepare("INSERT INTO leads (nome, nota) VALUES (?, ?)");
    
    foreach ($data as $lead) {
        $stmt->execute([$lead['nome'], $lead['nota']]);
    }

    echo json_encode(["status" => "success", "count" => count($data)]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}