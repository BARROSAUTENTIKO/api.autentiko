/**
 * CODE.GS COMPLETO DE RECUPERAÇÃO — AUTENTIKO OK CHECK / VISTORIAS
 * Substitua TODO o arquivo Code.gs por este conteúdo.
 * Mantém: login, cadastro, configurações, upload de fotos, salvamento,
 * consulta no painel, emissão de PDF e estrutura das abas.
 */

/** TROQUE O ID ABAIXO SE A SUA PLANILHA FOR OUTRA */
var ID_PLANILHA = '1bs2hGPyYRpe8X1hzLYpHB_4ense7ca7T79hMyWJqqSk';

var AUTENTIKO_LOGO_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1NiIgZmlsbD0iIzI1NjNlYiIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEyOCIgcj0iODIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTQiLz48dGV4dCB4PSIxMjgiIHk9IjE0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjQiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmZmZmYiPkE8L3RleHQ+PHRleHQgeD0iMTI4IiB5PSIxNzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZGJlYWZlIj5PSzwvdGV4dD48L3N2Zz4=';

var AUTENTIKO_HEADERS = {
  'USUARIOS': [
    'NOME','DATA_NASCIMENTO','CONTATO','EMAIL','USUARIO','SENHA_HASH',
    'PERFIL','STATUS','DATA_CADASTRO','ULTIMO_ACESSO'
  ],
  'CONFIGURACOES': [
    'NOME_SISTEMA','LOGO_BASE64','MANUTENCAO','SITE','ENDERECO','CORRETOR','CRECI'
  ],
  'REGISTRO DE VISTORIA': [
    'ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','DATA_VISTORIA','HORA_VISTORIA',
    'RESPONSAVEL','VISTORIADOR','PROPRIETARIO','CPF_PROPRIETARIO','LOCATARIO',
    'CPF_LOCATARIO','CONTATO','EMAIL','RUA','NUMERO','REFERENCIA','BAIRRO','CIDADE','CEP',
    'ENDERECO_IMOVEL','TIPO_VISTORIA','CATEGORIA_IMOVEL','TIPO_LOCACAO','ESTADO_IMOVEL',
    'PAYLOAD_JSON','DATA_REGISTRO','PDF_URL','HASH_LAUDO'
  ],
  'PROCESSOS': [
    'ID_PROCESSO','ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','PROPRIETARIO','LOCATARIO',
    'ENDERECO','TIPO_VISTORIA','CATEGORIA_IMOVEL','VISTORIADOR','STATUS','PDF_URL',
    'HASH_LAUDO','CRIADO_EM','ATUALIZADO_EM'
  ],
  'FOTOS_LAUDO': [
    'ID_FOTO','ID_LAUDO','NUMERO_LAUDO','AMBIENTE','ITEM','NOME_ARQUIVO','MIME_TYPE',
    'FOTO_URL','FOTO_DATA_URL','HASH_FOTO','CRIADO_EM'
  ],
  'DOCUMENTOS_LAUDO': [
    'ID_DOCUMENTO','ID_LAUDO','NOME_DOCUMENTO','ARQUIVO_URL','HASH_DOCUMENTO','CRIADO_EM'
  ],
  'ANAMINESE': [
    'CATEGORIA','CLAUSULA_DE_ANALISE'
  ],
  'LISTAS': [
    'TIPO','VALOR','ORDEM','ATIVO'
  ],
  'LOGS': [
    'DATA_HORA','NIVEL','FUNCAO','MENSAGEM','DETALHES_JSON'
  ],
  'AUDITORIA': [
    'ID_AUDITORIA','QUANDO','USUARIO','ACAO','ENTIDADE','ID_ENTIDADE','DETALHES_JSON',
    'HASH_ANTERIOR','HASH_ATUAL'
  ]
};

/* =========================================================
   WEB APP
   ========================================================= */

function doGet(e) {
  garantirEstruturaDoSistema();

  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Palmer Imóveis - Vistorias')
    .setFaviconUrl('https://img.icons8.com/fluency/48/000000/ok.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .addMetaTag('apple-mobile-web-app-capable', 'yes');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚙️ Autentiko OK Check')
    .addItem('🔄 Instalar / Reparar Estrutura', 'garantirEstruturaMenu')
    .addItem('✅ Aprovar Usuário Selecionado', 'aprovarUsuarioViaPlanilha')
    .addToUi();
}

function garantirEstruturaMenu() {
  garantirEstruturaDoSistema();
  SpreadsheetApp.getUi().alert('Estrutura reparada com sucesso.');
}

/* =========================================================
   ESTRUTURA / UTILITÁRIOS
   ========================================================= */

function AUT_SS_() {
  try {
    var ativo = SpreadsheetApp.getActiveSpreadsheet();
    if (ativo && ativo.getId && ativo.getId() === ID_PLANILHA) return ativo;
  } catch (e) {}
  return SpreadsheetApp.openById(ID_PLANILHA);
}

function AUT_NORM_(v) {
  return String(v || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function AUT_SHEET_(ss, nome, headers) {
  var sh = ss.getSheetByName(nome) || ss.insertSheet(nome);

  if (sh.getMaxColumns() < headers.length) {
    sh.insertColumnsAfter(sh.getMaxColumns(), headers.length - sh.getMaxColumns());
  }

  // Garante os cabeçalhos sem apagar os dados.
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);

  try {
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#2563eb')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
  } catch (e) {}

  return sh;
}

function garantirEstruturaDoSistema() {
  var ss = AUT_SS_();

  Object.keys(AUTENTIKO_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUTENTIKO_HEADERS[nome]);
  });

  garantirConfigPadrao_(ss);
  garantirUsuarioAdmin_(ss);
  garantirListasPadrao_(ss);
  garantirAnamnesePadrao_(ss);

  return { sucesso: true, msg: 'Estrutura AUTENTIKO reparada.' };
}

function garantirConfigPadrao_(ss) {
  var sh = ss.getSheetByName('CONFIGURACOES');
  if (sh.getLastRow() < 2) {
    sh.getRange(2, 1, 1, 7).setValues([[
      'LAUDO DE VISTORIA',
      AUTENTIKO_LOGO_FALLBACK,
      'FALSE',
      'WWW.PALMERIMOVEIS.COM.BR',
      'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      'RYCKY DE PALMER DIAS',
      '12.596'
    ]]);
  }
}

function garantirUsuarioAdmin_(ss) {
  var sh = ss.getSheetByName('USUARIOS');
  var data = sh.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][4] || '').toLowerCase() === 'admin') return;
  }

  // Hash SHA-256 da chave mestra padrao.
  sh.appendRow([
    'Administrador Mestre',
    '',
    '',
    'admin@local',
    'admin',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'Desenvolvedor',
    'Aprovado',
    new Date(),
    ''
  ]);
}

function garantirListasPadrao_(ss) {
  var sh = ss.getSheetByName('LISTAS');
  var atuais = {};
  var data = sh.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    atuais[String(data[i][0]) + '::' + String(data[i][1])] = true;
  }

  var linhas = [
    ['VISTORIADOR','ANTONIO BARROS DA COSTA NETO',1,'SIM'],
    ['VISTORIADOR','RYCKY DE PALMER MELO DIAS',2,'SIM'],
    ['TIPO_VISTORIA','ENTRADA',1,'SIM'],
    ['TIPO_VISTORIA','SAÍDA',2,'SIM'],
    ['TIPO_VISTORIA','CONSTATAÇÃO',3,'SIM'],
    ['ESTADO_IMOVEL','EXCELENTE',1,'SIM'],
    ['ESTADO_IMOVEL','BOM',2,'SIM'],
    ['ESTADO_IMOVEL','REGULAR',3,'SIM'],
    ['ESTADO_IMOVEL','RUIM',4,'SIM']
  ];

  var inserir = [];
  linhas.forEach(function(l) {
    var chave = l[0] + '::' + l[1];
    if (!atuais[chave]) inserir.push(l);
  });

  if (inserir.length) {
    sh.getRange(sh.getLastRow() + 1, 1, inserir.length, 4).setValues(inserir);
  }
}

function garantirAnamnesePadrao_(ss) {
  var sh = ss.getSheetByName('ANAMINESE');
  if (sh.getLastRow() > 1) return;

  var dados = [
    ['Áreas Sociais', 'Sala de Estar: paredes, piso, teto, portas, janelas, tomadas e iluminação.'],
    ['Áreas Sociais', 'Sala de Jantar: piso, pintura, luminárias, tomadas e estado geral.'],
    ['Áreas Íntimas', 'Quarto: piso, paredes, teto, portas, janelas, armários e iluminação.'],
    ['Áreas Íntimas', 'Suíte: quarto, banheiro, metais, louças, box, ventilação e infiltrações.'],
    ['Cozinha', 'Cozinha: bancada, pia, torneira, sifão, revestimentos, armários e tomadas.'],
    ['Banheiros', 'Banheiro: louças, metais, box, ralos, registros, revestimentos e ventilação.'],
    ['Serviço', 'Área de serviço: tanque, instalações hidráulicas, tomadas e ventilação.'],
    ['Estrutura', 'Verificar rachaduras, fissuras, infiltrações, umidade, mofo e cupins.']
  ];

  sh.getRange(2, 1, dados.length, 2).setValues(dados);
}

function AUT_OBJ_INDEX_(obj) {
  var out = {};
  obj = obj || {};
  Object.keys(obj).forEach(function(k) {
    out[AUT_NORM_(k)] = obj[k];
  });
  return out;
}

function AUT_GET_(obj, nomes) {
  var idx = AUT_OBJ_INDEX_(obj || {});
  for (var i = 0; i < nomes.length; i++) {
    var key = AUT_NORM_(nomes[i]);
    if (idx[key] !== undefined && idx[key] !== null && String(idx[key]).trim() !== '') {
      return idx[key];
    }
  }
  return '';
}

function AUT_ROW_TO_OBJ_(headers, row) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    if (headers[i]) obj[AUT_NORM_(headers[i])] = row[i];
  }
  return obj;
}

function AUT_APPEND_OBJ_(sh, obj) {
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var idx = AUT_OBJ_INDEX_(obj || {});
  var row = [];

  for (var i = 0; i < headers.length; i++) {
    var k = AUT_NORM_(headers[i]);
    row.push(idx[k] !== undefined ? idx[k] : '');
  }

  sh.getRange(sh.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function AUT_SET_BY_HEADER_(sh, rowNumber, nomes, valor) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

  for (var c = 0; c < headers.length; c++) {
    var h = AUT_NORM_(headers[c]);
    for (var i = 0; i < nomes.length; i++) {
      if (h === AUT_NORM_(nomes[i])) {
        sh.getRange(rowNumber, c + 1).setValue(valor);
        return true;
      }
    }
  }

  return false;
}

function AUT_HASH_(texto) {
  var raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(texto || ''),
    Utilities.Charset.UTF_8
  );

  return raw.map(function(b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function AUT_DATA_BR_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  }
  return String(v);
}

function AUT_ENDERECO_(dados) {
  var rua = AUT_GET_(dados, ['etapa2_rua', 'rua']);
  var numero = AUT_GET_(dados, ['etapa2_numero', 'numero']);
  var bairro = AUT_GET_(dados, ['etapa2_bairro', 'bairro']);
  var cidade = AUT_GET_(dados, ['etapa2_cidade', 'cidade']);
  var cep = AUT_GET_(dados, ['etapa2_cep', 'cep']);

  var partes = [];
  if (rua) partes.push(rua);
  if (numero) partes.push('nº ' + numero);
  if (bairro) partes.push(bairro);
  if (cidade) partes.push(cidade);
  if (cep) partes.push('CEP ' + cep);

  return partes.join(', ');
}

/* =========================================================
   CONFIGURAÇÕES / LOGO
   ========================================================= */

function AUT_DRIVE_ID_(url) {
  url = String(url || '').trim();
  if (!url) return '';

  if (url.indexOf('id=') > -1) {
    return url.split('id=')[1].split('&')[0];
  }

  if (url.indexOf('/d/') > -1) {
    return url.split('/d/')[1].split('/')[0];
  }

  return url;
}

function AUT_BASE64_IMAGEM_(src) {
  try {
    if (!src) return '';

    src = String(src).trim();

    if (src.indexOf('data:image') === 0) return src;

    if (src.indexOf('drive.google.com') > -1) {
      var id = AUT_DRIVE_ID_(src);
      var blob = DriveApp.getFileById(id).getBlob();
      return 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
    }

    // URLs externas podem funcionar no HTML, mas para PDF o ideal é base64.
    return src;
  } catch (e) {
    return '';
  }
}

function obterLogoBase64(idOuUrl) {
  try {
    if (!idOuUrl || String(idOuUrl).trim() === '') return AUTENTIKO_LOGO_FALLBACK;

    var logo = AUT_BASE64_IMAGEM_(idOuUrl);
    if (logo && logo.indexOf('data:image') === 0) return logo;

    return logo || AUTENTIKO_LOGO_FALLBACK;
  } catch (e) {
    return AUTENTIKO_LOGO_FALLBACK;
  }
}

function getConfiguracoesGlobais() {
  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SS_().getSheetByName('CONFIGURACOES');
    var row = sh.getRange(2, 1, 1, 7).getValues()[0];

    var logoRaw = row[1] || AUTENTIKO_LOGO_FALLBACK;
    var logoBase64 = obterLogoBase64(logoRaw);

    return {
      sucesso: true,
      nome: row[0] || 'LAUDO DE VISTORIA',
      logoRaw: logoRaw,
      logoBase64: logoBase64,
      logoPublica: logoBase64,
      manutencao: row[2] === true || String(row[2]).toUpperCase() === 'TRUE',
      site: row[3] || '',
      endereco: row[4] || '',
      corretor: row[5] || '',
      creci: row[6] || ''
    };
  } catch (e) {
    return {
      sucesso: false,
      nome: 'LAUDO DE VISTORIA',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoPublica: AUTENTIKO_LOGO_FALLBACK,
      manutencao: false,
      site: '',
      endereco: '',
      corretor: '',
      creci: '',
      msg: e.message
    };
  }
}

function salvarConfiguracoesGlobais(n, l, m, s, end, c, cr) {
  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SS_().getSheetByName('CONFIGURACOES');
    sh.getRange(2, 1, 1, 7).setValues([[
      n || 'LAUDO DE VISTORIA',
      l || AUTENTIKO_LOGO_FALLBACK,
      m ? 'TRUE' : 'FALSE',
      s || '',
      end || '',
      c || '',
      cr || ''
    ]]);

    return { sucesso: true, msg: 'Configurações salvas.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao salvar configurações: ' + e.message };
  }
}

/* =========================================================
   LOGIN / USUÁRIOS
   ========================================================= */

function registrarUsuario(dados) {
  try {
    garantirEstruturaDoSistema();

    dados = dados || {};
    if (!dados.nome || !dados.email || !dados.usuario || !dados.senhaHash) {
      return { sucesso: false, msg: 'Dados obrigatórios não preenchidos.' };
    }

    var sh = AUT_SS_().getSheetByName('USUARIOS');
    var data = sh.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][3] || '').toLowerCase() === String(dados.email).toLowerCase()) {
        return { sucesso: false, msg: 'E-mail já cadastrado.' };
      }

      if (String(data[i][4] || '').toLowerCase() === String(dados.usuario).toLowerCase()) {
        return { sucesso: false, msg: 'Usuário já existe.' };
      }
    }

    sh.appendRow([
      dados.nome,
      dados.nascimento || '',
      dados.contato || '',
      dados.email,
      dados.usuario,
      dados.senhaHash,
      'Suporte Técnico',
      'Pendente',
      new Date(),
      ''
    ]);

    return { sucesso: true, msg: 'Cadastro realizado. Aguarde aprovação.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao registrar usuário: ' + e.message };
  }
}

function validarLogin(usuario, senhaHash) {
  try {
    garantirEstruturaDoSistema();

    usuario = String(usuario || '').trim();
    senhaHash = String(senhaHash || '').trim();

    if (!usuario || !senhaHash) {
      return { sucesso: false, msg: 'Usuário e senha são obrigatórios.' };
    }

    var configs = getConfiguracoesGlobais();
    var sh = AUT_SS_().getSheetByName('USUARIOS');
    var data = sh.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      var u = String(data[i][4] || '').trim();
      var h = String(data[i][5] || '').trim();

      if (u === usuario && h === senhaHash) {
        var status = String(data[i][7] || '').trim();
        var perfil = String(data[i][6] || '').trim();

        if (status !== 'Aprovado') {
          return { sucesso: false, msg: 'Acesso pendente ou bloqueado.' };
        }

        if (configs.manutencao && perfil !== 'Desenvolvedor') {
          return { sucesso: false, msg: 'Sistema em manutenção.' };
        }

        try {
          sh.getRange(i + 1, 10).setValue(new Date());
        } catch (eData) {}

        return {
          sucesso: true,
          msg: 'Login efetuado.',
          nome: data[i][0],
          perfil: perfil
        };
      }
    }

    return { sucesso: false, msg: 'Usuário ou senha incorretos.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no login: ' + e.message };
  }
}

function getTodosUsuarios() {
  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SS_().getSheetByName('USUARIOS');
    var data = sh.getDataRange().getValues();
    var lista = [];

    for (var i = 1; i < data.length; i++) {
      if (!data[i][0] && !data[i][4]) continue;
      lista.push({
        linha: i + 1,
        nome: data[i][0],
        email: data[i][3],
        usuario: data[i][4],
        perfil: data[i][6],
        status: data[i][7]
      });
    }

    return { sucesso: true, dados: lista };
  } catch (e) {
    return { sucesso: false, dados: [], msg: 'Erro ao buscar usuários: ' + e.message };
  }
}

function alterarMembroCompleto(linha, perfil, status) {
  try {
    garantirEstruturaDoSistema();

    linha = Number(linha);
    if (!linha || linha < 2) return { sucesso: false, msg: 'Linha inválida.' };

    var sh = AUT_SS_().getSheetByName('USUARIOS');
    sh.getRange(linha, 7).setValue(perfil || 'Suporte Técnico');
    sh.getRange(linha, 8).setValue(status || 'Pendente');

    return { sucesso: true, msg: 'Usuário atualizado.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao atualizar usuário: ' + e.message };
  }
}

function aprovarUsuarioViaPlanilha() {
  var ss = AUT_SS_();
  var sh = ss.getActiveSheet();
  var ui = SpreadsheetApp.getUi();

  if (sh.getName() !== 'USUARIOS') {
    ui.alert('Abra a aba USUARIOS para aprovar o usuário.');
    return;
  }

  var linha = sh.getActiveCell().getRow();
  if (linha <= 1) return;

  sh.getRange(linha, 8).setValue('Aprovado');
  ui.alert('Usuário aprovado.');
}

function validarChaveMestra(chave) {
  try {
    // Hash padrao da chave mestra. Em producao, salve CHAVE_MESTRA nas Propriedades do Script.
    var props = PropertiesService.getScriptProperties();
    var chaveSalva = props.getProperty('CHAVE_MESTRA') || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

    return { sucesso: String(chave || '') === String(chaveSalva) };
  } catch (e) {
    return { sucesso: false };
  }
}

/* =========================================================
   ANAMNESE
   ========================================================= */

function getClausulasAnamnese() {
  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SS_().getSheetByName('ANAMINESE');
    var data = sh.getDataRange().getValues();
    var lista = [];
    var seen = {};

    for (var i = 1; i < data.length; i++) {
      var categoria = String(data[i][0] || 'Geral').trim();
      var texto = String(data[i][1] || '').trim();

      if (texto && !seen[categoria + texto]) {
        seen[categoria + texto] = true;
        lista.push({ categoria: categoria, texto: texto });
      }
    }

    return { sucesso: true, dados: lista };
  } catch (e) {
    return { sucesso: false, dados: [], msg: e.message };
  }
}

/* =========================================================
   DRIVE / FOTOS
   ========================================================= */

function obterPastaVistorias() {
  var nome = 'Autentiko - Fotos e PDFs Vistorias';
  var pastas = DriveApp.getFoldersByName(nome);
  if (pastas.hasNext()) return pastas.next();
  return DriveApp.createFolder(nome);
}

