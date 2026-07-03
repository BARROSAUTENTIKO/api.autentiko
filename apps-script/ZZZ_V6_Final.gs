/* =========================================================
   AUTENTIKO-OK CHECK — PATCH FINAL V6
   Performance, cache, upload compacto e laudo documental.
   ========================================================= */

var AUTENTIKO_PATCH_VERSION_V6 = 'V13_FOTOS_PDF_DEDUP_EMBED_20260703';
var AUT_MODELO_PDF_VERSION_V6 = 'MODELO_PALMER_FOTOS_DEDUP_EMBED_20260703';
var PALMER_LAUDO_LOGO_OFICIAL = 'https://i.postimg.cc/TPvjXw7D/Whats-App-Image-2026-06-16-at-15-48-05-removebg-preview.png?sha=665353158D30C2184BF1061A92EFD6D7F3492226D31A76FA46E01CC2620ED47A';
var PALMER_MARCADAGUA_OFICIAL = PALMER_LAUDO_LOGO_OFICIAL;
var AUT_WEBAPP_URL_PUBLICA_V7 = 'https://script.google.com/macros/s/AKfycbwL173NCw8THyvkJ2cp-HalyjLLV2wYUn664ahNJTlcwNPRO7st7HmMQlLTbgCXVTme/exec';
var PALMER_RAZAO_SOCIAL_OFICIAL = 'PALMER IMÓVEIS SOLUÇÕES LTDA';
var PALMER_CNPJ_OFICIAL = '55.963.658/0001-90';
var PALMER_ENDERECO_OFICIAL = 'R. SÃO SEBASTIÃO, 1746, SALA 01, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000';
var PALMER_FONE_OFICIAL = '(91) 99283-4665';
var PALMER_EMAIL_OFICIAL = 'rycky.corretor@gmail.com';
var PALMER_REPRESENTANTE_LEGAL_OFICIAL = 'RYCKY DE PALMER DIAS';

function AUT_REGISTRO_HEADERS_V4_() {
  return [
    'ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','DATA_VISTORIA','HORA_VISTORIA',
    'RESPONSAVEL','VISTORIADOR','PROPRIETARIO','CPF_PROPRIETARIO','LOCATARIO',
    'CPF_LOCATARIO','CONTATO','EMAIL','RUA','NUMERO','REFERENCIA','BAIRRO','CIDADE','CEP',
    'ENDERECO_IMOVEL','TIPO_VISTORIA','CATEGORIA_IMOVEL','TIPO_LOCACAO','ESTADO_IMOVEL',
    'PAYLOAD_JSON','DATA_REGISTRO','PDF_URL','HASH_LAUDO','PDF_HASH','PDF_GERADO_EM',
    'QTD_FOTOS','QTD_ITENS','ID_DOCUMENTO','HASH_DOCUMENTO','MANIFESTO_URL',
    'EDITADO_DE_ID','ID_REVISAO_ATUAL','REVISAO','REVISAO_STATUS','HISTORICO_ALTERACOES',
    'HASH_ANTERIOR','EDITADO_EM'
  ];
}

function AUT_PREPARAR_HEADERS_V4_() {
  AUTENTIKO_HEADERS.USUARIOS = [
    'NOME','DATA_NASCIMENTO','CONTATO','EMAIL','USUARIO','SENHA_HASH',
    'PERFIL','STATUS','DATA_CADASTRO','ULTIMO_ACESSO','ACEITE_LGPD','DATA_ACEITE_LGPD'
  ];
  AUTENTIKO_HEADERS.CONFIGURACOES = [
    'NOME_SISTEMA','AUTENTIKO_LOGO_URL','LAUDO_LOGO_URL','MANUTENCAO',
    'SITE','ENDERECO','CORRETOR','CRECI','APP_SUBTITLE',
    'RAZAO_SOCIAL','CNPJ','FONE','EMAIL_EMPRESA','REPRESENTANTE_LEGAL'
  ];
  AUTENTIKO_HEADERS['REGISTRO DE VISTORIA'] = AUT_REGISTRO_HEADERS_V4_();
  AUTENTIKO_HEADERS.REGISTRO_DE_VISTORIA = AUT_REGISTRO_HEADERS_V4_();
  AUTENTIKO_HEADERS.PROCESSOS = [
    'ID_PROCESSO','ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','PROPRIETARIO','LOCATARIO',
    'ENDERECO','TIPO_VISTORIA','CATEGORIA_IMOVEL','VISTORIADOR','STATUS','PDF_URL',
    'PDF_HASH','PDF_GERADO_EM','HASH_LAUDO','CRIADO_EM','ATUALIZADO_EM',
    'ID_DOCUMENTO','HASH_DOCUMENTO','MANIFESTO_URL','EDITADO_DE_ID','REVISAO','REVISAO_STATUS'
  ];
  AUTENTIKO_HEADERS.FOTOS_LAUDO = [
    'ID_FOTO','ID_LAUDO','NUMERO_LAUDO','AMBIENTE','ITEM','TIPO_OBSERVACAO',
    'LEGENDA_TECNICA','NOME_ARQUIVO','MIME_TYPE','FOTO_URL','FOTO_DATA_URL',
    'HASH_FOTO','CRIADO_EM','ARQUIVO_ID','FOTO_THUMB_URL','LARGURA','ALTURA','TAMANHO_BYTES'
  ];
  AUTENTIKO_HEADERS.AMBIENTES_LAUDO = [
    'ID_AMBIENTE','ID_LAUDO','NUMERO_LAUDO','ORDEM','NOME_AMBIENTE',
    'PISO','PISO_OBS','PAREDES','PAREDES_OBS','TETO','TETO_OBS',
    'ELETRICA_HIDRAULICA','ELETRICA_HIDRAULICA_OBS','ESQUADRIAS','ESQUADRIAS_OBS',
    'ANAMNESE_JSON','OBSERVACOES','QTD_FOTOS','CRIADO_EM','ATUALIZADO_EM'
  ];
  AUTENTIKO_HEADERS.ITENS_AMBIENTE = [
    'ID_ITEM','ID_AMBIENTE','ID_LAUDO','NUMERO_LAUDO','AMBIENTE','ITEM',
    'ESTADO','TIPO_OBSERVACAO','OBSERVACAO','LEGENDA_TECNICA','CRIADO_EM','ATUALIZADO_EM'
  ];
}

function garantirEstruturaDoSistema() {
  var cache = CacheService.getScriptCache();
  try {
    if (cache.get('AUTENTIKO_STRUCTURE_READY_' + AUTENTIKO_PATCH_VERSION_V6) === 'SIM') {
      return { sucesso: true, msg: 'Estrutura verificada em cache.' };
    }
  } catch (eCache) {}

  var ss = AUT_SS_FAST_();
  AUT_PREPARAR_HEADERS_V4_();
  Object.keys(AUTENTIKO_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUTENTIKO_HEADERS[nome]);
  });
  if (typeof AUT_SIGN_GARANTIR_ESTRUTURA_ === 'function') {
    AUT_SIGN_GARANTIR_ESTRUTURA_(ss);
  }
  garantirConfigPadrao_(ss);
  garantirUsuarioAdmin_(ss);
  garantirListasPadrao_(ss);
  garantirAnamnesePadrao_(ss);
  AUT_CORRIGIR_LOGO_PALMER_CONFIG_();
  AUT_APLICAR_LOGO_PALMER_V7_();

  try { cache.put('AUTENTIKO_STRUCTURE_READY_' + AUTENTIKO_PATCH_VERSION_V6, 'SIM', 900); } catch (ePut) {}
  return { sucesso: true, msg: 'Estrutura AUTENTIKO-OK CHECK reparada em modo rápido.' };
}

function getConfiguracoesGlobais() {
  var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.CFG);
  if (cached && cached.cacheVersion === AUTENTIKO_PATCH_VERSION_V6) return cached;

  try {
    garantirEstruturaDoSistema();
    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var nome = AUT_GET_CELL_BY_HEADER_(sh, 2, ['NOME_SISTEMA'], 'LAUDO DE VISTORIA');
    var logoUiRaw = AUT_GET_PROP_('AUTENTIKO_LOGO_URL', AUT_GET_CELL_BY_HEADER_(sh, 2, ['AUTENTIKO_LOGO_URL', 'LOGO_AUTENTIKO'], AUTENTIKO_LOGO_FALLBACK));
    var logoLaudoRaw = PALMER_LAUDO_LOGO_OFICIAL;
    AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', logoLaudoRaw);

    var manut = AUT_GET_CELL_BY_HEADER_(sh, 2, ['MANUTENCAO'], 'FALSE');
    var site = AUT_GET_CELL_BY_HEADER_(sh, 2, ['SITE'], 'WWW.PALMERIMOVEIS.COM.BR');
    var creci = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CRECI'], '12.596');
    var subtitle = AUT_GET_CELL_BY_HEADER_(sh, 2, ['APP_SUBTITLE'], AUTENTIKO_APP_SUBTITLE_DEFAULT);
    var corretor = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CORRETOR'], PALMER_REPRESENTANTE_LEGAL_OFICIAL) || PALMER_REPRESENTANTE_LEGAL_OFICIAL;

    var logoUiPublica = AUT_PUBLIC_URL_(logoUiRaw, 512);
    var logoLaudoPublica = AUT_PUBLIC_URL_(logoLaudoRaw, 1200) || PALMER_LAUDO_LOGO_OFICIAL;
    var logoUiBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoUiRaw, 'LOGO_UI_V6_EMPRESA') || AUTENTIKO_LOGO_FALLBACK;
    var logoLaudoBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoLaudoRaw, 'LOGO_LAUDO_V9_INLINE_OFICIAL_10X12') || logoLaudoRaw;

    var cfg = {
      sucesso: true,
      cacheVersion: AUTENTIKO_PATCH_VERSION_V6,
      nome: nome,
      logoRaw: logoUiRaw,
      logoBase64: logoUiBase64,
      logoPublica: logoUiPublica,
      appNome: 'AUTENTIKO-OK CHECK',
      appSubtitle: subtitle,
      logoUiRaw: logoUiRaw,
      logoUiBase64: logoUiBase64,
      logoUiPublica: logoUiPublica,
      laudoNome: nome || 'LAUDO DE VISTORIA',
      logoLaudoRaw: logoLaudoRaw,
      logoLaudoBase64: logoLaudoBase64,
      logoLaudoPublica: logoLaudoPublica,
      marcaDaguaRaw: PALMER_MARCADAGUA_OFICIAL,
      marcaDaguaBase64: AUT_IMAGEM_DATA_OU_VAZIO_(PALMER_MARCADAGUA_OFICIAL, 'MARCADAGUA_PALMER_V9_INLINE') || logoLaudoBase64,
      marcaDaguaPublica: AUT_PUBLIC_URL_(PALMER_MARCADAGUA_OFICIAL, 1200) || PALMER_MARCADAGUA_OFICIAL,
      palmerNome: PALMER_RAZAO_SOCIAL_OFICIAL,
      razaoSocial: PALMER_RAZAO_SOCIAL_OFICIAL,
      cnpj: PALMER_CNPJ_OFICIAL,
      site: site,
      endereco: PALMER_ENDERECO_OFICIAL,
      enderecoEmpresa: PALMER_ENDERECO_OFICIAL,
      fone: PALMER_FONE_OFICIAL,
      emailEmpresa: PALMER_EMAIL_OFICIAL,
      corretor: corretor,
      representanteLegal: PALMER_REPRESENTANTE_LEGAL_OFICIAL,
      creci: creci,
      manutencao: (manut === true || String(manut).toUpperCase() === 'TRUE')
    };

    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.CFG, cfg, 600);
    return cfg;
  } catch (e) {
    return {
      sucesso: false,
      cacheVersion: AUTENTIKO_PATCH_VERSION_V6,
      nome: 'LAUDO DE VISTORIA',
      appNome: 'AUTENTIKO-OK CHECK',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoUiBase64: AUTENTIKO_LOGO_FALLBACK,
      logoLaudoRaw: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoBase64: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoPublica: PALMER_LAUDO_LOGO_OFICIAL,
      marcaDaguaRaw: PALMER_MARCADAGUA_OFICIAL,
      marcaDaguaBase64: PALMER_MARCADAGUA_OFICIAL,
      marcaDaguaPublica: PALMER_MARCADAGUA_OFICIAL,
      palmerNome: PALMER_RAZAO_SOCIAL_OFICIAL,
      razaoSocial: PALMER_RAZAO_SOCIAL_OFICIAL,
      cnpj: PALMER_CNPJ_OFICIAL,
      site: 'WWW.PALMERIMOVEIS.COM.BR',
      endereco: PALMER_ENDERECO_OFICIAL,
      enderecoEmpresa: PALMER_ENDERECO_OFICIAL,
      fone: PALMER_FONE_OFICIAL,
      emailEmpresa: PALMER_EMAIL_OFICIAL,
      corretor: PALMER_REPRESENTANTE_LEGAL_OFICIAL,
      representanteLegal: PALMER_REPRESENTANTE_LEGAL_OFICIAL,
      creci: '12.596',
      manutencao: false,
      msg: e.message
    };
  }
}

