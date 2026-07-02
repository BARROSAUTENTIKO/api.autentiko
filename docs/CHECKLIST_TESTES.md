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
