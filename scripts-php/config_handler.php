<?php
// Não exibe HTML, apenas processa e retorna JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $envPath = dirname(__DIR__) . '/.env'; 
    
    $content = "NICHO_ATUAL=\"{$_POST['nicho']}\"\n";
    $content .= "CIDADE_ATUAL=\"{$_POST['cidade']}\"\n";
    $content .= "BAIRRO_ATUAL=\"{$_POST['bairro']}\"\n";

    if (file_put_contents($envPath, $content)) {
        // Comando para o Docker restartar o serviço Node
        shell_exec("docker restart scraping-bot");
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error']);
    }
}