function AUT_INVALIDAR_CACHES_() {
  try {
    CacheService.getScriptCache().remove(AUT_CACHE_KEYS.CFG);
    CacheService.getScriptCache().remove(AUT_CACHE_KEYS.LISTA_PROCESSOS);
    CacheService.getScriptCache().remove('AUTENTIKO_V6_LISTA_PROCESSOS');
  } catch (e) {}
}

function AUT_APLICAR_LOGO_PALMER_V7_() {
  try {
    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', PALMER_LAUDO_LOGO_OFICIAL);
    PropertiesService.getScriptProperties().setProperty('LAUDO_LOGO_URL', PALMER_LAUDO_LOGO_OFICIAL);
    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, logo: PALMER_LAUDO_LOGO_OFICIAL };
  } catch (e) {
    return { sucesso: false, msg: e.message };
  }
}

function AUT_WEBAPP_URL_V7_() {
  try {
    var url = ScriptApp.getService().getUrl();
    if (url) return url;
  } catch (e) {}
  return AUT_WEBAPP_URL_PUBLICA_V7;
}

function AUT_MANIFESTO_URL_V7_(idDocumento, hashDocumento) {
  var base = AUT_WEBAPP_URL_V7_();
  if (!base) return '';
  return base + '?manifesto=1&id=' + encodeURIComponent(String(idDocumento || '')) +
    '&hash=' + encodeURIComponent(String(hashDocumento || ''));
}

function AUT_QR_DATA_URL_V7_(texto) {
  texto = String(texto || '').trim();
  if (!texto) return '';
  var cacheKey = 'AUT_QR_V7_' + AUT_HASH_(texto).substring(0, 45);
  try {
    var cached = CacheService.getScriptCache().get(cacheKey);
    if (cached) return cached;
  } catch (eGet) {}
  try {
    var url = 'https://quickchart.io/qr?size=180&margin=1&text=' + encodeURIComponent(texto);
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
      var data = 'data:image/png;base64,' + Utilities.base64Encode(res.getBlob().getBytes());
      try { CacheService.getScriptCache().put(cacheKey, data, 21600); } catch (ePut) {}
      return data;
    }
  } catch (eFetch) {}
  return '';
}