function uploadImagemVistoria(base64Data, nomeArquivo) {
  try {
    garantirEstruturaDoSistema();

    if (!base64Data || !nomeArquivo) {
      return { sucesso: false, msg: 'Imagem ou nome do arquivo ausente.' };
    }

    var tipo = 'image/jpeg';
    var dadosPuros = '';

    if (String(base64Data).indexOf('data:') === 0) {
      tipo = String(base64Data).split(';')[0].split(':')[1] || 'image/jpeg';
      dadosPuros = String(base64Data).split(',')[1];
    } else {
      dadosPuros = String(base64Data);
    }

    if (!dadosPuros) {
      return { sucesso: false, msg: 'Base64 da imagem está vazio.' };
    }

    var blob = Utilities.newBlob(
      Utilities.base64Decode(dadosPuros),
      tipo,
      nomeArquivo
    );

    var arquivo = obterPastaVistorias().createFile(blob);

    try {
      arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (eShare) {}

    var hash = AUT_HASH_(dadosPuros);

    return {
      sucesso: true,
      url: arquivo.getUrl(),
      dataUrl: base64Data,
      hash: hash,
      fileId: arquivo.getId(),
      nome: nomeArquivo,
      mimeType: tipo
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no upload da imagem: ' + e.message };
  }
}

function excluirImagemVistoria(fotoId, arquivoId) {
  try {
    garantirEstruturaDoSistema();

    if (arquivoId) {
      try {
        DriveApp.getFileById(arquivoId).setTrashed(true);
      } catch (eDrive) {}
    }

    if (fotoId) {
      var sh = AUT_SS_().getSheetByName('FOTOS_LAUDO');
      var data = sh.getDataRange().getValues();
      for (var i = data.length - 1; i >= 1; i--) {
        if (String(data[i][0]) === String(fotoId)) {
          sh.deleteRow(i + 1);
        }
      }
    }

    return { sucesso: true, msg: 'Imagem excluída.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao excluir imagem: ' + e.message };
  }
}

function AUT_EXTRAIR_FOTOS_PAYLOAD_(dados) {
  var fotos = [];
  var visitados = [];

  function andar(valor, caminho) {
    if (!valor) return;

    if (visitados.indexOf(valor) >= 0) return;
    if (typeof valor === 'object') visitados.push(valor);

    if (Array.isArray(valor)) {
      valor.forEach(function(item, idx) {
        andar(item, caminho + '[' + idx + ']');
      });
      return;
    }

    if (typeof valor === 'object') {
      var url = valor.url || valor.fotoUrl || valor.FOTO_URL || '';
      var dataUrl = valor.dataUrl || valor.base64 || valor.FOTO_DATA_URL || '';
      var embed = valor.embed || '';

      if (
        (url && String(url).indexOf('http') === 0) ||
        (dataUrl && String(dataUrl).indexOf('data:image') === 0) ||
        (embed && String(embed).indexOf('data:image') === 0)
      ) {
        fotos.push({
          id: valor.fotoId || valor.id || '',
          ambiente: valor.ambiente || valor.comodo || valor.local || caminho,
          item: valor.item || '',
          nome: valor.nome || valor.nomeArquivo || valor.name || 'foto_vistoria.jpg',
          mimeType: valor.mimeType || 'image/jpeg',
          url: url,
          dataUrl: dataUrl || embed,
          hash: valor.hash || AUT_HASH_(url + dataUrl + embed)
        });
      }

      Object.keys(valor).forEach(function(k) {
        andar(valor[k], caminho ? caminho + '.' + k : k);
      });
    }
  }

  andar(dados || {}, '');
  return fotos;
}

function AUT_VINCULAR_FOTOS_(ss, idLaudo, numeroLaudo, dados) {
  var fotos = AUT_EXTRAIR_FOTOS_PAYLOAD_(dados);
  if (!fotos.length) return 0;

  var sh = ss.getSheetByName('FOTOS_LAUDO');
  var inseridas = 0;
  var jaExiste = {};

  if (sh.getLastRow() > 1) {
    var atuais = sh.getDataRange().getValues();
    for (var i = 1; i < atuais.length; i++) {
      jaExiste[String(atuais[i][1]) + '::' + String(atuais[i][9])] = true;
    }
  }

  fotos.forEach(function(f) {
    var hash = f.hash || AUT_HASH_(f.url + f.dataUrl + f.nome);
    var chave = String(idLaudo) + '::' + String(hash);

    if (jaExiste[chave]) return;

    AUT_APPEND_OBJ_(sh, {
      ID_FOTO: f.id || ('FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)),
      ID_LAUDO: idLaudo,
      NUMERO_LAUDO: numeroLaudo,
      AMBIENTE: f.ambiente || '',
      ITEM: f.item || '',
      NOME_ARQUIVO: f.nome || 'foto_vistoria.jpg',
      MIME_TYPE: f.mimeType || 'image/jpeg',
      FOTO_URL: f.url || '',
      FOTO_DATA_URL: f.dataUrl || '',
      HASH_FOTO: hash,
      CRIADO_EM: new Date()
    });

    inseridas++;
  });

  return inseridas;
}

// =========================================================
// ESCUDO ANTI-CRASH (ERRO DE 50.000 CARACTERES)
// =========================================================
function AUT_PURGE_PAYLOAD_(dados) {
  if (!dados) return {};
  var out = {};
  
  Object.keys(dados).forEach(function(k) {
    var val = dados[k];
    
    if (typeof val === 'string') {
      // 1. Destrói qualquer código Base64 gigante solto na string
      val = val.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, "");
      
      // 2. Se for um array JSON (como a lista de fotos dos cômodos), limpa as chaves
      if (val.trim().charAt(0) === '[') {
        try {
          var obj = JSON.parse(val);
          if (Array.isArray(obj)) {
            obj.forEach(function(item) {
              if (item.dataUrl) item.dataUrl = "";
              if (item.base64) item.base64 = "";
              if (item.embed) item.embed = "";
              if (item.fotoDataUrl) item.fotoDataUrl = "";
            });
            val = JSON.stringify(obj);
          }
        } catch(e) {}
      }
      
      // 3. Guilhotina final: se a string ainda for maior que 45.000 caracteres, corta seco.
      if (val.length > 45000) {
        val = val.substring(0, 45000) + "... [CORTADO PELO SISTEMA]";
      }
    }
    
    out[k] = val;
  });
  
  return out;
}
/* =========================================================
   SALVAMENTO / CONSULTA
   ========================================================= */

function apiSalvarVistoria(dados) {
  try {
    garantirEstruturaDoSistema();
    
    // Usa a conexão super rápida com a planilha
    var ss = typeof AUT_SS_FAST_ === 'function' ? AUT_SS_FAST_() : AUT_SS_();

    dados = dados || {};
    
    // --- ATIVA O ESCUDO NUCLEAR ANTI 50.000 CARACTERES ---
    if (typeof AUT_PURGE_PAYLOAD_ === 'function') {
      dados = AUT_PURGE_PAYLOAD_(dados);
    }

    var registro = typeof AUT_MONTAR_REGISTRO_LAUDO_ === 'function' 
      ? AUT_MONTAR_REGISTRO_LAUDO_(dados) 
      : {
          // Fallback caso a função de montagem falte
          ID_LAUDO: AUT_GET_(dados, ['idLaudo', 'ID_LAUDO']) || ('LAUDO-' + Date.now()),
          NUMERO_LAUDO: AUT_GET_(dados, ['etapa1_numeroLaudo', 'numeroLaudo', 'NUMERO_LAUDO']) || ('LAUDO-' + Date.now()),
          CODIGO_LAUDO: AUT_GET_(dados, ['codigoLaudo', 'CODIGO_LAUDO']),
          PROPRIETARIO: AUT_GET_(dados, ['etapa1_proprietario', 'proprietario']),
          LOCATARIO: AUT_GET_(dados, ['etapa1_locatario', 'locatario']),
          ENDERECO_IMOVEL: AUT_ENDERECO_(dados),
          TIPO_VISTORIA: AUT_GET_(dados, ['etapa3_tipo', 'tipoVistoria']),
          CATEGORIA_IMOVEL: AUT_GET_(dados, ['etapa3_categoria', 'categoriaImovel']),
          VISTORIADOR: AUT_GET_(dados, ['etapa1_vistoriador', 'responsavel', 'vistoriador']),
          HASH_LAUDO: AUT_HASH_(JSON.stringify(dados))
        };

    // Salva na aba principal
    AUT_APPEND_OBJ_(ss.getSheetByName('REGISTRO DE VISTORIA'), registro);

    // Salva na aba de processos para listagem rápida
    AUT_APPEND_OBJ_(ss.getSheetByName('PROCESSOS'), {
      ID_PROCESSO: registro.ID_LAUDO,
      ID_LAUDO: registro.ID_LAUDO,
      NUMERO_LAUDO: registro.NUMERO_LAUDO,
      CODIGO_LAUDO: registro.CODIGO_LAUDO,
      PROPRIETARIO: registro.PROPRIETARIO,
      LOCATARIO: registro.LOCATARIO,
      ENDERECO: registro.ENDERECO_IMOVEL || '',
      TIPO_VISTORIA: registro.TIPO_VISTORIA,
      CATEGORIA_IMOVEL: registro.CATEGORIA_IMOVEL,
      VISTORIADOR: registro.VISTORIADOR,
      STATUS: 'REGISTRADO',
      PDF_URL: '',
      HASH_LAUDO: registro.HASH_LAUDO,
      CRIADO_EM: new Date(),
      ATUALIZADO_EM: new Date()
    });

    // Salva as fotos separadamente usando o link seguro
    var qtdFotos = typeof AUT_VINCULAR_FOTOS_ === 'function' ? AUT_VINCULAR_FOTOS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dados) : 0;
    
    // Limpa o cache para o painel atualizar imediatamente
    if (typeof AUT_INVALIDAR_CACHES_ === 'function') AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: registro.ID_LAUDO,
      idLaudo: registro.ID_LAUDO,
      numeroLaudo: registro.NUMERO_LAUDO,
      fotos: qtdFotos,
      msg: 'Laudo salvo com sucesso (Escudo Ativo).'
    };
  } catch (e) {
    return {
      sucesso: false,
      ok: false,
      msg: 'Erro ao salvar vistoria: ' + e.message,
      erro: e.message
    };
  }
}

// Atalhos para compatibilidade com versões antigas do frontend
function salvarLaudoVistoria(dados) { return apiSalvarVistoria(dados); }
function apiSalvarLaudoVistoria(dados) { return apiSalvarVistoria(dados); }
function salvarVistoria(dados) { return apiSalvarVistoria(dados); }

function AUT_MAP_ITEM_(obj, rowNumber) {
  return {
    rowNumber: rowNumber,
    id: AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']),
    idLaudo: AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']),
    idProcesso: AUT_GET_(obj, ['ID_PROCESSO', 'ID_LAUDO']),
    numero: AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO', 'ID_LAUDO']),
    numeroLaudo: AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO', 'ID_LAUDO']),
    codigoLaudo: AUT_GET_(obj, ['CODIGO_LAUDO', 'NUMERO_LAUDO']),
    dataVistoria: AUT_DATA_BR_(AUT_GET_(obj, ['DATA_VISTORIA', 'CRIADO_EM', 'DATA_REGISTRO'])),
    responsavel: AUT_GET_(obj, ['RESPONSAVEL', 'VISTORIADOR']),
    vistoriador: AUT_GET_(obj, ['VISTORIADOR', 'RESPONSAVEL']),
    proprietario: AUT_GET_(obj, ['PROPRIETARIO']),
    locatario: AUT_GET_(obj, ['LOCATARIO']),
    endereco: AUT_GET_(obj, ['ENDERECO', 'ENDERECO_IMOVEL']),
    tipoVistoria: AUT_GET_(obj, ['TIPO_VISTORIA']),
    categoriaImovel: AUT_GET_(obj, ['CATEGORIA_IMOVEL']),
    status: AUT_GET_(obj, ['STATUS']) || 'REGISTRADO',
    pdfUrl: AUT_GET_(obj, ['PDF_URL']),
    hash: AUT_GET_(obj, ['HASH_LAUDO']),
    criadoEm: AUT_DATA_BR_(AUT_GET_(obj, ['CRIADO_EM', 'DATA_REGISTRO'])),
    atualizadoEm: AUT_DATA_BR_(AUT_GET_(obj, ['ATUALIZADO_EM']))
  };
}

function AUT_LER_ITENS_(ss, nome) {
  var sh = ss.getSheetByName(nome);
  if (!sh || sh.getLastRow() < 2) return [];

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var out = [];

  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var item = AUT_MAP_ITEM_(obj, r + 1);
    if (item.id || item.numero || item.proprietario || item.locatario) {
      out.push(item);
    }
  }

  return out;
}

function apiListarProcessos() {
  try {
    if (typeof garantirEstruturaDoSistema === 'function') garantirEstruturaDoSistema();

    // Tenta pegar os laudos direto do Cache (Painel carrega em milissegundos)
    if (typeof AUT_CACHE_GET_JSON_ === 'function') {
      var cached = AUT_CACHE_GET_JSON_('AUTENTIKO_V2_LISTA_PROCESSOS');
      if (cached) return cached;
    }

    var ss = typeof AUT_SS_FAST_ === 'function' ? AUT_SS_FAST_() : AUT_SS_();

    var processos = AUT_LER_ITENS_(ss, 'PROCESSOS');
    var registros = AUT_LER_ITENS_(ss, 'REGISTRO DE VISTORIA');

    var mapa = {};

    registros.forEach(function(item) {
      mapa[String(item.id || item.numero)] = item;
    });

    processos.forEach(function(item) {
      var key = String(item.id || item.numero);
      mapa[key] = Object.assign(mapa[key] || {}, item);
    });

    var dados = Object.keys(mapa).map(function(k) {
      return mapa[k];
    });

    // Ordena do mais recente para o mais antigo
    dados.sort(function(a, b) {
      return String(b.criadoEm || b.dataVistoria || '').localeCompare(String(a.criadoEm || a.dataVistoria || ''));
    });

    var res = {
      sucesso: true,
      ok: true,
      dados: dados,
      processos: dados,
      laudos: dados,
      total: dados.length,
      cache: false
    };

    // Salva o resultado no cache do Google por 3 minutos
    if (typeof AUT_CACHE_PUT_JSON_ === 'function') {
      AUT_CACHE_PUT_JSON_('AUTENTIKO_V2_LISTA_PROCESSOS', res, 180);
    }

    return res;
  } catch (e) {
    return {
      sucesso: false,
      ok: false,
      dados: [],
      processos: [],
      laudos: [],
      total: 0,
      msg: 'Erro ao listar processos: ' + e.message
    };
  }
}

function getMeusLaudos() {
  return apiListarProcessos();
}

function apiListarLaudos() {
  return apiListarProcessos();
}

function apiListarConsultas() {
  return apiListarProcessos();
}

function apiConsultarLaudos() {
  return apiListarProcessos();
}

function listarLaudosVistoria() {
  return apiListarProcessos();
}

/* =========================================================
   PDF
   ========================================================= */

function AUT_LOCALIZAR_LAUDO_(ss, idLaudo) {
  var sh = ss.getSheetByName('REGISTRO DE VISTORIA');
  if (!sh || sh.getLastRow() < 2) return null;

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];

  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var candidatos = [
      AUT_GET_(obj, ['ID_LAUDO']),
      AUT_GET_(obj, ['NUMERO_LAUDO']),
      AUT_GET_(obj, ['CODIGO_LAUDO'])
    ];

    for (var i = 0; i < candidatos.length; i++) {
      if (String(candidatos[i]) === String(idLaudo)) {
        return {
          sheet: sh,
          rowNumber: r + 1,
          row: values[r],
          rowObj: obj,
          headers: headers
        };
      }
    }
  }

  return null;
}

function AUT_PAYLOAD_(rowObj) {
  var raw = AUT_GET_(rowObj, ['PAYLOAD_JSON', 'DADOS_JSON', 'JSON']);
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
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

    var dataUrl = AUT_GET_(obj, ['FOTO_DATA_URL', 'DATA_URL', 'BASE64']);
    var url = AUT_GET_(obj, ['FOTO_URL', 'URL']);
    var embed = AUT_BASE64_IMAGEM_(dataUrl || url) || url;

    out.push({
      id: AUT_GET_(obj, ['ID_FOTO']),
      ambiente: AUT_GET_(obj, ['AMBIENTE']),
      item: AUT_GET_(obj, ['ITEM']),
      nome: AUT_GET_(obj, ['NOME_ARQUIVO']),
      url: url,
      dataUrl: dataUrl,
      embed: embed,
      hash: AUT_GET_(obj, ['HASH_FOTO'])
    });
  }

  return out;
}

function AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idLaudo, numeroLaudo, url) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return;

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];

  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var id = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
    var num = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);

    if (String(id) === String(idLaudo) || String(num) === String(numeroLaudo)) {
      AUT_SET_BY_HEADER_(sh, r + 1, ['PDF_URL'], url);
      AUT_SET_BY_HEADER_(sh, r + 1, ['ATUALIZADO_EM'], new Date());
    }
  }
}

function apiEmitirLaudoPdf(idLaudo) {
  try {
    if (!idLaudo) {
      return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };
    }

    garantirEstruturaDoSistema();

    var ss = AUT_SS_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);

    if (!achado) {
      return { sucesso: false, ok: false, msg: 'Laudo não encontrado na aba REGISTRO DE VISTORIA.' };
    }

    var rowObj = achado.rowObj;
    var payload = AUT_PAYLOAD_(rowObj);
    var numeroLaudo = AUT_GET_(rowObj, ['NUMERO_LAUDO', 'CODIGO_LAUDO', 'ID_LAUDO']) || idLaudo;
    var idReal = AUT_GET_(rowObj, ['ID_LAUDO']) || idLaudo;
    var cfg = getConfiguracoesGlobais();
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numeroLaudo);
    var hash = AUT_GET_(rowObj, ['HASH_LAUDO']) || AUT_HASH_(JSON.stringify(rowObj));

    var tpl = HtmlService.createTemplateFromFile('modelo');
    tpl.cfg = cfg;
    tpl.row = achado.row;
    tpl.rowObj = rowObj;
    tpl.payload = payload;
    tpl.fotos = fotos;
    tpl.auditHash = hash;

    var html = tpl.evaluate().getContent();

    var blob = Utilities
      .newBlob(html, 'text/html', 'LAUDO_' + numeroLaudo + '.html')
      .getAs('application/pdf')
      .setName('LAUDO_' + numeroLaudo + '.pdf');

    var file = obterPastaVistorias().createFile(blob);

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (eShare) {}

    AUT_SET_BY_HEADER_(achado.sheet, achado.rowNumber, ['PDF_URL'], file.getUrl());
    AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idReal, numeroLaudo, file.getUrl());

    return {
      sucesso: true,
      ok: true,
      url: file.getUrl(),
      msg: 'PDF gerado com sucesso.',
      fotos: fotos.length
    };
  } catch (e) {
    return {
      sucesso: false,
      ok: false,
      msg: 'Erro ao emitir PDF: ' + e.message,
      erro: e.message
    };
  }
}


/* =====================================================================
   PATCH V2 — PALMER IMÓVEIS + OPTIMUS UI CACHE + IMAGENS DRIVE SEGURAS
   Este bloco sobrescreve funções anteriores por declaração posterior.
   Estratégias copiadas/adaptadas do CRM enviado:
   - MEMO_SS/MEMO_SHEETS para reduzir leituras repetidas.
   - CacheService para consulta, configuração e base64 de logos.
   - extractDriveId_/normalizeDriveUrl_/getLogoPublicUrlAlt_ para links Drive.
   - Separação de logo do sistema AUTENTIKO e logo do laudo PALMER IMÓVEIS.
   - Edição de laudos já registrados.
   ===================================================================== */

var PALMER_LAUDO_LOGO_DEFAULT = 'https://drive.google.com/file/d/1ZnF0J2QlwxU_MvLjMX3U4JMyZoviOQud/view?usp=sharing';
var AUTENTIKO_APP_SUBTITLE_DEFAULT = 'Gestão Administrativa & Laudos';
var AUT_CACHE_KEYS = {
  CFG: 'AUTENTIKO_V2_CFG',
  LISTA_PROCESSOS: 'AUTENTIKO_V2_LISTA_PROCESSOS'
};

/** Memória por execução, inspirada no código eficiente enviado. */
var MEMO_SS_V2 = null;
var MEMO_SHEETS_V2 = {};

function AUT_SS_FAST_() {
  if (MEMO_SS_V2) return MEMO_SS_V2;
  try {
    var props = PropertiesService.getScriptProperties();
    var sid = props.getProperty('SPREADSHEET_ID') || ID_PLANILHA;
    MEMO_SS_V2 = SpreadsheetApp.openById(sid);
    return MEMO_SS_V2;
  } catch (e) {
    return AUT_SS_();
  }
}

