/* =========================================================
   AUTENTIKO SIGN - Assinatura eletronica auditavel V1
   Camada incremental para AUTENTIKO-OK CHECK.
   ========================================================= */

var AUT_SIGN_VERSION = 'AUTENTIKO_SIGN_V1_20260701';
var AUT_SIGN_CACHE_LISTA = 'AUT_SIGN_LISTA_ASSINATURAS_V1';
var AUT_SIGN_EXPIRACAO_HORAS = 1;
var AUT_SIGN_MAX_EVIDENCIA_BYTES = 15 * 1024 * 1024;
var AUT_SIGN_GITHUB_VERIFY_URL_PUBLICA = 'https://barrosautentiko.github.io/api.autentiko/verificar/';

var AUT_SIGN_HEADERS = {
  ASSINATURAS: [
    'ID_ASSINATURA','ID_LAUDO','NUMERO_LAUDO','ID_DOCUMENTO_ORIGEM','HASH_DOCUMENTO_ORIGEM',
    'PDF_ORIGEM_URL','STATUS','CRIADO_EM','CRIADO_POR','EXPIRA_EM','CONCLUIDO_EM',
    'PDF_ASSINADO_URL','HASH_PDF_ASSINADO','ID_DOCUMENTO_ASSINADO','MANIFESTO_URL',
    'HASH_MANIFESTO','QTD_SIGNATARIOS','QTD_ASSINADOS','RISCO_GERAL','OBSERVACOES'
  ],
  SIGNATARIOS: [
    'ID_SIGNATARIO','ID_ASSINATURA','ID_LAUDO','PAPEL','NOME','CPF','EMAIL','TELEFONE',
    'STATUS','NONCE_HASH','TOKEN_VALIDADO_EM','ASSINADO_EM','IP_PUBLICO','IP_HASH',
    'GEO_LAT','GEO_LNG','GEO_ACURACIA','USER_AGENT_HASH','DISPOSITIVO_JSON_HASH',
    'PASSKEY_STATUS','PASSKEY_HASH','RISCO_JSON','HASH_ASSINATURA','MANIFESTO_URL'
  ],
  TOKENS_ASSINATURA: [
    'ID_TOKEN','ID_ASSINATURA','ID_SIGNATARIO','TIPO','HASH_TOKEN','STATUS','CRIADO_EM',
    'EXPIRA_EM','USADO_EM','TENTATIVAS','ULTIMO_ERRO'
  ],
  EVENTOS_ASSINATURA: [
    'ID_EVENTO','ID_ASSINATURA','ID_SIGNATARIO','QUANDO','TIPO','ATOR','IP_HASH',
    'DETALHES_JSON','HASH_ANTERIOR','HASH_EVENTO'
  ],
  EVIDENCIAS_ASSINATURA: [
    'ID_EVIDENCIA','ID_ASSINATURA','ID_SIGNATARIO','TIPO','NOME_ARQUIVO','MIME_TYPE',
    'ARQUIVO_ID','ARQUIVO_URL','HASH_EVIDENCIA','TAMANHO_BYTES','CRIADO_EM','META_JSON','RESTRICAO'
  ],
  MANIFESTOS_ASSINATURA: [
    'ID_MANIFESTO','ID_ASSINATURA','ID_LAUDO','NUMERO_LAUDO','HASH_MANIFESTO',
    'HASH_PDF_ASSINADO','PDF_ASSINADO_URL','MANIFESTO_PUBLICO_JSON','CRIADO_EM','STATUS','QR_URL'
  ],
  POSICOES_ASSINATURA: [
    'ID_POSICAO','ID_ASSINATURA','ID_SIGNATARIO','PAPEL','PAGINA','ANCORA','LABEL','X','Y','CRIADO_EM'
  ]
};

function AUT_SIGN_PREPARAR_HEADERS_() {
  if (typeof AUTENTIKO_HEADERS === 'undefined') return;
  Object.keys(AUT_SIGN_HEADERS).forEach(function(nome) {
    AUTENTIKO_HEADERS[nome] = AUT_SIGN_HEADERS[nome];
  });
}

function AUT_SIGN_GARANTIR_ESTRUTURA_(ss) {
  ss = ss || AUT_SS_FAST_();
  AUT_SIGN_PREPARAR_HEADERS_();
  Object.keys(AUT_SIGN_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUT_SIGN_HEADERS[nome]);
  });
  try {
    PropertiesService.getScriptProperties().setProperty('AUT_SIGN_VERSION', AUT_SIGN_VERSION);
  } catch (e) {}
}

function AUT_SIGN_INVALIDAR_CACHE_() {
  try { CacheService.getScriptCache().remove(AUT_SIGN_CACHE_LISTA); } catch (e) {}
}

function AUT_SIGN_SHEET_(nome) {
  var ss = AUT_SS_FAST_();
  var sh = ss.getSheetByName(nome);
  if (!sh) sh = AUT_SHEET_(ss, nome, AUT_SIGN_HEADERS[nome] || []);
  return sh;
}

function AUT_SIGN_ROWS_(nome) {
  var sh = AUT_SIGN_SHEET_(nome);
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    obj.__rowNumber = r + 1;
    out.push(obj);
  }
  return out;
}

function AUT_SIGN_SET_ROW_(sh, rowNumber, obj) {
  if (!sh || !rowNumber || !obj) return;
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var map = {};
  Object.keys(obj).forEach(function(k) { map[AUT_NORM_(k)] = obj[k]; });
  for (var c = 0; c < headers.length; c++) {
    var key = AUT_NORM_(headers[c]);
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      sh.getRange(rowNumber, c + 1).setValue(map[key]);
    }
  }
}

function AUT_SIGN_FIND_(nome, chave, valor) {
  var rows = AUT_SIGN_ROWS_(nome);
  var key = AUT_NORM_(chave);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][key] || '') === String(valor || '')) return rows[i];
  }
  return null;
}

function AUT_SIGN_NOVO_ID_(prefixo) {
  return prefixo + '-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss') +
    '-' + Math.floor(100000 + Math.random() * 900000);
}

function AUT_SIGN_TOKEN_FORTE_() {
  return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').substring(0, 16);
}

function AUT_SIGN_TOKEN_CURTO_() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function AUT_SIGN_JSON_(obj) {
  try { return JSON.stringify(obj || {}); } catch (e) { return '{}'; }
}

function AUT_SIGN_PARSE_JSON_(raw, fallback) {
  try { return raw ? JSON.parse(String(raw)) : (fallback || {}); } catch (e) { return fallback || {}; }
}

function AUT_SIGN_DATA_(d) {
  if (!d) return '';
  try {
    return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  } catch (e) {
    return String(d);
  }
}