function AUT_APPEND_MANY_OBJ_(sh, lista) {
  lista = lista || [];
  if (!sh || !lista.length) return 0;
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = lista.map(function(obj) {
    var idx = AUT_OBJ_INDEX_(obj || {});
    return headers.map(function(h) {
      var k = AUT_NORM_(h);
      return idx[k] !== undefined ? idx[k] : '';
    });
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, lastCol).setValues(rows);
  return rows.length;
}

function AUT_EXTRAIR_FOTOS_PAYLOAD_(dados) {
  var fotos = [];
  var visitados = [];
  var hashes = {};
  dados = dados || {};

  function ambienteDoCaminho(caminho, obj) {
    obj = obj || {};
    if (obj.ambiente) return obj.ambiente;
    if (obj.AMBIENTE) return obj.AMBIENTE;
    var m = String(caminho || '').match(/amb_(\d+)/i);
    if (m && m[1]) {
      var codigo = 'amb_' + m[1];
      return dados[codigo + '_tipo_ambiente'] || codigo;
    }
    return obj.comodo || obj.local || caminho || '';
  }

  function codigoDoCaminho(caminho, obj) {
    obj = obj || {};
    if (obj.ambienteCodigo) return obj.ambienteCodigo;
    var m = String(caminho || '').match(/amb_(\d+)/i);
    return (m && m[1]) ? ('amb_' + m[1]) : '';
  }

  function andar(valor, caminho) {
    if (/__fotosRemovidas|__fotos_removidas|fotosRemovidasEdicao/i.test(String(caminho || ''))) return;
    if (!valor) return;
    if (typeof valor === 'string') {
      var s = valor.trim();
      if ((s.charAt(0) === '[' || s.charAt(0) === '{') && s.length < 200000) {
        try { andar(JSON.parse(s), caminho); } catch (eJson) {}
      }
      return;
    }
    if (typeof valor === 'object') {
      if (visitados.indexOf(valor) >= 0) return;
      visitados.push(valor);
    }
    if (Array.isArray(valor)) {
      valor.forEach(function(item, idx) { andar(item, caminho + '[' + idx + ']'); });
      return;
    }
    if (typeof valor === 'object') {
      var url = valor.url || valor.fotoUrl || valor.FOTO_URL || valor.driveUrl || valor.directViewUrl || '';
      var dataUrl = valor.dataUrl || valor.base64 || valor.FOTO_DATA_URL || valor.embed || '';
      var fileId = valor.fileId || valor.arquivoId || valor.ARQUIVO_ID || '';
      if (!url && fileId) url = 'https://drive.google.com/file/d/' + fileId + '/view';
      if (url || dataUrl) {
        var hash = valor.hash || AUT_HASH_(url + dataUrl + fileId);
        var ambiente = ambienteDoCaminho(caminho, valor);
        var codigoAmbiente = codigoDoCaminho(caminho, valor);
        var chaveFoto = [codigoAmbiente, ambiente, valor.fotoId || valor.id || '', hash, fileId, url].join('::');
        if (!hashes[chaveFoto]) {
          hashes[chaveFoto] = true;
          var tipoObs = valor.tipoObservacao || valor.tipo_observacao || valor.item || 'Registro fotográfico técnico do ambiente';
          fotos.push({
            id: valor.fotoId || valor.id || '',
            ambiente: ambiente,
            ambienteCodigo: codigoAmbiente,
            item: valor.item || tipoObs,
            tipoObservacao: tipoObs,
            legendaTecnica: valor.legendaTecnica || valor.legenda || ('Registro fotográfico padronizado do ambiente ' + ambiente + '.'),
            nome: valor.nome || valor.nomeArquivo || valor.name || 'foto_vistoria.jpg',
            mimeType: valor.mimeType || 'image/jpeg',
            url: url,
            dataUrl: dataUrl,
            hash: hash,
            fileId: fileId,
            thumbnailUrl: valor.thumbnailUrl || '',
            largura: valor.largura || valor.width || '',
            altura: valor.altura || valor.height || '',
            tamanhoBytes: valor.tamanhoBytes || valor.bytes || ''
          });
        }
      }
      Object.keys(valor).forEach(function(k) {
        if (/^__fotosRemovidas$|^__fotos_removidas$/i.test(String(k))) return;
        andar(valor[k], caminho ? caminho + '.' + k : k);
      });
    }
  }

  andar(dados, '');
  return fotos;
}

function uploadImagemVistoria(base64Data, nomeArquivo) {
  try {
    garantirEstruturaDoSistema();
    if (!base64Data || !nomeArquivo) return { sucesso: false, msg: 'Imagem ou nome do arquivo ausente.' };
    var tipo = 'image/jpeg';
    var entrada = String(base64Data || '');
    var dadosPuros = entrada;
    if (entrada.indexOf('data:') === 0) {
      tipo = entrada.split(';')[0].split(':')[1] || 'image/jpeg';
      dadosPuros = entrada.split(',')[1] || '';
    }
    if (!dadosPuros) return { sucesso: false, msg: 'Base64 da imagem está vazio.' };
    var bytes = Utilities.base64Decode(dadosPuros);
    var nomeSeguro = String(nomeArquivo || 'foto_vistoria.jpg').replace(/[\\/:*?"<>|]+/g, '_');
    var blob = Utilities.newBlob(bytes, tipo, nomeSeguro);
    var arquivo = obterPastaVistorias().createFile(blob);
    try { arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}
    var fileUrl = arquivo.getUrl();
    return {
      sucesso: true,
      url: fileUrl,
      driveUrl: fileUrl,
      thumbnailUrl: normalizeDriveUrl_(fileUrl, 900),
      directViewUrl: getLogoPublicUrlAlt_(fileUrl),
      hash: AUT_HASH_(dadosPuros),
      fileId: arquivo.getId(),
      arquivoId: arquivo.getId(),
      nome: nomeSeguro,
      mimeType: tipo,
      tamanhoBytes: bytes.length,
      fotoId: 'FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no upload da imagem: ' + e.message };
  }
}

function AUT_CHAVE_FOTO_LAUDO_V12_(idLaudo, ambiente, hash, fileId, url) {
  return [
    String(idLaudo || '').trim(),
    AUT_NORM_(ambiente || ''),
    String(hash || '').trim(),
    String(fileId || '').trim(),
    String(url || '').trim()
  ].join('::');
}

function AUT_CONTAR_FOTOS_LAUDO_V12_(ss, idLaudo, numeroLaudo) {
  var sh = ss.getSheetByName('FOTOS_LAUDO');
  if (!sh || sh.getLastRow() < 2) return 0;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var count = 0;
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var rowId = AUT_GET_(obj, ['ID_LAUDO']);
    var rowNum = AUT_GET_(obj, ['NUMERO_LAUDO']);
    if (String(rowId) !== String(idLaudo) && String(rowNum) !== String(numeroLaudo)) continue;
    count++;
  }
  return count;
}

function AUT_VINCULAR_FOTOS_(ss, idLaudo, numeroLaudo, dados) {
  var fotos = AUT_EXTRAIR_FOTOS_PAYLOAD_(dados);
  if (!fotos.length) return 0;
  var sh = ss.getSheetByName('FOTOS_LAUDO');
  var jaExiste = {};
  if (sh.getLastRow() > 1) {
    var atuais = sh.getDataRange().getValues();
    var headersAtuais = atuais[0];
    for (var i = 1; i < atuais.length; i++) {
      var atual = AUT_ROW_TO_OBJ_(headersAtuais, atuais[i]);
      var rowId = AUT_GET_(atual, ['ID_LAUDO']);
      var rowNum = AUT_GET_(atual, ['NUMERO_LAUDO']);
      if (String(rowId) !== String(idLaudo) && String(rowNum) !== String(numeroLaudo)) continue;
      var rowUrl = AUT_GET_(atual, ['FOTO_URL', 'URL']);
      var rowFileId = AUT_GET_(atual, ['ARQUIVO_ID']) || extractDriveId_(rowUrl);
      jaExiste[AUT_CHAVE_FOTO_LAUDO_V12_(idLaudo, AUT_GET_(atual, ['AMBIENTE']), AUT_GET_(atual, ['HASH_FOTO']), rowFileId, rowUrl)] = true;
    }
  }

  var rows = [];
  fotos.forEach(function(f) {
    var url = f.url || '';
    var fileId = f.fileId || extractDriveId_(url);
    if (!url && f.dataUrl) {
      var up = uploadImagemVistoria(f.dataUrl, f.nome || 'foto_vistoria.jpg');
      if (up && up.sucesso) {
        url = up.url || up.driveUrl || '';
        fileId = up.fileId || up.arquivoId || fileId;
        f.hash = f.hash || up.hash;
        f.thumbnailUrl = f.thumbnailUrl || up.thumbnailUrl || '';
        f.tamanhoBytes = f.tamanhoBytes || up.tamanhoBytes || '';
      }
    }
    if (!url && fileId) url = 'https://drive.google.com/file/d/' + fileId + '/view';
    if (!url) return;
    var hash = f.hash || AUT_HASH_(url + fileId + f.nome);
    var ambienteFoto = f.ambiente || '';
    var chave = AUT_CHAVE_FOTO_LAUDO_V12_(idLaudo, ambienteFoto, hash, fileId, url);
    if (jaExiste[chave]) return;
    rows.push({
      ID_FOTO: f.id || ('FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)),
      ID_LAUDO: idLaudo,
      NUMERO_LAUDO: numeroLaudo,
      AMBIENTE: ambienteFoto,
      ITEM: f.item || '',
      TIPO_OBSERVACAO: f.tipoObservacao || f.item || 'Registro fotográfico técnico do ambiente',
      LEGENDA_TECNICA: f.legendaTecnica || '',
      NOME_ARQUIVO: f.nome || 'foto_vistoria.jpg',
      MIME_TYPE: f.mimeType || 'image/jpeg',
      FOTO_URL: url,
      FOTO_DATA_URL: '',
      HASH_FOTO: hash,
      CRIADO_EM: new Date(),
      ARQUIVO_ID: fileId || '',
      FOTO_THUMB_URL: f.thumbnailUrl || normalizeDriveUrl_(url, 900),
      LARGURA: f.largura || '',
      ALTURA: f.altura || '',
      TAMANHO_BYTES: f.tamanhoBytes || ''
    });
    jaExiste[chave] = true;
  });
  return AUT_APPEND_MANY_OBJ_(sh, rows);
}

function AUT_CONTAR_FOTOS_AMBIENTE_V6_(dados, idAmb) {
  var fotos = AUT_EXTRAIR_FOTOS_PAYLOAD_(dados || {});
  var count = 0;
  fotos.forEach(function(f) {
    if (String(f.ambienteCodigo || '') === String(idAmb)) count++;
  });
  return count;
}

function AUT_VINCULAR_AMBIENTES_ITENS_(ss, idLaudo, numeroLaudo, dados) {
  dados = dados || {};
  var shAmb = ss.getSheetByName('AMBIENTES_LAUDO');
  var shItens = ss.getSheetByName('ITENS_AMBIENTE');
  AUT_REMOVER_LAUDO_DE_ABA_(shAmb, idLaudo);
  AUT_REMOVER_LAUDO_DE_ABA_(shItens, idLaudo);

  var grupos = {};
  Object.keys(dados).forEach(function(k) {
    var m = String(k).match(/^amb_(\d+)_(.+)$/);
    if (!m) return;
    var id = 'amb_' + m[1];
    if (!grupos[id]) grupos[id] = { ordem: Number(m[1]), campos: {} };
    grupos[id].campos[m[2]] = dados[k];
  });

  var ambRows = [];
  var itemRows = [];
  var componentes = [
    { key: 'piso', item: 'PISO', label: 'Piso' },
    { key: 'paredes', item: 'PAREDES / PINTURA', label: 'Paredes / pintura' },
    { key: 'teto', item: 'TETO / FORRO', label: 'Teto / forro' },
    { key: 'infra', item: 'ELETRICA / HIDRAULICA', label: 'Elétrica / hidráulica' },
    { key: 'esquadrias', item: 'ESQUADRIAS', label: 'Esquadrias' }
  ];

  Object.keys(grupos).sort(function(a, b) { return grupos[a].ordem - grupos[b].ordem; }).forEach(function(idAmb) {
    var g = grupos[idAmb];
    var c = g.campos || {};
    var nome = c.tipo_ambiente || '';
    if (!nome) return;
    var idAmbiente = idLaudo + '_' + idAmb;
    var qtdFotos = AUT_CONTAR_FOTOS_AMBIENTE_V6_(dados, idAmb);
    ambRows.push({
      ID_AMBIENTE: idAmbiente,
      ID_LAUDO: idLaudo,
      NUMERO_LAUDO: numeroLaudo,
      ORDEM: g.ordem,
      NOME_AMBIENTE: nome,
      PISO: c.piso || '',
      PISO_OBS: c.piso_obs || '',
      PAREDES: c.paredes || '',
      PAREDES_OBS: c.paredes_obs || '',
      TETO: c.teto || '',
      TETO_OBS: c.teto_obs || '',
      ELETRICA_HIDRAULICA: c.infra || '',
      ELETRICA_HIDRAULICA_OBS: c.infra_obs || '',
      ESQUADRIAS: c.esquadrias || '',
      ESQUADRIAS_OBS: c.esquadrias_obs || '',
      ANAMNESE_JSON: c.anamnese || '',
      OBSERVACOES: c.obs || '',
      QTD_FOTOS: qtdFotos,
      CRIADO_EM: new Date(),
      ATUALIZADO_EM: new Date()
    });
    componentes.forEach(function(comp) {
      var estado = c[comp.key] || '';
      var obsPontual = c[comp.key + '_obs'] || '';
      if (!estado && !obsPontual) return;
      itemRows.push({
        ID_ITEM: idAmbiente + '_' + AUT_NORM_(comp.item),
        ID_AMBIENTE: idAmbiente,
        ID_LAUDO: idLaudo,
        NUMERO_LAUDO: numeroLaudo,
        AMBIENTE: nome,
        ITEM: comp.item,
        ESTADO: estado,
        TIPO_OBSERVACAO: obsPontual ? 'Observação técnica pontual do item' : 'Condição declarada do item',
        OBSERVACAO: obsPontual || c.obs || '',
        LEGENDA_TECNICA: comp.label + ' do ambiente ' + nome + ' avaliado no laudo ' + numeroLaudo + '.',
        CRIADO_EM: new Date(),
        ATUALIZADO_EM: new Date()
      });
    });
  });
  AUT_APPEND_MANY_OBJ_(shAmb, ambRows);
  AUT_APPEND_MANY_OBJ_(shItens, itemRows);
  return itemRows.length;
}

function apiListarProcessos() {
  try {
    garantirEstruturaDoSistema();
    var cached = AUT_CACHE_GET_JSON_('AUTENTIKO_V6_LISTA_PROCESSOS');
    if (cached) {
      cached.cache = true;
      return cached;
    }
    var ss = AUT_SS_FAST_();
    var processos = AUT_LER_ITENS_(ss, 'PROCESSOS');
    var registros = processos.length ? [] : AUT_LER_ITENS_(ss, 'REGISTRO_DE_VISTORIA');
    var mapa = {};
    registros.forEach(function(item) { mapa[String(item.id || item.numero)] = item; });
    processos.forEach(function(item) {
      var key = String(item.id || item.numero);
      mapa[key] = Object.assign(mapa[key] || {}, item);
    });
    var dados = Object.keys(mapa).map(function(k) { return mapa[k]; });
    dados.sort(function(a, b) {
      return String(b.atualizadoEm || b.criadoEm || b.dataVistoria || '').localeCompare(String(a.atualizadoEm || a.criadoEm || a.dataVistoria || ''));
    });
    var res = { sucesso: true, ok: true, dados: dados, processos: dados, laudos: dados, total: dados.length, cache: false };
    AUT_CACHE_PUT_JSON_('AUTENTIKO_V6_LISTA_PROCESSOS', res, 600);
    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.LISTA_PROCESSOS, res, 600);
    return res;
  } catch (e) {
    return { sucesso: false, ok: false, dados: [], processos: [], laudos: [], total: 0, msg: 'Erro ao listar processos: ' + e.message };
  }
}

function AUT_FOTOS_LAUDO_LEVES_FINAL_(ss, idLaudo, numeroLaudo) {
  var sh = ss.getSheetByName('FOTOS_LAUDO');
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var out = [];

  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var id = AUT_GET_(obj, ['ID_LAUDO']);
    var num = AUT_GET_(obj, ['NUMERO_LAUDO']);
    if (String(id) !== String(idLaudo) && String(num) !== String(numeroLaudo)) continue;

    var url = AUT_GET_(obj, ['FOTO_URL', 'URL']);
    var arquivoId = AUT_GET_(obj, ['ARQUIVO_ID']) || extractDriveId_(url);
    out.push({
      id: AUT_GET_(obj, ['ID_FOTO']),
      fotoId: AUT_GET_(obj, ['ID_FOTO']),
      ambiente: AUT_GET_(obj, ['AMBIENTE']),
      ambienteCodigo: '',
      item: AUT_GET_(obj, ['ITEM']),
      tipoObservacao: AUT_GET_(obj, ['TIPO_OBSERVACAO']),
      legendaTecnica: AUT_GET_(obj, ['LEGENDA_TECNICA']),
      nome: AUT_GET_(obj, ['NOME_ARQUIVO']),
      url: url,
      driveUrl: url,
      directViewUrl: arquivoId ? ('https://drive.google.com/uc?export=view&id=' + encodeURIComponent(arquivoId)) : url,
      thumbnailUrl: AUT_GET_(obj, ['FOTO_THUMB_URL']) || (url ? normalizeDriveUrl_(url, 900) : ''),
      hash: AUT_GET_(obj, ['HASH_FOTO']),
      arquivoId: arquivoId,
      mimeType: AUT_GET_(obj, ['MIME_TYPE']) || 'image/jpeg',
      largura: AUT_GET_(obj, ['LARGURA']),
      altura: AUT_GET_(obj, ['ALTURA']),
      tamanhoBytes: AUT_GET_(obj, ['TAMANHO_BYTES'])
    });
  }
  return out;
}

function AUT_EDIT_IDS_CANDIDATOS_FINAL_(idLaudo) {
  var raw = String(idLaudo || '').trim();
  var out = [];
  var seen = {};
  function add(v) {
    v = String(v || '').trim();
    if (!v || seen[v]) return;
    seen[v] = true;
    out.push(v);
  }
  add(raw);
  add(raw.replace(/^LAUDO[\s:#-]*/i, ''));
  add(raw.replace(/^PROCESSO[\s:#-]*/i, ''));
  add(raw.replace(/^REVISAO[\s:#-]*/i, ''));
  var digits = raw.replace(/\D+/g, '');
  add(digits);
  return out;
}

function AUT_ID_EDICAO_EQ_V8_(a, b) {
  var sa = String(a === null || a === undefined ? '' : a).trim();
  var sb = String(b === null || b === undefined ? '' : b).trim();
  if (!sa || !sb) return false;
  if (sa === sb) return true;
  if (sa.toUpperCase() === sb.toUpperCase()) return true;
  var da = sa.replace(/\D+/g, '');
  var db = sb.replace(/\D+/g, '');
  return !!(da && db && da === db);
}

function AUT_LAUDO_MATCH_ROW_V8_(headers, row, idBusca) {
  var obj = AUT_ROW_TO_OBJ_(headers, row);
  var candidatos = [
    AUT_GET_(obj, ['ID_LAUDO']),
    AUT_GET_(obj, ['ID_PROCESSO']),
    AUT_GET_(obj, ['NUMERO_LAUDO']),
    AUT_GET_(obj, ['CODIGO_LAUDO']),
    AUT_GET_(obj, ['ID_DOCUMENTO']),
    row[0],
    row[1],
    row[2]
  ];
  for (var c = 0; c < candidatos.length; c++) {
    if (AUT_ID_EDICAO_EQ_V8_(candidatos[c], idBusca)) return true;
  }
  return false;
}

function AUT_LOCALIZAR_REGISTRO_LAUDO_V8_(ss, idBusca) {
  var sheets = AUT_REGISTRO_SHEETS_(ss);
  for (var s = 0; s < sheets.length; s++) {
    var sh = sheets[s];
    if (!sh || sh.getLastRow() < 2) continue;
    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];
    for (var r = 1; r < values.length; r++) {
      if (!AUT_LAUDO_MATCH_ROW_V8_(headers, values[r], idBusca)) continue;
      var rawObj = AUT_ROW_TO_OBJ_(headers, values[r]);
      var achado = { sheet: sh, rowNumber: r + 1, row: values[r], rowObjRaw: rawObj, rowObj: rawObj, headers: headers };
      achado.payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
      achado.rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
      return achado;
    }
  }
  return null;
}

function AUT_LOCALIZAR_PROCESSO_V8_(ss, idBusca) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return null;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  for (var r = 1; r < values.length; r++) {
    if (!AUT_LAUDO_MATCH_ROW_V8_(headers, values[r], idBusca)) continue;
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    return { sheet: sh, rowNumber: r + 1, row: values[r], rowObj: obj, headers: headers };
  }
  return null;
}

function AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V8_(ss, idBusca) {
  var proc = AUT_LOCALIZAR_PROCESSO_V8_(ss, idBusca);
  if (!proc) return null;
  var idReal = AUT_GET_(proc.rowObj, ['ID_LAUDO', 'ID_PROCESSO']) || idBusca;
  var existente = AUT_LOCALIZAR_REGISTRO_LAUDO_V8_(ss, idReal) ||
    AUT_LOCALIZAR_REGISTRO_LAUDO_V8_(ss, AUT_GET_(proc.rowObj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']));
  if (existente) return existente;

  var payload = AUT_PAYLOAD_DE_PROCESSO_V5_(proc.rowObj);
  var registro = AUT_MONTAR_REGISTRO_LAUDO_(payload, idReal, AUT_GET_(proc.rowObj, ['HASH_LAUDO']) || '');
  registro.PDF_URL = AUT_GET_(proc.rowObj, ['PDF_URL']) || '';
  registro.PDF_HASH = AUT_GET_(proc.rowObj, ['PDF_HASH']) || '';
  registro.HASH_DOCUMENTO = AUT_GET_(proc.rowObj, ['HASH_DOCUMENTO']) || '';
  registro.MANIFESTO_URL = AUT_GET_(proc.rowObj, ['MANIFESTO_URL']) || '';
  AUT_APPEND_OBJ_(AUT_REGISTRO_SHEET_(ss), registro);
  AUT_INVALIDAR_CACHES_();
  return AUT_LOCALIZAR_REGISTRO_LAUDO_V8_(ss, idReal) || AUT_LOCALIZAR_REGISTRO_LAUDO_V8_(ss, registro.NUMERO_LAUDO);
}

function AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo, numeroFallback) {
  var candidatos = [];
  AUT_EDIT_IDS_CANDIDATOS_FINAL_(idLaudo).forEach(function(v) { candidatos.push(v); });
  AUT_EDIT_IDS_CANDIDATOS_FINAL_(numeroFallback).forEach(function(v) { candidatos.push(v); });
  var seen = {};
  candidatos = candidatos.filter(function(v) {
    v = String(v || '').trim();
    if (!v || seen[v]) return false;
    seen[v] = true;
    return true;
  });
  for (var i = 0; i < candidatos.length; i++) {
    var achado = AUT_LOCALIZAR_REGISTRO_LAUDO_V8_(ss, candidatos[i]);
    if (achado) return { achado: achado, idUsado: candidatos[i] };
  }
  for (var p = 0; p < candidatos.length; p++) {
    var criado = AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V8_(ss, candidatos[p]);
    if (criado) return { achado: criado, idUsado: candidatos[p] };
  }
  return null;
}

function AUT_FORMAT_DATE_CLIENTE_V8_(date, key) {
  if (!(date instanceof Date)) return date;
  var tz = Session.getScriptTimeZone();
  var nk = AUT_NORM_(key || '');
  if (nk.indexOf('HORA') >= 0) return Utilities.formatDate(date, tz, 'HH:mm');
  if (nk.indexOf('DATA_REGISTRO') >= 0 || nk.indexOf('CRIADO') >= 0 || nk.indexOf('ATUALIZADO') >= 0 || nk.indexOf('EDITADO') >= 0 || nk.indexOf('GERADO') >= 0) {
    return Utilities.formatDate(date, tz, 'dd/MM/yyyy HH:mm:ss');
  }
  return Utilities.formatDate(date, tz, 'yyyy-MM-dd');
}

function AUT_JSON_CLIENTE_SEGURO_V8_(valor, key) {
  if (valor instanceof Date) return AUT_FORMAT_DATE_CLIENTE_V8_(valor, key);
  if (valor === null || valor === undefined) return '';
  if (Array.isArray(valor)) {
    return valor.map(function(item) { return AUT_JSON_CLIENTE_SEGURO_V8_(item, key); });
  }
  if (typeof valor === 'object') {
    var out = {};
    Object.keys(valor).forEach(function(k) {
      out[k] = AUT_JSON_CLIENTE_SEGURO_V8_(valor[k], k);
    });
    return out;
  }
  return valor;
}

function AUT_NORMALIZAR_PAYLOAD_EDICAO_CLIENTE_V8_(payload) {
  payload = AUT_JSON_CLIENTE_SEGURO_V8_(payload || {}, '');
  if (payload.etapa1_data && payload.etapa1_data instanceof Date) {
    payload.etapa1_data = AUT_FORMAT_DATE_CLIENTE_V8_(payload.etapa1_data, 'etapa1_data');
  }
  if (payload.etapa1_hora && payload.etapa1_hora instanceof Date) {
    payload.etapa1_hora = AUT_FORMAT_DATE_CLIENTE_V8_(payload.etapa1_hora, 'etapa1_hora');
  }
  return payload;
}

function AUT_COMPLETAR_PAYLOAD_EDICAO_FINAL_(payload, rowObj, idLaudo) {
  payload = payload || {};
  rowObj = rowObj || {};
  AUT_MERGE_SE_VAZIO_(payload, 'idLaudo', rowObj.ID_LAUDO || idLaudo);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_numeroLaudo', rowObj.NUMERO_LAUDO || rowObj.CODIGO_LAUDO || idLaudo);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_data', rowObj.DATA_VISTORIA);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_hora', rowObj.HORA_VISTORIA);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_vistoriador', rowObj.VISTORIADOR || rowObj.RESPONSAVEL);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_proprietario', rowObj.PROPRIETARIO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_cpf_prop', rowObj.CPF_PROPRIETARIO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_locatario', rowObj.LOCATARIO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_cpf_loc', rowObj.CPF_LOCATARIO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_contato', rowObj.CONTATO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_email', rowObj.EMAIL);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_rua', rowObj.RUA);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_numero', rowObj.NUMERO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_referencia', rowObj.REFERENCIA);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_bairro', rowObj.BAIRRO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_cidade', rowObj.CIDADE);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_cep', rowObj.CEP);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_endereco', rowObj.ENDERECO_IMOVEL || rowObj.ENDERECO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_tipo', rowObj.TIPO_VISTORIA);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_categoria', rowObj.CATEGORIA_IMOVEL);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_locacao', rowObj.TIPO_LOCACAO);
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_estado', rowObj.ESTADO_IMOVEL);
  return payload;
}

function AUT_TEM_AMBIENTES_PAYLOAD_FINAL_(payload) {
  payload = payload || {};
  var keys = Object.keys(payload);
  for (var i = 0; i < keys.length; i++) {
    if (/^amb_\d+_tipo_ambiente$/i.test(keys[i])) return true;
  }
  return false;
}

function AUT_RECONSTRUIR_AMBIENTES_EDICAO_FINAL_(ss, payload, idLaudo, numeroLaudo) {
  payload = payload || {};
  if (AUT_TEM_AMBIENTES_PAYLOAD_FINAL_(payload)) return payload;
  var sh = ss.getSheetByName('AMBIENTES_LAUDO');
  if (!sh || sh.getLastRow() < 2) return payload;

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var id = AUT_GET_(obj, ['ID_LAUDO']);
    var num = AUT_GET_(obj, ['NUMERO_LAUDO']);
    if (String(id) !== String(idLaudo) && String(num) !== String(numeroLaudo)) continue;
    rows.push(obj);
  }

  rows.sort(function(a, b) {
    return (Number(AUT_GET_(a, ['ORDEM'])) || 0) - (Number(AUT_GET_(b, ['ORDEM'])) || 0);
  });
  rows.forEach(function(obj, idx) {
    var ordem = Number(AUT_GET_(obj, ['ORDEM'])) || (6 + idx);
    var prefix = 'amb_' + ordem;
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_tipo_ambiente', AUT_GET_(obj, ['NOME_AMBIENTE', 'AMBIENTE']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_piso', AUT_GET_(obj, ['PISO']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_piso_obs', AUT_GET_(obj, ['PISO_OBS']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_paredes', AUT_GET_(obj, ['PAREDES']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_paredes_obs', AUT_GET_(obj, ['PAREDES_OBS']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_teto', AUT_GET_(obj, ['TETO']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_teto_obs', AUT_GET_(obj, ['TETO_OBS']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_infra', AUT_GET_(obj, ['ELETRICA_HIDRAULICA']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_infra_obs', AUT_GET_(obj, ['ELETRICA_HIDRAULICA_OBS']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_esquadrias', AUT_GET_(obj, ['ESQUADRIAS']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_esquadrias_obs', AUT_GET_(obj, ['ESQUADRIAS_OBS']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_anamnese', AUT_GET_(obj, ['ANAMNESE_JSON']));
    AUT_MERGE_SE_VAZIO_(payload, prefix + '_obs', AUT_GET_(obj, ['OBSERVACOES']));
  });
  return payload;
}

function apiObterLaudoParaEdicao(idLaudo, numeroFallback) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do processo/laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo, numeroFallback);
    if (!localizado || !localizado.achado) {
      return { sucesso: false, ok: false, msg: 'Não encontrei o laudo/processo "' + idLaudo + '" para edição. Atualize consultas e tente novamente.' };
    }
    var achado = localizado.achado;

    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || idLaudo;
    payload = AUT_COMPLETAR_PAYLOAD_EDICAO_FINAL_(payload, rowObj, idReal);
    payload = AUT_RECONSTRUIR_AMBIENTES_EDICAO_FINAL_(ss, payload, idReal, numero);
    var fotos = AUT_FOTOS_LAUDO_LEVES_FINAL_(ss, idReal, numero);
    var statusLaudo = AUT_STATUS_LAUDO_ATUAL_V7_(ss, idReal, numero, rowObj, payload);
    payload = AUT_NORMALIZAR_PAYLOAD_EDICAO_CLIENTE_V8_(payload);
    rowObj = AUT_JSON_CLIENTE_SEGURO_V8_(rowObj, '');
    fotos = AUT_JSON_CLIENTE_SEGURO_V8_(fotos, '');

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      status: statusLaudo,
      rascunho: statusLaudo === 'RASCUNHO',
      payload: payload,
      rowObj: rowObj,
      fotos: fotos,
      modoEdicaoLeve: true,
      idBusca: localizado.idUsado,
      serializado: true
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao abrir edição: ' + e.message, erro: e.message };
  }
}

function abrirLaudoParaEdicao(idLaudo, numeroFallback) {
  return apiObterLaudoParaEdicao(idLaudo, numeroFallback);
}

function apiDiagnosticarEdicaoLaudo(idLaudo, numeroFallback) {
  try {
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo, numeroFallback);
    var proc = AUT_LOCALIZAR_PROCESSO_V8_(ss, idLaudo) || AUT_LOCALIZAR_PROCESSO_V8_(ss, numeroFallback);
    return {
      sucesso: true,
      idInformado: String(idLaudo || ''),
      numeroFallback: String(numeroFallback || ''),
      achouRegistro: !!(localizado && localizado.achado),
      idUsado: localizado ? localizado.idUsado : '',
      abaRegistro: localizado && localizado.achado && localizado.achado.sheet ? localizado.achado.sheet.getName() : '',
      linhaRegistro: localizado && localizado.achado ? localizado.achado.rowNumber : '',
      achouProcesso: !!proc,
      linhaProcesso: proc ? proc.rowNumber : '',
      msg: localizado && localizado.achado ? 'Laudo localizável para edição.' : 'Laudo não localizado pelo diagnóstico.'
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no diagnóstico de edição: ' + e.message, erro: e.message };
  }
}

function doGet(e) {
  garantirEstruturaDoSistema();
  var params = (e && e.parameter) ? e.parameter : {};
  if (params.api === 'verifySignature' && typeof AUT_SIGN_JSONP_VERIFY_ === 'function') {
    return AUT_SIGN_JSONP_VERIFY_(params);
  }
  if ((params.sign || params.assinar) && typeof AUT_SIGN_RENDER_SIGN_ === 'function') {
    return AUT_SIGN_RENDER_SIGN_(params);
  }
  if ((params.verify || params.verificar) && typeof AUT_SIGN_RENDER_VERIFY_ === 'function') {
    return AUT_SIGN_RENDER_VERIFY_(params);
  }
  if ((params.manifestoAssinatura || params.manifestoassinatura) && typeof AUT_SIGN_RENDER_MANIFESTO_ === 'function') {
    return AUT_SIGN_RENDER_MANIFESTO_(params);
  }
  if (params.manifesto || params.m) {
    return AUT_RENDER_MANIFESTO_V7_(params);
  }
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('AUTENTIKO-OK CHECK - Palmer Imóveis')
    .setFaviconUrl('https://img.icons8.com/fluency/48/000000/ok.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .addMetaTag('apple-mobile-web-app-capable', 'yes');
}

function AUT_ESCAPE_HTML_V7_(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function AUT_LOCALIZAR_MANIFESTO_V7_(ss, id) {
  var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, id);
  if (localizado && localizado.achado) return localizado.achado;
  var sheets = AUT_REGISTRO_SHEETS_(ss);
  for (var s = 0; s < sheets.length; s++) {
    var sh = sheets[s];
    if (!sh || sh.getLastRow() < 2) continue;
    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];
    for (var r = 1; r < values.length; r++) {
      var raw = AUT_ROW_TO_OBJ_(headers, values[r]);
      var doc = AUT_GET_(raw, ['ID_DOCUMENTO']);
      if (String(doc) === String(id)) {
        var achado = { sheet: sh, rowNumber: r + 1, row: values[r], rowObjRaw: raw, rowObj: raw, headers: headers };
        achado.payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
        achado.rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
        return achado;
      }
    }
  }
  return null;
}

function AUT_RENDER_MANIFESTO_V7_(params) {
  params = params || {};
  var id = String(params.id || params.manifesto || params.m || '').trim();
  var hashInformado = String(params.hash || '').trim();
  var ss = AUT_SS_FAST_();
  var achado = id ? AUT_LOCALIZAR_MANIFESTO_V7_(ss, id) : null;
  var rowObj = achado ? AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado) : {};
  var rawObj = achado ? (achado.rowObjRaw || achado.rowObj || {}) : {};
  function getDoc(keys) {
    return AUT_GET_(rawObj, keys) || AUT_GET_(rowObj, keys);
  }
  var hashAtual = getDoc(['HASH_DOCUMENTO', 'PDF_HASH', 'HASH_LAUDO']);
  var status = achado && (!hashInformado || String(hashInformado) === String(hashAtual)) ? 'AUTÊNTICO' : 'NÃO CONFIRMADO';
  var cor = status === 'AUTÊNTICO' ? '#047857' : '#b91c1c';
  var html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Manifesto de Autenticidade - AUTENTIKO-OK CHECK</title>' +
    '<style>body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f8fafc;color:#111827}.wrap{max-width:760px;margin:32px auto;background:#fff;border:1px solid #dbe3ef;padding:24px}.brand{font-size:12px;color:#475569;text-transform:uppercase;font-weight:700}.status{color:' + cor + ';font-size:26px;font-weight:800;margin:10px 0 18px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #e2e8f0;padding:9px;text-align:left;vertical-align:top}th{width:210px;background:#f1f5f9}.hash{font-family:Consolas,monospace;word-break:break-all;font-size:12px}.note{font-size:12px;color:#475569;line-height:1.5;margin-top:16px}</style>' +
    '</head><body><main class="wrap"><div class="brand">AUTENTIKO-OK CHECK | Palmer Imóveis</div>' +
    '<h1>Manifesto de Autenticidade</h1><div class="status">' + status + '</div><table>' +
    '<tr><th>ID consultado</th><td>' + AUT_ESCAPE_HTML_V7_(id) + '</td></tr>' +
    '<tr><th>ID do laudo</th><td>' + AUT_ESCAPE_HTML_V7_(getDoc(['ID_LAUDO'])) + '</td></tr>' +
    '<tr><th>Número do laudo</th><td>' + AUT_ESCAPE_HTML_V7_(getDoc(['NUMERO_LAUDO', 'CODIGO_LAUDO'])) + '</td></tr>' +
    '<tr><th>Documento</th><td>' + AUT_ESCAPE_HTML_V7_(getDoc(['ID_DOCUMENTO'])) + '</td></tr>' +
    '<tr><th>Hash documental atual</th><td class="hash">' + AUT_ESCAPE_HTML_V7_(hashAtual) + '</td></tr>' +
    '<tr><th>Hash informado no QR</th><td class="hash">' + AUT_ESCAPE_HTML_V7_(hashInformado) + '</td></tr>' +
    '<tr><th>Gerado em</th><td>' + AUT_ESCAPE_HTML_V7_(getDoc(['PDF_GERADO_EM', 'DATA_REGISTRO'])) + '</td></tr>' +
    '<tr><th>Status de revisão</th><td>' + AUT_ESCAPE_HTML_V7_(getDoc(['REVISAO_STATUS']) || 'VIGENTE') + '</td></tr>' +
    '</table><div class="note">Este manifesto confirma a existência do registro técnico na base administrativa e confronta o ID/hash informado no QR Code com o hash documental atualmente registrado. Não substitui assinatura física ou eletrônica qualificada, mas reforça a rastreabilidade e a integridade administrativa do laudo emitido.</div></main></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle('Manifesto AUTENTIKO-OK CHECK')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function AUT_PURGE_PAYLOAD_(dados) {
  function limpar(valor, chave) {
    var nk = AUT_NORM_(chave || '');
    if (nk === '__FOTOSREMOVIDAS' || nk === '__FOTOS_REMOVIDAS') return '';
    if (nk === 'DATAURL' || nk === 'DATA_URL' || nk === 'BASE64' || nk === 'EMBED' || nk === 'FOTO_DATA_URL') return '';
    if (valor === null || valor === undefined) return valor;
    if (typeof valor === 'string') {
      var s = valor;
      var trimmed = s.trim();
      if (/^data:(image|video)\//i.test(trimmed)) return '';
      if ((trimmed.charAt(0) === '[' || trimmed.charAt(0) === '{') && trimmed.length < 200000) {
        try { return JSON.stringify(limpar(JSON.parse(trimmed), chave)); } catch (eJson) {}
      }
      s = s.replace(/data:(image|video)\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
      if (s.length > 45000) s = s.substring(0, 45000) + '... [CORTADO PELO SISTEMA]';
      return s;
    }
    if (Array.isArray(valor)) return valor.map(function(item) { return limpar(item, chave); });
    if (typeof valor === 'object') {
      var out = {};
      Object.keys(valor).forEach(function(k) { out[k] = limpar(valor[k], k); });
      return out;
    }
    return valor;
  }
  return limpar(dados || {}, '');
}

function AUT_FOTOS_REMOVIDAS_PAYLOAD_V7_(dados) {
  dados = dados || {};
  var raw = dados.__fotosRemovidas || dados.__fotos_removidas || '';
  if (!raw) return [];
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw); } catch (eJson) { raw = raw ? [{ url: raw }] : []; }
  }
  if (!Array.isArray(raw)) raw = [raw];
  return raw.map(function(item) {
    if (typeof item === 'string') item = { url: item };
    item = item || {};
    var url = item.url || item.driveUrl || item.directViewUrl || '';
    var arquivoId = item.arquivoId || item.fileId || item.ARQUIVO_ID || extractDriveId_(url) || '';
    return {
      id: item.id || item.fotoId || item.ID_FOTO || '',
      fotoId: item.fotoId || item.id || item.ID_FOTO || '',
      hash: item.hash || item.HASH_FOTO || '',
      arquivoId: arquivoId,
      url: url,
      ambiente: item.ambiente || '',
      origemServidor: item.origemServidor ? 'SIM' : ''
    };
  }).filter(function(item) {
    return item.id || item.fotoId || item.hash || item.arquivoId || item.url;
  });
}

function AUT_REMOVER_CONTROLES_EDICAO_V7_(dados) {
  var out = {};
  dados = dados || {};
  Object.keys(dados).forEach(function(k) {
    if (/^__fotosRemovidas$|^__fotos_removidas$/i.test(String(k))) return;
    out[k] = dados[k];
  });
  return out;
}

function AUT_APLICAR_FOTOS_REMOVIDAS_V7_(ss, idLaudo, numeroLaudo, dados) {
  var removidas = AUT_FOTOS_REMOVIDAS_PAYLOAD_V7_(dados || {});
  if (!removidas.length) return 0;
  var sh = ss.getSheetByName('FOTOS_LAUDO');
  if (!sh || sh.getLastRow() < 2) return 0;

  var ids = {};
  var hashes = {};
  var arquivos = {};
  var urls = {};
  removidas.forEach(function(f) {
    if (f.id) ids[String(f.id)] = true;
    if (f.fotoId) ids[String(f.fotoId)] = true;
    if (f.hash) hashes[String(f.hash)] = true;
    if (f.arquivoId) arquivos[String(f.arquivoId)] = true;
    if (f.url) {
      urls[String(f.url)] = true;
      var idUrl = extractDriveId_(f.url);
      if (idUrl) arquivos[String(idUrl)] = true;
    }
  });

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var removidasRows = 0;
  for (var r = values.length - 1; r >= 1; r--) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var rowIdLaudo = AUT_GET_(obj, ['ID_LAUDO']);
    var rowNumero = AUT_GET_(obj, ['NUMERO_LAUDO']);
    var pertenceAoDestino = String(rowIdLaudo) === String(idLaudo) || String(rowNumero) === String(numeroLaudo);
    if (!pertenceAoDestino) continue;

    var fotoId = AUT_GET_(obj, ['ID_FOTO']);
    var hash = AUT_GET_(obj, ['HASH_FOTO']);
    var url = AUT_GET_(obj, ['FOTO_URL', 'URL']);
    var arquivoId = AUT_GET_(obj, ['ARQUIVO_ID']) || extractDriveId_(url);
    var bateu = (fotoId && ids[String(fotoId)]) ||
      (hash && hashes[String(hash)]) ||
      (arquivoId && arquivos[String(arquivoId)]) ||
      (url && urls[String(url)]);
    if (!bateu) continue;
    sh.deleteRow(r + 1);
    removidasRows++;
  }
  return removidasRows;
}

