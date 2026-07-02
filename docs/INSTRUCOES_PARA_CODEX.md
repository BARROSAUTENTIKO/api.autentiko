# Instruções objetivas para o Codex

Corrija o sistema AUTENTIKO OK CHECK / PALMER IMÓVEIS mantendo a estrutura atual e sem remover funcionalidades já existentes.

## Problemas críticos a corrigir

1. **Logo errada no PDF**
   - A logo do laudo de vistoria deve ser a da Palmer Imóveis:
     `https://i.postimg.cc/6QDd7672/LOGO-MARCA.png`
   - A logo da interface/sistema Autentiko pode ser outra.
   - Não misturar `logoUi` com `logoLaudo`.
   - O `modelo.html` deve priorizar `cfg.logoLaudoBase64`, depois `cfg.logoLaudoPublica`, depois `cfg.logoLaudoRaw`, e por fim o fallback oficial da Palmer.

2. **Cabeçalho do PDF**
   - O cabeçalho do laudo deve aparecer como Palmer Imóveis.
   - Deve usar dados da Palmer Imóveis: site, endereço, corretor e CRECI quando existirem em `CONFIGURACOES`.

3. **Erro de 50.000 caracteres em uma célula**
   - Não salvar `data:image/base64` dentro de `PAYLOAD_JSON` nem dentro de qualquer célula comum.
   - Fotos devem ir para `FOTOS_LAUDO`, preferencialmente com link/ID/hash.
   - Se houver base64 temporário no front-end, limpar antes de gravar o payload principal.
   - Revisar `AUT_PURGE_PAYLOAD_`, `AUT_EXTRAIR_FOTOS_PAYLOAD_`, `AUT_VINCULAR_FOTOS_` e chamadas do front-end.

4. **Laudos não aparecem no Painel Geral**
   - O salvamento deve atualizar corretamente:
     - `REGISTRO DE VISTORIA`
     - `PROCESSOS`
     - `FOTOS_LAUDO`
   - A listagem deve ler de `PROCESSOS` ou normalizar dados antigos de `REGISTRO DE VISTORIA`.
   - Invalidar caches depois de salvar/editar/excluir laudo.
   - Garantir que `apiListarProcessos`, `apiListarLaudos`, `getMeusLaudos` e funções chamadas pelo `Index.html` retornem formato esperado pelo front-end.

5. **Mapeamento por cabeçalho**
   - Não depender de posição fixa de coluna quando for possível usar cabeçalhos normalizados.
   - Garantir que `AUTENTIKO_HEADERS` esteja sincronizado com funções de salvar/listar/emitir PDF.

6. **Compatibilidade com Apps Script**
   - Usar JavaScript compatível com V8 do Google Apps Script.
   - Não usar `import`, `require`, módulos Node, DOMParser no backend ou APIs que não existam no Apps Script.
   - Manter nomes de arquivos: `Code.gs`, `Index.html`, `modelo.html`, `appsscript.json`.

7. **Performance / Optimus UI**
   - Manter cache de consultas e configurações, mas garantir invalidação correta.
   - O front-end pode mostrar atualização otimista imediatamente, mas deve sincronizar em segundo plano.
   - Evitar leituras repetidas da planilha sem necessidade.

8. **Edição de laudos antigos**
   - Não quebrar laudos antigos.
   - Preservar função de reparo/normalização de laudos antigos.
   - Permitir emissão de PDF mesmo para laudos antigos, com campos ausentes tratados como vazio.

## Entrega esperada do Codex

- Corrigir os arquivos diretamente.
- Explicar quais funções foram alteradas.
- Apontar qualquer risco de dados sensíveis.
- Fornecer um checklist final de implantação no Apps Script.