function AUT_SIGN_DATA_ISO_(d) {
  try { return Utilities.formatDate(new Date(d || new Date()), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss"); }
  catch (e) { return String(d || ''); }
}

function AUT_SIGN_EXPIRA_EM_() {
  return new Date(Date.now() + AUT_SIGN_EXPIRACAO_HORAS * 60 * 60 * 1000);
}

function AUT_SIGN_IS_EXPIRADO_(assinatura) {
  if (!assinatura || !assinatura.EXPIRA_EM) return false;
  return new Date(assinatura.EXPIRA_EM).getTime() < Date.now();
}

function AUT_SIGN_WEBAPP_URL_() {
  if (typeof AUT_WEBAPP_URL_V7_ === 'function') return AUT_WEBAPP_URL_V7_();
  try { return ScriptApp.getService().getUrl(); } catch (e) {}
  return '';
}

function AUT_SIGN_URL_(idAssinatura, nonce) {
  return AUT_SIGN_WEBAPP_URL_() + '?sign=1&s=' + encodeURIComponent(idAssinatura) +
    '&n=' + encodeURIComponent(nonce);
}

function AUT_SIGN_MANIFESTO_URL_(idAssinatura, hashManifesto) {
  return AUT_SIGN_WEBAPP_URL_() + '?manifestoAssinatura=1&id=' + encodeURIComponent(idAssinatura) +
    '&hash=' + encodeURIComponent(hashManifesto || '');
}

function AUT_SIGN_VERIFY_URL_(idAssinatura, hashManifesto) {
  var base = '';
  try { base = PropertiesService.getScriptProperties().getProperty('AUT_SIGN_GITHUB_VERIFY_URL') || ''; } catch (e) {}
  if (!base) base = AUT_SIGN_GITHUB_VERIFY_URL_PUBLICA || (AUT_SIGN_WEBAPP_URL_() + '?verify=1');
  return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'id=' + encodeURIComponent(idAssinatura) +
    '&hash=' + encodeURIComponent(hashManifesto || '');
}

function AUT_SIGN_ESCAPE_(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function AUT_SIGN_ULTIMO_HASH_EVENTO_(idAssinatura) {
  var eventos = AUT_SIGN_ROWS_('EVENTOS_ASSINATURA');
  var ultimo = '';
  eventos.forEach(function(ev) {
    if (String(ev.ID_ASSINATURA || '') === String(idAssinatura || '') && ev.HASH_EVENTO) {
      ultimo = ev.HASH_EVENTO;
    }
  });
  return ultimo;
}

function AUT_SIGN_EVENTO_(idAssinatura, idSignatario, tipo, ator, detalhes) {
  detalhes = detalhes || {};
  var hashAnterior = AUT_SIGN_ULTIMO_HASH_EVENTO_(idAssinatura);
  var quando = new Date();
  var ip = detalhes.ipPublico || detalhes.ip || '';
  var ipHash = ip ? AUT_HASH_(String(ip)) : '';
  var json = AUT_SIGN_JSON_(detalhes);
  var hashEvento = AUT_HASH_([
    idAssinatura, idSignatario || '', tipo, ator || '', AUT_SIGN_DATA_ISO_(quando), ipHash, json, hashAnterior
  ].join('|'));
  AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('EVENTOS_ASSINATURA'), {
    ID_EVENTO: AUT_SIGN_NOVO_ID_('EVT'),
    ID_ASSINATURA: idAssinatura,
    ID_SIGNATARIO: idSignatario || '',
    QUANDO: quando,
    TIPO: tipo,
    ATOR: ator || 'SISTEMA',
    IP_HASH: ipHash,
    DETALHES_JSON: json,
    HASH_ANTERIOR: hashAnterior,
    HASH_EVENTO: hashEvento
  });
  return hashEvento;
}

function AUT_SIGN_ENCONTRAR_SIGNATARIO_POR_NONCE_(idAssinatura, nonce) {
  var nonceHash = AUT_HASH_(String(nonce || ''));
  var rows = AUT_SIGN_ROWS_('SIGNATARIOS');
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].ID_ASSINATURA || '') === String(idAssinatura || '') &&
        String(rows[i].NONCE_HASH || '') === nonceHash) {
      return rows[i];
    }
  }
  return null;
}

function AUT_SIGN_TOKEN_ATIVO_(idSignatario) {
  var tokens = AUT_SIGN_ROWS_('TOKENS_ASSINATURA');
  for (var i = tokens.length - 1; i >= 0; i--) {
    if (String(tokens[i].ID_SIGNATARIO || '') === String(idSignatario || '') &&
        String(tokens[i].TIPO || '') === 'EMAIL_OTP') {
      return tokens[i];
    }
  }
  return null;
}

function AUT_SIGN_SIGNATARIOS_(idAssinatura) {
  return AUT_SIGN_ROWS_('SIGNATARIOS').filter(function(s) {
    return String(s.ID_ASSINATURA || '') === String(idAssinatura || '');
  });
}

function AUT_SIGN_EVIDENCIAS_(idAssinatura, idSignatario) {
  return AUT_SIGN_ROWS_('EVIDENCIAS_ASSINATURA').filter(function(e) {
    if (String(e.ID_ASSINATURA || '') !== String(idAssinatura || '')) return false;
    return !idSignatario || String(e.ID_SIGNATARIO || '') === String(idSignatario || '');
  });
}

function AUT_SIGN_TEM_EVIDENCIA_(idAssinatura, idSignatario, tipo) {
  var evidencias = AUT_SIGN_EVIDENCIAS_(idAssinatura, idSignatario);
  for (var i = 0; i < evidencias.length; i++) {
    if (String(evidencias[i].TIPO || '').toUpperCase() === String(tipo || '').toUpperCase()) return true;
  }
  return false;
}

function AUT_SIGN_LABEL_PAPEL_(papel) {
  var p = String(papel || '').toUpperCase();
  var mapa = {
    LOCATARIO_ENTRADA: 'Locatario - ciencia na entrada',
    CORRETOR_ENTRADA: 'Corretor - ciencia na entrada',
    LOCATARIO_SAIDA: 'Locatario - ciencia na saida',
    CORRETOR_SAIDA: 'Corretor - ciencia na saida',
    PROPRIETARIO: 'Proprietario',
    TESTEMUNHA: 'Testemunha',
    OUTRO: 'Signatario'
  };
  return mapa[p] || papel || 'Signatario';
}