function excluirImagemVistoria(fotoId, arquivoId, hashFoto, urlFoto) {
  try {
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    fotoId = String(fotoId || '').trim();
    arquivoId = String(arquivoId || '').trim();
    hashFoto = String(hashFoto || '').trim();
    urlFoto = String(urlFoto || '').trim();

    if (!urlFoto && /^https?:\/\//i.test(fotoId)) {
      urlFoto = fotoId;
      fotoId = '';
    }
    if (!arquivoId && urlFoto) arquivoId = extractDriveId_(urlFoto) || '';
    if (!arquivoId && /^[A-Za-z0-9_-]{20,}$/.test(fotoId) && fotoId.indexOf('FOTO_') !== 0) {
      arquivoId = fotoId;
      fotoId = '';
    }

    var arquivoRemovido = false;
    if (arquivoId) {
      try {
        DriveApp.getFileById(arquivoId).setTrashed(true);
        arquivoRemovido = true;
      } catch (eDrive) {}
    }

    var removidas = 0;
    var sh = ss.getSheetByName('FOTOS_LAUDO');
    if (sh && sh.getLastRow() >= 2 && (fotoId || arquivoId || hashFoto || urlFoto)) {
      var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
      var headers = values[0];
      for (var r = values.length - 1; r >= 1; r--) {
        var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
        var rowUrl = AUT_GET_(obj, ['FOTO_URL', 'URL']);
        var rowArquivoId = AUT_GET_(obj, ['ARQUIVO_ID']) || extractDriveId_(rowUrl);
        var bateu = (fotoId && String(AUT_GET_(obj, ['ID_FOTO'])) === String(fotoId)) ||
          (hashFoto && String(AUT_GET_(obj, ['HASH_FOTO'])) === String(hashFoto)) ||
          (arquivoId && String(rowArquivoId) === String(arquivoId)) ||
          (urlFoto && String(rowUrl) === String(urlFoto));
        if (bateu) {
          sh.deleteRow(r + 1);
          removidas++;
        }
      }
    }

    AUT_APPEND_AUDITORIA_V7_(ss, 'EXCLUIR_FOTO_VISTORIA', fotoId || arquivoId || hashFoto || urlFoto, {
      fotoId: fotoId,
      arquivoId: arquivoId,
      hashFoto: hashFoto,
      urlInformada: urlFoto,
      linhasRemovidas: removidas,
      arquivoRemovidoDrive: arquivoRemovido
    }, '', '');
    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, msg: 'Imagem removida com trilha de auditoria.', removidas: removidas, arquivoRemovido: arquivoRemovido };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao excluir imagem: ' + e.message };
  }
}

