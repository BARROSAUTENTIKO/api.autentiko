# Checklist de testes depois das correções

## 1. Estrutura
- Executar `garantirEstruturaDoSistema()`.
- Confirmar que as abas existem:
  - `USUARIOS`
  - `CONFIGURACOES`
  - `REGISTRO DE VISTORIA`
  - `PROCESSOS`
  - `FOTOS_LAUDO`
  - `DOCUMENTOS_LAUDO`
  - `ANAMINESE`
  - `LISTAS`
  - `LOGS`
  - `AUDITORIA`

## 2. Configurações
- Abrir o sistema.
- Confirmar logo da interface.
- Confirmar logo do laudo como Palmer Imóveis.
- Salvar configurações e recarregar.

## 3. Salvamento de vistoria
- Criar laudo com poucos campos e sem foto.
- Criar laudo com várias fotos.
- Confirmar que não aparece erro de célula acima de 50.000 caracteres.
- Confirmar que `PAYLOAD_JSON` não guarda base64 gigante.
- Confirmar que as fotos aparecem na aba `FOTOS_LAUDO`.

## 4. Painel Geral
- Após salvar, o laudo deve aparecer imediatamente ou depois de atualizar consultas.
- Conferir número do laudo, proprietário, locatário, endereço, status e botão PDF.

## 5. PDF
- Emitir PDF de laudo novo.
- Emitir PDF de laudo antigo.
- Conferir cabeçalho Palmer Imóveis.
- Conferir fotos no PDF.
- Conferir hash e assinaturas.

## 6. Cache
- Salvar novo laudo.
- Conferir se a listagem atualiza após invalidar cache.
- Editar laudo e conferir se o painel reflete alteração.

## 7. Assinatura eletrônica / câmera
- Criar sessão de assinatura e confirmar que o admin não vê token nem link sensível do signatário.
- Abrir link público, validar token de e-mail e marcar consentimentos.
- Confirmar que o sistema não coleta contexto, geolocalização, câmera ou vídeo antes das autorizações.
- Confirmar que a câmera solicita permissão do navegador.
- Testar ambiente escuro: liveness deve reprovar e registrar evento.
- Testar sem rosto humano: liveness deve reprovar e registrar evento.
- Testar navegador/conexão sem MediaPipe e sem `FaceDetector`: assinatura deve ser bloqueada.
- Testar movimentos insuficientes: vídeo não deve ser enviado.
- Testar fluxo aprovado: foto e vídeo devem ir para Drive restrito, com hash na planilha.
- Concluir assinatura e verificar selo no PDF, manifesto e QR Code.