function AUT_SIGN_ENVIAR_EMAIL_(signatario, token, link, assinatura) {
  if (!signatario.email) return { enviado: false, msg: 'E-mail ausente.' };
  var assunto = 'Assinatura eletronica - AUTENTIKO-OK CHECK - Laudo ' + (assinatura.numeroLaudo || assinatura.idLaudo || '');
  var html = '<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.5">' +
    '<h2 style="margin:0 0 8px">AUTENTIKO Sign</h2>' +
    '<p>Voce recebeu uma solicitacao de assinatura eletronica referente ao laudo <b>' +
    AUT_SIGN_ESCAPE_(assinatura.numeroLaudo || assinatura.idLaudo || '') + '</b>.</p>' +
    '<p><b>Token de validacao:</b> <span style="font-size:22px;letter-spacing:4px">' + AUT_SIGN_ESCAPE_(token) + '</span></p>' +
    '<p>O link e unico, auditado e expira em ' + AUT_SIGN_EXPIRACAO_HORAS + ' hora.</p>' +
    '<p><a href="' + AUT_SIGN_ESCAPE_(link) + '" style="background:#2563eb;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Abrir assinatura</a></p>' +
    '<p style="font-size:12px;color:#64748b">Se voce nao reconhece esta solicitacao, ignore este e-mail e avise a Palmer Imoveis.</p>' +
    '</div>';
  try {
    MailApp.sendEmail({
      to: signatario.email,
      subject: assunto,
      htmlBody: html,
      name: 'AUTENTIKO-OK CHECK'
    });
    return { enviado: true };
  } catch (e) {
    return { enviado: false, msg: e.message };
  }
}

function apiSignCriarSessao(idLaudo, signatarios, posicoes, usuario) {
  try {
    garantirEstruturaDoSistema();
    AUT_SIGN_GARANTIR_ESTRUTURA_();
    if (!idLaudo) return { sucesso: false, msg: 'Informe o ID do laudo.' };
    signatarios = Array.isArray(signatarios) ? signatarios : [];
    signatarios = signatarios.filter(function(s) { return s && (s.nome || s.email || s.cpf); });
    if (!signatarios.length) return { sucesso: false, msg: 'Informe ao menos um signatario.' };

    var ss = AUT_SS_FAST_();
    var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, idLaudo);
    if (!localizado || !localizado.achado) return { sucesso: false, msg: 'Laudo nao encontrado.' };
    var achado = localizado.achado;
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var rawObj = achado.rowObjRaw || achado.rowObj || {};
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || rowObj.CODIGO_LAUDO || idLaudo;
    var pdfUrl = AUT_GET_(rawObj, ['PDF_URL']) || AUT_GET_(rowObj, ['PDF_URL']);
    var hashDoc = AUT_GET_(rawObj, ['HASH_DOCUMENTO', 'PDF_HASH', 'HASH_LAUDO']) ||
      AUT_GET_(rowObj, ['HASH_DOCUMENTO', 'PDF_HASH', 'HASH_LAUDO']) ||
      AUT_HASH_(AUT_SIGN_JSON_(rowObj));
    var idDoc = AUT_GET_(rawObj, ['ID_DOCUMENTO']) || AUT_GET_(rowObj, ['ID_DOCUMENTO']) || '';
    var idAssinatura = AUT_SIGN_NOVO_ID_('SIGN');
    var expiraEm = AUT_SIGN_EXPIRA_EM_();
    var criadoPor = (usuario && (usuario.usuario || usuario.email || usuario.nome)) || Session.getActiveUser().getEmail() || 'SISTEMA';

    AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('ASSINATURAS'), {
      ID_ASSINATURA: idAssinatura,
      ID_LAUDO: idReal,
      NUMERO_LAUDO: numero,
      ID_DOCUMENTO_ORIGEM: idDoc,
      HASH_DOCUMENTO_ORIGEM: hashDoc,
      PDF_ORIGEM_URL: pdfUrl,
      STATUS: 'AGUARDANDO',
      CRIADO_EM: new Date(),
      CRIADO_POR: criadoPor,
      EXPIRA_EM: expiraEm,
      QTD_SIGNATARIOS: signatarios.length,
      QTD_ASSINADOS: 0,
      OBSERVACOES: 'Sessao criada pelo modulo AUTENTIKO Sign.'
    });

    var links = [];
    for (var i = 0; i < signatarios.length; i++) {
      var s = signatarios[i] || {};
      var idSign = AUT_SIGN_NOVO_ID_('SIG');
      var nonce = AUT_SIGN_TOKEN_FORTE_();
      var token = AUT_SIGN_TOKEN_CURTO_();
      var papel = s.papel || (i === 0 ? 'LOCATARIO_ENTRADA' : 'OUTRO');
      var link = AUT_SIGN_URL_(idAssinatura, nonce);
      AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('SIGNATARIOS'), {
        ID_SIGNATARIO: idSign,
        ID_ASSINATURA: idAssinatura,
        ID_LAUDO: idReal,
        PAPEL: papel,
        NOME: s.nome || '',
        CPF: s.cpf || '',
        EMAIL: s.email || '',
        TELEFONE: s.telefone || s.contato || '',
        STATUS: 'PENDENTE',
        NONCE_HASH: AUT_HASH_(nonce)
      });
      AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('TOKENS_ASSINATURA'), {
        ID_TOKEN: AUT_SIGN_NOVO_ID_('TOK'),
        ID_ASSINATURA: idAssinatura,
        ID_SIGNATARIO: idSign,
        TIPO: 'EMAIL_OTP',
        HASH_TOKEN: AUT_HASH_(token),
        STATUS: 'ENVIADO',
        CRIADO_EM: new Date(),
        EXPIRA_EM: expiraEm,
        TENTATIVAS: 0
      });
      AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('POSICOES_ASSINATURA'), {
        ID_POSICAO: AUT_SIGN_NOVO_ID_('POS'),
        ID_ASSINATURA: idAssinatura,
        ID_SIGNATARIO: idSign,
        PAPEL: papel,
        PAGINA: (posicoes && posicoes[i] && posicoes[i].pagina) || 'FINAL',
        ANCORA: (posicoes && posicoes[i] && posicoes[i].ancora) || papel,
        LABEL: AUT_SIGN_LABEL_PAPEL_(papel),
        X: (posicoes && posicoes[i] && posicoes[i].x) || '',
        Y: (posicoes && posicoes[i] && posicoes[i].y) || '',
        CRIADO_EM: new Date()
      });
      var emailRes = AUT_SIGN_ENVIAR_EMAIL_({
        nome: s.nome || '',
        email: s.email || ''
      }, token, link, { idLaudo: idReal, numeroLaudo: numero });
      AUT_SIGN_EVENTO_(idAssinatura, idSign, emailRes.enviado ? 'CONVITE_ENVIADO' : 'CONVITE_EMAIL_FALHOU', criadoPor, {
        emailMascarado: AUT_SIGN_MASCARAR_EMAIL_(s.email || ''),
        papel: papel,
        msg: emailRes.msg || ''
      });
      links.push({
        idSignatario: idSign,
        papel: papel,
        nome: s.nome || '',
        email: s.email || '',
        link: link,
        token: token,
        emailEnviado: emailRes.enviado
      });
    }
    AUT_SIGN_EVENTO_(idAssinatura, '', 'SESSAO_CRIADA', criadoPor, {
      idLaudo: idReal,
      numeroLaudo: numero,
      qtdSignatarios: signatarios.length,
      hashDocumentoOrigem: hashDoc
    });
    AUT_SIGN_INVALIDAR_CACHE_();
    return { sucesso: true, msg: 'Sessao de assinatura criada.', idAssinatura: idAssinatura, links: links };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao criar assinatura: ' + e.message, erro: e.message };
  }
}

