const CONFIG = {
  OWNER_EMAIL:  'kamil.erd@gmail.com',
  SHEET_NAME:   'RSVP Julien & Amandine',
  COUPLE:       'Julien & Amandine'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Nom', 'Email', 'Presence', 'Allergies', 'Message']);
    }

    const presenceStr = (data.attendance === 'oui' ? '✅ Présent(e)' : '❌ Absent(e)');
    const allergiesStr = data.allergies || 'Aucune';
    const messageStr = data.message || '';

    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      presenceStr,
      allergiesStr,
      messageStr
    ]);

    // Envoi de la notification par email avec récapitulatif
    sendNotification(data.name, data.email, presenceStr, allergiesStr, messageStr, sheet);

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotification(name, email, presence, allergies, message, sheet) {
  try {
    // Calcul des statistiques récapitulatives
    const rows = sheet.getDataRange().getValues();
    let totalPresents = 0;
    let totalAbsents = 0;
    
    // Ignorer la ligne d'en-tête (index 0)
    for (let i = 1; i < rows.length; i++) {
      const pres = rows[i][3]; // Colonne D : Presence
      if (pres && pres.indexOf('✅') !== -1) {
        totalPresents++;
      } else if (pres && pres.indexOf('❌') !== -1) {
        totalAbsents++;
      }
    }
    const totalResponses = totalPresents + totalAbsents;

    const subject = `✨ Nouveau RSVP : ${name} (${presence.indexOf('✅') !== -1 ? 'Présent' : 'Absent'})`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- En-tête -->
        <div style="background-color: #0E3D26; color: #FAF7F2; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-family: 'Georgia', serif; font-size: 22px;">Mariage de ${CONFIG.COUPLE}</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Nouvelle réponse RSVP reçue !</p>
        </div>
        
        <!-- Contenu -->
        <div style="padding: 24px; background-color: #F5F2EB; color: #0A2216;">
          <h3 style="color: #0E3D26; border-bottom: 1px solid #D4AF37; padding-bottom: 8px; margin-top: 0;">Détails de l'invité</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Nom :</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email :</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0E3D26; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Présence :</td>
              <td style="padding: 8px 0; font-weight: bold; color: ${presence.includes('✅') ? '#2e7d32' : '#c62828'};">${presence}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Allergies :</td>
              <td style="padding: 8px 0; font-style: italic;">${allergies}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message :</td>
              <td style="padding: 8px 0; white-space: pre-wrap; background-color: rgba(255,255,255,0.5); padding: 8px; border-radius: 4px;">${message || '<i>Aucun message particulier.</i>'}</td>
            </tr>
          </table>
          
          <h3 style="color: #0E3D26; border-bottom: 1px solid #D4AF37; padding-bottom: 8px;">Tableau Récapitulatif</h3>
          <table style="width: 100%; border-collapse: collapse; text-align: center; background-color: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background-color: #E5DFD3; color: #0E3D26; font-weight: bold;">
                <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">Statut</th>
                <th style="padding: 12px; border: 1px solid #e2e8f0;">Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold; color: #2e7d32;">✅ Présents</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 16px; font-weight: bold;">${totalPresents}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-weight: bold; color: #c62828;">❌ Absents</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 16px; font-weight: bold;">${totalAbsents}</td>
              </tr>
              <tr style="background-color: #FAF7F2; font-weight: bold;">
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">Total Réponses</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 16px;">${totalResponses}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pied de page -->
        <div style="background-color: #E5DFD3; color: #6D8E79; padding: 15px; text-align: center; font-size: 12px;">
          Faire-part de mariage Julien & Amandine — Généré automatiquement
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: CONFIG.OWNER_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Erreur lors de l'envoi de l'email : " + err.message);
  }
}

// Fonction de test permettant d'exécuter et d'autoriser le script dans Apps Script
function testRSVP() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: "Jean Dupont (Test)",
        email: "jean.dupont.test@example.com",
        attendance: "oui",
        allergies: "Aucune",
        message: "Félicitations pour votre mariage ! Nous serons ravis d'être là."
      })
    }
  };
  
  const response = doPost(testData);
  Logger.log("Réponse du test : " + response.getContent());
}