function AUT_EXTRAIR_LINKS_VIDEO_V7_(dados) {
  var out = [];
  dados = dados || {};
  Object.keys(dados).forEach(function(k) {
    if (!/_videos?_links?$/i.test(k)) return;
    var raw = String(dados[k] || '').trim();
    if (!raw) return;
    var ambiente = '';
    var m = String(k).match(/^(amb_\d+)_/i);
    if (m && m[1]) ambiente = dados[m[1] + '_tipo_ambiente'] || m[1];
    raw.split(/\r?\n|[,;]/).forEach(function(link) {
      link = String(link || '').trim();
      if (link) out.push({ campo: k, ambiente: ambiente, url: link });
    });
  });
  return out;
}

function AUT_VALIDAR_LINKS_VIDEO_V7_(dados) {
  var links = AUT_EXTRAIR_LINKS_VIDEO_V7_(dados);
  for (var i = 0; i < links.length; i++) {
    if (!/^https?:\/\/\S+/i.test(links[i].url)) {
      return 'Vídeos devem ser informados somente como links públicos ou compartilháveis, começando por http:// ou https://.';
    }
    if (/^data:video\//i.test(links[i].url)) {
      return 'Upload/base64 de vídeo não é aceito. Informe apenas o link de acesso ao vídeo carregado na plataforma.';
    }
  }
  return '';
}

function AUT_VALIDAR_VISTORIA_(dados) {
  var categoria = AUT_GET_(dados, ['etapa3_categoria']);
  var categoriaOutros = AUT_GET_(dados, ['etapa3_categoria_outros']);
  var locacao = AUT_GET_(dados, ['etapa3_locacao']);
  var dias = AUT_GET_(dados, ['etapa3_locacao_dias']);
  if (AUT_NORM_(categoria) === 'OUTROS' && !String(categoriaOutros || '').trim()) {
    return 'Especifique a categoria quando selecionar OUTROS.';
  }
  if (AUT_NORM_(locacao) === 'DIA' && !String(dias || '').trim()) {
    return 'Informe a quantidade de dias quando o tipo de locação for DIA.';
  }
  return AUT_VALIDAR_LINKS_VIDEO_V7_(dados || {});
}