function AUT_SIGN_MASCARAR_EMAIL_(email) {
  email = String(email || '');
  var p = email.split('@');
  if (p.length !== 2) return '';
  return (p[0].substring(0, 2) + '***@' + p[1]);
}

function apiSignValidarLink(idAssinatura, nonce) {
  try {
    garantirEstruturaDoSistema();
    AUT_SIGN_GARANTIR_ESTRUTURA_();
    var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', idAssinatura);
    var sign = AUT_SIGN_ENCONTRAR_SIGNATARIO_POR_NONCE_(idAssinatura, nonce);
    if (!assinatura || !sign) return { sucesso: false, msg: 'Link de assinatura nao localizado.' };
    if (AUT_SIGN_IS_EXPIRADO_(assinatura)) return { sucesso: false, msg: 'Link expirado. Solicite novo convite.' };
    if (String(assinatura.STATUS || '') === 'CANCELADA') return { sucesso: false, msg: 'Sessao de assinatura cancelada.' };
    if (String(sign.STATUS || '') === 'ASSINADO') return { sucesso: true, jaAssinado: true, msg: 'Este signatario ja assinou.', assinatura: AUT_SIGN_PUBLIC_SESSION_(assinatura, sign) };
    AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, 'LINK_ABERTO', 'SIGNATARIO', { origem: 'pagina_assinatura' });
    return {
      sucesso: true,
      assinatura: AUT_SIGN_PUBLIC_SESSION_(assinatura, sign),
      challenge: AUT_HASH_(idAssinatura + nonce + new Date().getTime()).substring(0, 48)
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao validar link: ' + e.message };
  }
}

function AUT_SIGN_PUBLIC_SESSION_(assinatura, sign) {
  return {
    idAssinatura: assinatura.ID_ASSINATURA,
    idLaudo: assinatura.ID_LAUDO,
    numeroLaudo: assinatura.NUMERO_LAUDO,
    status: assinatura.STATUS,
    expiraEm: AUT_SIGN_DATA_(assinatura.EXPIRA_EM),
    signatario: {
      idSignatario: sign.ID_SIGNATARIO,
      nome: sign.NOME,
      papel: sign.PAPEL,
      papelLabel: AUT_SIGN_LABEL_PAPEL_(sign.PAPEL),
      emailMascarado: AUT_SIGN_MASCARAR_EMAIL_(sign.EMAIL),
      status: sign.STATUS
    }
  };
}

function apiSignRegistrarEventoPublico(idAssinatura, nonce, tipo, dados) {
  try {
    var sign = AUT_SIGN_ENCONTRAR_SIGNATARIO_POR_NONCE_(idAssinatura, nonce);
    if (!sign) return { sucesso: false, msg: 'Sessao invalida.' };
    AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, tipo || 'EVENTO_PUBLICO', 'SIGNATARIO', dados || {});
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, msg: e.message };
  }
}

function apiSignVerificarToken(idAssinatura, nonce, token, contexto) {
  try {
    var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', idAssinatura);
    var sign = AUT_SIGN_ENCONTRAR_SIGNATARIO_POR_NONCE_(idAssinatura, nonce);
    if (!assinatura || !sign) return { sucesso: false, msg: 'Sessao invalida.' };
    if (AUT_SIGN_IS_EXPIRADO_(assinatura)) return { sucesso: false, msg: 'Token expirado.' };
    var tok = AUT_SIGN_TOKEN_ATIVO_(sign.ID_SIGNATARIO);
    if (!tok) return { sucesso: false, msg: 'Token nao localizado.' };
    var shTok = AUT_SIGN_SHEET_('TOKENS_ASSINATURA');
    var tentativas = Number(tok.TENTATIVAS || 0) + 1;
    if (String(tok.HASH_TOKEN || '') !== AUT_HASH_(String(token || '').trim())) {
      AUT_SIGN_SET_ROW_(shTok, tok.__rowNumber, { TENTATIVAS: tentativas, ULTIMO_ERRO: 'TOKEN_INVALIDO' });
      AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, 'TOKEN_INVALIDO', 'SIGNATARIO', contexto || {});
      return { sucesso: false, msg: 'Token incorreto.' };
    }
    AUT_SIGN_SET_ROW_(shTok, tok.__rowNumber, { STATUS: 'VALIDADO', TENTATIVAS: tentativas, USADO_EM: new Date() });
    AUT_SIGN_SET_ROW_(AUT_SIGN_SHEET_('SIGNATARIOS'), sign.__rowNumber, { TOKEN_VALIDADO_EM: new Date(), STATUS: 'EM_VALIDACAO' });
    AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, 'TOKEN_VALIDADO', 'SIGNATARIO', contexto || {});
    return { sucesso: true, msg: 'Token validado.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao validar token: ' + e.message };
  }
}

function apiSignUploadEvidencia(idAssinatura, nonce, tipo, dataUrl, meta) {
  try {
    var sign = AUT_SIGN_ENCONTRAR_SIGNATARIO_POR_NONCE_(idAssinatura, nonce);
    if (!sign) return { sucesso: false, msg: 'Sessao invalida.' };
    var entrada = String(dataUrl || '');
    var mime = 'application/octet-stream';
    var raw = entrada;
    if (entrada.indexOf('data:') === 0) {
      mime = entrada.split(';')[0].split(':')[1] || mime;
      raw = entrada.split(',')[1] || '';
    }
    if (!raw) return { sucesso: false, msg: 'Evidencia vazia.' };
    var bytes = Utilities.base64Decode(raw);
    if (bytes.length > AUT_SIGN_MAX_EVIDENCIA_BYTES) {
      AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, 'EVIDENCIA_REJEITADA_TAMANHO', 'SIGNATARIO', {
        tipo: tipo,
        tamanhoBytes: bytes.length
      });
      return { sucesso: false, msg: 'Evidencia muito grande. Limite: 15 MB.' };
    }
    var ext = mime.indexOf('video/') === 0 ? '.webm' : (mime.indexOf('image/') === 0 ? '.jpg' : '.bin');
    var nome = String(tipo || 'EVIDENCIA').replace(/[^A-Za-z0-9_-]+/g, '_') + '_' + sign.ID_SIGNATARIO + ext;
    var blob = Utilities.newBlob(bytes, mime, nome);
    var pasta = AUT_SIGN_PASTA_EVIDENCIAS_();
    var arquivo = pasta.createFile(blob);
    var hash = AUT_HASH_(raw);
    AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('EVIDENCIAS_ASSINATURA'), {
      ID_EVIDENCIA: AUT_SIGN_NOVO_ID_('EVD'),
      ID_ASSINATURA: idAssinatura,
      ID_SIGNATARIO: sign.ID_SIGNATARIO,
      TIPO: String(tipo || 'EVIDENCIA').toUpperCase(),
      NOME_ARQUIVO: nome,
      MIME_TYPE: mime,
      ARQUIVO_ID: arquivo.getId(),
      ARQUIVO_URL: arquivo.getUrl(),
      HASH_EVIDENCIA: hash,
      TAMANHO_BYTES: bytes.length,
      CRIADO_EM: new Date(),
      META_JSON: AUT_SIGN_JSON_(meta || {}),
      RESTRICAO: 'DRIVE_RESTRITO_ADMIN'
    });
    AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, 'EVIDENCIA_RECEBIDA', 'SIGNATARIO', {
      tipo: tipo,
      mimeType: mime,
      tamanhoBytes: bytes.length,
      hash: hash
    });
    return { sucesso: true, msg: 'Evidencia enviada.', hash: hash, fileId: arquivo.getId(), tamanhoBytes: bytes.length };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao gravar evidencia: ' + e.message };
  }
}

