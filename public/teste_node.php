<?php
header('Content-Type: text/plain');

echo "--- Verificação de Ambiente ---\n";

// 1. Testar se o comando 'node' responde
$nodeVersion = shell_exec('node -v 2>&1');
echo "Versão do Node: " . trim($nodeVersion) . "\n";

// 2. Testar se o 'npm' responde
$npmVersion = shell_exec('npm -v 2>&1');
echo "Versão do NPM: " . trim($npmVersion) . "\n";

// 3. Testar execução de um código JS simples
$jsTest = shell_exec('node -e "console.log(\'Node.js executando com sucesso!\')" 2>&1');
echo "Teste de Execução: " . trim($jsTest) . "\n";

echo "-------------------------------\n";

if (strpos($nodeVersion, 'v') === 0) {
    echo "✅ SUCESSO: O Node.js está pronto para o robô!";
} else {
    echo "❌ ERRO: O Node.js não foi encontrado no container.";
}