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

## 8. Rascunhos e edição documental
- Iniciar nova vistoria e clicar em `Salvar rascunho` antes de preencher tudo.
- Confirmar que o painel mostra status `RASCUNHO`.
- Confirmar que rascunho não permite emitir PDF nem criar assinatura.
- Reabrir rascunho pelo botão `Continuar rascunho`, editar e salvar novamente.
- Finalizar/trancar o rascunho e confirmar status `REGISTRADO`.
- Editar um laudo registrado e salvar como rascunho; o laudo original não deve ser substituído.
- Finalizar esse rascunho de revisão e confirmar novo ID/hash e auditoria.
- Emitir PDF final e conferir quadro executivo, partes, imóvel, ambientes, fotos e assinaturas.

## 9. Fotos em rascunhos e revisões
- Abrir um laudo registrado com foto e remover uma imagem antes de salvar rascunho.
- Confirmar que o laudo registrado original ainda mantém a foto na aba `FOTOS_LAUDO`.
- Confirmar que o rascunho/revisão não mostra a foto removida na prévia nem no PDF final.
- Remover uma foto recém enviada antes de salvar e confirmar que o arquivo temporário é enviado para exclusão no Drive.
- Conferir `AUDITORIA` com ação de salvamento contendo `fotosRemovidas`.

## 10. Abrir laudo para edição
- No painel geral, clicar em `Editar` em um laudo registrado.
- Confirmar que o assistente abre na etapa 1 com número, data, partes e endereço preenchidos.
- Clicar em `Continuar rascunho` em um rascunho e confirmar que ele abre sem gerar PDF.
- Testar laudo cujo painel mostra ID e número diferentes; o fallback por número deve localizar o registro.
- Se falhar, executar `apiDiagnosticarEdicaoLaudo(id, numero)` no Apps Script para confirmar aba/linha encontrada.

## 11. Fotos compactas e rascunhos @50
- Enviar 6 a 12 fotos em um mesmo ambiente e confirmar que todas ficam com selo `Drive 10x12`.
- Salvar como rascunho, reabrir e confirmar que as fotos continuam aparecendo na prévia.
- Emitir PDF final e conferir que as fotos aparecem agrupadas por ambiente, em miniaturas, sem uma foto por página.
- Conferir que nenhuma foto é cortada; a imagem deve ficar inteira dentro do quadro.
- Testar a mesma foto em dois ambientes diferentes e confirmar que ela aparece nos dois contextos.
- Executar `apiDiagnosticarFotosLaudo(id)` e confirmar `fotosPreparadasPdf` igual ou maior que as fotos esperadas.

## 12. Fotos quebradas no PDF @51
- Emitir novamente o laudo `35601524` forçando nova geração após a versão 51.
- Conferir que as fotos duplicadas por hash não geram cards com ícone quebrado.
- Conferir que o PDF não contém imagem quebrada nas páginas de registro fotográfico.
- Conferir se a auditoria `EMITIR_PDF_COM_MANIFESTO` registra `fotosSincronizadasAntesPdf`.
- Se aparecer quadro de imagem não incorporada, revisar a respectiva linha em `FOTOS_LAUDO` pelo hash/ID.

## 13. Galeria e legenda por ambiente @52
- Emitir um laudo com várias fotos por ambiente.
- Conferir que cada foto mostra apenas o código documental, sem legenda individual abaixo.
- Conferir que a legenda técnica aparece uma única vez por ambiente.
- Conferir que observações e anamnese aparecem consolidadas por ambiente.
- Conferir que a anamnese usa passado constatativo, por exemplo `verificou-se` ou `constatou-se`.

## 14. Recuperação de senha @55
- Na tela de login, clicar em `Recuperar senha por e-mail`.
- Informar usuário ou e-mail cadastrado e confirmar envio do link.
- Confirmar que o e-mail recebido abre a página de redefinição.
- Testar senha fraca: deve ser recusada no navegador.
- Testar senha forte e confirmação igual: deve atualizar a senha e invalidar o link.
- Tentar reutilizar o mesmo link: deve aparecer como usado/não localizado.
- Conferir `AUDITORIA` com solicitação e confirmação da recuperação.