function AUT_SIGN_PASTA_EVIDENCIAS_() {
  var nome = 'Autentiko - Evidencias Assinaturas';
  var it = DriveApp.getFoldersByName(nome);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(nome);
}

function apiSignConcluir(idAssinatura, nonce, payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', idAssinatura);
    var sign = AUT_SIGN_ENCONTRAR_SIGNATARIO_POR_NONCE_(idAssinatura, nonce);
    if (!assinatura || !sign) return { sucesso: false, msg: 'Sessao invalida.' };
    if (AUT_SIGN_IS_EXPIRADO_(assinatura)) return { sucesso: false, msg: 'Link expirado.' };
    if (!sign.TOKEN_VALIDADO_EM) return { sucesso: false, msg: 'Valide o token antes de concluir.' };
    if (!AUT_SIGN_TEM_EVIDENCIA_(idAssinatura, sign.ID_SIGNATARIO, 'VIDEO_ROSTO')) {
      return { sucesso: false, msg: 'Grave o video de validacao antes de concluir.' };
    }
    payload = payload || {};
    var contexto = payload.contexto || {};
    var geo = contexto.geolocation || {};
    var deviceHash = AUT_HASH_(AUT_SIGN_JSON_(contexto.device || {}));
    var ua = (contexto.device && contexto.device.userAgent) || '';
    var ip = contexto.ipPublico || '';
    var passkeyHash = payload.passkey ? AUT_HASH_(AUT_SIGN_JSON_(payload.passkey)) : '';
    var risco = AUT_SIGN_ANALISAR_RISCO_(contexto, payload.passkey);
    var hashAssinatura = AUT_HASH_(AUT_SIGN_JSON_({
      idAssinatura: idAssinatura,
      idSignatario: sign.ID_SIGNATARIO,
      papel: sign.PAPEL,
      contexto: contexto,
      evidencias: AUT_SIGN_EVIDENCIAS_(idAssinatura, sign.ID_SIGNATARIO).map(function(e) { return e.HASH_EVIDENCIA; }),
      aceite: payload.aceite,
      passkeyHash: passkeyHash
    }));
    AUT_SIGN_SET_ROW_(AUT_SIGN_SHEET_('SIGNATARIOS'), sign.__rowNumber, {
      STATUS: 'ASSINADO',
      ASSINADO_EM: new Date(),
      IP_PUBLICO: ip ? String(ip).replace(/(\d+\.\d+)\.\d+\.\d+/, '$1.*.*') : '',
      IP_HASH: ip ? AUT_HASH_(String(ip)) : '',
      GEO_LAT: geo.latitude || '',
      GEO_LNG: geo.longitude || '',
      GEO_ACURACIA: geo.accuracy || '',
      USER_AGENT_HASH: ua ? AUT_HASH_(ua) : '',
      DISPOSITIVO_JSON_HASH: deviceHash,
      PASSKEY_STATUS: payload.passkey ? 'REGISTRADA' : 'NAO_SUPORTADA_OU_RECUSADA',
      PASSKEY_HASH: passkeyHash,
      RISCO_JSON: AUT_SIGN_JSON_(risco),
      HASH_ASSINATURA: hashAssinatura
    });
    AUT_SIGN_EVENTO_(idAssinatura, sign.ID_SIGNATARIO, 'ASSINATURA_CONCLUIDA_SIGNATARIO', 'SIGNATARIO', {
      hashAssinatura: hashAssinatura,
      risco: risco,
      aceite: payload.aceite === true
    });
    var todos = AUT_SIGN_SIGNATARIOS_(idAssinatura);
    var assinados = todos.filter(function(item) { return String(item.ID_SIGNATARIO || '') === String(sign.ID_SIGNATARIO || '') || String(item.STATUS || '') === 'ASSINADO'; }).length;
    AUT_SIGN_SET_ROW_(AUT_SIGN_SHEET_('ASSINATURAS'), assinatura.__rowNumber, {
      STATUS: assinados >= todos.length ? 'FINALIZANDO' : 'PARCIAL',
      QTD_ASSINADOS: assinados,
      RISCO_GERAL: risco.nivel
    });
    var finalizado = null;
    if (assinados >= todos.length) {
      finalizado = AUT_SIGN_FINALIZAR_ASSINATURA_(idAssinatura);
    }
    AUT_SIGN_INVALIDAR_CACHE_();
    return {
      sucesso: true,
      msg: finalizado ? 'Assinatura concluida e PDF assinado emitido.' : 'Assinatura registrada. Aguardando os demais signatarios.',
      finalizado: !!finalizado,
      manifestoUrl: finalizado ? finalizado.manifestoUrl : '',
      pdfAssinadoUrl: finalizado ? finalizado.pdfAssinadoUrl : ''
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao concluir assinatura: ' + e.message, erro: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function AUT_SIGN_ANALISAR_RISCO_(contexto, passkey) {
  contexto = contexto || {};
  var flags = [];
  if (!contexto.geolocation || contexto.geolocation.erro) flags.push('SEM_GEOLOCALIZACAO');
  if (!contexto.ipPublico) flags.push('SEM_IP_PUBLICO');
  if (!passkey) flags.push('SEM_PASSKEY');
  if (contexto.privacy && (contexto.privacy.vpn || contexto.privacy.proxy || contexto.privacy.tor)) flags.push('VPN_PROXY_TOR');
  if (contexto.device && contexto.device.webdriver) flags.push('AUTOMACAO_WEBDRIVER');
  var nivel = flags.indexOf('VPN_PROXY_TOR') >= 0 || flags.indexOf('AUTOMACAO_WEBDRIVER') >= 0 ? 'ALTO' :
    (flags.length ? 'ATENCAO' : 'BAIXO');
  return { nivel: nivel, flags: flags };
}

function AUT_SIGN_FINALIZAR_ASSINATURA_(idAssinatura) {
  var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', idAssinatura);
  if (!assinatura) throw new Error('Assinatura nao encontrada para finalizacao.');
  var signatarios = AUT_SIGN_SIGNATARIOS_(idAssinatura);
  var evidencias = AUT_SIGN_EVIDENCIAS_(idAssinatura);
  var eventos = AUT_SIGN_ROWS_('EVENTOS_ASSINATURA').filter(function(ev) {
    return String(ev.ID_ASSINATURA || '') === String(idAssinatura || '');
  });
  var manifestoBase = {
    versao: AUT_SIGN_VERSION,
    idAssinatura: idAssinatura,
    idLaudo: assinatura.ID_LAUDO,
    numeroLaudo: assinatura.NUMERO_LAUDO,
    hashDocumentoOrigem: assinatura.HASH_DOCUMENTO_ORIGEM,
    signatarios: signatarios.map(function(s) {
      return {
        idSignatario: s.ID_SIGNATARIO,
        papel: s.PAPEL,
        status: s.STATUS,
        assinadoEm: AUT_SIGN_DATA_ISO_(s.ASSINADO_EM),
        hashAssinatura: s.HASH_ASSINATURA,
        passkeyStatus: s.PASSKEY_STATUS
      };
    }),
    evidencias: evidencias.map(function(e) {
      return { tipo: e.TIPO, hash: e.HASH_EVIDENCIA, tamanhoBytes: e.TAMANHO_BYTES };
    }),
    eventos: eventos.map(function(ev) {
      return { quando: AUT_SIGN_DATA_ISO_(ev.QUANDO), tipo: ev.TIPO, hashEvento: ev.HASH_EVENTO, hashAnterior: ev.HASH_ANTERIOR };
    }),
    concluidoEm: AUT_SIGN_DATA_ISO_(new Date())
  };
  var hashManifesto = AUT_HASH_(AUT_SIGN_JSON_(manifestoBase));
  var manifestoUrl = AUT_SIGN_MANIFESTO_URL_(idAssinatura, hashManifesto);
  var verifyUrl = AUT_SIGN_VERIFY_URL_(idAssinatura, hashManifesto);
  var pdf = AUT_SIGN_GERAR_PDF_ASSINADO_(assinatura, signatarios, hashManifesto, manifestoUrl);
  var manifestoPublico = {
    idAssinatura: idAssinatura,
    idLaudo: assinatura.ID_LAUDO,
    numeroLaudo: assinatura.NUMERO_LAUDO,
    status: 'CONCLUIDA',
    concluidoEm: AUT_SIGN_DATA_ISO_(new Date()),
    hashManifesto: hashManifesto,
    hashPdfAssinado: pdf.hashPdfAssinado,
    idDocumentoAssinado: pdf.idDocumentoAssinado,
    verifyUrl: verifyUrl,
    manifestoUrl: manifestoUrl,
    qtdSignatarios: signatarios.length
  };
  AUT_APPEND_OBJ_(AUT_SIGN_SHEET_('MANIFESTOS_ASSINATURA'), {
    ID_MANIFESTO: 'MAN-' + idAssinatura,
    ID_ASSINATURA: idAssinatura,
    ID_LAUDO: assinatura.ID_LAUDO,
    NUMERO_LAUDO: assinatura.NUMERO_LAUDO,
    HASH_MANIFESTO: hashManifesto,
    HASH_PDF_ASSINADO: pdf.hashPdfAssinado,
    PDF_ASSINADO_URL: pdf.pdfAssinadoUrl,
    MANIFESTO_PUBLICO_JSON: AUT_SIGN_JSON_(manifestoPublico),
    CRIADO_EM: new Date(),
    STATUS: 'CONCLUIDA',
    QR_URL: manifestoUrl
  });
  AUT_SIGN_SET_ROW_(AUT_SIGN_SHEET_('ASSINATURAS'), assinatura.__rowNumber, {
    STATUS: 'CONCLUIDA',
    CONCLUIDO_EM: new Date(),
    PDF_ASSINADO_URL: pdf.pdfAssinadoUrl,
    HASH_PDF_ASSINADO: pdf.hashPdfAssinado,
    ID_DOCUMENTO_ASSINADO: pdf.idDocumentoAssinado,
    MANIFESTO_URL: manifestoUrl,
    HASH_MANIFESTO: hashManifesto,
    QTD_ASSINADOS: signatarios.length
  });
  signatarios.forEach(function(s) {
    AUT_SIGN_SET_ROW_(AUT_SIGN_SHEET_('SIGNATARIOS'), s.__rowNumber, { MANIFESTO_URL: manifestoUrl });
  });
  AUT_SIGN_EVENTO_(idAssinatura, '', 'MANIFESTO_SELADO', 'SISTEMA', {
    hashManifesto: hashManifesto,
    hashPdfAssinado: pdf.hashPdfAssinado,
    manifestoUrl: manifestoUrl
  });
  try {
    AUT_APPEND_AUDITORIA_V7_(AUT_SS_FAST_(), 'ASSINATURA_ELETRONICA_CONCLUIDA', idAssinatura, {
      idLaudo: assinatura.ID_LAUDO,
      numeroLaudo: assinatura.NUMERO_LAUDO,
      hashManifesto: hashManifesto,
      hashPdfAssinado: pdf.hashPdfAssinado
    }, assinatura.HASH_DOCUMENTO_ORIGEM, hashManifesto);
  } catch (eAudit) {}
  return { manifestoUrl: manifestoUrl, pdfAssinadoUrl: pdf.pdfAssinadoUrl, hashManifesto: hashManifesto };
}

function AUT_SIGN_GERAR_PDF_ASSINADO_(assinatura, signatarios, hashManifesto, manifestoUrl) {
  var ss = AUT_SS_FAST_();
  var localizado = AUT_LOCALIZAR_LAUDO_EDICAO_FINAL_(ss, assinatura.ID_LAUDO);
  if (!localizado || !localizado.achado) throw new Error('Laudo nao encontrado para gerar PDF assinado.');
  var achado = localizado.achado;
  var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
  var rawObj = achado.rowObjRaw || achado.rowObj || {};
  var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
  var numeroLaudo = rowObj.NUMERO_LAUDO || assinatura.NUMERO_LAUDO || assinatura.ID_LAUDO;
  var idReal = rowObj.ID_LAUDO || assinatura.ID_LAUDO;
  var fotos = AUT_FOTOS_PDF_(ss, idReal, numeroLaudo);
  var cfg = getConfiguracoesGlobais();
  var idDocumentoAssinado = 'SIGDOC-' + String(idReal).replace(/[^A-Za-z0-9_-]/g, '') + '-' + hashManifesto.substring(0, 12).toUpperCase();
  var qrCodeDataUrl = AUT_QR_DATA_URL_V7_(manifestoUrl);
  var seals = signatarios.map(function(s) {
    return {
      idSignatario: s.ID_SIGNATARIO,
      papel: s.PAPEL,
      papelLabel: AUT_SIGN_LABEL_PAPEL_(s.PAPEL),
      nome: s.NOME,
      cpf: s.CPF,
      assinadoEm: AUT_SIGN_DATA_(s.ASSINADO_EM),
      hashAssinatura: s.HASH_ASSINATURA,
      passkeyStatus: s.PASSKEY_STATUS,
      ipHash: s.IP_HASH,
      geo: s.GEO_LAT && s.GEO_LNG ? (s.GEO_LAT + ', ' + s.GEO_LNG + ' | precisao ' + (s.GEO_ACURACIA || '-') + 'm') : 'Nao informado'
    };
  });
  var tpl = HtmlService.createTemplateFromFile('modelo');
  tpl.cfg = cfg;
  tpl.logoPalmerDataUri = AUT_LOGO_PALMER_INLINE_DATA_V9_() || cfg.logoLaudoBase64 || cfg.logoLaudoPublica || PALMER_LAUDO_LOGO_OFICIAL;
  tpl.marcaDaguaPalmerDataUri = tpl.logoPalmerDataUri;
  tpl.row = achado.row;
  tpl.rowObj = rowObj;
  tpl.payload = payload;
  tpl.fotos = fotos;
  tpl.auditHash = rowObj.HASH_LAUDO || AUT_HASH_(AUT_SIGN_JSON_(rowObj));
  tpl.documentHash = hashManifesto;
  tpl.pdfHash = hashManifesto;
  tpl.idDocumento = idDocumentoAssinado;
  tpl.manifestoUrl = manifestoUrl;
  tpl.qrCodeDataUrl = qrCodeDataUrl;
  tpl.historicoAlteracoes = AUT_GET_(rawObj, ['HISTORICO_ALTERACOES']) || '';
  tpl.assinaturasEletronicas = seals;
  tpl.assinaturaHashManifesto = hashManifesto;
  tpl.assinaturaManifestoUrl = manifestoUrl;
  var html = tpl.evaluate().getContent();
  var blob = Utilities
    .newBlob(html, 'text/html', 'LAUDO_ASSINADO_' + numeroLaudo + '.html')
    .getAs('application/pdf')
    .setName('LAUDO_ASSINADO_' + numeroLaudo + '.pdf');
  var pdfHash = AUT_HASH_(Utilities.base64Encode(blob.getBytes()));
  var file = obterPastaVistorias().createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}
  return { pdfAssinadoUrl: file.getUrl(), hashPdfAssinado: pdfHash, idDocumentoAssinado: idDocumentoAssinado };
}

