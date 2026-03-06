<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    if (!is_array($payload)) {
        throw new Exception('Payload inválido.');
    }

    $leads = $payload['leads'] ?? [];
    $nicho = trim((string)($payload['nicho'] ?? '')); // alterado: salva nicho junto com o lead
    $cidade = trim((string)($payload['cidade'] ?? '')); // alterado: salva cidade junto com o lead

    if (!is_array($leads) || count($leads) === 0) {
        throw new Exception('Nenhum lead foi enviado para gravação.');
    }

    if ($nicho === '' || $cidade === '') {
        throw new Exception('Nicho e cidade são obrigatórios para gravar os leads.');
    }

    $dbPath = __DIR__ . '/../database/rescue_lead.db'; // alterado: usa o nome real do banco existente
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->beginTransaction();

    $sql = "
        INSERT INTO leads (
            nome_empresa,
            nicho,
            nota,
            telefone,
            site,
            endereco_completo,
            bairro,
            cidade,
            cep,
            status_contato
        ) VALUES (
            :nome_empresa,
            :nicho,
            :nota,
            :telefone,
            :site,
            :endereco_completo,
            :bairro,
            :cidade,
            :cep,
            :status_contato
        )
    ";

    $stmt = $pdo->prepare($sql);

    $inseridos = 0;
    $ignorados = 0;

    foreach ($leads as $lead) {
        $nomeEmpresa = trim((string)($lead['nome_empresa'] ?? ''));

        if ($nomeEmpresa === '') {
            $ignorados++;
            continue;
        }

        $nota = isset($lead['nota']) && $lead['nota'] !== '' ? (float) str_replace(',', '.', (string)$lead['nota']) : null;
        $telefone = trim((string)($lead['telefone'] ?? '')) ?: null;
        $site = trim((string)($lead['site'] ?? '')) ?: null;
        $enderecoCompleto = trim((string)($lead['endereco'] ?? '')) ?: null; // alterado: mapeia "endereco" do JSON para "endereco_completo" do banco
        $bairro = trim((string)($lead['bairro'] ?? '')) ?: null;
        $cep = trim((string)($lead['cep'] ?? '')) ?: null;

        // alterado: evita duplicados por empresa + cidade + endereço quando houver endereço
        if ($enderecoCompleto) {
            $check = $pdo->prepare("
                SELECT id
                FROM leads
                WHERE lower(trim(nome_empresa)) = lower(trim(:nome_empresa))
                  AND lower(trim(cidade)) = lower(trim(:cidade))
                  AND lower(trim(endereco_completo)) = lower(trim(:endereco_completo))
                LIMIT 1
            ");

            $check->execute([
                ':nome_empresa' => $nomeEmpresa,
                ':cidade' => $cidade,
                ':endereco_completo' => $enderecoCompleto
            ]);

            if ($check->fetchColumn()) {
                $ignorados++;
                continue;
            }
        } else {
            // alterado: fallback de deduplicação quando não houver endereço
            $check = $pdo->prepare("
                SELECT id
                FROM leads
                WHERE lower(trim(nome_empresa)) = lower(trim(:nome_empresa))
                  AND lower(trim(cidade)) = lower(trim(:cidade))
                LIMIT 1
            ");

            $check->execute([
                ':nome_empresa' => $nomeEmpresa,
                ':cidade' => $cidade
            ]);

            if ($check->fetchColumn()) {
                $ignorados++;
                continue;
            }
        }

        $stmt->execute([
            ':nome_empresa' => $nomeEmpresa,
            ':nicho' => $nicho,
            ':nota' => $nota,
            ':telefone' => $telefone,
            ':site' => $site,
            ':endereco_completo' => $enderecoCompleto,
            ':bairro' => $bairro,
            ':cidade' => $cidade,
            ':cep' => $cep,
            ':status_contato' => 'Pendente'
        ]);

        $inseridos++;
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'inseridos' => $inseridos,
        'ignorados' => $ignorados
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Falha ao gravar leads.',
        'debug' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}