function AUT_SHEET_FAST_(nome) {
  if (MEMO_SHEETS_V2[nome]) return MEMO_SHEETS_V2[nome];
  var sh = AUT_SS_FAST_().getSheetByName(nome);
  MEMO_SHEETS_V2[nome] = sh;
  return sh;
}

function AUT_CACHE_GET_JSON_(key) {
  try {
    var raw = CacheService.getScriptCache().get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function AUT_CACHE_PUT_JSON_(key, obj, seconds) {
  try {
    CacheService.getScriptCache().put(key, JSON.stringify(obj), seconds || 600);
  } catch (e) {}
}

function AUT_INVALIDAR_CACHES_() {
  try {
    CacheService.getScriptCache().remove(AUT_CACHE_KEYS.CFG);
    CacheService.getScriptCache().remove(AUT_CACHE_KEYS.LISTA_PROCESSOS);
  } catch (e) {}
}

/** Estratégias copiadas/adaptadas do CRM enviado. */
function extractDriveId_(url) {
  var s = String(url || '').trim();
  var m1 = s.match(/[?&]id=([-\w]{20,})/);
  if (m1 && m1[1]) return m1[1];
  var m2 = s.match(/\/d\/([-\w]{20,})/);
  if (m2 && m2[1]) return m2[1];
  var m3 = s.match(/[-\w]{25,}/);
  return m3 ? m3[0] : '';
}

function normalizeDriveUrl_(url, size) {
  var id = extractDriveId_(url);
  if (!id) return String(url || '');
  return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + (size || 1200);
}

function getLogoPublicUrlAlt_(url) {
  var id = extractDriveId_(url);
  if (!id) return normalizeDriveUrl_(url);
  return 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(id);
}

function AUT_GET_PROP_(key, fallback) {
  try {
    var v = PropertiesService.getScriptProperties().getProperty(key);
    if (v !== null && v !== undefined && String(v).trim() !== '') return String(v);
  } catch (e) {}
  return fallback;
}

function AUT_GET_HEADER_MAP_(sh) {
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var k = AUT_NORM_(headers[i]);
    if (k) map[k] = i + 1;
  }
  return map;
}

function AUT_GET_CELL_BY_HEADER_(sh, row, headerNames, fallback) {
  var map = AUT_GET_HEADER_MAP_(sh);
  for (var i = 0; i < headerNames.length; i++) {
    var col = map[AUT_NORM_(headerNames[i])];
    if (col) {
      var v = sh.getRange(row, col).getValue();
      if (v !== null && v !== undefined && String(v).trim() !== '') return v;
    }
  }
  return fallback;
}

function AUT_SET_CELL_BY_HEADER_(sh, row, headerName, value) {
  var map = AUT_GET_HEADER_MAP_(sh);
  var col = map[AUT_NORM_(headerName)];
  if (!col) return false;
  sh.getRange(row, col).setValue(value);
  return true;
}

function garantirEstruturaDoSistema() {
  var ss = AUT_SS_FAST_();

  AUTENTIKO_HEADERS.CONFIGURACOES = [
    'NOME_SISTEMA',
    'AUTENTIKO_LOGO_URL',
    'LAUDO_LOGO_URL',
    'MANUTENCAO',
    'SITE',
    'ENDERECO',
    'CORRETOR',
    'CRECI',
    'APP_SUBTITLE'
  ];

  Object.keys(AUTENTIKO_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUTENTIKO_HEADERS[nome]);
  });

  garantirConfigPadrao_(ss);
  garantirUsuarioAdmin_(ss);
  garantirListasPadrao_(ss);
  garantirAnamnesePadrao_(ss);

  return { sucesso: true, msg: 'Estrutura AUTENTIKO/PALMER reparada.' };
}

function garantirConfigPadrao_(ss) {
  var sh = ss.getSheetByName('CONFIGURACOES');

  // Migração automática do modelo antigo:
  // [NOME_SISTEMA, LOGO_BASE64, MANUTENCAO, SITE, ENDERECO, CORRETOR, CRECI]
  if (sh.getLastRow() >= 2) {
    var row = sh.getRange(2, 1, 1, Math.max(sh.getLastColumn(), 9)).getValues()[0];
    var possivelManutencaoAntiga = String(row[2] || '').toUpperCase();

    if (possivelManutencaoAntiga === 'TRUE' || possivelManutencaoAntiga === 'FALSE') {
      var nomeAntigo = row[0] || 'LAUDO DE VISTORIA';
      var logoAntiga = row[1] || PALMER_LAUDO_LOGO_DEFAULT;
      var manutAntiga = row[2] || 'FALSE';
      var siteAntigo = row[3] || 'WWW.PALMERIMOVEIS.COM.BR';
      var endAntigo = row[4] || 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000';
      var corretorAntigo = row[5] || 'RYCKY DE PALMER DIAS';
      var creciAntigo = row[6] || '12.596';

      sh.getRange(2, 1, 1, 9).setValues([[
        nomeAntigo,
        AUTENTIKO_LOGO_FALLBACK,
        logoAntiga,
        manutAntiga,
        siteAntigo,
        endAntigo,
        corretorAntigo,
        creciAntigo,
        AUTENTIKO_APP_SUBTITLE_DEFAULT
      ]]);
      AUT_INVALIDAR_CACHES_();
      return;
    }
  }

  if (sh.getLastRow() < 2) {
    sh.getRange(2, 1, 1, 9).setValues([[
      'LAUDO DE VISTORIA',
      AUTENTIKO_LOGO_FALLBACK,
      PALMER_LAUDO_LOGO_DEFAULT,
      'FALSE',
      'WWW.PALMERIMOVEIS.COM.BR',
      'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      'RYCKY DE PALMER DIAS',
      '12.596',
      AUTENTIKO_APP_SUBTITLE_DEFAULT
    ]]);
  }
}

function AUT_BASE64_IMAGEM_CACHE_(src, namespace) {
  src = String(src || '').trim();
  if (!src) return '';

  if (/^data:image\//i.test(src)) return src;

  var cacheKey = 'AUT_B64_' + (namespace || 'IMG') + '_' + AUT_HASH_(src).substring(0, 40);
  try {
    var cached = CacheService.getScriptCache().get(cacheKey);
    if (cached && cached.indexOf('data:image') === 0) return cached;
  } catch (e) {}

  try {
    var out = '';
    var driveId = extractDriveId_(src);

    if (driveId) {
      var blob = DriveApp.getFileById(driveId).getBlob();
      out = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
    } else if (/^https?:\/\//i.test(src)) {
      // Para PDF, URLs externas ainda podem falhar. Mantém como fallback.
      out = src;
    }

    if (out && out.indexOf('data:image') === 0) {
      try { CacheService.getScriptCache().put(cacheKey, out, 21600); } catch (ePut) {}
    }

    return out;
  } catch (e) {
    return '';
  }
}

function getConfiguracoesGlobais() {
  var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.CFG);
  if (cached) return cached;

  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var nome = AUT_GET_CELL_BY_HEADER_(sh, 2, ['NOME_SISTEMA'], 'LAUDO DE VISTORIA');
    var logoUiRaw = AUT_GET_PROP_('AUTENTIKO_LOGO_URL', AUT_GET_CELL_BY_HEADER_(sh, 2, ['AUTENTIKO_LOGO_URL', 'LOGO_AUTENTIKO'], AUTENTIKO_LOGO_FALLBACK));
    var logoLaudoRaw = AUT_GET_PROP_('LAUDO_LOGO_URL', AUT_GET_CELL_BY_HEADER_(sh, 2, ['LAUDO_LOGO_URL', 'PALMER_LOGO_URL', 'LOGO_BASE64'], PALMER_LAUDO_LOGO_DEFAULT));
    var manut = AUT_GET_CELL_BY_HEADER_(sh, 2, ['MANUTENCAO'], 'FALSE');
    var site = AUT_GET_CELL_BY_HEADER_(sh, 2, ['SITE'], 'WWW.PALMERIMOVEIS.COM.BR');
    var endereco = AUT_GET_CELL_BY_HEADER_(sh, 2, ['ENDERECO'], 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000');
    var corretor = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CORRETOR'], 'RYCKY DE PALMER DIAS');
    var creci = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CRECI'], '12.596');
    var subtitle = AUT_GET_CELL_BY_HEADER_(sh, 2, ['APP_SUBTITLE'], AUTENTIKO_APP_SUBTITLE_DEFAULT);

    var logoUiPublica = normalizeDriveUrl_(logoUiRaw, 512);
    var logoLaudoPublica = normalizeDriveUrl_(logoLaudoRaw, 1200);

    var logoUiBase64 = AUT_BASE64_IMAGEM_CACHE_(logoUiRaw, 'LOGO_UI') || AUTENTIKO_LOGO_FALLBACK;
    var logoLaudoBase64 = AUT_BASE64_IMAGEM_CACHE_(logoLaudoRaw, 'LOGO_LAUDO') || logoLaudoPublica || PALMER_LAUDO_LOGO_DEFAULT;

    var cfg = {
      sucesso: true,

      // Compatibilidade com o Index antigo.
      nome: nome,
      logoRaw: logoUiRaw,
      logoBase64: logoUiBase64,
      logoPublica: logoUiPublica,

      // Novo: separação real das marcas.
      appNome: 'AUTENTIKO-OK CHECK',
      appSubtitle: subtitle,
      logoUiRaw: logoUiRaw,
      logoUiBase64: logoUiBase64,
      logoUiPublica: logoUiPublica,

      laudoNome: nome || 'LAUDO DE VISTORIA',
      logoLaudoRaw: logoLaudoRaw,
      logoLaudoBase64: logoLaudoBase64,
      logoLaudoPublica: logoLaudoPublica,

      palmerNome: 'PALMER IMÓVEIS',
      manutencao: (manut === true || String(manut).toUpperCase() === 'TRUE'),
      site: site,
      endereco: endereco,
      corretor: corretor,
      creci: creci
    };

    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.CFG, cfg, 600);
    return cfg;
  } catch (e) {
    return {
      sucesso: false,
      nome: 'LAUDO DE VISTORIA',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoUiBase64: AUTENTIKO_LOGO_FALLBACK,
      logoLaudoBase64: PALMER_LAUDO_LOGO_DEFAULT,
      manutencao: false,
      site: '',
      endereco: '',
      corretor: '',
      creci: '',
      msg: e.message
    };
  }
}

/**
 * Assinatura compatível com o Index novo:
 * salvarConfiguracoesGlobais(nome, logoLaudo, manutencao, site, endereco, corretor, creci, logoUi, subtitle)
 */
function salvarConfiguracoesGlobais(n, logoLaudo, m, s, end, c, cr, logoUi, subtitle) {
  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    sh.getRange(2, 1, 1, 9).setValues([[
      n || 'LAUDO DE VISTORIA',
      logoUi || AUTENTIKO_LOGO_FALLBACK,
      logoLaudo || PALMER_LAUDO_LOGO_DEFAULT,
      m ? 'TRUE' : 'FALSE',
      s || '',
      end || '',
      c || '',
      cr || '',
      subtitle || AUTENTIKO_APP_SUBTITLE_DEFAULT
    ]]);

    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, msg: 'Configurações salvas. Logo do sistema e logo do laudo foram separadas.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao salvar configurações: ' + e.message };
  }
}

function uploadImagemVistoria(base64Data, nomeArquivo) {
  try {
    garantirEstruturaDoSistema();

    if (!base64Data || !nomeArquivo) {
      return { sucesso: false, msg: 'Imagem ou nome do arquivo ausente.' };
    }

    var tipo = 'image/jpeg';
    var dadosPuros = '';

    if (String(base64Data).indexOf('data:') === 0) {
      tipo = String(base64Data).split(';')[0].split(':')[1] || 'image/jpeg';
      dadosPuros = String(base64Data).split(',')[1];
    } else {
      dadosPuros = String(base64Data);
      base64Data = 'data:' + tipo + ';base64,' + dadosPuros;
    }

    if (!dadosPuros) return { sucesso: false, msg: 'Base64 da imagem está vazio.' };

    var blob = Utilities.newBlob(Utilities.base64Decode(dadosPuros), tipo, nomeArquivo);
    var arquivo = obterPastaVistorias().createFile(blob);

    try { arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}

    var hash = AUT_HASH_(dadosPuros);
    var fileId = arquivo.getId();
    var fileUrl = arquivo.getUrl();

    return {
      sucesso: true,
      url: fileUrl,
      driveUrl: fileUrl,
      thumbnailUrl: normalizeDriveUrl_(fileUrl, 1000),
      directViewUrl: getLogoPublicUrlAlt_(fileUrl),
      dataUrl: base64Data,
      hash: hash,
      fileId: fileId,
      nome: nomeArquivo,
      mimeType: tipo,
      fotoId: 'FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no upload da imagem: ' + e.message };
  }
}

function AUT_MONTAR_REGISTRO_LAUDO_(dados, idLaudoExistente, hashExistente) {
  dados = dados || {};
  var numeroLaudo =
    AUT_GET_(dados, ['etapa1_numeroLaudo', 'numeroLaudo', 'NUMERO_LAUDO']) ||
    idLaudoExistente ||
    ('LAUDO-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss'));

  var idLaudo = idLaudoExistente || AUT_GET_(dados, ['idLaudo', 'ID_LAUDO']) || numeroLaudo;
  var codigoLaudo = AUT_GET_(dados, ['codigoLaudo', 'CODIGO_LAUDO']) || numeroLaudo;
  var endereco = AUT_ENDERECO_(dados);
  var payload = JSON.stringify(dados);
  var hash = hashExistente || AUT_HASH_(idLaudo + payload + new Date().getTime());

  return {
    ID_LAUDO: idLaudo,
    NUMERO_LAUDO: numeroLaudo,
    CODIGO_LAUDO: codigoLaudo,
    DATA_VISTORIA: AUT_GET_(dados, ['etapa1_data', 'dataVistoria', 'DATA_VISTORIA']),
    HORA_VISTORIA: AUT_GET_(dados, ['etapa1_hora', 'horaVistoria', 'HORA_VISTORIA']),
    RESPONSAVEL: AUT_GET_(dados, ['etapa1_vistoriador', 'responsavel', 'vistoriador']),
    VISTORIADOR: AUT_GET_(dados, ['etapa1_vistoriador', 'responsavel', 'vistoriador']),
    PROPRIETARIO: AUT_GET_(dados, ['etapa1_proprietario', 'proprietario']),
    CPF_PROPRIETARIO: AUT_GET_(dados, ['etapa1_cpf_prop', 'cpfProprietario']),
    LOCATARIO: AUT_GET_(dados, ['etapa1_locatario', 'locatario']),
    CPF_LOCATARIO: AUT_GET_(dados, ['etapa1_cpf_loc', 'cpfLocatario']),
    CONTATO: AUT_GET_(dados, ['etapa1_contato', 'contato']),
    EMAIL: AUT_GET_(dados, ['etapa1_email', 'email']),
    RUA: AUT_GET_(dados, ['etapa2_rua', 'rua']),
    NUMERO: AUT_GET_(dados, ['etapa2_numero', 'numero']),
    REFERENCIA: AUT_GET_(dados, ['etapa2_referencia', 'referencia']),
    BAIRRO: AUT_GET_(dados, ['etapa2_bairro', 'bairro']),
    CIDADE: AUT_GET_(dados, ['etapa2_cidade', 'cidade']),
    CEP: AUT_GET_(dados, ['etapa2_cep', 'cep']),
    ENDERECO_IMOVEL: endereco,
    TIPO_VISTORIA: AUT_GET_(dados, ['etapa3_tipo', 'tipoVistoria']),
    CATEGORIA_IMOVEL: AUT_GET_(dados, ['etapa3_categoria', 'categoriaImovel']),
    TIPO_LOCACAO: AUT_GET_(dados, ['etapa3_locacao', 'tipoLocacao']),
    ESTADO_IMOVEL: AUT_GET_(dados, ['etapa3_estado', 'estadoImovel']),
    PAYLOAD_JSON: payload,
    DATA_REGISTRO: new Date(),
    PDF_URL: '',
    HASH_LAUDO: hash
  };
}

function apiSalvarVistoria(dados) {
  try {
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dados);

    AUT_APPEND_OBJ_(ss.getSheetByName('REGISTRO DE VISTORIA'), registro);

    AUT_APPEND_OBJ_(ss.getSheetByName('PROCESSOS'), {
      ID_PROCESSO: registro.ID_LAUDO,
      ID_LAUDO: registro.ID_LAUDO,
      NUMERO_LAUDO: registro.NUMERO_LAUDO,
      CODIGO_LAUDO: registro.CODIGO_LAUDO,
      PROPRIETARIO: registro.PROPRIETARIO,
      LOCATARIO: registro.LOCATARIO,
      ENDERECO: registro.ENDERECO_IMOVEL,
      TIPO_VISTORIA: registro.TIPO_VISTORIA,
      CATEGORIA_IMOVEL: registro.CATEGORIA_IMOVEL,
      VISTORIADOR: registro.VISTORIADOR,
      STATUS: 'REGISTRADO',
      PDF_URL: '',
      HASH_LAUDO: registro.HASH_LAUDO,
      CRIADO_EM: new Date(),
      ATUALIZADO_EM: new Date()
    });

    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dados);
    AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: registro.ID_LAUDO,
      idLaudo: registro.ID_LAUDO,
      numeroLaudo: registro.NUMERO_LAUDO,
      fotos: qtdFotos,
      msg: 'Laudo salvo com sucesso.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao salvar vistoria: ' + e.message, erro: e.message };
  }
}

function AUT_ATUALIZAR_ROW_OBJ_(sh, rowNumber, obj) {
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = sh.getRange(rowNumber, 1, 1, lastCol).getValues()[0];
  var idx = AUT_OBJ_INDEX_(obj || {});

  for (var i = 0; i < headers.length; i++) {
    var k = AUT_NORM_(headers[i]);
    if (idx[k] !== undefined) row[i] = idx[k];
  }

  sh.getRange(rowNumber, 1, 1, lastCol).setValues([row]);
}

function apiAtualizarVistoria(idLaudo, dados) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, msg: 'ID do laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, msg: 'Laudo não encontrado para edição.' };

    var idReal = AUT_GET_(achado.rowObj, ['ID_LAUDO']) || idLaudo;
    var hashAnterior = AUT_GET_(achado.rowObj, ['HASH_LAUDO']);
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dados, idReal, AUT_HASH_(idReal + JSON.stringify(dados) + new Date().getTime()));

    AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, registro);

    // Atualiza PROCESSOS.
    var proc = ss.getSheetByName('PROCESSOS');
    if (proc && proc.getLastRow() >= 2) {
      var values = proc.getRange(1, 1, proc.getLastRow(), proc.getLastColumn()).getValues();
      var headers = values[0];
      for (var r = 1; r < values.length; r++) {
        var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
        var pid = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
        var pnum = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);
        if (String(pid) === String(idReal) || String(pnum) === String(registro.NUMERO_LAUDO)) {
          AUT_ATUALIZAR_ROW_OBJ_(proc, r + 1, {
            PROPRIETARIO: registro.PROPRIETARIO,
            LOCATARIO: registro.LOCATARIO,
            ENDERECO: registro.ENDERECO_IMOVEL,
            TIPO_VISTORIA: registro.TIPO_VISTORIA,
            CATEGORIA_IMOVEL: registro.CATEGORIA_IMOVEL,
            VISTORIADOR: registro.VISTORIADOR,
            HASH_LAUDO: registro.HASH_LAUDO,
            ATUALIZADO_EM: new Date()
          });
        }
      }
    }

    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, idReal, registro.NUMERO_LAUDO, dados);

    AUT_APPEND_OBJ_(ss.getSheetByName('AUDITORIA'), {
      ID_AUDITORIA: 'AUD_' + Date.now(),
      QUANDO: new Date(),
      USUARIO: '',
      ACAO: 'EDITAR_LAUDO',
      ENTIDADE: 'REGISTRO DE VISTORIA',
      ID_ENTIDADE: idReal,
      DETALHES_JSON: JSON.stringify({ hashAnterior: hashAnterior, hashAtual: registro.HASH_LAUDO }),
      HASH_ANTERIOR: hashAnterior,
      HASH_ATUAL: registro.HASH_LAUDO
    });

    AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: idReal,
      idLaudo: idReal,
      numeroLaudo: registro.NUMERO_LAUDO,
      fotos: qtdFotos,
      msg: 'Laudo atualizado com sucesso.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao atualizar vistoria: ' + e.message, erro: e.message };
  }
}