function apiSignListarAssinaturas() {
  try {
    garantirEstruturaDoSistema();
    var cached = AUT_CACHE_GET_JSON_(AUT_SIGN_CACHE_LISTA);
    if (cached && cached.version === AUT_SIGN_VERSION) return cached;
    var assinaturas = AUT_SIGN_ROWS_('ASSINATURAS');
    var signatarios = AUT_SIGN_ROWS_('SIGNATARIOS');
    var out = assinaturas.map(function(a) {
      var ss = signatarios.filter(function(s) { return String(s.ID_ASSINATURA || '') === String(a.ID_ASSINATURA || ''); });
      return {
        idAssinatura: a.ID_ASSINATURA,
        idLaudo: a.ID_LAUDO,
        numeroLaudo: a.NUMERO_LAUDO,
        status: a.STATUS,
        criadoEm: AUT_SIGN_DATA_(a.CRIADO_EM),
        expiraEm: AUT_SIGN_DATA_(a.EXPIRA_EM),
        concluidoEm: AUT_SIGN_DATA_(a.CONCLUIDO_EM),
        qtdSignatarios: a.QTD_SIGNATARIOS || ss.length,
        qtdAssinados: a.QTD_ASSINADOS || ss.filter(function(s) { return String(s.STATUS) === 'ASSINADO'; }).length,
        manifestoUrl: a.MANIFESTO_URL,
        pdfAssinadoUrl: a.PDF_ASSINADO_URL,
        hashManifesto: a.HASH_MANIFESTO,
        riscoGeral: a.RISCO_GERAL,
        signatarios: ss.map(function(s) {
          return { nome: s.NOME, papel: s.PAPEL, papelLabel: AUT_SIGN_LABEL_PAPEL_(s.PAPEL), status: s.STATUS, email: AUT_SIGN_MASCARAR_EMAIL_(s.EMAIL) };
        })
      };
    });
    out.sort(function(a, b) { return String(b.idAssinatura).localeCompare(String(a.idAssinatura)); });
    var res = { sucesso: true, version: AUT_SIGN_VERSION, dados: out };
    AUT_CACHE_PUT_JSON_(AUT_SIGN_CACHE_LISTA, res, 300);
    return res;
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao listar assinaturas: ' + e.message };
  }
}

