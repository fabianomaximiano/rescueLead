<?php
// scripts-php/config_handler.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nicho = $_POST['nicho'] ?? '';
    $cidade = $_POST['cidade'] ?? '';
    $bairro = $_POST['bairro'] ?? '';

    // Ajuste de caminho: sobe um nível para achar a raiz do projeto
    $envPath = dirname(__DIR__) . '/.env'; 

    // Conteúdo formatado preservando as outras chaves se necessário
    $content = "NICHO_ATUAL=\"$nicho\"\n";
    $content .= "CIDADE_ATUAL=\"$cidade\"\n";
    $content .= "BAIRRO_ATUAL=\"$bairro\"\n";
    $content .= "DB_PATH=\"./database/rescue_lead.db\"";

    if (file_put_contents($envPath, $content)) {
        echo json_encode(['status' => 'success', 'message' => 'Configurações aplicadas!']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Falha ao gravar arquivo .env em: ' . $envPath]);
    }
}