function apiObterLaudoParaEdicao(idLaudo) {
  try {
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, msg: 'Laudo não encontrado.' };

    var payload = AUT_PAYLOAD_(achado.rowObj);
    var idReal = AUT_GET_(achado.rowObj, ['ID_LAUDO']) || idLaudo;
    var numero = AUT_GET_(achado.rowObj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']) || idLaudo;
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numero);

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      payload: payload,
      rowObj: achado.rowObj,
      fotos: fotos
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao abrir edição: ' + e.message };
  }
}

function apiListarProcessos() {
  try {
    garantirEstruturaDoSistema();

    var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.LISTA_PROCESSOS);
    if (cached) return cached;

    var ss = AUT_SS_FAST_();
    var processos = AUT_LER_ITENS_(ss, 'PROCESSOS');
    var registros = AUT_LER_ITENS_(ss, 'REGISTRO DE VISTORIA');

    var mapa = {};
    registros.forEach(function(item) { mapa[String(item.id || item.numero)] = item; });
    processos.forEach(function(item) {
      var key = String(item.id || item.numero);
      mapa[key] = Object.assign(mapa[key] || {}, item);
    });

    var dados = Object.keys(mapa).map(function(k) { return mapa[k]; });
    dados.sort(function(a, b) {
      return String(b.criadoEm || b.dataVistoria || '').localeCompare(String(a.criadoEm || a.dataVistoria || ''));
    });

    var res = { sucesso: true, ok: true, dados: dados, processos: dados, laudos: dados, total: dados.length, cache: false };
    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.LISTA_PROCESSOS, res, 180);
    return res;
  } catch (e) {
    return { sucesso: false, ok: false, dados: [], processos: [], laudos: [], total: 0, msg: 'Erro ao listar processos: ' + e.message };
  }
}

function apiEmitirLaudoPdf(idLaudo) {
  try {
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };

    garantirEstruturaDoSistema();

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado na aba REGISTRO DE VISTORIA.' };

    var rowObj = achado.rowObj;
    var payload = AUT_PAYLOAD_(rowObj);
    var numeroLaudo = AUT_GET_(rowObj, ['NUMERO_LAUDO', 'CODIGO_LAUDO', 'ID_LAUDO']) || idLaudo;
    var idReal = AUT_GET_(rowObj, ['ID_LAUDO']) || idLaudo;
    var cfg = getConfiguracoesGlobais();
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numeroLaudo);
    var hash = AUT_GET_(rowObj, ['HASH_LAUDO']) || AUT_HASH_(JSON.stringify(rowObj));

    var tpl = HtmlService.createTemplateFromFile('modelo');
    tpl.cfg = cfg;
    tpl.row = achado.row;
    tpl.rowObj = rowObj;
    tpl.payload = payload;
    tpl.fotos = fotos;
    tpl.auditHash = hash;

    var html = tpl.evaluate().getContent();

    var blob = Utilities
      .newBlob(html, 'text/html', 'LAUDO_' + numeroLaudo + '.html')
      .getAs('application/pdf')
      .setName('LAUDO_' + numeroLaudo + '.pdf');

    var file = obterPastaVistorias().createFile(blob);
    try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}

    AUT_SET_BY_HEADER_(achado.sheet, achado.rowNumber, ['PDF_URL'], file.getUrl());
    AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idReal, numeroLaudo, file.getUrl());
    AUT_INVALIDAR_CACHES_();

    return { sucesso: true, ok: true, url: file.getUrl(), msg: 'PDF gerado com sucesso.', fotos: fotos.length };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao emitir PDF: ' + e.message, erro: e.message };
  }
}


/*******************************************************
 * PATCH V3 — PALMER LOGO OFICIAL + EDIÇÃO DE LAUDOS ANTIGOS
 * Cole no final do Code.gs ou use o arquivo completo V3.
 *******************************************************/

var PALMER_LAUDO_LOGO_OFICIAL = 'https://i.postimg.cc/6QDd7672/LOGO-MARCA.png';
PALMER_LAUDO_LOGO_DEFAULT = PALMER_LAUDO_LOGO_OFICIAL;

function AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(v) {
  v = String(v || '').trim();
  if (!v) return true;
  if (v === AUTENTIKO_LOGO_FALLBACK) return true;
  if (v.indexOf('data:image/svg+xml;base64,PHN2Zy') === 0) return true;
  if (v.indexOf('1ZnF0J2QlwxU_MvLjMX3U4JMyZoviOQud') >= 0) return true;
  if (v.indexOf('img.icons8.com') >= 0) return true;
  return false;
}

function AUT_PUBLIC_URL_(src, size) {
  src = String(src || '').trim();
  if (!src) return '';
  if (/^data:image\//i.test(src)) return src;
  var driveId = extractDriveId_(src);
  if (driveId) return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(driveId) + '&sz=w' + (size || 1200);
  return src;
}

/**
 * Agora também baixa URL externa via UrlFetchApp.
 * Isso evita o problema de redirecionamento/thumbnail do Google no PDF.
 */
function AUT_BASE64_IMAGEM_CACHE_(src, namespace) {
  src = String(src || '').trim();
  if (!src) return '';

  if (/^data:image\//i.test(src)) return src;

  var cacheKey = 'AUT_B64_V3_' + (namespace || 'IMG') + '_' + AUT_HASH_(src).substring(0, 40);
  try {
    var cached = CacheService.getScriptCache().get(cacheKey);
    if (cached && cached.indexOf('data:image') === 0) return cached;
  } catch (eCacheGet) {}

  try {
    var blob = null;
    var driveId = extractDriveId_(src);

    if (driveId) {
      blob = DriveApp.getFileById(driveId).getBlob();
    } else if (/^https?:\/\//i.test(src)) {
      var res = UrlFetchApp.fetch(src, {
        method: 'get',
        followRedirects: true,
        muteHttpExceptions: true,
        headers: { 'User-Agent': 'Mozilla/5.0 Autentiko/Palmer PDF' }
      });
      var code = res.getResponseCode();
      if (code < 200 || code >= 300) throw new Error('HTTP ' + code + ' ao baixar imagem.');
      blob = res.getBlob();
    }

    if (!blob) return '';

    var contentType = blob.getContentType() || 'image/png';
    if (contentType.indexOf('image/') !== 0) contentType = 'image/png';

    var out = 'data:' + contentType + ';base64,' + Utilities.base64Encode(blob.getBytes());

    try {
      CacheService.getScriptCache().put(cacheKey, out, 21600);
    } catch (eCachePut) {}

    return out;
  } catch (e) {
    return /^https?:\/\//i.test(src) ? src : '';
  }
}

function garantirEstruturaDoSistema() {
  var ss = AUT_SS_FAST_();

  AUTENTIKO_HEADERS.CONFIGURACOES = [
    'NOME_SISTEMA',
    'AUTENTIKO_LOGO_URL',
    'LAUDO_LOGO_URL',
    'MANUTENCAO',
    'SITE',
    'ENDERECO',
    'CORRETOR',
    'CRECI',
    'APP_SUBTITLE'
  ];

  Object.keys(AUTENTIKO_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUTENTIKO_HEADERS[nome]);
  });

  garantirConfigPadrao_(ss);
  garantirUsuarioAdmin_(ss);
  garantirListasPadrao_(ss);
  garantirAnamnesePadrao_(ss);
  AUT_CORRIGIR_LOGO_PALMER_CONFIG_();

  return { sucesso: true, msg: 'Estrutura AUTENTIKO/PALMER reparada com logo oficial Palmer.' };
}

function garantirConfigPadrao_(ss) {
  var sh = ss.getSheetByName('CONFIGURACOES');

  if (sh.getLastRow() < 2) {
    sh.getRange(2, 1, 1, 9).setValues([[
      'LAUDO DE VISTORIA',
      AUTENTIKO_LOGO_FALLBACK,
      PALMER_LAUDO_LOGO_OFICIAL,
      'FALSE',
      'WWW.PALMERIMOVEIS.COM.BR',
      'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      'RYCKY DE PALMER DIAS',
      '12.596',
      AUTENTIKO_APP_SUBTITLE_DEFAULT
    ]]);
    AUT_INVALIDAR_CACHES_();
    return;
  }

  var colLogoLaudo = AUT_GET_HEADER_MAP_(sh)[AUT_NORM_('LAUDO_LOGO_URL')];
  var colLogoUi = AUT_GET_HEADER_MAP_(sh)[AUT_NORM_('AUTENTIKO_LOGO_URL')];

  // Migração de estrutura antiga: se a terceira coluna ainda for TRUE/FALSE, a linha está no layout antigo.
  var row = sh.getRange(2, 1, 1, Math.max(sh.getLastColumn(), 9)).getValues()[0];
  var possivelManutencaoAntiga = String(row[2] || '').toUpperCase();

  if (possivelManutencaoAntiga === 'TRUE' || possivelManutencaoAntiga === 'FALSE') {
    sh.getRange(2, 1, 1, 9).setValues([[
      row[0] || 'LAUDO DE VISTORIA',
      AUTENTIKO_LOGO_FALLBACK,
      PALMER_LAUDO_LOGO_OFICIAL,
      row[2] || 'FALSE',
      row[3] || 'WWW.PALMERIMOVEIS.COM.BR',
      row[4] || 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      row[5] || 'RYCKY DE PALMER DIAS',
      row[6] || '12.596',
      AUTENTIKO_APP_SUBTITLE_DEFAULT
    ]]);
    AUT_INVALIDAR_CACHES_();
    return;
  }

  if (colLogoUi && AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(sh.getRange(2, colLogoUi).getValue())) {
    sh.getRange(2, colLogoUi).setValue(AUTENTIKO_LOGO_FALLBACK);
  }

  if (colLogoLaudo && AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(sh.getRange(2, colLogoLaudo).getValue())) {
    sh.getRange(2, colLogoLaudo).setValue(PALMER_LAUDO_LOGO_OFICIAL);
    AUT_INVALIDAR_CACHES_();
  }
}

function AUT_CORRIGIR_LOGO_PALMER_CONFIG_() {
  try {
    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var map = AUT_GET_HEADER_MAP_(sh);
    var col = map[AUT_NORM_('LAUDO_LOGO_URL')];
    if (!col) return { sucesso: false, msg: 'Coluna LAUDO_LOGO_URL não encontrada.' };

    var atual = sh.getRange(2, col).getValue();
    if (AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(atual)) {
      sh.getRange(2, col).setValue(PALMER_LAUDO_LOGO_OFICIAL);
      AUT_INVALIDAR_CACHES_();
      return { sucesso: true, alterado: true, logo: PALMER_LAUDO_LOGO_OFICIAL };
    }

    return { sucesso: true, alterado: false, logo: atual };
  } catch (e) {
    return { sucesso: false, msg: e.message };
  }
}

/** Execute manualmente se quiser forçar a logo oficial Palmer agora. */
function configurarLogoPalmerAgora() {
  var ss = AUT_SS_FAST_();
  garantirEstruturaDoSistema();
  var sh = ss.getSheetByName('CONFIGURACOES');
  AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', PALMER_LAUDO_LOGO_OFICIAL);
  AUT_INVALIDAR_CACHES_();
  return { sucesso: true, msg: 'Logo Palmer aplicada no laudo.', logo: PALMER_LAUDO_LOGO_OFICIAL };
}

function getConfiguracoesGlobais() {
  var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.CFG);
  if (cached && cached.logoLaudoRaw === PALMER_LAUDO_LOGO_OFICIAL) return cached;

  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var nome = AUT_GET_CELL_BY_HEADER_(sh, 2, ['NOME_SISTEMA'], 'LAUDO DE VISTORIA');

    var logoUiRaw = AUT_GET_PROP_(
      'AUTENTIKO_LOGO_URL',
      AUT_GET_CELL_BY_HEADER_(sh, 2, ['AUTENTIKO_LOGO_URL', 'LOGO_AUTENTIKO'], AUTENTIKO_LOGO_FALLBACK)
    );

    var logoLaudoRaw = AUT_GET_PROP_(
      'LAUDO_LOGO_URL',
      AUT_GET_CELL_BY_HEADER_(sh, 2, ['LAUDO_LOGO_URL', 'PALMER_LOGO_URL', 'LOGO_BASE64'], PALMER_LAUDO_LOGO_OFICIAL)
    );

    if (AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(logoLaudoRaw)) {
      logoLaudoRaw = PALMER_LAUDO_LOGO_OFICIAL;
      AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', logoLaudoRaw);
    }

    var manut = AUT_GET_CELL_BY_HEADER_(sh, 2, ['MANUTENCAO'], 'FALSE');
    var site = AUT_GET_CELL_BY_HEADER_(sh, 2, ['SITE'], 'WWW.PALMERIMOVEIS.COM.BR');
    var endereco = AUT_GET_CELL_BY_HEADER_(sh, 2, ['ENDERECO'], 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000');
    var corretor = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CORRETOR'], 'RYCKY DE PALMER DIAS');
    var creci = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CRECI'], '12.596');
    var subtitle = AUT_GET_CELL_BY_HEADER_(sh, 2, ['APP_SUBTITLE'], AUTENTIKO_APP_SUBTITLE_DEFAULT);

    var logoUiPublica = AUT_PUBLIC_URL_(logoUiRaw, 512);
    var logoLaudoPublica = AUT_PUBLIC_URL_(logoLaudoRaw, 1200);

    var logoUiBase64 = AUT_BASE64_IMAGEM_CACHE_(logoUiRaw, 'LOGO_UI') || AUTENTIKO_LOGO_FALLBACK;
    var logoLaudoBase64 = AUT_BASE64_IMAGEM_CACHE_(logoLaudoRaw, 'LOGO_LAUDO_PALMER') || logoLaudoPublica || PALMER_LAUDO_LOGO_OFICIAL;

    var cfg = {
      sucesso: true,

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

      palmerNome: 'PALMER IMÓVEIS',
      manutencao: (manut === true || String(manut).toUpperCase() === 'TRUE'),
      site: site,
      endereco: endereco,
      corretor: corretor,
      creci: creci
    };

    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.CFG, cfg, 600);
    return cfg;
  } catch (e) {
    return {
      sucesso: false,
      nome: 'LAUDO DE VISTORIA',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoUiBase64: AUTENTIKO_LOGO_FALLBACK,
      logoLaudoRaw: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoBase64: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoPublica: PALMER_LAUDO_LOGO_OFICIAL,
      manutencao: false,
      site: '',
      endereco: '',
      corretor: '',
      creci: '',
      msg: e.message
    };
  }
}

