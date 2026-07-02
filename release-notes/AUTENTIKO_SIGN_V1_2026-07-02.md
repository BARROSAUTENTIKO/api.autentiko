# Release AUTENTIKO Sign v1 - 2026-07-02

## Publicado

- Modulo AUTENTIKO Sign integrado ao AUTENTIKO-OK CHECK.
- Rota publica de assinatura por `?sign=sessionId:nonce`.
- Rota publica de verificacao por `?verify=id` e endpoint JSONP `?api=verifySignature`.
- GitHub Pages publico em `https://barrosautentiko.github.io/api.autentiko/verificar/`.
- Apps Script publicado no deployment existente, versao `44`.

## Revisao de camera/liveness @44

- Consentimentos separados antes da coleta de contexto, geolocalizacao, camera/microfone, verificacao de rosto/movimento e armazenamento no Drive restrito.
- Token validado nao coleta dados tecnicos automaticamente; a coleta acontece apenas apos acao e aceite do signatario.
- Camera/microfone so sao solicitados apos consentimento expresso.
- Validacao local de luz, rosto e movimentos guiados antes de liberar gravacao de evidencia.
- Uso de `FaceDetector` quando suportado pelo navegador; fallback registrado como heuristica local, sem promessa de biometria certificada.
- Backend rejeita video e conclusao sem liveness aprovado, luz aprovada, rosto confirmado, tres fases de movimento e consentimentos completos.
- Manifesto tecnico inclui risco por signatario, e o selo do PDF exibe resumo de validacao sem expor video, IP completo ou evidencias sensiveis.

## Revisao de seguranca @43

- O painel administrativo nao exibe mais token OTP nem link unico do signatario apos criar a sessao.
- O convite continua sendo enviado por e-mail ao signatario.
- O OTP agora bloqueia apos excesso de tentativas incorretas e registra evento auditavel.
- A validacao de chave mestra prioriza `CHAVE_MESTRA_HASH` em `PropertiesService`.
- O fonte publico nao contem mais o hash literal da chave padrao nem texto puro da chave.

## Abas adicionadas na planilha

- `ASSINATURAS`
- `SIGNATARIOS`
- `TOKENS_ASSINATURA`
- `EVENTOS_ASSINATURA`
- `EVIDENCIAS_ASSINATURA`
- `MANIFESTOS_ASSINATURA`
- `POSICOES_ASSINATURA`

## APIs adicionadas

- `apiSignCriarSessao`
- `apiSignValidarLink`
- `apiSignRegistrarEventoPublico`
- `apiSignVerificarToken`
- `apiSignUploadEvidencia`
- `apiSignConcluir`
- `apiSignListarAssinaturas`
- `apiSignObterAssinatura`
- `apiSignCancelarAssinatura`
- `apiSignConsultarPublico`

## Fluxo de assinatura

1. Administrador cria sessao de assinatura a partir do painel.
2. Signatario recebe e-mail com link unico e token.
3. Link expira em 1 hora e e de uso unico.
4. Signatario marca aceite e consentimentos especificos.
5. Sistema coleta contexto tecnico e geolocalizacao apenas depois da autorizacao.
6. Se suportado, registra tentativa WebAuthn/passkey como evidencia tecnica.
7. Signatario autoriza camera/microfone, executa validacao de luz, rosto e movimento.
8. Signatario grava foto/video curto; evidencias ficam no Drive restrito e a planilha guarda metadados, hash e IDs.
9. Ao concluir, o sistema gera manifesto com hash encadeado de eventos.
10. O PDF assinado recebe selo formal, QR Code e link de verificacao publica.

## Seguranca e auditoria

- Tokens salvos apenas como hash SHA-256.
- Eventos com `hashAnterior` e `hashEvento`.
- Manifesto final com hash do laudo, hash do PDF assinado, hashes das evidencias e linha do tempo.
- Dados sensiveis ficam restritos ao painel administrativo.
- Verificacao publica exibe somente dados minimos de integridade.

## Limites declarados

- A protecao real do PDF e por hash, manifesto e trilha de auditoria.
- Senha de PDF, quando usada, e barreira contra edicao casual, nao garantia absoluta contra clonagem.
- A verificacao local de rosto/movimento e evidencia tecnica de auditoria, nao biometria certificada equivalente a servico especializado.
- Para assinatura qualificada ICP-Brasil, gov.br oficial ou ato notarial, deve haver integracao com fornecedor credenciado.

## Verificacoes realizadas

- Checagem de sintaxe do JavaScript do `Sign.html` com Node.js.
- `clasp push --force` concluiu com os 8 arquivos principais.
- Deployment existente atualizado para `@44`.
- Endpoint JSONP publico respondeu HTTP 200.
- GitHub Pages respondeu HTTP 200.
- Fonte completo publicado em `apps-script/` no GitHub.
