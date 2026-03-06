<?php
header('Content-Type: application/json; charset=utf-8');

// Recebe dados do formulário
$nicho = escapeshellarg($_POST['nicho'] ?? '');
$cidade = escapeshellarg($_POST['cidade'] ?? '');
$bairro = escapeshellarg($_POST['bairro'] ?? '');

// Caminho absoluto para o engine.js
$script = realpath(__DIR__ . '/../scripts-js/engine.js');

// Validação adicionada para evitar erro silencioso se o arquivo não existir
if (!$script) {
    http_response_code(500);
    echo json_encode([
        "error" => "engine.js não encontrado"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Monta o comando para executar o Node
$comando = "node " . escapeshellarg($script) . " $nicho $cidade $bairro 2>&1"; // escapeshellarg no caminho do script para evitar quebra por espaço no path

$output = shell_exec($comando);

// Normaliza saída
$output = trim((string)$output);

// Se não houve retorno nenhum, devolve JSON válido
if ($output === '') {
    http_response_code(500);
    echo json_encode([
        "error" => "Falha no motor Node",
        "debug" => "Nenhuma saída retornada pelo engine.js"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Tenta decodificar o retorno para garantir que é JSON válido
$data = json_decode($output, true);

// Validação adicionada para impedir que HTML/warnings do PHP ou Node quebrem o frontend
if (json_last_error() === JSON_ERROR_NONE) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(500);
echo json_encode([
    "error" => "Falha no motor Node",
    "debug" => $output
], JSON_UNESCAPED_UNICODE);