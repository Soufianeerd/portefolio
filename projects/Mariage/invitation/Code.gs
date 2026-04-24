// ═══════════════════════════════════════════════════════════════
//  FAIRE-PART DIGITAL — Soufiane & Salma
//  Google Apps Script · RSVP Handler
//
//  Ce script reçoit les réponses du formulaire RSVP,
//  les enregistre dans Google Sheets et envoie une
//  notification email à l'organisateur.
//
//  DÉPLOIEMENT : Extensions → Apps Script → Déployer →
//                Nouveau déploiement → Application Web
//                → Exécuter en tant que : Moi
//                → Qui peut accéder : Tout le monde
// ═══════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
//  CONFIG — à modifier si nécessaire
// ──────────────────────────────────────────────────────────────
const CONFIG = {
  OWNER_EMAIL:  'soufiane.erd@gmail.com',
  OWNER_NAME:   'Soufiane',
  SHEET_NAME:   'RSVP Invités',
  WEDDING_DATE: 'Vendredi 23 Octobre 2026',
  COUPLE:       'Soufiane & Salma',
  RSVP_LIMIT:   '1er Septembre 2026'
};

// Colonnes du tableau (ordre strict)
const COLS = {
  TIMESTAMP:    0,   // A
  NOM:          1,   // B
  EMAIL:        2,   // C
  PRESENCE:     3,   // D
  NB_PERSONNES: 4,   // E
  ALLERGIES:    5,   // F
  MESSAGE:      6    // G
};

const HEADERS = [
  '⏱ Date & Heure',
  '👤 Nom & Prénom',
  '📧 Email',
  '✅ Présence',
  '👥 Nb. Personnes',
  '🥗 Allergies',
  '💬 Message'
];


// ──────────────────────────────────────────────────────────────
//  POINT D'ENTRÉE — reçoit les requêtes POST du formulaire
// ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    // Récupère ou crée la feuille RSVP
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(ss);

    // Ajoute la ligne de réponse
    const row = buildRow_(data);
    sheet.appendRow(row);

    // Mise en forme de la nouvelle ligne
    styleLastRow_(sheet);

    // Envoie la notification email à Soufiane
    sendOwnerNotification_(data, sheet);

    // Envoie un email de confirmation à l'invité (si email renseigné)
    if (data.email && data.email.trim() !== '') {
      sendGuestConfirmation_(data);
    }

    // Réponse de succès
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Erreur RSVP : ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permet de tester l'URL via GET (optionnel)
function doGet() {
  return ContentService
    .createTextOutput('✅ RSVP Script actif — ' + CONFIG.COUPLE)
    .setMimeType(ContentService.MimeType.TEXT);
}


// ──────────────────────────────────────────────────────────────
//  SHEET — Création / récupération avec mise en forme
// ──────────────────────────────────────────────────────────────
function getOrCreateSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    initSheetHeaders_(sheet);
  }
  return sheet;
}

function initSheetHeaders_(sheet) {
  // En-têtes
  sheet.appendRow(HEADERS);

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground('#5D262C');
  headerRange.setFontColor('#F9F7F2');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment('center');

  // Fige la ligne d'en-tête
  sheet.setFrozenRows(1);

  // Largeurs de colonnes
  sheet.setColumnWidth(1, 170); // Date
  sheet.setColumnWidth(2, 180); // Nom
  sheet.setColumnWidth(3, 200); // Email
  sheet.setColumnWidth(4, 120); // Présence
  sheet.setColumnWidth(5, 100); // Nb personnes
  sheet.setColumnWidth(6, 200); // Allergies
  sheet.setColumnWidth(7, 260); // Message
}

function buildRow_(data) {
  const presence    = data.attendance === 'oui' ? '✅ Présent(e)' : '❌ Absent(e)';
  const nbPersonnes = data.attendance === 'oui' ? (data.guests || '1') : '—';

  return [
    new Date(),
    (data.name       || '').trim(),
    (data.email      || '').trim().toLowerCase(),
    presence,
    nbPersonnes,
    (data.allergies  || 'Aucune').trim(),
    (data.message    || '').trim()
  ];
}