function AUT_LABEL_CAMPO_V7_(k) {
  return String(k || '')
    .replace(/^amb_(\d+)_/i, 'Ambiente $1 - ')
    .replace(/^etapa\d+_/i, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function AUT_RESUMO_ALTERACOES_V7_(antigo, novo) {
  antigo = antigo || {};
  novo = novo || {};
  var ignorar = {
    MODOEDICAO: true,
    IDLAUDOEDICAO: true,
    HISTORICOALTERACOES: true,
    ALTERACOESEDICAO: true,
    PDF_URL: true
  };
  var keys = {};
  Object.keys(antigo).forEach(function(k) { keys[k] = true; });
  Object.keys(novo).forEach(function(k) { keys[k] = true; });
  var diffs = [];
  Object.keys(keys).sort().forEach(function(k) {
    var nk = AUT_NORM_(k);
    if (ignorar[nk] || /FOTOS_URLS$/i.test(nk)) return;
    var a = String(antigo[k] === undefined || antigo[k] === null ? '' : antigo[k]);
    var b = String(novo[k] === undefined || novo[k] === null ? '' : novo[k]);
    if (a === b) return;
    if (a.length > 120) a = a.substring(0, 120) + '...';
    if (b.length > 120) b = b.substring(0, 120) + '...';
    diffs.push(AUT_LABEL_CAMPO_V7_(k) + ': "' + (a || 'vazio') + '" -> "' + (b || 'vazio') + '"');
  });
  if (!diffs.length) return 'Edição registrada sem alteração material de campos textuais; hash e revisão foram recalculados.';
  return diffs.slice(0, 30).join(' | ') + (diffs.length > 30 ? ' | Demais alterações registradas na auditoria.' : '');
}

function AUT_GERAR_ID_REVISAO_V7_(ss, idAnterior) {
  for (var i = 0; i < 30; i++) {
    var id = 'REV' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMddHHmmss') + String(Math.floor(100 + Math.random() * 900));
    if (!AUT_LOCALIZAR_LAUDO_(ss, id)) return id;
  }
  return 'REV' + Date.now();
}

function AUT_APPEND_AUDITORIA_V7_(ss, acao, idEntidade, detalhes, hashAnterior, hashAtual) {
  try {
    AUT_APPEND_OBJ_(ss.getSheetByName('AUDITORIA'), {
      ID_AUDITORIA: 'AUD_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
      QUANDO: new Date(),
      USUARIO: '',
      ACAO: acao,
      ENTIDADE: 'LAUDO_DE_VISTORIA',
      ID_ENTIDADE: idEntidade,
      DETALHES_JSON: JSON.stringify(detalhes || {}),
      HASH_ANTERIOR: hashAnterior || '',
      HASH_ATUAL: hashAtual || ''
    });
  } catch (e) {}
}

function AUT_STATUS_LAUDO_NORM_V7_(status) {
  var s = AUT_NORM_(status || '');
  if (s === 'RASCUNHO' || s === 'DRAFT') return 'RASCUNHO';
  if (s === 'SUBSTITUIDO_POR_REVISAO' || s.indexOf('SUBSTITUIDO') === 0) return 'SUBSTITUIDO_POR_REVISAO';
  if (s === 'CANCELADO' || s === 'CANCELADA') return 'CANCELADO';
  return 'REGISTRADO';
}

function AUT_DADOS_RASCUNHO_V7_(dados) {
  dados = dados || {};
  var flag = AUT_GET_(dados, ['__statusLaudo', 'statusLaudo', 'STATUS_LAUDO', '__rascunho']);
  return AUT_STATUS_LAUDO_NORM_V7_(flag) === 'RASCUNHO' || AUT_NORM_(flag) === 'SIM';
}

function AUT_BUSCAR_PROCESSO_OBJ_V7_(ss, idLaudo, numeroLaudo) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return null;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var pid = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
    var pnum = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);
    if ((idLaudo && String(pid) === String(idLaudo)) || (numeroLaudo && String(pnum) === String(numeroLaudo))) {
      obj.__rowNumber = r + 1;
      return obj;
    }
  }
  return null;
}

function AUT_STATUS_LAUDO_ATUAL_V7_(ss, idLaudo, numeroLaudo, rowObj, payload) {
  var proc = AUT_BUSCAR_PROCESSO_OBJ_V7_(ss, idLaudo, numeroLaudo);
  var statusProc = proc ? AUT_GET_(proc, ['STATUS']) : '';
  var statusPayload = AUT_GET_(payload || {}, ['__statusLaudo', 'statusLaudo', 'STATUS_LAUDO', '__rascunho']);
  var statusRevisao = AUT_GET_(rowObj || {}, ['REVISAO_STATUS']);
  if (AUT_STATUS_LAUDO_NORM_V7_(statusProc) === 'RASCUNHO') return 'RASCUNHO';
  if (AUT_STATUS_LAUDO_NORM_V7_(statusPayload) === 'RASCUNHO' || AUT_NORM_(statusPayload) === 'SIM') return 'RASCUNHO';
  if (String(statusRevisao || '').toUpperCase().indexOf('RASCUNHO') >= 0) return 'RASCUNHO';
  return AUT_STATUS_LAUDO_NORM_V7_(statusProc || 'REGISTRADO');
}

function AUT_SET_STATUS_PROCESSO_V7_(ss, idLaudo, numeroLaudo, status, extra) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return false;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var mudou = false;
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var pid = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
    var pnum = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);
    if ((idLaudo && String(pid) === String(idLaudo)) || (numeroLaudo && String(pnum) === String(numeroLaudo))) {
      var update = {
        STATUS: AUT_STATUS_LAUDO_NORM_V7_(status),
        ATUALIZADO_EM: new Date()
      };
      if (extra) Object.keys(extra).forEach(function(k) { update[k] = extra[k]; });
      AUT_ATUALIZAR_ROW_OBJ_(sh, r + 1, update);
      mudou = true;
    }
  }
  return mudou;
}

function AUT_REMOVER_AMBIENTES_ITENS_LAUDO_V7_(ss, idLaudo) {
  ['ITENS_AMBIENTE', 'AMBIENTES_LAUDO'].forEach(function(nome) {
    var sh = ss.getSheetByName(nome);
    if (!sh || sh.getLastRow() < 2) return;
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var idCol = -1;
    for (var c = 0; c < headers.length; c++) {
      if (AUT_NORM_(headers[c]) === 'ID_LAUDO') { idCol = c + 1; break; }
    }
    if (idCol < 1) return;
    var vals = sh.getRange(2, idCol, sh.getLastRow() - 1, 1).getValues();
    for (var r = vals.length - 1; r >= 0; r--) {
      if (String(vals[r][0]) === String(idLaudo)) sh.deleteRow(r + 2);
    }
  });
}

function AUT_GERAR_ID_RASCUNHO_V7_(ss) {
  for (var i = 0; i < 30; i++) {
    var id = 'RASC' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMddHHmmss') + String(Math.floor(100 + Math.random() * 900));
    if (!AUT_LOCALIZAR_LAUDO_(ss, id)) return id;
  }
  return 'RASC' + Date.now();
}

function AUT_MARCAR_PROCESSO_SUBSTITUIDO_V7_(ss, idAntigo, idNovo) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var pid = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
    if (String(pid) === String(idAntigo)) {
      AUT_ATUALIZAR_ROW_OBJ_(sh, r + 1, {
        STATUS: 'SUBSTITUIDO_POR_REVISAO',
        REVISAO_STATUS: 'SUBSTITUIDO_POR_' + idNovo,
        ATUALIZADO_EM: new Date()
      });
      return;
    }
  }
}

function apiSalvarVistoria(dados) {
  try {
    garantirEstruturaDoSistema();
    dados = dados || {};
    dados.__statusLaudo = 'REGISTRADO';
    dados.__rascunho = 'NAO';
    var erroValidacao = AUT_VALIDAR_VISTORIA_(dados || {});
    if (erroValidacao) return { sucesso: false, ok: false, msg: erroValidacao };

    var ss = AUT_SS_FAST_();
    var dadosOriginais = dados || {};
    var dadosLimpos = AUT_REMOVER_CONTROLES_EDICAO_V7_(AUT_PURGE_PAYLOAD_(dadosOriginais));
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dadosLimpos);
    registro.REVISAO_STATUS = 'VIGENTE';
    registro.PDF_URL = '';
    registro.PDF_HASH = '';
    registro.HASH_DOCUMENTO = '';
    registro.MANIFESTO_URL = '';

    AUT_APPEND_OBJ_(AUT_REGISTRO_SHEET_(ss), registro);
    AUT_UPSERT_PROCESSO_LAUDO_(ss, registro);
    AUT_SET_STATUS_PROCESSO_V7_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, 'REGISTRADO');
    var fotosRemovidas = AUT_APLICAR_FOTOS_REMOVIDAS_V7_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdFotosTotal = AUT_CONTAR_FOTOS_LAUDO_V12_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO);
    AUT_REMOVER_AMBIENTES_ITENS_LAUDO_V7_(ss, registro.ID_LAUDO);
    var qtdItens = AUT_VINCULAR_AMBIENTES_ITENS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosLimpos);
    AUT_APPEND_AUDITORIA_V7_(ss, 'CRIAR_LAUDO_REGISTRADO', registro.ID_LAUDO, {
      numeroLaudo: registro.NUMERO_LAUDO,
      fotosRemovidas: fotosRemovidas,
      qtdFotos: qtdFotosTotal,
      qtdFotosInseridas: qtdFotos,
      qtdItens: qtdItens
    }, '', registro.HASH_LAUDO);
    AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: registro.ID_LAUDO,
      idLaudo: registro.ID_LAUDO,
      numeroLaudo: registro.NUMERO_LAUDO,
      status: 'REGISTRADO',
      fotos: qtdFotosTotal,
      fotosInseridas: qtdFotos,
      itens: qtdItens,
      msg: 'Laudo registrado com segurança. Fotos ficaram vinculadas por URL/ID, sem base64 no payload.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao salvar vistoria: ' + e.message, erro: e.message };
  }
}

function apiSalvarRascunhoVistoria(idLaudo, dados) {
  try {
    garantirEstruturaDoSistema();
    var erroVideos = AUT_VALIDAR_LINKS_VIDEO_V7_(dados || {});
    if (erroVideos) return { sucesso: false, ok: false, msg: erroVideos };

    var ss = AUT_SS_FAST_();
    dados = dados || {};
    dados.__statusLaudo = 'RASCUNHO';
    dados.__rascunho = 'SIM';
    dados.__rascunho_salvo_em = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

    var localizado = idLaudo ? AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo) : null;
    var achado = localizado && localizado.achado ? localizado.achado : null;
    var payloadAnterior = achado ? AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado) : {};
    var rowAnterior = achado ? AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado) : {};
    var idAnterior = rowAnterior.ID_LAUDO || idLaudo || '';
    var numeroAnterior = rowAnterior.NUMERO_LAUDO || '';
    var statusAtual = achado ? AUT_STATUS_LAUDO_ATUAL_V7_(ss, idAnterior, numeroAnterior, rowAnterior, payloadAnterior) : '';
    var dadosOriginais = AUT_MERGE_PAYLOAD_ATUALIZACAO_(payloadAnterior, dados || {});
    dadosOriginais.__statusLaudo = 'RASCUNHO';
    dadosOriginais.__rascunho = 'SIM';
    dadosOriginais.__rascunho_salvo_em = dados.__rascunho_salvo_em;

    var atualizarMesmoRegistro = achado && statusAtual === 'RASCUNHO';
    var idDestino = atualizarMesmoRegistro ? idAnterior : (achado ? AUT_GERAR_ID_RASCUNHO_V7_(ss) : '');
    var hashAnterior = rowAnterior.HASH_LAUDO || AUT_GET_(payloadAnterior, ['__hash_anterior']) || '';
    var editadoDe = atualizarMesmoRegistro
      ? (AUT_GET_(rowAnterior, ['EDITADO_DE_ID']) || AUT_GET_(payloadAnterior, ['__editado_de_id']))
      : (achado ? idAnterior : '');
    var alteracoes = achado ? AUT_RESUMO_ALTERACOES_V7_(payloadAnterior, dadosOriginais) : 'Rascunho inicial criado.';
    if (editadoDe) {
      dadosOriginais.__editado_de_id = editadoDe;
      dadosOriginais.__hash_anterior = atualizarMesmoRegistro ? (AUT_GET_(payloadAnterior, ['__hash_anterior']) || hashAnterior) : hashAnterior;
      dadosOriginais.__historico_alteracoes = alteracoes;
      dadosOriginais.__editado_em = dados.__rascunho_salvo_em;
    }

    var dadosLimpos = AUT_REMOVER_CONTROLES_EDICAO_V7_(AUT_PURGE_PAYLOAD_(dadosOriginais));
    var hashNovo = AUT_HASH_((idDestino || 'NOVO_RASCUNHO') + ':RASCUNHO:' + JSON.stringify(dadosLimpos) + ':' + new Date().getTime());
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dadosLimpos, idDestino || null, hashNovo);
    registro.REVISAO_STATUS = editadoDe ? 'RASCUNHO_REVISAO' : 'RASCUNHO';
    registro.REVISAO = editadoDe ? 'SIM' : '';
    registro.EDITADO_DE_ID = editadoDe || '';
    registro.HASH_ANTERIOR = editadoDe ? (dadosOriginais.__hash_anterior || hashAnterior) : '';
    registro.HISTORICO_ALTERACOES = editadoDe ? alteracoes : 'Rascunho em elaboração.';
    registro.EDITADO_EM = editadoDe ? new Date() : '';
    registro.PDF_URL = '';
    registro.PDF_HASH = '';
    registro.HASH_DOCUMENTO = '';
    registro.ID_DOCUMENTO = '';
    registro.MANIFESTO_URL = '';

    if (atualizarMesmoRegistro) {
      AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, registro);
    } else {
      AUT_APPEND_OBJ_(AUT_REGISTRO_SHEET_(ss), registro);
    }
    AUT_UPSERT_PROCESSO_LAUDO_(ss, registro);
    AUT_SET_STATUS_PROCESSO_V7_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, 'RASCUNHO', {
      PDF_URL: '',
      PDF_HASH: '',
      HASH_DOCUMENTO: '',
      MANIFESTO_URL: ''
    });
    var fotosRemovidas = AUT_APLICAR_FOTOS_REMOVIDAS_V7_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdFotosTotal = AUT_CONTAR_FOTOS_LAUDO_V12_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO);
    AUT_REMOVER_AMBIENTES_ITENS_LAUDO_V7_(ss, registro.ID_LAUDO);
    var qtdItens = AUT_VINCULAR_AMBIENTES_ITENS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosLimpos);
    AUT_APPEND_AUDITORIA_V7_(ss, atualizarMesmoRegistro ? 'ATUALIZAR_RASCUNHO_LAUDO' : 'CRIAR_RASCUNHO_LAUDO', registro.ID_LAUDO, {
      idOrigem: editadoDe || '',
      numeroLaudo: registro.NUMERO_LAUDO,
      alteracoes: alteracoes,
      fotosRemovidas: fotosRemovidas,
      qtdFotos: qtdFotosTotal,
      qtdFotosInseridas: qtdFotos,
      qtdItens: qtdItens
    }, hashAnterior, hashNovo);
    AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: registro.ID_LAUDO,
      idLaudo: registro.ID_LAUDO,
      idAnterior: editadoDe || '',
      numeroLaudo: registro.NUMERO_LAUDO,
      status: 'RASCUNHO',
      fotos: qtdFotosTotal,
      fotosInseridas: qtdFotos,
      itens: qtdItens,
      msg: 'Rascunho salvo. Você pode voltar depois, editar e finalizar o laudo quando estiver completo.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao salvar rascunho: ' + e.message, erro: e.message };
  }
}