function AUT_PARSE_JSON_SAFE_(v) {
  try {
    if (v === null || v === undefined) return null;
    if (typeof v === 'object') return v;
    var s = String(v || '').trim();
    if (!s || s.charAt(0) !== '{') return null;
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function AUT_IS_JSON_PAYLOAD_(v) {
  var obj = AUT_PARSE_JSON_SAFE_(v);
  return !!(obj && typeof obj === 'object');
}

function AUT_ENDERECO_(dados) {
  dados = dados || {};
  var direto = AUT_GET_(dados, ['etapa2_endereco', 'endereco', 'ENDERECO_IMOVEL']);
  var rua = AUT_GET_(dados, ['etapa2_rua', 'rua']);
  var numero = AUT_GET_(dados, ['etapa2_numero', 'numero']);
  var bairro = AUT_GET_(dados, ['etapa2_bairro', 'bairro']);
  var cidade = AUT_GET_(dados, ['etapa2_cidade', 'cidade']);
  var cep = AUT_GET_(dados, ['etapa2_cep', 'cep']);

  var partes = [];
  if (rua) partes.push(rua);
  if (numero) partes.push('nº ' + numero);
  if (bairro) partes.push(bairro);
  if (cidade) partes.push(cidade);
  if (cep) partes.push('CEP ' + cep);

  return partes.length ? partes.join(', ') : String(direto || '');
}

function AUT_MERGE_SE_VAZIO_(obj, key, val) {
  if (obj[key] === undefined || obj[key] === null || String(obj[key]).trim() === '') {
    obj[key] = val || '';
  }
}

function AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado) {
  achado = achado || {};
  var rowObj = achado.rowObj || {};
  var row = achado.row || [];
  var payload = AUT_PARSE_JSON_SAFE_(AUT_GET_(rowObj, ['PAYLOAD_JSON', 'DADOS_JSON', 'JSON'])) || {};

  // Laudos antigos: o JSON ficou deslocado em alguma coluna, geralmente coluna H.
  if (!Object.keys(payload).length && row && row.length) {
    for (var i = 0; i < row.length; i++) {
      var parsed = AUT_PARSE_JSON_SAFE_(row[i]);
      if (parsed && typeof parsed === 'object') {
        payload = parsed;
        break;
      }
    }
  }

  // Se não encontrou JSON, reconstroi pelos campos antigos.
  if (row && row.length) {
    AUT_MERGE_SE_VAZIO_(payload, 'etapa1_numeroLaudo', row[1] || AUT_GET_(rowObj, ['NUMERO_LAUDO']));
    AUT_MERGE_SE_VAZIO_(payload, 'etapa1_data', row[2] || AUT_GET_(rowObj, ['DATA_VISTORIA']));
    AUT_MERGE_SE_VAZIO_(payload, 'etapa1_vistoriador', row[3] || AUT_GET_(rowObj, ['RESPONSAVEL', 'VISTORIADOR']));
    AUT_MERGE_SE_VAZIO_(payload, 'etapa1_proprietario', row[4] || AUT_GET_(rowObj, ['PROPRIETARIO']));
    AUT_MERGE_SE_VAZIO_(payload, 'etapa1_locatario', row[5] || AUT_GET_(rowObj, ['LOCATARIO']));
    AUT_MERGE_SE_VAZIO_(payload, 'etapa2_endereco', row[6] || AUT_GET_(rowObj, ['ENDERECO_IMOVEL', 'ENDERECO']));
  }

  // Completa também a partir do layout novo, quando disponível.
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_numeroLaudo', AUT_GET_(rowObj, ['NUMERO_LAUDO', 'CODIGO_LAUDO', 'ID_LAUDO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_data', AUT_GET_(rowObj, ['DATA_VISTORIA']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_hora', AUT_GET_(rowObj, ['HORA_VISTORIA']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_vistoriador', AUT_GET_(rowObj, ['RESPONSAVEL', 'VISTORIADOR']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_proprietario', AUT_GET_(rowObj, ['PROPRIETARIO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_cpf_prop', AUT_GET_(rowObj, ['CPF_PROPRIETARIO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_locatario', AUT_GET_(rowObj, ['LOCATARIO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_cpf_loc', AUT_GET_(rowObj, ['CPF_LOCATARIO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_contato', AUT_GET_(rowObj, ['CONTATO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa1_email', AUT_GET_(rowObj, ['EMAIL']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_rua', AUT_GET_(rowObj, ['RUA']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_numero', AUT_GET_(rowObj, ['NUMERO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_referencia', AUT_GET_(rowObj, ['REFERENCIA']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_bairro', AUT_GET_(rowObj, ['BAIRRO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_cidade', AUT_GET_(rowObj, ['CIDADE']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa2_cep', AUT_GET_(rowObj, ['CEP']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_tipo', AUT_GET_(rowObj, ['TIPO_VISTORIA']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_categoria', AUT_GET_(rowObj, ['CATEGORIA_IMOVEL']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_locacao', AUT_GET_(rowObj, ['TIPO_LOCACAO']));
  AUT_MERGE_SE_VAZIO_(payload, 'etapa3_estado', AUT_GET_(rowObj, ['ESTADO_IMOVEL']));

  return payload;
}

function AUT_PAYLOAD_(rowObj) {
  var raw = AUT_GET_(rowObj || {}, ['PAYLOAD_JSON', 'DADOS_JSON', 'JSON']);
  var parsed = AUT_PARSE_JSON_SAFE_(raw);
  if (parsed) return parsed;

  // Compatibilidade com cabeçalhos deslocados: procura JSON em qualquer campo do objeto.
  rowObj = rowObj || {};
  var keys = Object.keys(rowObj);
  for (var i = 0; i < keys.length; i++) {
    parsed = AUT_PARSE_JSON_SAFE_(rowObj[keys[i]]);
    if (parsed) return parsed;
  }

  return {};
}

function AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado) {
  achado = achado || {};
  var raw = achado.rowObj || {};
  var row = achado.row || [];
  var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
  var obj = {};

  obj.ID_LAUDO = row[0] || AUT_GET_(raw, ['ID_LAUDO', 'ID_PROCESSO']);
  obj.NUMERO_LAUDO = payload.etapa1_numeroLaudo || row[1] || AUT_GET_(raw, ['NUMERO_LAUDO', 'CODIGO_LAUDO', 'ID_LAUDO']);
  obj.CODIGO_LAUDO = AUT_GET_(raw, ['CODIGO_LAUDO']) || obj.NUMERO_LAUDO;
  obj.DATA_VISTORIA = payload.etapa1_data || AUT_GET_(raw, ['DATA_VISTORIA']) || row[2];
  obj.HORA_VISTORIA = payload.etapa1_hora || AUT_GET_(raw, ['HORA_VISTORIA']);
  obj.RESPONSAVEL = payload.etapa1_vistoriador || AUT_GET_(raw, ['RESPONSAVEL', 'VISTORIADOR']) || row[3];
  obj.VISTORIADOR = obj.RESPONSAVEL;
  obj.PROPRIETARIO = payload.etapa1_proprietario || AUT_GET_(raw, ['PROPRIETARIO']) || row[4];
  obj.CPF_PROPRIETARIO = payload.etapa1_cpf_prop || AUT_GET_(raw, ['CPF_PROPRIETARIO']);
  obj.LOCATARIO = payload.etapa1_locatario || AUT_GET_(raw, ['LOCATARIO']) || row[5];
  obj.CPF_LOCATARIO = payload.etapa1_cpf_loc || AUT_GET_(raw, ['CPF_LOCATARIO']);
  obj.CONTATO = payload.etapa1_contato || AUT_GET_(raw, ['CONTATO']);
  obj.EMAIL = payload.etapa1_email || AUT_GET_(raw, ['EMAIL']);
  obj.RUA = payload.etapa2_rua || AUT_GET_(raw, ['RUA']);
  obj.NUMERO = payload.etapa2_numero || AUT_GET_(raw, ['NUMERO']);
  obj.REFERENCIA = payload.etapa2_referencia || AUT_GET_(raw, ['REFERENCIA']);
  obj.BAIRRO = payload.etapa2_bairro || AUT_GET_(raw, ['BAIRRO']);
  obj.CIDADE = payload.etapa2_cidade || AUT_GET_(raw, ['CIDADE']);
  obj.CEP = payload.etapa2_cep || AUT_GET_(raw, ['CEP']);
  obj.ENDERECO_IMOVEL = AUT_ENDERECO_(payload) || AUT_GET_(raw, ['ENDERECO_IMOVEL', 'ENDERECO']) || row[6];
  obj.TIPO_VISTORIA = payload.etapa3_tipo || AUT_GET_(raw, ['TIPO_VISTORIA']);
  obj.CATEGORIA_IMOVEL = payload.etapa3_categoria || AUT_GET_(raw, ['CATEGORIA_IMOVEL']);
  obj.TIPO_LOCACAO = payload.etapa3_locacao || AUT_GET_(raw, ['TIPO_LOCACAO']);
  obj.ESTADO_IMOVEL = payload.etapa3_estado || AUT_GET_(raw, ['ESTADO_IMOVEL']);
  obj.PAYLOAD_JSON = JSON.stringify(payload || {});
  obj.DATA_REGISTRO = AUT_GET_(raw, ['DATA_REGISTRO', 'CRIADO_EM']) || row[8] || '';
  obj.PDF_URL = AUT_GET_(raw, ['PDF_URL']);
  obj.HASH_LAUDO = AUT_GET_(raw, ['HASH_LAUDO']) || AUT_HASH_(obj.ID_LAUDO + obj.PAYLOAD_JSON);

  return obj;
}

function AUT_LOCALIZAR_LAUDO_(ss, idLaudo) {
  var sh = ss.getSheetByName('REGISTRO DE VISTORIA');
  if (!sh || sh.getLastRow() < 2) return null;

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];

  for (var r = 1; r < values.length; r++) {
    var rawObj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var candidatos = [
      AUT_GET_(rawObj, ['ID_LAUDO']),
      AUT_GET_(rawObj, ['NUMERO_LAUDO']),
      AUT_GET_(rawObj, ['CODIGO_LAUDO']),
      values[r][0],
      values[r][1]
    ];

    for (var i = 0; i < candidatos.length; i++) {
      if (String(candidatos[i]) === String(idLaudo)) {
        var achado = {
          sheet: sh,
          rowNumber: r + 1,
          row: values[r],
          rowObjRaw: rawObj,
          rowObj: rawObj,
          headers: headers
        };
        achado.payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
        achado.rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
        return achado;
      }
    }
  }

  return null;
}

function AUT_LER_ITENS_(ss, nome) {
  var sh = ss.getSheetByName(nome);
  if (!sh || sh.getLastRow() < 2) return [];

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var out = [];

  for (var r = 1; r < values.length; r++) {
    var rawObj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var rowObj = rawObj;

    if (nome === 'REGISTRO DE VISTORIA') {
      rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_({
        sheet: sh,
        rowNumber: r + 1,
        row: values[r],
        rowObj: rawObj,
        headers: headers
      });
    }

    var item = AUT_MAP_ITEM_(rowObj, r + 1);
    if (item.id || item.numero || item.proprietario || item.locatario) out.push(item);
  }

  return out;
}

function AUT_MERGE_PAYLOAD_ATUALIZACAO_(antigo, novo) {
  var out = {};
  antigo = antigo || {};
  novo = novo || {};

  Object.keys(antigo).forEach(function(k) { out[k] = antigo[k]; });
  Object.keys(novo).forEach(function(k) {
    if (novo[k] !== undefined && novo[k] !== null) out[k] = novo[k];
  });

  return out;
}

function AUT_UPSERT_PROCESSO_LAUDO_(ss, registro) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh) return;

  var found = false;
  if (sh.getLastRow() >= 2) {
    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];

    for (var r = 1; r < values.length; r++) {
      var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
      var pid = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
      var pnum = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);

      if (String(pid) === String(registro.ID_LAUDO) || String(pnum) === String(registro.NUMERO_LAUDO)) {
        AUT_ATUALIZAR_ROW_OBJ_(sh, r + 1, {
          ID_PROCESSO: registro.ID_LAUDO,
          ID_LAUDO: registro.ID_LAUDO,
          NUMERO_LAUDO: registro.NUMERO_LAUDO,
          CODIGO_LAUDO: registro.CODIGO_LAUDO,
          PROPRIETARIO: registro.PROPRIETARIO,
          LOCATARIO: registro.LOCATARIO,
          ENDERECO: registro.ENDERECO_IMOVEL,
          TIPO_VISTORIA: registro.TIPO_VISTORIA,
          CATEGORIA_IMOVEL: registro.CATEGORIA_IMOVEL,
          VISTORIADOR: registro.VISTORIADOR,
          STATUS: AUT_GET_(obj, ['STATUS']) || 'REGISTRADO',
          HASH_LAUDO: registro.HASH_LAUDO,
          ATUALIZADO_EM: new Date()
        });
        found = true;
      }
    }
  }

  if (!found) {
    AUT_APPEND_OBJ_(sh, {
      ID_PROCESSO: registro.ID_LAUDO,
      ID_LAUDO: registro.ID_LAUDO,
      NUMERO_LAUDO: registro.NUMERO_LAUDO,
      CODIGO_LAUDO: registro.CODIGO_LAUDO,
      PROPRIETARIO: registro.PROPRIETARIO,
      LOCATARIO: registro.LOCATARIO,
      ENDERECO: registro.ENDERECO_IMOVEL,
      TIPO_VISTORIA: registro.TIPO_VISTORIA,
      CATEGORIA_IMOVEL: registro.CATEGORIA_IMOVEL,
      VISTORIADOR: registro.VISTORIADOR,
      STATUS: 'REGISTRADO',
      PDF_URL: '',
      HASH_LAUDO: registro.HASH_LAUDO,
      CRIADO_EM: new Date(),
      ATUALIZADO_EM: new Date()
    });
  }
}

function apiObterLaudoParaEdicao(idLaudo) {
  try {
    garantirEstruturaDoSistema();

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado para edição.' };

    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || idLaudo;
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numero);

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      payload: payload,
      rowObj: rowObj,
      fotos: fotos,
      legadoCorrigido: true
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao abrir edição: ' + e.message, erro: e.message };
  }
}

function AUT_EXTRAIR_FOTOS_PAYLOAD_(dados) {
  var fotos = [];
  var visitados = [];
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
    if (!valor) return;
    if (typeof valor === 'string') {
      var s = valor.trim();
      if ((s.charAt(0) === '[' || s.charAt(0) === '{') && s.length < 200000) {
        try {
          andar(JSON.parse(s), caminho);
        } catch (eJson) {}
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
        var ambiente = ambienteDoCaminho(caminho, valor);
        var codigo = codigoDoCaminho(caminho, valor);
        fotos.push({
          id: valor.fotoId || valor.id || '',
          ambiente: ambiente,
          ambienteCodigo: codigo,
          item: valor.item || valor.tipoObservacao || 'Registro fotografico do ambiente',
          nome: valor.nome || valor.nomeArquivo || valor.name || 'foto_vistoria.jpg',
          mimeType: valor.mimeType || 'image/jpeg',
          url: url,
          dataUrl: dataUrl,
          hash: valor.hash || AUT_HASH_(url + dataUrl + fileId),
          fileId: fileId,
          thumbnailUrl: valor.thumbnailUrl || ''
        });
      }
      Object.keys(valor).forEach(function(k) {
        andar(valor[k], caminho ? caminho + '.' + k : k);
      });
    }
  }

  andar(dados, '');
  return fotos;
}

/* =========================================================
   PATCH V6 — PERFORMANCE, CACHE PDF E LAUDO DOCUMENTAL ABNT
   ========================================================= */

var AUTENTIKO_PATCH_VERSION_V6 = 'V6_FAST_ABNT_20260618';
var AUT_MODELO_PDF_VERSION_V6 = 'MODELO_FOTOS_30X38_DRIVE_BASE64_20260618';

function AUT_REGISTRO_HEADERS_V4_() {
  return [
    'ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','DATA_VISTORIA','HORA_VISTORIA',
    'RESPONSAVEL','VISTORIADOR','PROPRIETARIO','CPF_PROPRIETARIO','LOCATARIO',
    'CPF_LOCATARIO','CONTATO','EMAIL','RUA','NUMERO','REFERENCIA','BAIRRO','CIDADE','CEP',
    'ENDERECO_IMOVEL','TIPO_VISTORIA','CATEGORIA_IMOVEL','TIPO_LOCACAO','ESTADO_IMOVEL',
    'PAYLOAD_JSON','DATA_REGISTRO','PDF_URL','HASH_LAUDO','PDF_HASH','PDF_GERADO_EM',
    'QTD_FOTOS','QTD_ITENS'
  ];
}

function AUT_PREPARAR_HEADERS_V4_() {
  AUTENTIKO_HEADERS.USUARIOS = [
    'NOME','DATA_NASCIMENTO','CONTATO','EMAIL','USUARIO','SENHA_HASH',
    'PERFIL','STATUS','DATA_CADASTRO','ULTIMO_ACESSO','ACEITE_LGPD','DATA_ACEITE_LGPD'
  ];
  AUTENTIKO_HEADERS.CONFIGURACOES = [
    'NOME_SISTEMA','AUTENTIKO_LOGO_URL','LAUDO_LOGO_URL','MANUTENCAO',
    'SITE','ENDERECO','CORRETOR','CRECI','APP_SUBTITLE'
  ];
  AUTENTIKO_HEADERS['REGISTRO DE VISTORIA'] = AUT_REGISTRO_HEADERS_V4_();
  AUTENTIKO_HEADERS.REGISTRO_DE_VISTORIA = AUT_REGISTRO_HEADERS_V4_();
  AUTENTIKO_HEADERS.PROCESSOS = [
    'ID_PROCESSO','ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','PROPRIETARIO','LOCATARIO',
    'ENDERECO','TIPO_VISTORIA','CATEGORIA_IMOVEL','VISTORIADOR','STATUS','PDF_URL',
    'PDF_HASH','PDF_GERADO_EM','HASH_LAUDO','CRIADO_EM','ATUALIZADO_EM'
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
      return { sucesso: true, msg: 'Estrutura AUTENTIKO-OK CHECK verificada em cache.' };
    }
  } catch (eCache) {}

  var ss = AUT_SS_FAST_();
  AUT_PREPARAR_HEADERS_V4_();

  Object.keys(AUTENTIKO_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUTENTIKO_HEADERS[nome]);
  });

  garantirConfigPadrao_(ss);
  garantirUsuarioAdmin_(ss);
  garantirListasPadrao_(ss);
  garantirAnamnesePadrao_(ss);
  AUT_CORRIGIR_LOGO_PALMER_CONFIG_();

  try {
    cache.put('AUTENTIKO_STRUCTURE_READY_' + AUTENTIKO_PATCH_VERSION_V6, 'SIM', 900);
  } catch (ePut) {}

  return { sucesso: true, msg: 'Estrutura AUTENTIKO-OK CHECK reparada em modo rápido.' };
}

function AUT_INVALIDAR_CACHES_() {
  try {
    CacheService.getScriptCache().remove(AUT_CACHE_KEYS.CFG);
    CacheService.getScriptCache().remove(AUT_CACHE_KEYS.LISTA_PROCESSOS);
    CacheService.getScriptCache().remove('AUTENTIKO_V6_LISTA_PROCESSOS');
  } catch (e) {}
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
        if (!hashes[hash]) {
          hashes[hash] = true;
          var ambiente = ambienteDoCaminho(caminho, valor);
          var tipoObs = valor.tipoObservacao || valor.tipo_observacao || valor.item || 'Registro fotografico tecnico do ambiente';
          fotos.push({
            id: valor.fotoId || valor.id || '',
            ambiente: ambiente,
            ambienteCodigo: codigoDoCaminho(caminho, valor),
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
    var dadosPuros = '';
    var entrada = String(base64Data || '');
    if (entrada.indexOf('data:') === 0) {
      tipo = entrada.split(';')[0].split(':')[1] || 'image/jpeg';
      dadosPuros = entrada.split(',')[1] || '';
    } else {
      dadosPuros = entrada;
    }
    if (!dadosPuros) return { sucesso: false, msg: 'Base64 da imagem está vazio.' };

    var bytes = Utilities.base64Decode(dadosPuros);
    var nomeSeguro = String(nomeArquivo || 'foto_vistoria.jpg').replace(/[\\/:*?"<>|]+/g, '_');
    var blob = Utilities.newBlob(bytes, tipo, nomeSeguro);
    var arquivo = obterPastaVistorias().createFile(blob);
    try { arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}

    var fileId = arquivo.getId();
    var fileUrl = arquivo.getUrl();
    var hash = AUT_HASH_(dadosPuros);
    return {
      sucesso: true,
      url: fileUrl,
      driveUrl: fileUrl,
      thumbnailUrl: normalizeDriveUrl_(fileUrl, 900),
      directViewUrl: getLogoPublicUrlAlt_(fileUrl),
      hash: hash,
      fileId: fileId,
      arquivoId: fileId,
      nome: nomeSeguro,
      mimeType: tipo,
      tamanhoBytes: bytes.length,
      fotoId: 'FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no upload da imagem: ' + e.message };
  }
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
      jaExiste[String(AUT_GET_(atual, ['ID_LAUDO'])) + '::' + String(AUT_GET_(atual, ['HASH_FOTO']))] = true;
    }
  }

  var rows = [];
  fotos.forEach(function(f) {
    var url = f.url || '';
    var fileId = f.fileId || AUT_DRIVE_ID_(url);
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
    var chave = String(idLaudo) + '::' + String(hash);
    if (jaExiste[chave]) return;

    rows.push({
      ID_FOTO: f.id || ('FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)),
      ID_LAUDO: idLaudo,
      NUMERO_LAUDO: numeroLaudo,
      AMBIENTE: f.ambiente || '',
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
    var registros = [];
    if (!processos.length) registros = AUT_LER_ITENS_(ss, 'REGISTRO_DE_VISTORIA');

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

function AUT_IMAGEM_PDF_DATA_V6_(url, thumb, hash) {
  url = String(url || '').trim();
  thumb = String(thumb || '').trim();
  if (/^data:image\//i.test(url)) return url;
  if (/^data:image\//i.test(thumb)) return thumb;

  var driveId = extractDriveId_(url) || extractDriveId_(thumb);
  if (driveId) {
    var driveUrl = 'https://drive.google.com/file/d/' + driveId + '/view';
    var fromDrive = AUT_BASE64_IMAGEM_CACHE_(driveUrl, 'FOTO_DRIVE_PDF_30X38_' + hash);
    if (/^data:image\//i.test(String(fromDrive || ''))) return fromDrive;
  }

  var srcThumb = thumb || (url ? normalizeDriveUrl_(url, 900) : '');
  var fetched = AUT_URLFETCH_IMAGE_CACHE_V6_(srcThumb, 'FOTO_URL_PDF_30X38_' + hash);
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
      largura: AUT_GET_(obj, ['LARGURA']),
      altura: AUT_GET_(obj, ['ALTURA']),
      tamanhoBytes: AUT_GET_(obj, ['TAMANHO_BYTES'])
    });
  }

  return out;
}

function AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idLaudo, numeroLaudo, url, pdfHash) {
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
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) achado = AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V5_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado para emissão.' };

    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var numeroLaudo = rowObj.NUMERO_LAUDO || idLaudo;
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var hashBase = rowObj.HASH_LAUDO || AUT_HASH_(JSON.stringify(rowObj) + JSON.stringify(payload));
    var pdfHash = AUT_HASH_(hashBase + AUT_MODELO_PDF_VERSION_V6);
    var pdfUrlAtual = AUT_GET_(rowObj, ['PDF_URL']);
    var pdfHashAtual = AUT_GET_(rowObj, ['PDF_HASH']);

    if (!forcarGeracao && pdfUrlAtual && pdfHashAtual && String(pdfHashAtual) === String(pdfHash)) {
      return {
        sucesso: true,
        ok: true,
        url: pdfUrlAtual,
        msg: 'PDF reaproveitado em cache porque o laudo não mudou.',
        fotos: 0,
        cachePdf: true
      };
    }

    var cfg = getConfiguracoesGlobais();
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numeroLaudo);

    var tpl = HtmlService.createTemplateFromFile('modelo');
    tpl.cfg = cfg;
    tpl.row = achado.row;
    tpl.rowObj = rowObj;
    tpl.payload = payload;
    tpl.fotos = fotos;
    tpl.auditHash = hashBase;

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
      PDF_GERADO_EM: new Date(),
      QTD_FOTOS: fotos.length
    });
    AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idReal, numeroLaudo, file.getUrl(), pdfHash);
    AUT_INVALIDAR_CACHES_();

    return { sucesso: true, ok: true, url: file.getUrl(), msg: 'PDF gerado com modelo documental atualizado.', fotos: fotos.length, cachePdf: false };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao emitir PDF: ' + e.message, erro: e.message };
  }
}

function AUT_EXTRAIR_FOTOS_PAYLOAD_(dados) {
  var fotos = [];
  var visitados = [];
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
    if (!valor) return;
    if (typeof valor === 'string') {
      var s = valor.trim();
      if ((s.charAt(0) === '[' || s.charAt(0) === '{') && s.length < 200000) {
        try {
          andar(JSON.parse(s), caminho);
        } catch (eJson) {}
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
        var ambiente = ambienteDoCaminho(caminho, valor);
        var codigo = codigoDoCaminho(caminho, valor);
        fotos.push({
          id: valor.fotoId || valor.id || '',
          ambiente: ambiente,
          ambienteCodigo: codigo,
          item: valor.item || valor.tipoObservacao || 'Registro fotografico do ambiente',
          nome: valor.nome || valor.nomeArquivo || valor.name || 'foto_vistoria.jpg',
          mimeType: valor.mimeType || 'image/jpeg',
          url: url,
          dataUrl: dataUrl,
          hash: valor.hash || AUT_HASH_(url + dataUrl + fileId),
          fileId: fileId,
          thumbnailUrl: valor.thumbnailUrl || ''
        });
      }
      Object.keys(valor).forEach(function(k) {
        andar(valor[k], caminho ? caminho + '.' + k : k);
      });
    }
  }

  andar(dados, '');
  return fotos;
}

function apiAtualizarVistoria(idLaudo, dados) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, msg: 'ID do laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, msg: 'Laudo não encontrado para edição.' };

    var payloadAnterior = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var dadosFinais = AUT_MERGE_PAYLOAD_ATUALIZACAO_(payloadAnterior, dados || {});
    var idReal = AUT_GET_(achado.rowObj, ['ID_LAUDO']) || idLaudo;
    var hashAnterior = AUT_GET_(achado.rowObj, ['HASH_LAUDO']);
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dadosFinais, idReal, AUT_HASH_(idReal + JSON.stringify(dadosFinais) + new Date().getTime()));

    AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, registro);
    AUT_UPSERT_PROCESSO_LAUDO_(ss, registro);

    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, idReal, registro.NUMERO_LAUDO, dadosFinais);

    AUT_APPEND_OBJ_(ss.getSheetByName('AUDITORIA'), {
      ID_AUDITORIA: 'AUD_' + Date.now(),
      QUANDO: new Date(),
      USUARIO: '',
      ACAO: 'EDITAR_LAUDO',
      ENTIDADE: 'REGISTRO DE VISTORIA',
      ID_ENTIDADE: idReal,
      DETALHES_JSON: JSON.stringify({ hashAnterior: hashAnterior, hashAtual: registro.HASH_LAUDO }),
      HASH_ANTERIOR: hashAnterior,
      HASH_ATUAL: registro.HASH_LAUDO
    });

    AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: idReal,
      idLaudo: idReal,
      numeroLaudo: registro.NUMERO_LAUDO,
      fotos: qtdFotos,
      msg: 'Laudo antigo/novo atualizado com sucesso.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao atualizar vistoria: ' + e.message, erro: e.message };
  }
}

function apiEmitirLaudoPdf(idLaudo) {
  try {
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };

    garantirEstruturaDoSistema();

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado na aba REGISTRO DE VISTORIA.' };

    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var numeroLaudo = rowObj.NUMERO_LAUDO || idLaudo;
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var cfg = getConfiguracoesGlobais();
    var fotos = AUT_FOTOS_PDF_(ss, idReal, numeroLaudo);
    var hash = rowObj.HASH_LAUDO || AUT_HASH_(JSON.stringify(rowObj));

    var tpl = HtmlService.createTemplateFromFile('modelo');
    tpl.cfg = cfg;
    tpl.row = achado.row;
    tpl.rowObj = rowObj;
    tpl.payload = payload;
    tpl.fotos = fotos;
    tpl.auditHash = hash;

    var html = tpl.evaluate().getContent();

    var blob = Utilities
      .newBlob(html, 'text/html', 'LAUDO_' + numeroLaudo + '.html')
      .getAs('application/pdf')
      .setName('LAUDO_' + numeroLaudo + '.pdf');

    var file = obterPastaVistorias().createFile(blob);
    try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}

    AUT_SET_BY_HEADER_(achado.sheet, achado.rowNumber, ['PDF_URL'], file.getUrl());
    AUT_ATUALIZAR_PDF_PROCESSOS_(ss, idReal, numeroLaudo, file.getUrl());
    AUT_INVALIDAR_CACHES_();

    return { sucesso: true, ok: true, url: file.getUrl(), msg: 'PDF gerado com logo oficial Palmer.', fotos: fotos.length };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao emitir PDF: ' + e.message, erro: e.message };
  }
}