function styleLastRow_(sheet) {
  const lastRow = sheet.getLastRow();
  const range   = sheet.getRange(lastRow, 1, 1, HEADERS.length);

  // Alternance de couleurs
  const bgColor = (lastRow % 2 === 0) ? '#F9F7F2' : '#F0EBE3';
  range.setBackground(bgColor);
  range.setVerticalAlignment('middle');
  range.setFontSize(11);

  // Hauteur de ligne
  sheet.setRowHeight(lastRow, 36);
}


// ──────────────────────────────────────────────────────────────
//  EMAIL DE NOTIFICATION — Envoyé à soufiane.erd@gmail.com
// ──────────────────────────────────────────────────────────────
function sendOwnerNotification_(newRsvp, sheet) {
  // Récupère toutes les données (sans l'en-tête)
  const allData    = sheet.getDataRange().getValues();
  const responses  = allData.slice(1).filter(r => r[COLS.NOM] !== '');

  const confirmes  = responses.filter(r => String(r[COLS.PRESENCE]).includes('Présent'));
  const absents    = responses.filter(r => String(r[COLS.PRESENCE]).includes('Absent'));
  const totalPers  = confirmes.reduce((sum, r) => {
    const n = parseInt(r[COLS.NB_PERSONNES]);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const sheetUrl   = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const isPresent  = newRsvp.attendance === 'oui';
  const emoji      = isPresent ? '✅' : '❌';
  const subject    = `${emoji} RSVP · ${newRsvp.name} — ${isPresent ? 'Présent(e)' : 'Absent(e)'} · ${CONFIG.COUPLE}`;

  // ── Ligne récapitulative des confirmés ──────────────────────
  const confirmeRows = confirmes.map(r => `
    <tr>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;color:#2d1214;">${esc_(String(r[COLS.NOM]))}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;color:#5d7a8a;">${esc_(String(r[COLS.EMAIL] || '—'))}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;text-align:center;color:#2d1214;">${esc_(String(r[COLS.NB_PERSONNES]))}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;color:#7a6060;">${esc_(String(r[COLS.ALLERGIES] || '—'))}</td>
    </tr>`).join('');

  const absentRows = absents.map(r => `
    <tr>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;color:#2d1214;">${esc_(String(r[COLS.NOM]))}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;color:#5d7a8a;">${esc_(String(r[COLS.EMAIL] || '—'))}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EBE3;font-family:sans-serif;font-size:12px;color:#7a6060;">${esc_(String(r[COLS.MESSAGE] || '—'))}</td>
    </tr>`).join('');

  // ── Corps HTML de l'email ───────────────────────────────────
  const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2EDE5;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EDE5;padding:40px 20px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border:1px solid #e0d8ce;">

    <!-- ── HEADER ── -->
    <tr>
      <td style="background:#5D262C;text-align:center;padding:36px 30px;">
        <p style="margin:0 0 6px;font-family:sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(249,247,242,0.55);">Faire-part digital</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:#F9F7F2;letter-spacing:0.04em;">${esc_(CONFIG.COUPLE)}</h1>
        <p style="margin:10px 0 0;font-family:sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(249,247,242,0.5);">${esc_(CONFIG.WEDDING_DATE)}</p>
      </td>
    </tr>

    <!-- ── NOUVELLE RÉPONSE ── -->
    <tr>
      <td style="padding:36px 40px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${isPresent ? '#f0e8e8' : '#f2f2f2'};border-left:3px solid ${isPresent ? '#5D262C' : '#999'};margin-bottom:28px;">
          <tr><td style="padding:22px 24px;">
            <p style="margin:0 0 14px;font-family:sans-serif;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.22em;color:${isPresent ? '#5D262C' : '#666'};">
              ${emoji} Nouvelle réponse RSVP
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:4px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;min-width:110px;">Nom</td>
                  <td style="padding:4px 0;font-family:Georgia,serif;font-size:15px;color:#2d1214;">${esc_(newRsvp.name || '')}</td></tr>
              <tr><td style="padding:4px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;">Email</td>
                  <td style="padding:4px 0;font-family:sans-serif;font-size:13px;color:#5d7a8a;">${esc_(newRsvp.email || '—')}</td></tr>
              <tr><td style="padding:4px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;">Présence</td>
                  <td style="padding:4px 0;font-family:sans-serif;font-size:13px;font-weight:600;color:${isPresent ? '#3a7a3a' : '#c0392b'};">${isPresent ? '✅ Présent(e)' : '❌ Absent(e)'}</td></tr>
              ${isPresent ? `<tr><td style="padding:4px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;">Personnes</td>
                  <td style="padding:4px 0;font-family:sans-serif;font-size:13px;color:#2d1214;">${esc_(newRsvp.guests || '1')}</td></tr>` : ''}
              ${newRsvp.allergies ? `<tr><td style="padding:4px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;">Allergies</td>
                  <td style="padding:4px 0;font-family:sans-serif;font-size:13px;color:#2d1214;">${esc_(newRsvp.allergies)}</td></tr>` : ''}
              ${newRsvp.message ? `<tr><td style="padding:4px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;vertical-align:top;">Message</td>
                  <td style="padding:4px 0;font-family:Georgia,serif;font-size:13px;font-style:italic;color:#5D262C;">"${esc_(newRsvp.message)}"</td></tr>` : ''}
            </table>
          </td></tr>
        </table>

        <!-- ── STATISTIQUES ── -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td width="33%" style="text-align:center;padding:18px 8px;background:#eaf4ea;border-radius:4px;">
              <span style="display:block;font-family:Georgia,serif;font-size:32px;font-weight:300;color:#2d7a2d;">${confirmes.length}</span>
              <span style="display:block;font-family:sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#6aaa6a;margin-top:4px;">Confirmés</span>
            </td>
            <td width="4%"></td>
            <td width="30%" style="text-align:center;padding:18px 8px;background:#e8eef2;border-radius:4px;">
              <span style="display:block;font-family:Georgia,serif;font-size:32px;font-weight:300;color:#3a6080;">${totalPers}</span>
              <span style="display:block;font-family:sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#7a9ab0;margin-top:4px;">Personnes</span>
            </td>
            <td width="4%"></td>
            <td width="29%" style="text-align:center;padding:18px 8px;background:#fce8e8;border-radius:4px;">
              <span style="display:block;font-family:Georgia,serif;font-size:32px;font-weight:300;color:#c0392b;">${absents.length}</span>
              <span style="display:block;font-family:sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#e07070;margin-top:4px;">Absents</span>
            </td>
          </tr>
        </table>

        <!-- ── BOUTON GOOGLE SHEET ── -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr>
            <td align="center">
              <a href="${sheetUrl}" style="display:inline-block;background:#5D262C;color:#F9F7F2;padding:13px 28px;text-decoration:none;font-family:sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;border-radius:2px;">
                Voir le Google Sheet complet →
              </a>
            </td>
          </tr>
        </table>

        ${confirmes.length > 0 ? `
        <!-- ── LISTE CONFIRMÉS ── -->
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.22em;color:#5D262C;">
          ✅ Confirmés — ${totalPers} personne${totalPers > 1 ? 's' : ''}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e8e0d8;">
          <tr style="background:#5D262C;">
            <th style="padding:9px 12px;text-align:left;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#F9F7F2;">Nom</th>
            <th style="padding:9px 12px;text-align:left;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#F9F7F2;">Email</th>
            <th style="padding:9px 12px;text-align:center;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#F9F7F2;">Pers.</th>
            <th style="padding:9px 12px;text-align:left;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#F9F7F2;">Allergies</th>
          </tr>
          ${confirmeRows}
        </table>` : ''}

        ${absents.length > 0 ? `
        <!-- ── LISTE ABSENTS ── -->
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.22em;color:#888;">
          ❌ Absents — ${absents.length} réponse${absents.length > 1 ? 's' : ''}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e0d8;">
          <tr style="background:#999;">
            <th style="padding:9px 12px;text-align:left;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Nom</th>
            <th style="padding:9px 12px;text-align:left;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Email</th>
            <th style="padding:9px 12px;text-align:left;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Message</th>
          </tr>
          ${absentRows}
        </table>` : ''}
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="background:#2d1214;text-align:center;padding:20px 30px;">
        <p style="margin:0;font-family:sans-serif;font-size:10px;letter-spacing:0.15em;color:rgba(249,247,242,0.4);">
          ${esc_(CONFIG.COUPLE)} · 23 · 10 · 2026 · Notification automatique RSVP
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  MailApp.sendEmail({
    to:       CONFIG.OWNER_EMAIL,
    subject:  subject,
    htmlBody: htmlBody,
    name:     'Faire-part ' + CONFIG.COUPLE
  });
}


// ──────────────────────────────────────────────────────────────
//  EMAIL DE CONFIRMATION — Envoyé à l'invité
// ──────────────────────────────────────────────────────────────
function sendGuestConfirmation_(data) {
  try {
    const isPresent = data.attendance === 'oui';
    const guestName = (data.name || 'cher(e) invité(e)').split(' ')[0]; // prénom seulement

    const subject = isPresent
      ? `✅ Votre présence est confirmée — ${CONFIG.COUPLE}`
      : `Merci pour votre réponse — ${CONFIG.COUPLE}`;

    const htmlBody = isPresent ? `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2EDE5;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EDE5;padding:40px 20px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e0d8ce;">

    <!-- HEADER -->
    <tr>
      <td style="background:#5D262C;text-align:center;padding:40px 30px;">
        <p style="margin:0 0 8px;font-family:sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(249,247,242,0.55);">Mariage</p>
        <h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:28px;font-weight:normal;color:#F9F7F2;letter-spacing:0.05em;">${esc_(CONFIG.COUPLE)}</h1>
        <p style="margin:0;font-family:sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(249,247,242,0.5);">${esc_(CONFIG.WEDDING_DATE)}</p>
      </td>
    </tr>

    <!-- CORPS -->
    <tr>
      <td style="padding:44px 40px 36px;text-align:center;">
        <p style="margin:0 0 6px;font-family:sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#9a7c7e;">Confirmation de présence</p>
        <h2 style="margin:0 0 24px;font-family:Georgia,serif;font-size:24px;font-weight:normal;font-style:italic;color:#5D262C;">
          Quelle joie, ${esc_(guestName)}&nbsp;!
        </h2>

        <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:15px;font-weight:normal;color:#5a3a3a;line-height:1.8;">
          Votre présence à notre mariage est confirmée.<br>
          Nous avons hâte de vous retrouver en ce jour si précieux.
        </p>

        <!-- Récap -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F2;border:1px solid rgba(93,38,44,0.1);margin-bottom:32px;">
          <tr><td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:7px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9a7c7e;width:110px;">Date</td>
                <td style="padding:7px 0;font-family:Georgia,serif;font-size:14px;color:#2d1214;">${esc_(CONFIG.WEDDING_DATE)}</td>
              </tr>
              <tr>
                <td style="padding:7px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9a7c7e;">Cérémonie</td>
                <td style="padding:7px 0;font-family:Georgia,serif;font-size:14px;color:#2d1214;">15h00 · Mairie de Toul<br><span style="font-family:sans-serif;font-size:11px;color:#9a7c7e;">13 Rue de Rigny, 54200 Toul</span></td>
              </tr>
              <tr>
                <td style="padding:7px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9a7c7e;">Réception</td>
                <td style="padding:7px 0;font-family:Georgia,serif;font-size:14px;color:#2d1214;">19h00 · Domaine de Camélia<br><span style="font-family:sans-serif;font-size:11px;color:#9a7c7e;">1 bis Rte de Briey, 57160 Châtel-Saint-Germain</span></td>
              </tr>
              ${data.guests ? `<tr>
                <td style="padding:7px 0;font-family:sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9a7c7e;">Personnes</td>
                <td style="padding:7px 0;font-family:Georgia,serif;font-size:14px;color:#2d1214;">${esc_(data.guests)} personne${parseInt(data.guests) > 1 ? 's' : ''}</td>
              </tr>` : ''}
            </table>
          </td></tr>
        </table>

        <p style="margin:0 0 32px;font-family:Georgia,serif;font-size:13px;font-style:italic;color:#9a7c7e;line-height:1.8;">
          Tenue de soirée recommandée.<br>
          Pour toute question, contactez-nous à <a href="mailto:soufiane.erd@gmail.com" style="color:#5D262C;">${esc_(CONFIG.OWNER_EMAIL)}</a>
        </p>

        <!-- Séparateur -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="height:1px;background:rgba(93,38,44,0.1);"></td>
            <td style="width:24px;text-align:center;font-size:10px;color:rgba(93,38,44,0.3);padding:0 8px;">✦</td>
            <td style="height:1px;background:rgba(93,38,44,0.1);"></td>
          </tr>
        </table>

        <p style="margin:0;font-family:Georgia,serif;font-size:20px;font-weight:normal;font-style:italic;color:#5D262C;">
          À très bientôt,<br>
          <span style="font-size:16px;">${esc_(CONFIG.COUPLE)}</span>
        </p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#2d1214;text-align:center;padding:18px 30px;">
        <p style="margin:0;font-family:sans-serif;font-size:10px;letter-spacing:0.15em;color:rgba(249,247,242,0.35);">
          ${esc_(CONFIG.COUPLE)} · 23 · 10 · 2026
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>` : `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2EDE5;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EDE5;padding:40px 20px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e0d8ce;">
    <tr>
      <td style="background:#5D262C;text-align:center;padding:40px 30px;">
        <h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:28px;font-weight:normal;color:#F9F7F2;">${esc_(CONFIG.COUPLE)}</h1>
        <p style="margin:0;font-family:sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(249,247,242,0.5);">${esc_(CONFIG.WEDDING_DATE)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:44px 40px;text-align:center;">
        <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:22px;font-weight:normal;font-style:italic;color:#7a6060;">
          Merci, ${esc_(guestName)}.
        </h2>
        <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;color:#7a6060;line-height:1.8;">
          Nous avons bien reçu votre réponse.<br>
          Vous nous manquerez ce jour-là, mais vous serez dans nos pensées.
        </p>
        <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:#5D262C;">
          ${esc_(CONFIG.COUPLE)}
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#2d1214;text-align:center;padding:16px 30px;">
        <p style="margin:0;font-family:sans-serif;font-size:10px;letter-spacing:0.15em;color:rgba(249,247,242,0.35);">
          ${esc_(CONFIG.COUPLE)} · 23 · 10 · 2026
        </p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`;

    MailApp.sendEmail({
      to:       data.email.trim().toLowerCase(),
      subject:  subject,
      htmlBody: htmlBody,
      name:     CONFIG.COUPLE + ' 💒'
    });

  } catch (err) {
    // Ne pas bloquer l'enregistrement si le mail échoue
    Logger.log('⚠️ Erreur mail invité (non bloquant) : ' + err.toString());
  }
}


// ──────────────────────────────────────────────────────────────
//  UTILITAIRES
// ──────────────────────────────────────────────────────────────
function esc_(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}


// ──────────────────────────────────────────────────────────────
//  FONCTION DE TEST — exécutez-la manuellement pour vérifier
// ──────────────────────────────────────────────────────────────
function testRSVP() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        name:       'Marie Dupont',
        email:      'marie.dupont@test.com',
        attendance: 'oui',
        guests:     '2',
        allergies:  'Sans gluten',
        message:    'Très heureux d\'être là !'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