function apiSignObterAssinatura(idAssinatura) {
  try {
    var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', idAssinatura);
    if (!assinatura) return { sucesso: false, msg: 'Assinatura nao encontrada.' };
    var signatarios = AUT_SIGN_SIGNATARIOS_(idAssinatura);
    var evidencias = AUT_SIGN_EVIDENCIAS_(idAssinatura);
    var eventos = AUT_SIGN_ROWS_('EVENTOS_ASSINATURA').filter(function(ev) {
      return String(ev.ID_ASSINATURA || '') === String(idAssinatura || '');
    });
    return {
      sucesso: true,
      assinatura: assinatura,
      signatarios: signatarios,
      evidencias: evidencias,
      eventos: eventos
    };
  } catch (e) {
    return { sucesso: false, msg: e.message };
  }
}

function apiSignCancelarAssinatura(idAssinatura, usuario) {
  try {
    var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', idAssinatura);
    if (!assinatura) return { sucesso: false, msg: 'Assinatura nao encontrada.' };
    AUT_SIGN_SET_ROW_(AUT_SIGN_SHEET_('ASSINATURAS'), assinatura.__rowNumber, { STATUS: 'CANCELADA' });
    AUT_SIGN_EVENTO_(idAssinatura, '', 'SESSAO_CANCELADA', (usuario && usuario.usuario) || 'ADMIN', {});
    AUT_SIGN_INVALIDAR_CACHE_();
    return { sucesso: true, msg: 'Sessao cancelada.' };
  } catch (e) {
    return { sucesso: false, msg: e.message };
  }
}