/**
 * Opcional: execute uma vez no Apps Script para gravar os laudos antigos no layout novo.
 * O sistema já consegue ler/editar sem isso, mas esta função limpa a base.
 */
function apiRepararLaudosAntigos() {
  try {
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    var sh = ss.getSheetByName('REGISTRO DE VISTORIA');
    if (!sh || sh.getLastRow() < 2) return { sucesso: true, reparados: 0, msg: 'Nenhum laudo encontrado.' };

    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];
    var reparados = 0;

    for (var r = 1; r < values.length; r++) {
      var achado = {
        sheet: sh,
        rowNumber: r + 1,
        row: values[r],
        rowObj: AUT_ROW_TO_OBJ_(headers, values[r]),
        headers: headers
      };
      var normal = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
      AUT_ATUALIZAR_ROW_OBJ_(sh, r + 1, normal);
      AUT_UPSERT_PROCESSO_LAUDO_(ss, normal);
      reparados++;
    }

    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, reparados: reparados, msg: reparados + ' laudo(s) antigo(s) reparado(s).' };
  } catch (e) {
    return { sucesso: false, reparados: 0, msg: 'Erro ao reparar laudos antigos: ' + e.message };
  }
}

/* =========================================================
   PATCH V5 FINAL — DEFINIÇÕES FINAIS EFETIVAS
   ========================================================= */

function getConfiguracoesGlobais() {
  var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.CFG);
  if (cached && cached.cacheVersion === AUTENTIKO_PATCH_VERSION) return cached;

  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var nome = AUT_GET_CELL_BY_HEADER_(sh, 2, ['NOME_SISTEMA'], 'LAUDO DE VISTORIA');
    var logoUiRaw = AUT_GET_PROP_(
      'AUTENTIKO_LOGO_URL',
      AUT_GET_CELL_BY_HEADER_(sh, 2, ['AUTENTIKO_LOGO_URL', 'LOGO_AUTENTIKO'], AUTENTIKO_LOGO_FALLBACK)
    );
    var logoLaudoRaw = AUT_GET_PROP_(
      'LAUDO_LOGO_URL',
      AUT_GET_CELL_BY_HEADER_(sh, 2, ['LAUDO_LOGO_URL', 'PALMER_LOGO_URL', 'LOGO_BASE64'], PALMER_LAUDO_LOGO_OFICIAL)
    );

    if (AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(logoLaudoRaw)) {
      logoLaudoRaw = PALMER_LAUDO_LOGO_OFICIAL;
      AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', logoLaudoRaw);
    }

    var manut = AUT_GET_CELL_BY_HEADER_(sh, 2, ['MANUTENCAO'], 'FALSE');
    var site = AUT_GET_CELL_BY_HEADER_(sh, 2, ['SITE'], 'WWW.PALMERIMOVEIS.COM.BR');
    var endereco = AUT_GET_CELL_BY_HEADER_(sh, 2, ['ENDERECO'], 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000');
    var corretor = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CORRETOR'], 'RYCKY DE PALMER DIAS');
    var creci = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CRECI'], '12.596');
    var subtitle = AUT_GET_CELL_BY_HEADER_(sh, 2, ['APP_SUBTITLE'], AUTENTIKO_APP_SUBTITLE_DEFAULT);

    var logoUiPublica = AUT_PUBLIC_URL_(logoUiRaw, 512);
    var logoLaudoPublica = AUT_PUBLIC_URL_(logoLaudoRaw, 1200) || PALMER_LAUDO_LOGO_OFICIAL;
    var logoUiBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoUiRaw, 'LOGO_UI_V5_FINAL') || AUTENTIKO_LOGO_FALLBACK;
    var logoLaudoBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoLaudoRaw, 'LOGO_LAUDO_V5_FINAL') || AUT_PALMER_LOGO_SVG_DATA_();

    var cfg = {
      sucesso: true,
      cacheVersion: AUTENTIKO_PATCH_VERSION,
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
      palmerNome: 'PALMER IMÓVEIS',
      manutencao: (manut === true || String(manut).toUpperCase() === 'TRUE'),
      site: site,
      endereco: endereco,
      corretor: corretor,
      creci: creci
    };

    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.CFG, cfg, 600);
    return cfg;
  } catch (e) {
    return {
      sucesso: false,
      cacheVersion: AUTENTIKO_PATCH_VERSION,
      nome: 'LAUDO DE VISTORIA',
      appNome: 'AUTENTIKO-OK CHECK',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoUiBase64: AUTENTIKO_LOGO_FALLBACK,
      logoLaudoRaw: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoBase64: AUT_PALMER_LOGO_SVG_DATA_(),
      logoLaudoPublica: PALMER_LAUDO_LOGO_OFICIAL,
      manutencao: false,
      site: 'WWW.PALMERIMOVEIS.COM.BR',
      endereco: 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      corretor: 'RYCKY DE PALMER DIAS',
      creci: '12.596',
      msg: e.message
    };
  }
}

function apiObterLaudoParaEdicao(idLaudo) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do processo/laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) achado = AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V5_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Processo encontrado no painel, mas sem dados suficientes para edição.' };

    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || idLaudo;
    var fotos = AUT_FOTOS_LAUDO_LEVES_V5_(ss, idReal, numero);

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      payload: payload,
      rowObj: rowObj,
      fotos: fotos,
      modoEdicaoLeve: true
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao abrir edição: ' + e.message, erro: e.message };
  }
}

/* =========================================================
   PATCH V5 — EDIÇÃO LEVE + LOGO ROBUSTA
   ========================================================= */

var AUTENTIKO_PATCH_VERSION = 'V5_20260618';

function AUT_PALMER_LOGO_SVG_DATA_() {
  var svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320" viewBox="0 0 900 320">',
    '<rect width="900" height="320" fill="#ffffff"/>',
    '<text x="450" y="135" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="800" fill="#0f172a">PALMER</text>',
    '<text x="450" y="205" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#2563eb">IMOVEIS</text>',
    '<text x="450" y="255" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="#475569">CRECI 12.596</text>',
    '</svg>'
  ].join('');
  return 'data:image/svg+xml;base64,' + Utilities.base64Encode(svg);
}

function AUT_IMAGEM_DATA_OU_VAZIO_(src, namespace) {
  var out = AUT_BASE64_IMAGEM_CACHE_(src, namespace);
  return /^data:image\//i.test(String(out || '')) ? out : '';
}

function getConfiguracoesGlobais() {
  var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.CFG);
  if (cached && cached.cacheVersion === AUTENTIKO_PATCH_VERSION) return cached;

  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var nome = AUT_GET_CELL_BY_HEADER_(sh, 2, ['NOME_SISTEMA'], 'LAUDO DE VISTORIA');
    var logoUiRaw = AUT_GET_PROP_(
      'AUTENTIKO_LOGO_URL',
      AUT_GET_CELL_BY_HEADER_(sh, 2, ['AUTENTIKO_LOGO_URL', 'LOGO_AUTENTIKO'], AUTENTIKO_LOGO_FALLBACK)
    );
    var logoLaudoRaw = AUT_GET_PROP_(
      'LAUDO_LOGO_URL',
      AUT_GET_CELL_BY_HEADER_(sh, 2, ['LAUDO_LOGO_URL', 'PALMER_LOGO_URL', 'LOGO_BASE64'], PALMER_LAUDO_LOGO_OFICIAL)
    );

    if (AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(logoLaudoRaw)) {
      logoLaudoRaw = PALMER_LAUDO_LOGO_OFICIAL;
      AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', logoLaudoRaw);
    }

    var manut = AUT_GET_CELL_BY_HEADER_(sh, 2, ['MANUTENCAO'], 'FALSE');
    var site = AUT_GET_CELL_BY_HEADER_(sh, 2, ['SITE'], 'WWW.PALMERIMOVEIS.COM.BR');
    var endereco = AUT_GET_CELL_BY_HEADER_(sh, 2, ['ENDERECO'], 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000');
    var corretor = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CORRETOR'], 'RYCKY DE PALMER DIAS');
    var creci = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CRECI'], '12.596');
    var subtitle = AUT_GET_CELL_BY_HEADER_(sh, 2, ['APP_SUBTITLE'], AUTENTIKO_APP_SUBTITLE_DEFAULT);

    var logoUiPublica = AUT_PUBLIC_URL_(logoUiRaw, 512);
    var logoLaudoPublica = AUT_PUBLIC_URL_(logoLaudoRaw, 1200) || PALMER_LAUDO_LOGO_OFICIAL;
    var logoUiBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoUiRaw, 'LOGO_UI_V5') || AUTENTIKO_LOGO_FALLBACK;
    var logoLaudoBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoLaudoRaw, 'LOGO_LAUDO_V5') || AUT_PALMER_LOGO_SVG_DATA_();

    var cfg = {
      sucesso: true,
      cacheVersion: AUTENTIKO_PATCH_VERSION,
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
      palmerNome: 'PALMER IMÓVEIS',
      manutencao: (manut === true || String(manut).toUpperCase() === 'TRUE'),
      site: site,
      endereco: endereco,
      corretor: corretor,
      creci: creci
    };

    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.CFG, cfg, 600);
    return cfg;
  } catch (e) {
    return {
      sucesso: false,
      cacheVersion: AUTENTIKO_PATCH_VERSION,
      nome: 'LAUDO DE VISTORIA',
      appNome: 'AUTENTIKO-OK CHECK',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoUiBase64: AUTENTIKO_LOGO_FALLBACK,
      logoLaudoRaw: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoBase64: AUT_PALMER_LOGO_SVG_DATA_(),
      logoLaudoPublica: PALMER_LAUDO_LOGO_OFICIAL,
      manutencao: false,
      site: 'WWW.PALMERIMOVEIS.COM.BR',
      endereco: 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      corretor: 'RYCKY DE PALMER DIAS',
      creci: '12.596',
      msg: e.message
    };
  }
}

function AUT_LOCALIZAR_PROCESSO_V5_(ss, idLaudo) {
  var sh = ss.getSheetByName('PROCESSOS');
  if (!sh || sh.getLastRow() < 2) return null;

  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  for (var r = 1; r < values.length; r++) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    var candidatos = [
      AUT_GET_(obj, ['ID_PROCESSO']),
      AUT_GET_(obj, ['ID_LAUDO']),
      AUT_GET_(obj, ['NUMERO_LAUDO']),
      AUT_GET_(obj, ['CODIGO_LAUDO'])
    ];
    for (var i = 0; i < candidatos.length; i++) {
      if (String(candidatos[i]) === String(idLaudo)) {
        return { sheet: sh, rowNumber: r + 1, row: values[r], rowObj: obj, headers: headers };
      }
    }
  }
  return null;
}

function AUT_PAYLOAD_DE_PROCESSO_V5_(procObj) {
  procObj = procObj || {};
  return {
    idLaudo: AUT_GET_(procObj, ['ID_LAUDO', 'ID_PROCESSO']),
    etapa1_numeroLaudo: AUT_GET_(procObj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']),
    etapa1_vistoriador: AUT_GET_(procObj, ['VISTORIADOR']),
    etapa1_proprietario: AUT_GET_(procObj, ['PROPRIETARIO']),
    etapa1_locatario: AUT_GET_(procObj, ['LOCATARIO']),
    etapa2_endereco: AUT_GET_(procObj, ['ENDERECO']),
    etapa3_tipo: AUT_GET_(procObj, ['TIPO_VISTORIA']),
    etapa3_categoria: AUT_GET_(procObj, ['CATEGORIA_IMOVEL'])
  };
}

function AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V5_(ss, idLaudo) {
  var proc = AUT_LOCALIZAR_PROCESSO_V5_(ss, idLaudo);
  if (!proc) return null;

  var payload = AUT_PAYLOAD_DE_PROCESSO_V5_(proc.rowObj);
  var idReal = payload.idLaudo || idLaudo;
  var registro = AUT_MONTAR_REGISTRO_LAUDO_(payload, idReal, AUT_GET_(proc.rowObj, ['HASH_LAUDO']) || '');
  registro.PDF_URL = AUT_GET_(proc.rowObj, ['PDF_URL']) || '';
  AUT_APPEND_OBJ_(AUT_REGISTRO_SHEET_(ss), registro);
  AUT_INVALIDAR_CACHES_();
  return AUT_LOCALIZAR_LAUDO_(ss, idReal) || AUT_LOCALIZAR_LAUDO_(ss, registro.NUMERO_LAUDO);
}

function AUT_FOTOS_LAUDO_LEVES_V5_(ss, idLaudo, numeroLaudo) {
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
    var arquivoId = AUT_GET_(obj, ['ARQUIVO_ID']) || AUT_DRIVE_ID_(url);
    out.push({
      id: AUT_GET_(obj, ['ID_FOTO']),
      fotoId: AUT_GET_(obj, ['ID_FOTO']),
      ambiente: AUT_GET_(obj, ['AMBIENTE']),
      item: AUT_GET_(obj, ['ITEM']),
      nome: AUT_GET_(obj, ['NOME_ARQUIVO']),
      url: url,
      thumbnailUrl: AUT_GET_(obj, ['FOTO_THUMB_URL']) || (url ? normalizeDriveUrl_(url, 1000) : ''),
      hash: AUT_GET_(obj, ['HASH_FOTO']),
      arquivoId: arquivoId,
      mimeType: AUT_GET_(obj, ['MIME_TYPE']) || 'image/jpeg'
    });
  }
  return out;
}

function apiObterLaudoParaEdicao(idLaudo) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do processo/laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) achado = AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V5_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Processo encontrado no painel, mas sem dados suficientes para edição.' };

    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || idLaudo;
    var fotos = AUT_FOTOS_LAUDO_LEVES_V5_(ss, idReal, numero);

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      payload: payload,
      rowObj: rowObj,
      fotos: fotos,
      modoEdicaoLeve: true
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao abrir edição: ' + e.message, erro: e.message };
  }
}

/* =========================================================
   PATCH V4 — ESTABILIZAÇÃO ADMIN, PLANILHAS E FOTOS SEGURAS
   ========================================================= */

function AUT_REGISTRO_HEADERS_V4_() {
  return [
    'ID_LAUDO','NUMERO_LAUDO','CODIGO_LAUDO','DATA_VISTORIA','HORA_VISTORIA',
    'RESPONSAVEL','VISTORIADOR','PROPRIETARIO','CPF_PROPRIETARIO','LOCATARIO',
    'CPF_LOCATARIO','CONTATO','EMAIL','RUA','NUMERO','REFERENCIA','BAIRRO','CIDADE','CEP',
    'ENDERECO_IMOVEL','TIPO_VISTORIA','CATEGORIA_IMOVEL','TIPO_LOCACAO','ESTADO_IMOVEL',
    'PAYLOAD_JSON','DATA_REGISTRO','PDF_URL','HASH_LAUDO'
  ];
}

function AUT_PREPARAR_HEADERS_V4_() {
  AUTENTIKO_HEADERS.USUARIOS = [
    'NOME','DATA_NASCIMENTO','CONTATO','EMAIL','USUARIO','SENHA_HASH',
    'PERFIL','STATUS','DATA_CADASTRO','ULTIMO_ACESSO','ACEITE_LGPD','DATA_ACEITE_LGPD'
  ];
  AUTENTIKO_HEADERS.CONFIGURACOES = [
    'NOME_SISTEMA','AUTENTIKO_LOGO_URL','LAUDO_LOGO_URL','MANUTENCAO',
    'SITE','ENDERECO','CORRETOR','CRECI','APP_SUBTITLE'
  ];
  AUTENTIKO_HEADERS['REGISTRO DE VISTORIA'] = AUT_REGISTRO_HEADERS_V4_();
  AUTENTIKO_HEADERS.REGISTRO_DE_VISTORIA = AUT_REGISTRO_HEADERS_V4_();
  AUTENTIKO_HEADERS.FOTOS_LAUDO = [
    'ID_FOTO','ID_LAUDO','NUMERO_LAUDO','AMBIENTE','ITEM','NOME_ARQUIVO','MIME_TYPE',
    'FOTO_URL','FOTO_DATA_URL','HASH_FOTO','CRIADO_EM','ARQUIVO_ID','FOTO_THUMB_URL'
  ];
  AUTENTIKO_HEADERS.AMBIENTES_LAUDO = [
    'ID_AMBIENTE','ID_LAUDO','NUMERO_LAUDO','ORDEM','NOME_AMBIENTE',
    'ANAMNESE_JSON','OBSERVACOES','CRIADO_EM','ATUALIZADO_EM'
  ];
  AUTENTIKO_HEADERS.ITENS_AMBIENTE = [
    'ID_ITEM','ID_AMBIENTE','ID_LAUDO','NUMERO_LAUDO','AMBIENTE','ITEM',
    'ESTADO','OBSERVACAO','CRIADO_EM','ATUALIZADO_EM'
  ];
}

function garantirEstruturaDoSistema() {
  var ss = AUT_SS_FAST_();
  AUT_PREPARAR_HEADERS_V4_();

  Object.keys(AUTENTIKO_HEADERS).forEach(function(nome) {
    AUT_SHEET_(ss, nome, AUTENTIKO_HEADERS[nome]);
  });

  garantirConfigPadrao_(ss);
  garantirUsuarioAdmin_(ss);
  garantirListasPadrao_(ss);
  garantirAnamnesePadrao_(ss);
  AUT_CORRIGIR_LOGO_PALMER_CONFIG_();

  return { sucesso: true, msg: 'Estrutura AUTENTIKO-OK CHECK reparada.' };
}

