<?php

try {
    $dbPath = __DIR__ . '/../database/rescue_lead.db';
    $schemaPath = __DIR__ . '/../database/schema.sql';

    if (!file_exists($schemaPath)) {
        throw new Exception('Arquivo schema.sql não encontrado.');
    }

    $schemaSql = file_get_contents($schemaPath);

    if ($schemaSql === false || trim($schemaSql) === '') {
        throw new Exception('schema.sql está vazio ou não pôde ser lido.');
    }

    if (!is_dir(dirname($dbPath))) {
        throw new Exception('Pasta database não encontrada.');
    }

    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec($schemaSql); // alterado: aplica todo o schema.sql no banco real

    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'");
    $tabela = $stmt->fetchColumn();

    if (!$tabela) {
        throw new Exception('A tabela leads não foi criada corretamente.');
    }

    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM leads");
    $total = $stmt->fetch(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => 'Banco inicializado com sucesso.',
        'database' => $dbPath,
        'tabela' => 'leads',
        'total_registros' => (int)($total['total'] ?? 0)
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Falha ao inicializar o banco.',
        'debug' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}