function AUT_SIGN_CONSULTAR_PUBLICO_(id, hash) {
  var assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', id);
  if (!assinatura) {
    var mans = AUT_SIGN_ROWS_('MANIFESTOS_ASSINATURA');
    for (var i = 0; i < mans.length; i++) {
      if (String(mans[i].ID_MANIFESTO || '') === String(id || '')) {
        assinatura = AUT_SIGN_FIND_('ASSINATURAS', 'ID_ASSINATURA', mans[i].ID_ASSINATURA);
        break;
      }
    }
  }
  if (!assinatura) return { sucesso: true, status: 'NAO_CONFIRMADO', msg: 'Registro nao encontrado.' };
  var hashOk = !hash || String(hash) === String(assinatura.HASH_MANIFESTO || '') || String(hash) === String(assinatura.HASH_PDF_ASSINADO || '');
  var concluida = String(assinatura.STATUS || '') === 'CONCLUIDA';
  return {
    sucesso: true,
    status: hashOk && concluida ? 'AUTENTICO' : 'NAO_CONFIRMADO',
    idAssinatura: assinatura.ID_ASSINATURA,
    idLaudo: assinatura.ID_LAUDO,
    numeroLaudo: assinatura.NUMERO_LAUDO,
    idDocumentoAssinado: assinatura.ID_DOCUMENTO_ASSINADO,
    concluidoEm: AUT_SIGN_DATA_(assinatura.CONCLUIDO_EM),
    hashManifesto: assinatura.HASH_MANIFESTO,
    hashPdfAssinado: assinatura.HASH_PDF_ASSINADO,
    qtdSignatarios: assinatura.QTD_SIGNATARIOS,
    qtdAssinados: assinatura.QTD_ASSINADOS,
    manifestoUrl: assinatura.MANIFESTO_URL,
    pdfAssinadoUrl: assinatura.PDF_ASSINADO_URL,
    hashConferido: hashOk
  };
}

function apiSignConsultarPublico(id, hash) {
  try {
    garantirEstruturaDoSistema();
    return AUT_SIGN_CONSULTAR_PUBLICO_(id, hash);
  } catch (e) {
    return { sucesso: false, status: 'ERRO', msg: e.message };
  }
}

function AUT_SIGN_RENDER_SIGN_(params) {
  var tpl = HtmlService.createTemplateFromFile('Sign');
  tpl.idAssinatura = String((params && (params.s || params.sign)) || '');
  tpl.nonce = String((params && (params.n || params.nonce)) || '');
  return tpl.evaluate()
    .setTitle('AUTENTIKO Sign')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function AUT_SIGN_RENDER_VERIFY_(params) {
  var id = String((params && params.id) || '');
  var hash = String((params && params.hash) || '');
  var res = id ? AUT_SIGN_CONSULTAR_PUBLICO_(id, hash) : null;
  var status = res ? res.status : 'CONSULTA';
  var cor = status === 'AUTENTICO' ? '#047857' : (status === 'CONSULTA' ? '#2563eb' : '#b91c1c');
  var html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Verificador AUTENTIKO Sign</title><style>body{font-family:Arial,Helvetica,sans-serif;background:#f8fafc;color:#0f172a;margin:0}.wrap{max-width:820px;margin:32px auto;background:white;border:1px solid #dbe3ef;border-radius:12px;padding:24px}.brand{font-size:12px;font-weight:700;color:#475569;text-transform:uppercase}.status{font-size:28px;font-weight:800;color:' + cor + ';margin:12px 0 20px}.grid{display:grid;grid-template-columns:220px 1fr;border-top:1px solid #e2e8f0;border-left:1px solid #e2e8f0}.grid div{padding:10px;border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}.k{background:#f1f5f9;font-weight:700}.hash{font-family:Consolas,monospace;word-break:break-all;font-size:12px}input{width:100%;padding:11px;border:1px solid #cbd5e1;border-radius:8px;margin:6px 0 12px}button{background:#2563eb;color:white;border:none;border-radius:8px;padding:12px 16px;font-weight:700;cursor:pointer}</style></head><body><main class="wrap">' +
    '<div class="brand">AUTENTIKO-OK CHECK | Palmer Imoveis</div><h1>Verificador de Assinatura</h1>';
  if (!id) {
    html += '<p>Informe o ID e o hash para consultar a autenticidade.</p><form method="get"><input type="hidden" name="verify" value="1"><label>ID da assinatura</label><input name="id" required><label>Hash</label><input name="hash"><button>Verificar</button></form>';
  } else {
    html += '<div class="status">' + AUT_SIGN_ESCAPE_(status) + '</div><div class="grid">' +
      '<div class="k">ID assinatura</div><div>' + AUT_SIGN_ESCAPE_(res.idAssinatura) + '</div>' +
      '<div class="k">Laudo</div><div>' + AUT_SIGN_ESCAPE_(res.numeroLaudo || res.idLaudo) + '</div>' +
      '<div class="k">Documento assinado</div><div>' + AUT_SIGN_ESCAPE_(res.idDocumentoAssinado) + '</div>' +
      '<div class="k">Concluido em</div><div>' + AUT_SIGN_ESCAPE_(res.concluidoEm) + '</div>' +
      '<div class="k">Signatarios</div><div>' + AUT_SIGN_ESCAPE_(res.qtdAssinados || '0') + ' de ' + AUT_SIGN_ESCAPE_(res.qtdSignatarios || '0') + '</div>' +
      '<div class="k">Hash manifesto</div><div class="hash">' + AUT_SIGN_ESCAPE_(res.hashManifesto) + '</div>' +
      '<div class="k">Hash PDF assinado</div><div class="hash">' + AUT_SIGN_ESCAPE_(res.hashPdfAssinado) + '</div>' +
      '</div><p style="font-size:12px;color:#64748b;margin-top:16px">Consulta publica com dados reduzidos. Evidencias sensiveis ficam restritas ao painel administrativo.</p>';
  }
  html += '</main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Verificador AUTENTIKO Sign').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function AUT_SIGN_RENDER_MANIFESTO_(params) {
  var id = String((params && params.id) || '');
  var hash = String((params && params.hash) || '');
  var res = AUT_SIGN_CONSULTAR_PUBLICO_(id, hash);
  return AUT_SIGN_RENDER_VERIFY_({ id: id, hash: hash, verify: 1 });
}

function AUT_SIGN_JSONP_VERIFY_(params) {
  var id = String((params && params.id) || '');
  var hash = String((params && params.hash) || '');
  var callback = String((params && params.callback) || 'callback').replace(/[^A-Za-z0-9_.$]/g, '');
  var res = AUT_SIGN_CONSULTAR_PUBLICO_(id, hash);
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(res) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