function AUT_REGISTRO_SHEETS_(ss) {
  ss = ss || AUT_SS_FAST_();
  var out = [];
  var canonical = ss.getSheetByName('REGISTRO_DE_VISTORIA');
  var legacy = ss.getSheetByName('REGISTRO DE VISTORIA');
  if (canonical) out.push(canonical);
  if (legacy && (!canonical || legacy.getSheetId() !== canonical.getSheetId())) out.push(legacy);
  return out;
}

function AUT_REGISTRO_SHEET_(ss) {
  ss = ss || AUT_SS_FAST_();
  var canonical = ss.getSheetByName('REGISTRO_DE_VISTORIA');
  var legacy = ss.getSheetByName('REGISTRO DE VISTORIA');
  if (legacy && legacy.getLastRow() > 1 && (!canonical || canonical.getLastRow() < 2)) return legacy;
  return canonical || legacy || AUT_SHEET_(ss, 'REGISTRO_DE_VISTORIA', AUT_REGISTRO_HEADERS_V4_());
}

function AUT_HASH_VALIDO_(hash) {
  return /^[a-f0-9]{64}$/i.test(String(hash || '').trim());
}

function AUT_STATUS_APROVADO_(status) {
  return AUT_NORM_(status) === 'APROVADO';
}

function AUT_STATUS_BLOQUEADO_(status) {
  return AUT_NORM_(status) === 'BLOQUEADO';
}

function AUT_PERFIL_ADMIN_(perfil) {
  var p = AUT_NORM_(perfil);
  return p === 'ADMIN' || p === 'ADMINISTRADOR' || p === 'DESENVOLVEDOR';
}

function AUT_ENVIAR_EMAIL_APROVACAO_(email, nome) {
  if (!email) return;
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Acesso liberado - AUTENTIKO-OK CHECK',
      body: 'Olá, ' + (nome || '') + '.\n\nSeu acesso ao AUTENTIKO-OK CHECK foi liberado.\n\nPalmer Imóveis'
    });
  } catch (e) {}
}

function validarChaveMestra(chave) {
  try {
    var entrada = String(chave || '').trim();
    var props = PropertiesService.getScriptProperties();
    var chaveSalva = String(props.getProperty('CHAVE_MESTRA') || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9').trim();
    var hashEntrada = AUT_HASH_VALIDO_(entrada) ? entrada : AUT_HASH_(entrada);
    return { sucesso: !!entrada && hashEntrada === chaveSalva };
  } catch (e) {
    return { sucesso: false };
  }
}

function registrarUsuario(dados) {
  try {
    garantirEstruturaDoSistema();
    dados = dados || {};

    if (!dados.nome || !dados.email || !dados.usuario || !dados.senhaHash) {
      return { sucesso: false, msg: 'Dados obrigatórios não preenchidos.' };
    }
    if (!AUT_HASH_VALIDO_(dados.senhaHash)) {
      return { sucesso: false, msg: 'Senha inválida. O cadastro deve enviar apenas o hash SHA-256.' };
    }
    if (dados.aceiteLgpd !== true && String(dados.aceiteLgpd || '').toUpperCase() !== 'SIM') {
      return { sucesso: false, msg: 'O aceite LGPD é obrigatório para criar a conta.' };
    }

    var sh = AUT_SS_FAST_().getSheetByName('USUARIOS');
    var values = sh.getDataRange().getValues();
    var headers = values[0];
    var emailNovo = String(dados.email || '').trim().toLowerCase();
    var usuarioNovo = String(dados.usuario || '').trim().toLowerCase();

    for (var i = 1; i < values.length; i++) {
      var obj = AUT_ROW_TO_OBJ_(headers, values[i]);
      if (String(AUT_GET_(obj, ['EMAIL']) || '').trim().toLowerCase() === emailNovo) {
        return { sucesso: false, msg: 'E-mail já cadastrado.' };
      }
      if (String(AUT_GET_(obj, ['USUARIO']) || '').trim().toLowerCase() === usuarioNovo) {
        return { sucesso: false, msg: 'Usuário já existe.' };
      }
    }

    AUT_APPEND_OBJ_(sh, {
      NOME: dados.nome,
      DATA_NASCIMENTO: dados.nascimento || '',
      CONTATO: dados.contato || '',
      EMAIL: dados.email,
      USUARIO: dados.usuario,
      SENHA_HASH: String(dados.senhaHash).toLowerCase(),
      PERFIL: 'SUPORTE TECNICO',
      STATUS: 'PENDENTE',
      DATA_CADASTRO: new Date(),
      ULTIMO_ACESSO: '',
      ACEITE_LGPD: 'SIM',
      DATA_ACEITE_LGPD: new Date()
    });

    return { sucesso: true, msg: 'Cadastro realizado. Aguarde aprovação do administrador.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao registrar usuário: ' + e.message };
  }
}

function validarLogin(usuario, senhaHash) {
  try {
    garantirEstruturaDoSistema();
    usuario = String(usuario || '').trim();
    senhaHash = String(senhaHash || '').trim().toLowerCase();

    if (!usuario || !AUT_HASH_VALIDO_(senhaHash)) {
      return { sucesso: false, msg: 'Usuário e senha são obrigatórios.' };
    }

    var configs = getConfiguracoesGlobais();
    var sh = AUT_SS_FAST_().getSheetByName('USUARIOS');
    var values = sh.getDataRange().getValues();
    var headers = values[0];

    for (var i = 1; i < values.length; i++) {
      var obj = AUT_ROW_TO_OBJ_(headers, values[i]);
      var u = String(AUT_GET_(obj, ['USUARIO']) || '').trim();
      var h = String(AUT_GET_(obj, ['SENHA_HASH']) || '').trim().toLowerCase();
      if (u.toLowerCase() !== usuario.toLowerCase() || h !== senhaHash) continue;

      var status = AUT_GET_(obj, ['STATUS']);
      var perfil = AUT_GET_(obj, ['PERFIL']);

      if (!AUT_STATUS_APROVADO_(status)) {
        return { sucesso: false, msg: AUT_STATUS_BLOQUEADO_(status) ? 'Usuário bloqueado.' : 'Cadastro pendente de aprovação.' };
      }
      if (configs.manutencao && !AUT_PERFIL_ADMIN_(perfil)) {
        return { sucesso: false, msg: 'Sistema em manutenção. Acesso permitido apenas para ADMIN/DESENVOLVEDOR.' };
      }

      AUT_SET_BY_HEADER_(sh, i + 1, ['ULTIMO_ACESSO'], new Date());
      return {
        sucesso: true,
        msg: 'Login efetuado.',
        nome: AUT_GET_(obj, ['NOME']),
        perfil: perfil,
        status: status,
        usuario: u
      };
    }

    return { sucesso: false, msg: 'Usuário ou senha incorretos.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no login: ' + e.message };
  }
}

function getTodosUsuarios() {
  try {
    garantirEstruturaDoSistema();
    var sh = AUT_SS_FAST_().getSheetByName('USUARIOS');
    var values = sh.getDataRange().getValues();
    var headers = values[0];
    var lista = [];

    for (var i = 1; i < values.length; i++) {
      var obj = AUT_ROW_TO_OBJ_(headers, values[i]);
      if (!AUT_GET_(obj, ['NOME']) && !AUT_GET_(obj, ['USUARIO'])) continue;
      lista.push({
        linha: i + 1,
        nome: AUT_GET_(obj, ['NOME']),
        email: AUT_GET_(obj, ['EMAIL']),
        usuario: AUT_GET_(obj, ['USUARIO']),
        perfil: AUT_GET_(obj, ['PERFIL']),
        status: AUT_GET_(obj, ['STATUS']),
        aceiteLgpd: AUT_GET_(obj, ['ACEITE_LGPD'])
      });
    }

    return { sucesso: true, dados: lista };
  } catch (e) {
    return { sucesso: false, dados: [], msg: 'Erro ao buscar usuários: ' + e.message };
  }
}

function alterarMembroCompleto(linha, perfil, status, chaveMestra) {
  try {
    garantirEstruturaDoSistema();
    if (!validarChaveMestra(chaveMestra).sucesso) {
      return { sucesso: false, msg: 'Chave mestra inválida para alterar usuários.' };
    }

    linha = Number(linha);
    if (!linha || linha < 2) return { sucesso: false, msg: 'Linha inválida.' };

    var sh = AUT_SS_FAST_().getSheetByName('USUARIOS');
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var oldObj = AUT_ROW_TO_OBJ_(headers, sh.getRange(linha, 1, 1, sh.getLastColumn()).getValues()[0]);
    var statusAnterior = AUT_GET_(oldObj, ['STATUS']);
    var novoPerfil = AUT_NORM_(perfil || 'SUPORTE_TECNICO').replace(/_/g, ' ');
    var novoStatus = AUT_NORM_(status || 'PENDENTE').replace(/_/g, ' ');

    AUT_SET_BY_HEADER_(sh, linha, ['PERFIL'], novoPerfil);
    AUT_SET_BY_HEADER_(sh, linha, ['STATUS'], novoStatus);

    if (!AUT_STATUS_APROVADO_(statusAnterior) && AUT_STATUS_APROVADO_(novoStatus)) {
      AUT_ENVIAR_EMAIL_APROVACAO_(AUT_GET_(oldObj, ['EMAIL']), AUT_GET_(oldObj, ['NOME']));
    }

    return { sucesso: true, msg: 'Usuário atualizado.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao atualizar usuário: ' + e.message };
  }
}

function salvarConfiguracoesGlobais(n, logoLaudo, m, s, end, c, cr, logoUi, subtitle, chaveMestra) {
  try {
    garantirEstruturaDoSistema();
    if (!validarChaveMestra(chaveMestra).sucesso) {
      return { sucesso: false, msg: 'Chave mestra inválida para salvar configurações.' };
    }

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var logoFinalLaudo = logoLaudo || PALMER_LAUDO_LOGO_OFICIAL;
    if (AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(logoFinalLaudo)) logoFinalLaudo = PALMER_LAUDO_LOGO_OFICIAL;

    sh.getRange(2, 1, 1, 9).setValues([[
      n || 'LAUDO DE VISTORIA',
      logoUi || AUTENTIKO_LOGO_FALLBACK,
      logoFinalLaudo,
      m ? 'TRUE' : 'FALSE',
      s || 'WWW.PALMERIMOVEIS.COM.BR',
      end || 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      c || 'RYCKY DE PALMER DIAS',
      cr || '12.596',
      subtitle || AUTENTIKO_APP_SUBTITLE_DEFAULT
    ]]);

    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, msg: 'Configurações salvas com logo UI e logo do laudo separadas.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao salvar configurações: ' + e.message };
  }
}

function uploadImagemVistoria(base64Data, nomeArquivo) {
  try {
    garantirEstruturaDoSistema();
    if (!base64Data || !nomeArquivo) return { sucesso: false, msg: 'Imagem ou nome do arquivo ausente.' };

    var tipo = 'image/jpeg';
    var dadosPuros = '';
    var entrada = String(base64Data || '');
    if (entrada.indexOf('data:') === 0) {
      tipo = entrada.split(';')[0].split(':')[1] || 'image/jpeg';
      dadosPuros = entrada.split(',')[1] || '';
    } else {
      dadosPuros = entrada;
    }
    if (!dadosPuros) return { sucesso: false, msg: 'Base64 da imagem está vazio.' };

    var blob = Utilities.newBlob(Utilities.base64Decode(dadosPuros), tipo, nomeArquivo);
    var arquivo = obterPastaVistorias().createFile(blob);
    try { arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (eShare) {}

    var fileId = arquivo.getId();
    var fileUrl = arquivo.getUrl();
    var hash = AUT_HASH_(dadosPuros);
    return {
      sucesso: true,
      url: fileUrl,
      driveUrl: fileUrl,
      thumbnailUrl: normalizeDriveUrl_(fileUrl, 1000),
      directViewUrl: getLogoPublicUrlAlt_(fileUrl),
      hash: hash,
      fileId: fileId,
      arquivoId: fileId,
      nome: nomeArquivo,
      mimeType: tipo,
      fotoId: 'FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)
    };
  } catch (e) {
    return { sucesso: false, msg: 'Erro no upload da imagem: ' + e.message };
  }
}

function AUT_PURGE_PAYLOAD_(dados) {
  function limpar(valor, chave) {
    var nk = AUT_NORM_(chave || '');
    if (nk === 'DATAURL' || nk === 'DATA_URL' || nk === 'BASE64' || nk === 'EMBED' || nk === 'FOTO_DATA_URL') return '';

    if (valor === null || valor === undefined) return valor;
    if (typeof valor === 'string') {
      var s = valor;
      var trimmed = s.trim();
      if (/^data:image\//i.test(trimmed)) return '';
      if ((trimmed.charAt(0) === '[' || trimmed.charAt(0) === '{') && trimmed.length < 200000) {
        try {
          return JSON.stringify(limpar(JSON.parse(trimmed), chave));
        } catch (eJson) {}
      }
      s = s.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
      if (s.length > 45000) s = s.substring(0, 45000) + '... [CORTADO PELO SISTEMA]';
      return s;
    }
    if (Array.isArray(valor)) {
      return valor.map(function(item) { return limpar(item, chave); });
    }
    if (typeof valor === 'object') {
      var out = {};
      Object.keys(valor).forEach(function(k) { out[k] = limpar(valor[k], k); });
      return out;
    }
    return valor;
  }
  return limpar(dados || {}, '');
}

function AUT_EXTRAIR_FOTOS_PAYLOAD_(dados) {
  var fotos = [];
  var visitados = [];

  function fotoDeObjeto(obj, caminho) {
    obj = obj || {};
    var url = obj.url || obj.fotoUrl || obj.FOTO_URL || obj.driveUrl || obj.directViewUrl || '';
    var dataUrl = obj.dataUrl || obj.base64 || obj.FOTO_DATA_URL || obj.embed || '';
    var fileId = obj.fileId || obj.arquivoId || obj.ARQUIVO_ID || '';
    if (!url && fileId) url = 'https://drive.google.com/file/d/' + fileId + '/view';
    if (!url && !dataUrl) return;

    fotos.push({
      id: obj.fotoId || obj.id || '',
      ambiente: obj.ambiente || obj.comodo || obj.local || String(caminho || '').replace(/_fotos_urls.*/, ''),
      item: obj.item || '',
      nome: obj.nome || obj.nomeArquivo || obj.name || 'foto_vistoria.jpg',
      mimeType: obj.mimeType || 'image/jpeg',
      url: url,
      dataUrl: dataUrl,
      hash: obj.hash || AUT_HASH_(url + dataUrl + fileId),
      fileId: fileId,
      thumbnailUrl: obj.thumbnailUrl || ''
    });
  }

  function andar(valor, caminho) {
    if (!valor) return;
    if (typeof valor === 'string') {
      var s = valor.trim();
      if ((s.charAt(0) === '[' || s.charAt(0) === '{') && s.length < 200000) {
        try {
          andar(JSON.parse(s), caminho);
        } catch (eJson) {}
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
      fotoDeObjeto(valor, caminho);
      Object.keys(valor).forEach(function(k) { andar(valor[k], caminho ? caminho + '.' + k : k); });
    }
  }

  andar(dados || {}, '');
  return fotos;
}

function AUT_VINCULAR_FOTOS_(ss, idLaudo, numeroLaudo, dados) {
  var fotos = AUT_EXTRAIR_FOTOS_PAYLOAD_(dados);
  if (!fotos.length) return 0;

  var sh = ss.getSheetByName('FOTOS_LAUDO');
  var inseridas = 0;
  var jaExiste = {};

  if (sh.getLastRow() > 1) {
    var atuais = sh.getDataRange().getValues();
    var headersAtuais = atuais[0];
    for (var i = 1; i < atuais.length; i++) {
      var atual = AUT_ROW_TO_OBJ_(headersAtuais, atuais[i]);
      jaExiste[String(AUT_GET_(atual, ['ID_LAUDO'])) + '::' + String(AUT_GET_(atual, ['HASH_FOTO']))] = true;
    }
  }

  fotos.forEach(function(f) {
    var url = f.url || '';
    var fileId = f.fileId || AUT_DRIVE_ID_(url);
    if (!url && f.dataUrl) {
      var up = uploadImagemVistoria(f.dataUrl, f.nome || 'foto_vistoria.jpg');
      if (up && up.sucesso) {
        url = up.url || up.driveUrl || '';
        fileId = up.fileId || up.arquivoId || fileId;
        f.hash = f.hash || up.hash;
      }
    }
    if (!url && fileId) url = 'https://drive.google.com/file/d/' + fileId + '/view';
    if (!url) return;

    var hash = f.hash || AUT_HASH_(url + fileId + f.nome);
    var chave = String(idLaudo) + '::' + String(hash);
    if (jaExiste[chave]) return;

    AUT_APPEND_OBJ_(sh, {
      ID_FOTO: f.id || ('FOTO_' + Date.now() + '_' + Math.floor(Math.random() * 9999)),
      ID_LAUDO: idLaudo,
      NUMERO_LAUDO: numeroLaudo,
      AMBIENTE: f.ambiente || '',
      ITEM: f.item || '',
      NOME_ARQUIVO: f.nome || 'foto_vistoria.jpg',
      MIME_TYPE: f.mimeType || 'image/jpeg',
      FOTO_URL: url,
      FOTO_DATA_URL: '',
      HASH_FOTO: hash,
      CRIADO_EM: new Date(),
      ARQUIVO_ID: fileId || '',
      FOTO_THUMB_URL: f.thumbnailUrl || normalizeDriveUrl_(url, 1000)
    });
    jaExiste[chave] = true;
    inseridas++;
  });

  return inseridas;
}

function AUT_REMOVER_LAUDO_DE_ABA_(sh, idLaudo) {
  if (!sh || sh.getLastRow() < 2) return;
  var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  for (var r = values.length - 1; r >= 1; r--) {
    var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
    if (String(AUT_GET_(obj, ['ID_LAUDO'])) === String(idLaudo)) sh.deleteRow(r + 1);
  }
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

  var total = 0;
  Object.keys(grupos).sort(function(a, b) { return grupos[a].ordem - grupos[b].ordem; }).forEach(function(idAmb) {
    var g = grupos[idAmb];
    var c = g.campos || {};
    var nome = c.tipo_ambiente || '';
    if (!nome) return;

    var idAmbiente = idLaudo + '_' + idAmb;
    AUT_APPEND_OBJ_(shAmb, {
      ID_AMBIENTE: idAmbiente,
      ID_LAUDO: idLaudo,
      NUMERO_LAUDO: numeroLaudo,
      ORDEM: g.ordem,
      NOME_AMBIENTE: nome,
      ANAMNESE_JSON: c.anamnese || '',
      OBSERVACOES: c.obs || '',
      CRIADO_EM: new Date(),
      ATUALIZADO_EM: new Date()
    });

    ['piso','paredes','teto','infra','esquadrias'].forEach(function(item) {
      if (!c[item]) return;
      AUT_APPEND_OBJ_(shItens, {
        ID_ITEM: idAmbiente + '_' + AUT_NORM_(item),
        ID_AMBIENTE: idAmbiente,
        ID_LAUDO: idLaudo,
        NUMERO_LAUDO: numeroLaudo,
        AMBIENTE: nome,
        ITEM: item.toUpperCase(),
        ESTADO: c[item],
        OBSERVACAO: c.obs || '',
        CRIADO_EM: new Date(),
        ATUALIZADO_EM: new Date()
      });
      total++;
    });
  });

  return total;
}

function AUT_NUMERO_LAUDO_EXISTE_(ss, numeroLaudo, idIgnorar) {
  if (!numeroLaudo) return false;
  var sheets = AUT_REGISTRO_SHEETS_(ss).concat([ss.getSheetByName('PROCESSOS')]);
  for (var s = 0; s < sheets.length; s++) {
    var sh = sheets[s];
    if (!sh || sh.getLastRow() < 2) continue;
    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];
    for (var r = 1; r < values.length; r++) {
      var obj = AUT_ROW_TO_OBJ_(headers, values[r]);
      var id = AUT_GET_(obj, ['ID_LAUDO', 'ID_PROCESSO']);
      var num = AUT_GET_(obj, ['NUMERO_LAUDO', 'CODIGO_LAUDO']);
      if (String(idIgnorar || '') && String(id) === String(idIgnorar)) continue;
      if (String(num) === String(numeroLaudo)) return true;
    }
  }
  return false;
}

function AUT_GERAR_NUMERO_LAUDO_(ss, preferido, idIgnorar) {
  var limpo = String(preferido || '').replace(/\D/g, '');
  if (/^\d{8}$/.test(limpo) && !AUT_NUMERO_LAUDO_EXISTE_(ss, limpo, idIgnorar)) return limpo;

  for (var i = 0; i < 50; i++) {
    var numero = String(Math.floor(10000000 + Math.random() * 90000000));
    if (!AUT_NUMERO_LAUDO_EXISTE_(ss, numero, idIgnorar)) return numero;
  }
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMddHHmm');
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
  return '';
}

function AUT_MONTAR_REGISTRO_LAUDO_(dados, idLaudoExistente, hashExistente) {
  var ss = AUT_SS_FAST_();
  dados = AUT_PURGE_PAYLOAD_(dados || {});
  var numeroLaudo = AUT_GERAR_NUMERO_LAUDO_(ss, AUT_GET_(dados, ['etapa1_numeroLaudo', 'numeroLaudo', 'NUMERO_LAUDO']), idLaudoExistente);
  dados.etapa1_numeroLaudo = numeroLaudo;
  dados.numeroLaudo = numeroLaudo;
  var idLaudo = idLaudoExistente || AUT_GET_(dados, ['idLaudo', 'ID_LAUDO']) || numeroLaudo;
  var categoria = AUT_GET_(dados, ['etapa3_categoria', 'categoriaImovel']);
  var categoriaOutros = AUT_GET_(dados, ['etapa3_categoria_outros']);
  if (AUT_NORM_(categoria) === 'OUTROS' && categoriaOutros) categoria = 'OUTROS - ' + categoriaOutros;

  var payload = JSON.stringify(dados);
  var hash = hashExistente || AUT_HASH_(idLaudo + payload + new Date().getTime());
  return {
    ID_LAUDO: idLaudo,
    NUMERO_LAUDO: numeroLaudo,
    CODIGO_LAUDO: numeroLaudo,
    DATA_VISTORIA: AUT_GET_(dados, ['etapa1_data', 'dataVistoria', 'DATA_VISTORIA']),
    HORA_VISTORIA: AUT_GET_(dados, ['etapa1_hora', 'horaVistoria', 'HORA_VISTORIA']),
    RESPONSAVEL: AUT_GET_(dados, ['etapa1_vistoriador', 'responsavel', 'vistoriador']),
    VISTORIADOR: AUT_GET_(dados, ['etapa1_vistoriador', 'responsavel', 'vistoriador']),
    PROPRIETARIO: AUT_GET_(dados, ['etapa1_proprietario', 'proprietario']),
    CPF_PROPRIETARIO: AUT_GET_(dados, ['etapa1_cpf_prop', 'cpfProprietario']),
    LOCATARIO: AUT_GET_(dados, ['etapa1_locatario', 'locatario']),
    CPF_LOCATARIO: AUT_GET_(dados, ['etapa1_cpf_loc', 'cpfLocatario']),
    CONTATO: AUT_GET_(dados, ['etapa1_contato', 'contato']),
    EMAIL: AUT_GET_(dados, ['etapa1_email', 'email']),
    RUA: AUT_GET_(dados, ['etapa2_rua', 'rua']),
    NUMERO: AUT_GET_(dados, ['etapa2_numero', 'numero']),
    REFERENCIA: AUT_GET_(dados, ['etapa2_referencia', 'referencia']),
    BAIRRO: AUT_GET_(dados, ['etapa2_bairro', 'bairro']),
    CIDADE: AUT_GET_(dados, ['etapa2_cidade', 'cidade']),
    CEP: AUT_GET_(dados, ['etapa2_cep', 'cep']),
    ENDERECO_IMOVEL: AUT_ENDERECO_(dados),
    TIPO_VISTORIA: AUT_GET_(dados, ['etapa3_tipo', 'tipoVistoria']),
    CATEGORIA_IMOVEL: categoria,
    TIPO_LOCACAO: AUT_GET_(dados, ['etapa3_locacao', 'tipoLocacao']),
    ESTADO_IMOVEL: AUT_GET_(dados, ['etapa3_estado', 'estadoImovel']),
    PAYLOAD_JSON: payload,
    DATA_REGISTRO: AUT_GET_(dados, ['DATA_REGISTRO']) || new Date(),
    PDF_URL: AUT_GET_(dados, ['PDF_URL']) || '',
    HASH_LAUDO: hash
  };
}

function AUT_LOCALIZAR_LAUDO_(ss, idLaudo) {
  var sheets = AUT_REGISTRO_SHEETS_(ss);
  for (var s = 0; s < sheets.length; s++) {
    var sh = sheets[s];
    if (!sh || sh.getLastRow() < 2) continue;
    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];
    for (var r = 1; r < values.length; r++) {
      var rawObj = AUT_ROW_TO_OBJ_(headers, values[r]);
      var candidatos = [
        AUT_GET_(rawObj, ['ID_LAUDO']),
        AUT_GET_(rawObj, ['NUMERO_LAUDO']),
        AUT_GET_(rawObj, ['CODIGO_LAUDO']),
        values[r][0],
        values[r][1]
      ];
      for (var i = 0; i < candidatos.length; i++) {
        if (String(candidatos[i]) === String(idLaudo)) {
          var achado = { sheet: sh, rowNumber: r + 1, row: values[r], rowObjRaw: rawObj, rowObj: rawObj, headers: headers };
          achado.payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
          achado.rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
          return achado;
        }
      }
    }
  }
  return null;
}

function AUT_LER_ITENS_(ss, nome) {
  var sheets = [];
  var nomeNorm = AUT_NORM_(nome);
  if (nomeNorm === 'REGISTRO_DE_VISTORIA') {
    sheets = AUT_REGISTRO_SHEETS_(ss);
  } else {
    var shUnico = ss.getSheetByName(nome);
    if (shUnico) sheets = [shUnico];
  }

  var out = [];
  sheets.forEach(function(sh) {
    if (!sh || sh.getLastRow() < 2) return;
    var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var headers = values[0];
    for (var r = 1; r < values.length; r++) {
      var rawObj = AUT_ROW_TO_OBJ_(headers, values[r]);
      var rowObj = (AUT_NORM_(sh.getName()) === 'REGISTRO_DE_VISTORIA')
        ? AUT_NORMALIZAR_ROWOBJ_LAUDO_({ sheet: sh, rowNumber: r + 1, row: values[r], rowObj: rawObj, headers: headers })
        : rawObj;
      var item = AUT_MAP_ITEM_(rowObj, r + 1);
      if (item.id || item.numero || item.proprietario || item.locatario) out.push(item);
    }
  });
  return out;
}

function apiSalvarVistoria(dados) {
  try {
    garantirEstruturaDoSistema();
    var erroValidacao = AUT_VALIDAR_VISTORIA_(dados || {});
    if (erroValidacao) return { sucesso: false, ok: false, msg: erroValidacao };

    var ss = AUT_SS_FAST_();
    var dadosOriginais = dados || {};
    var dadosLimpos = AUT_PURGE_PAYLOAD_(dadosOriginais);
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dadosLimpos);

    AUT_APPEND_OBJ_(AUT_REGISTRO_SHEET_(ss), registro);
    AUT_UPSERT_PROCESSO_LAUDO_(ss, registro);
    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdItens = AUT_VINCULAR_AMBIENTES_ITENS_(ss, registro.ID_LAUDO, registro.NUMERO_LAUDO, dadosLimpos);
    AUT_INVALIDAR_CACHES_();

    return {
      sucesso: true,
      ok: true,
      id: registro.ID_LAUDO,
      idLaudo: registro.ID_LAUDO,
      numeroLaudo: registro.NUMERO_LAUDO,
      fotos: qtdFotos,
      itens: qtdItens,
      msg: 'Vistoria salva com segurança. Fotos ficaram vinculadas por URL/ID, sem base64 no payload.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao salvar vistoria: ' + e.message, erro: e.message };
  }
}