function salvarRascunhoVistoria(idLaudo, dados) {
  return apiSalvarRascunhoVistoria(idLaudo, dados);
}

function apiSalvarRascunhoLaudo(idLaudo, dados) {
  return apiSalvarRascunhoVistoria(idLaudo, dados);
}

function apiAtualizarVistoria(idLaudo, dados) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };
    var erroValidacao = AUT_VALIDAR_VISTORIA_(dados || {});
    if (erroValidacao) return { sucesso: false, ok: false, msg: erroValidacao };

    var ss = AUT_SS_FAST_();
    var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo);
    if (!localizado || !localizado.achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado para edição.' };
    var achado = localizado.achado;
    var payloadAnterior = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var rowAnterior = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idAnterior = rowAnterior.ID_LAUDO || idLaudo;
    var numeroAnterior = rowAnterior.NUMERO_LAUDO || '';
    var statusAtual = AUT_STATUS_LAUDO_ATUAL_V7_(ss, idAnterior, numeroAnterior, rowAnterior, payloadAnterior);
    var hashAnterior = rowAnterior.HASH_LAUDO || '';
    var dadosOriginais = AUT_MERGE_PAYLOAD_ATUALIZACAO_(payloadAnterior, dados || {});
    dadosOriginais.__statusLaudo = 'REGISTRADO';
    dadosOriginais.__rascunho = 'NAO';
    var alteracoes = AUT_RESUMO_ALTERACOES_V7_(payloadAnterior, dadosOriginais);

    if (statusAtual === 'RASCUNHO') {
      var editadoDe = AUT_GET_(rowAnterior, ['EDITADO_DE_ID']) || AUT_GET_(payloadAnterior, ['__editado_de_id']);
      var hashOrigem = AUT_GET_(rowAnterior, ['HASH_ANTERIOR']) || AUT_GET_(payloadAnterior, ['__hash_anterior']) || hashAnterior;
      if (editadoDe) {
        dadosOriginais.__editado_de_id = editadoDe;
        dadosOriginais.__hash_anterior = hashOrigem;
        dadosOriginais.__historico_alteracoes = alteracoes;
        dadosOriginais.__editado_em = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
      }
      var dadosFinalizados = AUT_REMOVER_CONTROLES_EDICAO_V7_(AUT_PURGE_PAYLOAD_(dadosOriginais));
      var hashFinal = AUT_HASH_(idAnterior + ':FINALIZAR_RASCUNHO:' + JSON.stringify(dadosFinalizados) + ':' + new Date().getTime());
      var registroFinal = AUT_MONTAR_REGISTRO_LAUDO_(dadosFinalizados, idAnterior, hashFinal);
      registroFinal.REVISAO = editadoDe ? 'SIM' : '';
      registroFinal.REVISAO_STATUS = editadoDe ? 'VIGENTE_REVISAO' : 'VIGENTE';
      registroFinal.EDITADO_DE_ID = editadoDe || '';
      registroFinal.HASH_ANTERIOR = editadoDe ? hashOrigem : '';
      registroFinal.HISTORICO_ALTERACOES = editadoDe ? alteracoes : 'Rascunho finalizado como laudo registrado.';
      registroFinal.EDITADO_EM = editadoDe ? new Date() : '';
      registroFinal.PDF_URL = '';
      registroFinal.PDF_HASH = '';
      registroFinal.HASH_DOCUMENTO = '';
      registroFinal.ID_DOCUMENTO = '';
      registroFinal.MANIFESTO_URL = '';

      AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, registroFinal);
      AUT_UPSERT_PROCESSO_LAUDO_(ss, registroFinal);
      AUT_SET_STATUS_PROCESSO_V7_(ss, registroFinal.ID_LAUDO, registroFinal.NUMERO_LAUDO, 'REGISTRADO', {
        PDF_URL: '',
        PDF_HASH: '',
        HASH_DOCUMENTO: '',
        MANIFESTO_URL: ''
      });
      if (editadoDe) AUT_MARCAR_PROCESSO_SUBSTITUIDO_V7_(ss, editadoDe, idAnterior);
      AUT_REMOVER_AMBIENTES_ITENS_LAUDO_V7_(ss, idAnterior);
      var fotosRemovidasFinal = AUT_APLICAR_FOTOS_REMOVIDAS_V7_(ss, idAnterior, registroFinal.NUMERO_LAUDO, dadosOriginais);
      var fotosFinal = AUT_VINCULAR_FOTOS_(ss, idAnterior, registroFinal.NUMERO_LAUDO, dadosOriginais);
      var fotosFinalTotal = AUT_CONTAR_FOTOS_LAUDO_V12_(ss, idAnterior, registroFinal.NUMERO_LAUDO);
      var itensFinal = AUT_VINCULAR_AMBIENTES_ITENS_(ss, idAnterior, registroFinal.NUMERO_LAUDO, dadosFinalizados);
      AUT_APPEND_AUDITORIA_V7_(ss, 'FINALIZAR_RASCUNHO_LAUDO', idAnterior, {
        idOrigem: editadoDe || '',
        numeroLaudo: registroFinal.NUMERO_LAUDO,
        alteracoes: alteracoes,
        fotosRemovidas: fotosRemovidasFinal,
        qtdFotos: fotosFinalTotal,
        qtdFotosInseridas: fotosFinal,
        qtdItens: itensFinal
      }, hashAnterior, hashFinal);
      AUT_INVALIDAR_CACHES_();
      return {
        sucesso: true,
        ok: true,
        id: idAnterior,
        idLaudo: idAnterior,
        idAnterior: editadoDe || '',
        numeroLaudo: registroFinal.NUMERO_LAUDO,
        hashAnterior: hashAnterior,
        hashAtual: hashFinal,
        status: 'REGISTRADO',
        fotos: fotosFinalTotal,
        fotosInseridas: fotosFinal,
        itens: itensFinal,
        msg: 'Rascunho finalizado e trancado como laudo registrado. O PDF já pode ser emitido.'
      };
    }

    dadosOriginais.__editado_de_id = idAnterior;
    dadosOriginais.__hash_anterior = hashAnterior;
    dadosOriginais.__historico_alteracoes = alteracoes;
    dadosOriginais.__editado_em = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

    var dadosLimpos = AUT_REMOVER_CONTROLES_EDICAO_V7_(AUT_PURGE_PAYLOAD_(dadosOriginais));
    var idNovo = AUT_GERAR_ID_REVISAO_V7_(ss, idAnterior);
    var hashNovo = AUT_HASH_(idAnterior + '->' + idNovo + JSON.stringify(dadosLimpos) + new Date().getTime());
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dadosLimpos, idNovo, hashNovo);
    registro.EDITADO_DE_ID = idAnterior;
    registro.HASH_ANTERIOR = hashAnterior;
    registro.REVISAO = 'SIM';
    registro.REVISAO_STATUS = 'VIGENTE_REVISAO';
    registro.HISTORICO_ALTERACOES = alteracoes;
    registro.EDITADO_EM = new Date();
    registro.PDF_URL = '';
    registro.PDF_HASH = '';
    registro.HASH_DOCUMENTO = '';
    registro.MANIFESTO_URL = '';

    AUT_APPEND_OBJ_(AUT_REGISTRO_SHEET_(ss), registro);
    AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, {
      REVISAO_STATUS: 'SUBSTITUIDO_POR_' + idNovo,
      ID_REVISAO_ATUAL: idNovo,
      EDITADO_EM: new Date()
    });
    AUT_MARCAR_PROCESSO_SUBSTITUIDO_V7_(ss, idAnterior, idNovo);
    AUT_UPSERT_PROCESSO_LAUDO_(ss, registro);
    AUT_SET_STATUS_PROCESSO_V7_(ss, idNovo, registro.NUMERO_LAUDO, 'REGISTRADO');
    var fotosRemovidasRevisao = AUT_APLICAR_FOTOS_REMOVIDAS_V7_(ss, idNovo, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, idNovo, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdFotosTotal = AUT_CONTAR_FOTOS_LAUDO_V12_(ss, idNovo, registro.NUMERO_LAUDO);
    AUT_REMOVER_AMBIENTES_ITENS_LAUDO_V7_(ss, idNovo);
    var qtdItens = AUT_VINCULAR_AMBIENTES_ITENS_(ss, idNovo, registro.NUMERO_LAUDO, dadosLimpos);
    AUT_APPEND_AUDITORIA_V7_(ss, 'EDITAR_LAUDO_REVISAO', idNovo, {
      idAnterior: idAnterior,
      idNovo: idNovo,
      numeroNovo: registro.NUMERO_LAUDO,
      alteracoes: alteracoes,
      fotosRemovidas: fotosRemovidasRevisao,
      qtdFotos: qtdFotosTotal,
      qtdFotosInseridas: qtdFotos,
      qtdItens: qtdItens
    }, hashAnterior, hashNovo);
    AUT_INVALIDAR_CACHES_();
    return {
      sucesso: true,
      ok: true,
      id: idNovo,
      idLaudo: idNovo,
      idAnterior: idAnterior,
      numeroLaudo: registro.NUMERO_LAUDO,
      hashAnterior: hashAnterior,
      hashAtual: hashNovo,
      fotos: qtdFotosTotal,
      fotosInseridas: qtdFotos,
      itens: qtdItens,
      msg: 'Edição salva como nova revisão documental. ID e hash foram atualizados e as alterações ficaram registradas no rodapé do laudo.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao atualizar vistoria: ' + e.message, erro: e.message };
  }
}

