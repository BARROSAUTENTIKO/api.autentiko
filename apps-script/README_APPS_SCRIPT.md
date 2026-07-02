# AUTENTIKO-OK CHECK - Apps Script

Esta pasta guarda a versao publicada do sistema administrativo AUTENTIKO-OK CHECK e do modulo AUTENTIKO Sign.

## Projeto publicado

- Apps Script project ID: `1PKMceWaR3WAh-hbPFb66pDrSNpLiquBoaRo5tnSUepDgn5bIn36imgp8`
- Web app principal: https://script.google.com/macros/s/AKfycbwL173NCw8THyvkJ2cp-HalyjLLV2wYUn664ahNJTlcwNPRO7st7HmMQlLTbgCXVTme/exec
- Versao publicada do Apps Script: `41`
- Descricao da publicacao: `AUTENTIKO Sign V1 - verificador GitHub Pages 2026-07-02`
- Planilha principal: `1bs2hGPyYRpe8X1hzLYpHB_4ense7ca7T79hMyWJqqSk`

## Arquivos principais

- `Code.gs`: nucleo legado do AUTENTIKO-OK CHECK.
- `ZZZ_V6_Final.gs`: reparos finais, rotas e integracao com assinatura.
- `ZZZ_Z_AUTENTIKO_SIGN.gs`: backend do AUTENTIKO Sign v1.
- `Index.html`: painel administrativo, incluindo aba Assinaturas.
- `Sign.html`: fluxo publico de assinatura por link/token.
- `modelo.html`: modelo de laudo/PDF com selo de assinatura e QR/manifesto.

## Publicacao

O deploy foi feito via `clasp push --force` e atualizacao do deployment existente. A pasta `verificar/` fica fora do deploy do Apps Script e pertence ao GitHub Pages.

## Observacao juridica

A v1 cria assinatura eletronica com prova de autoria, consentimento, trilha de auditoria, hash encadeado, manifesto e verificacao publica. Ela nao substitui ICP-Brasil, gov.br oficial ou e-Notariado quando a lei exigir assinatura qualificada ou ato notarial.
