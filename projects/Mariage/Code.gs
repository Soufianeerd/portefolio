const CONFIG = {
  OWNER_EMAIL:  'votre-email@exemple.com', // Remplacer par votre email en production (inutile en mode portfolio)
  SHEET_NAME:   'RSVP Invités',
  DEMO_SHEET:   'RSVP Demo Evoria',
  COUPLE:       'Élise & Gabriel' // Remplacer par vos prénoms
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Détection du mode Démo Portfolio depuis le payload envoyé par index.html
    const isDemo = data.demoMode === true;
    const targetSheetName = isDemo ? CONFIG.DEMO_SHEET : CONFIG.SHEET_NAME;
    
    let sheet = ss.getSheetByName(targetSheetName) || ss.insertSheet(targetSheetName);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Nom', 'Email', 'Presence', 'Allergies', 'Message', 'Mode Demo']);
    }

    const presenceTxt = data.attendance === 'oui' ? '✅ Présent(e)' : '❌ Absent(e)';

    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      presenceTxt,
      data.allergies || 'Aucune',
      data.message || '',
      isDemo ? 'OUI' : 'NON'
    ]);

    // Envoi des emails en Mode Démo
    if (isDemo && data.demoEmail) {
      const demoEmail = data.demoEmail;
      
      // 1. Email "Vue Mariés" (envoyé au testeur sur son email démo)
      const subjectMaries = `[DÉMO EVORIA] Nouveau RSVP reçu de ${data.name}`;
      const bodyMaries = `Bonjour (Ceci est la Vue Mariés),\n\nVous avez reçu une nouvelle réponse RSVP sur votre faire-part Evoria.\n\n` +
                         `Détails :\n` +
                         `- Nom : ${data.name}\n` +
                         `- Email : ${data.email}\n` +
                         `- Présence : ${presenceTxt}\n` +
                         `- Allergies : ${data.allergies || 'Aucune'}\n` +
                         `- Message : ${data.message || '/'}\n\n` +
                         `Ceci est un email de démonstration généré depuis le portfolio Evoria.`;
                         
      MailApp.sendEmail(demoEmail, subjectMaries, bodyMaries);

      // 2. Email "Vue Invité" (envoyé au testeur sur son email démo)
      const subjectInvite = `[DÉMO EVORIA] Confirmation de votre RSVP - Mariage de ${CONFIG.COUPLE}`;
      const bodyInvite = `Bonjour ${data.name} (Ceci est la Vue Invité),\n\n` +
                         `Nous avons bien enregistré votre réponse pour notre mariage.\n` +
                         `Votre statut : ${presenceTxt}\n\n` +
                         `Nous avons hâte de célébrer ce moment avec vous !\n\n` +
                         `${CONFIG.COUPLE}\n\n` +
                         `---\nCeci est un email de démonstration généré depuis le portfolio Evoria.`;
                         
      MailApp.sendEmail(demoEmail, subjectInvite, bodyInvite);
    } else if (!isDemo && CONFIG.OWNER_EMAIL !== 'votre-email@exemple.com') {
      // Envoi réel en production aux mariés
      const subject = `Nouveau RSVP : ${data.name}`;
      const body = `${data.name} a répondu : ${presenceTxt}\nMessage : ${data.message}`;
      MailApp.sendEmail(CONFIG.OWNER_EMAIL, subject, body);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
