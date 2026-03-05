<?php
// scripts-php/run_bot.php

// Define que o retorno será um JSON para o JavaScript ler
header('Content-Type: application/json');

// Captura os dados enviados pelo formulário do index.php
$nicho = isset($_POST['nicho']) ? $_POST['nicho'] : '';
$cidade = isset($_POST['cidade']) ? $_POST['cidade'] : '';
$bairro = isset($_POST['bairro']) ? $_POST['bairro'] : '';

// Protege as variáveis para uso no terminal (Segurança)
$argNicho = escapeshellarg($nicho);
$argCidade = escapeshellarg($cidade);
$argBairro = escapeshellarg($bairro);

/**
 * EXECUÇÃO DO ROBÔ:
 * O PHP chama o Node.js para rodar o engine.js.
 * Passamos os parâmetros de busca diretamente para o robô.
 */
$comando = "node ../scripts-js/engine.js $argNicho $argCidade $argBairro 2>&1";
$output = shell_exec($comando);

// Verifica se o robô retornou algo
if ($output) {
    // Retorna o que o robô imprimiu (o JSON com os leads encontrados)
    echo $output;
} else {
    // Caso ocorra um erro ou o robô não encontre nada
    http_response_code(500);
    echo json_encode(["error" => "O robô não retornou dados ou houve falha na execução."]);
}