function apiAtualizarVistoria(idLaudo, dados) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do laudo não informado.' };

    var erroValidacao = AUT_VALIDAR_VISTORIA_(dados || {});
    if (erroValidacao) return { sucesso: false, ok: false, msg: erroValidacao };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Laudo não encontrado para edição.' };

    var payloadAnterior = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var dadosOriginais = AUT_MERGE_PAYLOAD_ATUALIZACAO_(payloadAnterior, dados || {});
    var dadosLimpos = AUT_PURGE_PAYLOAD_(dadosOriginais);
    var idReal = AUT_GET_(achado.rowObj, ['ID_LAUDO']) || idLaudo;
    var hashAnterior = AUT_GET_(achado.rowObj, ['HASH_LAUDO']);
    var registro = AUT_MONTAR_REGISTRO_LAUDO_(dadosLimpos, idReal, AUT_HASH_(idReal + JSON.stringify(dadosLimpos) + new Date().getTime()));

    AUT_ATUALIZAR_ROW_OBJ_(achado.sheet, achado.rowNumber, registro);
    AUT_UPSERT_PROCESSO_LAUDO_(ss, registro);
    var qtdFotos = AUT_VINCULAR_FOTOS_(ss, idReal, registro.NUMERO_LAUDO, dadosOriginais);
    var qtdItens = AUT_VINCULAR_AMBIENTES_ITENS_(ss, idReal, registro.NUMERO_LAUDO, dadosLimpos);

    AUT_APPEND_OBJ_(ss.getSheetByName('AUDITORIA'), {
      ID_AUDITORIA: 'AUD_' + Date.now(),
      QUANDO: new Date(),
      USUARIO: '',
      ACAO: 'EDITAR_LAUDO',
      ENTIDADE: achado.sheet.getName(),
      ID_ENTIDADE: idReal,
      DETALHES_JSON: JSON.stringify({ hashAnterior: hashAnterior, hashAtual: registro.HASH_LAUDO }),
      HASH_ANTERIOR: hashAnterior,
      HASH_ATUAL: registro.HASH_LAUDO
    });

    AUT_INVALIDAR_CACHES_();
    return {
      sucesso: true,
      ok: true,
      id: idReal,
      idLaudo: idReal,
      numeroLaudo: registro.NUMERO_LAUDO,
      fotos: qtdFotos,
      itens: qtdItens,
      msg: 'Laudo atualizado com segurança.'
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao atualizar vistoria: ' + e.message, erro: e.message };
  }
}

function apiListarProcessos() {
  try {
    garantirEstruturaDoSistema();
    var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.LISTA_PROCESSOS);
    if (cached) return cached;

    var ss = AUT_SS_FAST_();
    var processos = AUT_LER_ITENS_(ss, 'PROCESSOS');
    var registros = AUT_LER_ITENS_(ss, 'REGISTRO_DE_VISTORIA');
    var mapa = {};

    registros.forEach(function(item) { mapa[String(item.id || item.numero)] = item; });
    processos.forEach(function(item) {
      var key = String(item.id || item.numero);
      mapa[key] = Object.assign(mapa[key] || {}, item);
    });

    var dados = Object.keys(mapa).map(function(k) { return mapa[k]; });
    dados.sort(function(a, b) {
      return String(b.criadoEm || b.dataVistoria || '').localeCompare(String(a.criadoEm || a.dataVistoria || ''));
    });

    var res = { sucesso: true, ok: true, dados: dados, processos: dados, laudos: dados, total: dados.length, cache: false };
    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.LISTA_PROCESSOS, res, 180);
    return res;
  } catch (e) {
    return { sucesso: false, ok: false, dados: [], processos: [], laudos: [], total: 0, msg: 'Erro ao listar processos: ' + e.message };
  }
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
    var oldDataUrl = AUT_GET_(obj, ['FOTO_DATA_URL', 'DATA_URL', 'BASE64']);
    var hash = AUT_GET_(obj, ['HASH_FOTO']) || AUT_HASH_(url);
    var embed = '';
    if (oldDataUrl && /^data:image\//i.test(String(oldDataUrl))) {
      embed = oldDataUrl;
    } else {
      embed = AUT_BASE64_IMAGEM_CACHE_(url, 'FOTO_PDF_' + hash) || AUT_BASE64_IMAGEM_(url) || url;
    }

    out.push({
      id: AUT_GET_(obj, ['ID_FOTO']),
      ambiente: AUT_GET_(obj, ['AMBIENTE']),
      item: AUT_GET_(obj, ['ITEM']),
      nome: AUT_GET_(obj, ['NOME_ARQUIVO']),
      url: url,
      dataUrl: '',
      embed: embed,
      hash: hash
    });
  }

  return out;
}

function apiRepararLaudosAntigos() {
  try {
    garantirEstruturaDoSistema();
    var ss = AUT_SS_FAST_();
    var reparados = 0;
    AUT_REGISTRO_SHEETS_(ss).forEach(function(sh) {
      if (!sh || sh.getLastRow() < 2) return;
      var values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
      var headers = values[0];
      for (var r = 1; r < values.length; r++) {
        var achado = { sheet: sh, rowNumber: r + 1, row: values[r], rowObj: AUT_ROW_TO_OBJ_(headers, values[r]), headers: headers };
        var normal = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
        normal.PAYLOAD_JSON = JSON.stringify(AUT_PURGE_PAYLOAD_(AUT_PAYLOAD_(normal)));
        AUT_ATUALIZAR_ROW_OBJ_(sh, r + 1, normal);
        AUT_UPSERT_PROCESSO_LAUDO_(ss, normal);
        reparados++;
      }
    });
    AUT_INVALIDAR_CACHES_();
    return { sucesso: true, reparados: reparados, msg: reparados + ' laudo(s) reparado(s).' };
  } catch (e) {
    return { sucesso: false, reparados: 0, msg: 'Erro ao reparar laudos antigos: ' + e.message };
  }
}

/* =========================================================
   PATCH V5 FINAL REAL — LOGO + EDIÇÃO DE PROCESSOS
   ========================================================= */

function getConfiguracoesGlobais() {
  var cached = AUT_CACHE_GET_JSON_(AUT_CACHE_KEYS.CFG);
  if (cached && cached.cacheVersion === AUTENTIKO_PATCH_VERSION) return cached;

  try {
    garantirEstruturaDoSistema();

    var sh = AUT_SHEET_FAST_('CONFIGURACOES');
    var nome = AUT_GET_CELL_BY_HEADER_(sh, 2, ['NOME_SISTEMA'], 'LAUDO DE VISTORIA');
    var logoUiRaw = AUT_GET_PROP_('AUTENTIKO_LOGO_URL', AUT_GET_CELL_BY_HEADER_(sh, 2, ['AUTENTIKO_LOGO_URL', 'LOGO_AUTENTIKO'], AUTENTIKO_LOGO_FALLBACK));
    var logoLaudoRaw = AUT_GET_PROP_('LAUDO_LOGO_URL', AUT_GET_CELL_BY_HEADER_(sh, 2, ['LAUDO_LOGO_URL', 'PALMER_LOGO_URL', 'LOGO_BASE64'], PALMER_LAUDO_LOGO_OFICIAL));

    if (AUT_DEVE_SUBSTITUIR_LOGO_LAUDO_(logoLaudoRaw)) {
      logoLaudoRaw = PALMER_LAUDO_LOGO_OFICIAL;
      AUT_SET_CELL_BY_HEADER_(sh, 2, 'LAUDO_LOGO_URL', logoLaudoRaw);
    }

    var manut = AUT_GET_CELL_BY_HEADER_(sh, 2, ['MANUTENCAO'], 'FALSE');
    var site = AUT_GET_CELL_BY_HEADER_(sh, 2, ['SITE'], 'WWW.PALMERIMOVEIS.COM.BR');
    var endereco = AUT_GET_CELL_BY_HEADER_(sh, 2, ['ENDERECO'], 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000');
    var corretor = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CORRETOR'], 'RYCKY DE PALMER DIAS');
    var creci = AUT_GET_CELL_BY_HEADER_(sh, 2, ['CRECI'], '12.596');
    var subtitle = AUT_GET_CELL_BY_HEADER_(sh, 2, ['APP_SUBTITLE'], AUTENTIKO_APP_SUBTITLE_DEFAULT);

    var logoUiPublica = AUT_PUBLIC_URL_(logoUiRaw, 512);
    var logoLaudoPublica = AUT_PUBLIC_URL_(logoLaudoRaw, 1200) || PALMER_LAUDO_LOGO_OFICIAL;
    var logoUiBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoUiRaw, 'LOGO_UI_V5_REAL') || AUTENTIKO_LOGO_FALLBACK;
    var logoLaudoBase64 = AUT_IMAGEM_DATA_OU_VAZIO_(logoLaudoRaw, 'LOGO_LAUDO_V5_REAL') || AUT_PALMER_LOGO_SVG_DATA_();

    var cfg = {
      sucesso: true,
      cacheVersion: AUTENTIKO_PATCH_VERSION,
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
      palmerNome: 'PALMER IMÓVEIS',
      manutencao: (manut === true || String(manut).toUpperCase() === 'TRUE'),
      site: site,
      endereco: endereco,
      corretor: corretor,
      creci: creci
    };

    AUT_CACHE_PUT_JSON_(AUT_CACHE_KEYS.CFG, cfg, 600);
    return cfg;
  } catch (e) {
    return {
      sucesso: false,
      cacheVersion: AUTENTIKO_PATCH_VERSION,
      nome: 'LAUDO DE VISTORIA',
      appNome: 'AUTENTIKO-OK CHECK',
      logoBase64: AUTENTIKO_LOGO_FALLBACK,
      logoUiBase64: AUTENTIKO_LOGO_FALLBACK,
      logoLaudoRaw: PALMER_LAUDO_LOGO_OFICIAL,
      logoLaudoBase64: AUT_PALMER_LOGO_SVG_DATA_(),
      logoLaudoPublica: PALMER_LAUDO_LOGO_OFICIAL,
      manutencao: false,
      site: 'WWW.PALMERIMOVEIS.COM.BR',
      endereco: 'TV SÃO SEBASTIÃO, 1746, JOÃO PAULO II, SALINÓPOLIS-PA CEP: 68721000',
      corretor: 'RYCKY DE PALMER DIAS',
      creci: '12.596',
      msg: e.message
    };
  }
}

function apiObterLaudoParaEdicao(idLaudo) {
  try {
    garantirEstruturaDoSistema();
    if (!idLaudo) return { sucesso: false, ok: false, msg: 'ID do processo/laudo não informado.' };

    var ss = AUT_SS_FAST_();
    var achado = AUT_LOCALIZAR_LAUDO_(ss, idLaudo);
    if (!achado) achado = AUT_GARANTIR_REGISTRO_A_PARTIR_PROCESSO_V5_(ss, idLaudo);
    if (!achado) return { sucesso: false, ok: false, msg: 'Processo encontrado no painel, mas sem dados suficientes para edição.' };

    var payload = AUT_RECUPERAR_PAYLOAD_DE_ACHADO_(achado);
    var rowObj = AUT_NORMALIZAR_ROWOBJ_LAUDO_(achado);
    var idReal = rowObj.ID_LAUDO || idLaudo;
    var numero = rowObj.NUMERO_LAUDO || idLaudo;
    var fotos = AUT_FOTOS_LAUDO_LEVES_V5_(ss, idReal, numero);

    return {
      sucesso: true,
      ok: true,
      idLaudo: idReal,
      numeroLaudo: numero,
      payload: payload,
      rowObj: rowObj,
      fotos: fotos,
      modoEdicaoLeve: true
    };
  } catch (e) {
    return { sucesso: false, ok: false, msg: 'Erro ao abrir edição: ' + e.message, erro: e.message };
  }
}

function AUT_EXTRAIR_FOTOS_PAYLOAD_(dados) {
  var fotos = [];
  var visitados = [];
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
    if (!valor) return;
    if (typeof valor === 'string') {
      var s = valor.trim();
      if ((s.charAt(0) === '[' || s.charAt(0) === '{') && s.length < 200000) {
        try {
          andar(JSON.parse(s), caminho);
        } catch (eJson) {}
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
        var ambiente = ambienteDoCaminho(caminho, valor);
        var codigo = codigoDoCaminho(caminho, valor);
        fotos.push({
          id: valor.fotoId || valor.id || '',
          ambiente: ambiente,
          ambienteCodigo: codigo,
          item: valor.item || valor.tipoObservacao || 'Registro fotografico do ambiente',
          nome: valor.nome || valor.nomeArquivo || valor.name || 'foto_vistoria.jpg',
          mimeType: valor.mimeType || 'image/jpeg',
          url: url,
          dataUrl: dataUrl,
          hash: valor.hash || AUT_HASH_(url + dataUrl + fileId),
          fileId: fileId,
          thumbnailUrl: valor.thumbnailUrl || ''
        });
      }
      Object.keys(valor).forEach(function(k) {
        andar(valor[k], caminho ? caminho + '.' + k : k);
      });
    }
  }

  andar(dados, '');
  return fotos;
}
