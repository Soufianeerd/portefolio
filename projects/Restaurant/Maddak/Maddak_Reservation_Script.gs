/**
 * ══════════════════════════════════════════════════════════════════
 * GOOGLE APPS SCRIPT — MADDAK RESERVATION
 * ══════════════════════════════════════════════════════════════════
 * Instructions :
 * 1. Créez un nouveau Google Sheet.
 * 2. Allez dans Extensions > Apps Script.
 * 3. Copiez ce code et remplacez tout le contenu de Code.gs.
 * 4. Cliquez sur "Déployer" > "Nouveau déploiement".
 * 5. Type : "Application Web".
 * 6. Exécuter en tant que : "Moi".
 * 7. Qui a accès : "Tout le monde" (indispensable pour fetch).
 * 8. Copiez l'URL de déploiement dans votre fichier reservation.js.
 * ══════════════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    // 1. Récupération des données envoyées par le site
    var data = JSON.parse(e.postData.contents);
    
    // 2. Accès à la feuille de calcul (Feuille 1 par défaut)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // 3. Préparation de la ligne à ajouter (Ordre des colonnes)
    // Timestamp | Date | Heure | Personnes | Prénom | Nom | Téléphone | Commentaire
    var row = [
      new Date(),       // Date d'envoi de la demande
      data.date,        // Date de réservation
      data.time,        // Heure
      data.persons,     // Nb personnes
      data.firstName,   // Prénom
      data.lastName,    // Nom
      data.phone,       // Téléphone
      data.comment      // Message
    ];
    
    // 4. Ajout de la ligne à la fin de la feuille
    sheet.appendRow(row);
    
    // 5. Réponse de succès (Utile pour le frontend)
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Réservation enregistrée avec succès."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    // Gestion des erreurs
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optionnel : Script pour créer les en-têtes automatiquement
 * Exécutez cette fonction une seule fois dans l'éditeur Apps Script
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var headers = [
    "Timestamp (Envoi)", 
    "Date Réservation", 
    "Heure", 
    "Nombre de Personnes", 
    "Prénom", 
    "Nom", 
    "Téléphone", 
    "Commentaire"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1); // Fige la première ligne
}
