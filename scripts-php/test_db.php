<?php
try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/../database/rescue_lead.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'");
    $tabela = $stmt->fetchColumn();

    if (!$tabela) {
        echo "Tabela leads não existe.";
        exit;
    }

    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM leads");
    $total = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "Total de registros: " . $total['total'];
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage();
}