# AUTENTIKO-OK CHECK + AUTENTIKO Sign

Repositorio publico de publicacao e verificacao do sistema AUTENTIKO-OK CHECK, com modulo AUTENTIKO Sign integrado.

## Links publicados

- Sistema Apps Script: https://script.google.com/macros/s/AKfycbwL173NCw8THyvkJ2cp-HalyjLLV2wYUn664ahNJTlcwNPRO7st7HmMQlLTbgCXVTme/exec
- Verificador publico GitHub Pages: https://barrosautentiko.github.io/api.autentiko/verificar/
- Repositorio: https://github.com/BARROSAUTENTIKO/api.autentiko

## Estrutura

- `apps-script/`: fonte completo publicado no Google Apps Script.
- `verificar/`: pagina estatica do GitHub Pages para consulta publica de autenticidade.
- `docs/`: checklist, instrucoes de manutencao e metadados.
- `release-notes/`: notas da versao publicada.

## Apps Script

- Project ID: `1PKMceWaR3WAh-hbPFb66pDrSNpLiquBoaRo5tnSUepDgn5bIn36imgp8`
- Versao publicada: `48`
- Deployment: `AUTENTIKO correcao abrir edicao laudo 2026-07-02`
- Planilha principal: `1bs2hGPyYRpe8X1hzLYpHB_4ense7ca7T79hMyWJqqSk`

Arquivos principais:

- `apps-script/Code.gs`
- `apps-script/ZZZ_V6_Final.gs`
- `apps-script/ZZZ_Z_AUTENTIKO_SIGN.gs`
- `apps-script/Index.html`
- `apps-script/Sign.html`
- `apps-script/modelo.html`
- `apps-script/appsscript.json`

## Revisao de camera/liveness @45

- A assinatura exige consentimentos separados para contexto tecnico, geolocalizacao, camera/microfone, verificacao de detector facial/movimento e Drive restrito.
- A tela de assinatura carrega o detector facial MediaPipe sob demanda e usa `FaceDetector` nativo como fallback quando disponivel.
- O navegador valida luz, rosto humano por detector real e movimentos guiados antes de liberar a gravacao.
- Cada etapa de movimento confirma novamente luz e rosto detectado.
- O backend rejeita video/conclusao sem liveness aprovado, detector facial forte, tres fases de movimento e consentimentos completos.
- O manifesto e o selo do PDF registram risco tecnico sem publicar video, IP completo ou evidencias sensiveis.

## Revisao de rascunhos/modelo @46

- Assistente de vistoria ganhou botao `Salvar rascunho`.
- Rascunhos podem ser reabertos e editados sem emitir PDF nem assinatura.
- Editar laudo registrado e salvar rascunho cria uma copia editavel, sem substituir o laudo original.
- Finalizar rascunho transforma o registro em laudo trancado/auditavel.
- Emissao de PDF e assinatura eletronica ficam bloqueadas enquanto o status for `RASCUNHO`.
- O modelo do laudo passou a abrir com quadro executivo, blocos de controle documental, partes, vistoria e imovel.

## Revisao de fotos/edicao @47

- Remover foto durante edicao nao apaga a evidencia do laudo registrado original.
- Fotos removidas ficam marcadas no payload de salvamento e sao aplicadas apenas ao rascunho/revisao correta.
- O backend ignora a lista tecnica de fotos removidas ao extrair fotos para evitar imagem fantasma no PDF.
- Exclusao de upload temporario no Drive registra auditoria.
- Auditoria de salvar rascunho, finalizar rascunho e criar revisao inclui quantidade de fotos removidas.

## Correcao abrir edicao @48

- O retorno de `apiObterLaudoParaEdicao` agora converte datas da planilha para strings seguras antes de voltar ao `google.script.run`.
- O botao `Editar/Continuar rascunho` envia ID e numero do laudo como fallback.
- A busca do backend aceita ID, numero, codigo e ID de documento com comparacao tolerante a espacos e formatos.
- Adicionada API administrativa de diagnostico `apiDiagnosticarEdicaoLaudo`.

## Revisao de seguranca @43

- Token e link de assinatura nao sao mais exibidos no painel administrativo apos criar convite.
- Token continua sendo enviado apenas ao e-mail do signatario.
- Tentativas incorretas de OTP passam a ser auditadas e bloqueadas no limite tecnico.
- O fonte nao publica mais o hash literal da chave padrao.

## Verificacao publica

A pagina em `verificar/` consulta o endpoint publico do Apps Script e mostra somente dados minimos:

- ID da assinatura
- status de autenticidade
- laudo vinculado
- hash do manifesto
- hash do PDF assinado
- datas e contadores de signatarios

Dados sensiveis como CPF, e-mail, IP completo, foto, video e evidencias administrativas nao sao publicados no GitHub.

## Observacao juridica

A v1 cria assinatura eletronica com prova de autoria, consentimento, trilha de auditoria, hash encadeado, manifesto e verificacao publica. A verificacao facial local e evidencia tecnica de auditoria, nao biometria certificada. Ela nao substitui ICP-Brasil, gov.br oficial ou e-Notariado quando a lei exigir assinatura qualificada ou ato notarial.
