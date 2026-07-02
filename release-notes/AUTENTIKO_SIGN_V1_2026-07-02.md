# Release AUTENTIKO Sign v1 - 2026-07-02

## Publicado

- Modulo AUTENTIKO Sign integrado ao AUTENTIKO-OK CHECK.
- Rota publica de assinatura por `?sign=sessionId:nonce`.
- Rota publica de verificacao por `?verify=id` e endpoint JSONP `?api=verifySignature`.
- GitHub Pages publico em `https://barrosautentiko.github.io/api.autentiko/verificar/`.
- Apps Script publicado no deployment existente, versao `42`.

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
4. Signatario aceita LGPD e registra contexto tecnico.
5. Sistema tenta coletar geolocalizacao, IP publico, user-agent, idioma, fuso, tela, touch e referrer.
6. Se suportado, registra tentativa WebAuthn/passkey como evidencia tecnica.
7. Signatario captura foto e video curto pelo navegador.
8. Evidencias sao salvas no Drive restrito e a planilha guarda metadados, hash e IDs.
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
- Para assinatura qualificada ICP-Brasil, gov.br oficial ou ato notarial, deve haver integracao com fornecedor credenciado.

## Verificacoes realizadas

- Web app principal respondeu HTTP 200.
- Endpoint JSONP publico respondeu com status controlado para registro inexistente.
- GitHub Pages respondeu HTTP 200 apos configurar Pages em `main`/root.
- Fonte completo publicado em `apps-script/` no GitHub.