function AUT_URLFETCH_IMAGE_CACHE_V6_(src, namespace) {
  src = String(src || '').trim();
  if (!src) return '';
  if (/^data:image\//i.test(src)) return src;
  var cacheKey = 'AUT_IMG_V6_' + (namespace || 'IMG') + '_' + AUT_HASH_(src).substring(0, 40);
  try {
    var cached = CacheService.getScriptCache().get(cacheKey);
    if (cached && /^data:image\//i.test(cached)) return cached;
  } catch (eGet) {}
  try {
    var res = UrlFetchApp.fetch(src, {
      method: 'get',
      followRedirects: true,
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 Autentiko Palmer PDF' }
    });
    if (res.getResponseCode() < 200 || res.getResponseCode() >= 300) return '';
    var blob = res.getBlob();
    var contentType = blob.getContentType() || 'image/jpeg';
    if (contentType.indexOf('image/') !== 0) return '';
    var out = 'data:' + contentType + ';base64,' + Utilities.base64Encode(blob.getBytes());
    if (out.length < 95000) {
      try { CacheService.getScriptCache().put(cacheKey, out, 21600); } catch (ePut) {}
    }
    return out;
  } catch (e) {
    return '';
  }
}

function AUT_IMAGEM_DATA_OU_VAZIO_(src, namespace) {
  src = String(src || '').trim();
  if (!src) return '';
  if (/^data:image\//i.test(src)) return src;

  var driveData = '';
  try {
    driveData = AUT_BASE64_IMAGEM_CACHE_(src, namespace || 'IMG_DRIVE');
    if (/^data:image\//i.test(String(driveData || ''))) return driveData;
  } catch (eDrive) {}

  var fetched = AUT_URLFETCH_IMAGE_CACHE_V6_(src, namespace || 'IMG_URLFETCH');
  return /^data:image\//i.test(String(fetched || '')) ? fetched : '';
}

function AUT_LOGO_PALMER_INLINE_DATA_V9_() {
  return AUT_IMAGEM_DATA_OU_VAZIO_(PALMER_LAUDO_LOGO_OFICIAL, 'LOGO_PALMER_INLINE_PDF_V9_' + AUT_HASH_(PALMER_LAUDO_LOGO_OFICIAL).substring(0, 12));
}

function apiDiagnosticarLogoLaudo() {
  try {
    garantirEstruturaDoSistema();
    var cfg = getConfiguracoesGlobais();
    var inlineLogo = AUT_LOGO_PALMER_INLINE_DATA_V9_();
    return {
      sucesso: true,
      logoOficial: PALMER_LAUDO_LOGO_OFICIAL,
      cfgLogoRaw: cfg.logoLaudoRaw || '',
      cfgLogoBase64Inicio: String(cfg.logoLaudoBase64 || '').substring(0, 30),
      cfgLogoBase64Tamanho: String(cfg.logoLaudoBase64 || '').length,
      inlineInicio: String(inlineLogo || '').substring(0, 30),
      inlineTamanho: String(inlineLogo || '').length,
      usaBase64NoPdf: /^data:image\//i.test(String(inlineLogo || cfg.logoLaudoBase64 || ''))
    };
  } catch (e) {
    return { sucesso: false, msg: e.message, erro: e.message };
  }
}

function AUT_DRIVE_IMAGE_DATA_URL_V12_(fileId) {
  fileId = String(fileId || '').trim();
  if (!fileId) return '';
  try {
    var blob = DriveApp.getFileById(fileId).getBlob();
    var tipo = blob.getContentType() || 'image/jpeg';
    if (!/^image\//i.test(String(tipo || ''))) tipo = 'image/jpeg';
    return 'data:' + tipo + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (eDrive) {
    return '';
  }
}

function AUT_IMAGEM_PDF_DATA_V6_(url, thumb, hash) {
  url = String(url || '').trim();
  thumb = String(thumb || '').trim();
  if (/^data:image\//i.test(url)) return url;
  if (/^data:image\//i.test(thumb)) return thumb;

  var driveId = extractDriveId_(url) || extractDriveId_(thumb);
  if (driveId) {
    var directBlob = AUT_DRIVE_IMAGE_DATA_URL_V12_(driveId);
    if (/^data:image\//i.test(String(directBlob || ''))) return directBlob;
    var driveUrl = 'https://drive.google.com/file/d/' + driveId + '/view';
    var fromDrive = AUT_BASE64_IMAGEM_CACHE_(driveUrl, 'FOTO_DRIVE_PDF_10X12_' + hash);
    if (/^data:image\//i.test(String(fromDrive || ''))) return fromDrive;
  }

  var srcThumb = thumb || (url ? normalizeDriveUrl_(url, 900) : '');
  var fetched = AUT_URLFETCH_IMAGE_CACHE_V6_(srcThumb, 'FOTO_URL_PDF_10X12_' + hash);
  if (fetched) return fetched;
  return AUT_BASE64_IMAGEM_CACHE_(url, 'FOTO_PDF_V6_' + hash) || srcThumb || url || '';
}

function AUT_FOTOS_PDF_(ss, idLaudo, numeroLaudo) {
  var sh = ss.getSheetByName('FOTOS_LAUDO');
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var id = AUT_GET_(obj, ['ID_LAUDO']);
    var num = AUT_GET_(obj, ['NUMERO_LAUDO']);
    if (String(id) !== String(idLaudo) && String(num) !== String(numeroLaudo)) continue;
    var url = AUT_GET_(obj, ['FOTO_URL', 'URL']);
    var arquivoId = AUT_GET_(obj, ['ARQUIVO_ID']) || extractDriveId_(url);
    if (!url && arquivoId) url = 'https://drive.google.com/file/d/' + arquivoId + '/view';
    var oldDataUrl = AUT_GET_(obj, ['FOTO_DATA_URL', 'DATA_URL', 'BASE64']);
    var hash = AUT_GET_(obj, ['HASH_FOTO']) || AUT_HASH_(url);
    var thumb = AUT_GET_(obj, ['FOTO_THUMB_URL']) || (url ? normalizeDriveUrl_(url, 900) : '');
    var embed = oldDataUrl && /^data:image\//i.test(String(oldDataUrl))
      ? oldDataUrl
      : AUT_IMAGEM_PDF_DATA_V6_(url, thumb, hash);
    out.push({
      id: AUT_GET_(obj, ['ID_FOTO']),
      ambiente: AUT_GET_(obj, ['AMBIENTE']),
      item: AUT_GET_(obj, ['ITEM']),
      tipoObservacao: AUT_GET_(obj, ['TIPO_OBSERVACAO']),
      legendaTecnica: AUT_GET_(obj, ['LEGENDA_TECNICA']),
      nome: AUT_GET_(obj, ['NOME_ARQUIVO']),
      url: url,
      thumbnailUrl: thumb,
      dataUrl: '',
      embed: embed,
      hash: hash,
      arquivoId: arquivoId,
      largura: AUT_GET_(obj, ['LARGURA']),
      altura: AUT_GET_(obj, ['ALTURA']),
      tamanhoBytes: AUT_GET_(obj, ['TAMANHO_BYTES'])
    });
  }
  return out;
}

function apiDiagnosticarFotosLaudo(idLaudo) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) achado = AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V5_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado.' };

    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || idLaudo;
    var fotosLeves = AUT_FOTOS_LAUDO_LEVES_FINAL_(ss, idReal, numero);
    var fotosPdf = AUT_FOTOS_PDF_(ss, idReal, numero);

    var amostras = fotosPdf.slice(0, 5).map(function(foto) {
      return {
        ambiente: foto.ambiente || '',
        url: foto.url || '',
        hash: foto.hash || '',
        temEmbed: /^data:image\//i.test(String(foto.embed || '')),
        embedTamanho: String(foto.embed || '').length
      };
    });

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      fotosNaPlanilha: fotosLeves.length,
      fotosPreparadasPdf: fotosPdf.length,
      amostras: amostras
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro no diagnóstico de fotos: ' + e.message, erro: e.message };
  }
}

function AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idLaudo, numeroLaudo, url, pdfHash, idDocumento, manifestoUrl) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var id = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
    var num = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);
    if (String(id) === String(idLaudo) || String(num) === String(numeroLaudo)) {
      AUT_ATUALIZAR_ROW_OBJ_(sh, r + 1, {
        PDF_URL: url,
        PDF_HASH: pdfHash || '',
        HASH_DOCUMENTO: pdfHash || '',
        ID_DOCUMENTO: idDocumento || '',
        MANIFESTO_URL: manifestoUrl || '',
        PDF_GERADO_EM: new Date(),
        ATUALIZADO_EM: new Date()
      });
    }
  }
}

function apiEmitirLaudoPdf(idLaudo, forcarGeracao) {
  try {
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo);
    var achado = localizado && localizado.achado ? localizado.achado : null;
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado para emissão.' };
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var rawObj = achado.rowObjRaw || achado.rowObj || {};
    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var numeroLaudo = rowObj.NUMERO_LAUDO || idLaudo;
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var statusLaudo = AUT_STATUS_LAUDO_ATUAL_V7_(ss, idReal, numeroLaudo, rowObj, payload);
    if (statusLaudo === 'RASCUNHO') {
      return { sucesso: false, ok: false, msg: 'Este laudo ainda está em rascunho. Finalize e tranque o laudo antes de emitir o PDF documental.' };
    }
    var hashBase = rowObj.HASH_LAUDO || AUT_HASH_(JSON.stringify(rowObj) + JSON.stringify(payload));
    var fotosSincronizadas = AUT_VINCULAR_FOTOS_(ss, idReal, numeroLaudo, payload);
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numeroLaudo);
    var hashFotos = fotos.map(function(f) { return f.hash || f.url || f.nome || ''; }).join('|');
    var historicoAlteracoes = AUT_GET_(rawObj, ['HISTORICO_ALTERACOES']) || AUT_GET_(rowObj, ['HISTORICO_ALTERACOES']) || AUT_GET_(payload, ['__historico_alteracoes']);
    var pdfHash = AUT_HASH_(JSON.stringify({
      idLaudo: idReal,
      numeroLaudo: numeroLaudo,
      hashLaudo: hashBase,
      modelo: AUT_MODELO_PDF_VERSION_V6,
      payload: AUT_PURGE_PAYLOAD_(payload),
      fotos: hashFotos,
      historico: historicoAlteracoes || ''
    }));
    var idDocumento = 'DOC-' + String(idReal).replace(/[^A-Za-z0-9_-]/g, '') + '-' + pdfHash.substring(0, 12).toUpperCase();
    var manifestoUrl = AUT_MANIFESTO_URL_V7_(idReal, pdfHash);
    var qrCodeDataUrl = AUT_QR_DATA_URL_V7_(manifestoUrl);
    var pdfUrlAtual = AUT_GET_(rawObj, ['PDF_URL']) || AUT_GET_(rowObj, ['PDF_URL']);
    var pdfHashAtual = AUT_GET_(rawObj, ['PDF_HASH', 'HASH_DOCUMENTO']) || AUT_GET_(rowObj, ['PDF_HASH', 'HASH_DOCUMENTO']);
    if (!forcarGeracao && pdfUrlAtual && pdfHashAtual && String(pdfHashAtual) === String(pdfHash)) {
      return { sucesso: true, ok: true, url: pdfUrlAtual, msg: 'PDF reaproveitado em cache porque o laudo não mudou.', fotos: 0, cachePdf: true };
    }
    var cfg = getConfiguracoesGlobais();
    var logoPalmerInline = AUT_LOGO_PALMER_INLINE_DATA_V9_() || cfg.logoLaudoBase64 || cfg.logoLaudoPublica || cfg.logoLaudoRaw || PALMER_LAUDO_LOGO_OFICIAL;
    var tpl = HtmlService.createTemplateFromFile('modelo');
    tpl.cfg = cfg;
    tpl.logoPalmerDataUri = logoPalmerInline;
    tpl.marcaDaguaPalmerDataUri = logoPalmerInline;
    tpl.row = achado.row;
    tpl.rowObj = rowObj;
    tpl.payload = payload;
    tpl.fotos = fotos;
    tpl.auditHash = hashBase;
    tpl.documentHash = pdfHash;
    tpl.pdfHash = pdfHash;
    tpl.idDocumento = idDocumento;
    tpl.manifestoUrl = manifestoUrl;
    tpl.qrCodeDataUrl = qrCodeDataUrl;
    tpl.historicoAlteracoes = historicoAlteracoes || '';
    var html = tpl.evaluate().getContent();
    var blob = Utilities
      .newBlob(html, 'text/html', 'LAUDO_' + numeroLaudo + '.html')
      .getAs('application/pdf')
      .setName('LAUDO_' + numeroLaudo + '.pdf');
    var file = obterPastaVistorias().createFile(blob);
    try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}
    AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, {
      PDF_URL: file.getUrl(),
      PDF_HASH: pdfHash,
      HASH_DOCUMENTO: pdfHash,
      ID_DOCUMENTO: idDocumento,
      MANIFESTO_URL: manifestoUrl,
      PDF_GERADO_EM: new Date(),
      QTD_FOTOS: fotos.length
    });
    AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idReal, numeroLaudo, file.getUrl(), pdfHash, idDocumento, manifestoUrl);
    AUT_APPEND_AUDITORIA_V7_(ss, 'EMITIR_PDF_COM_MANIFESTO', idReal, {
      numeroLaudo: numeroLaudo,
      idDocumento: idDocumento,
      hashDocumento: pdfHash,
      manifestoUrl: manifestoUrl,
      qtdFotos: fotos.length,
      fotosSincronizadasAntesPdf: fotosSincronizadas
    }, hashBase, pdfHash);
    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, ok: true, url: file.getUrl(), msg: 'PDF gerado com manifesto, QR Code e hash documental.', fotos: fotos.length, cachePdf: false, manifestoUrl: manifestoUrl, hashDocumento: pdfHash };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao emitir PDF: ' + e.message, erro: e.message };
  }
}
