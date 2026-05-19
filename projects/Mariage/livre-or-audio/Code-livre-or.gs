/**
 * ═══════════════════════════════════════════════════════
 *  LIVRE D'OR AUDIO — Google Apps Script
 *  Soufiane & Salma · 23 Octobre 2026
 * ═══════════════════════════════════════════════════════
 *
 *  Ce script reçoit les messages audio envoyés par les invités,
 *  les sauvegarde dans un dossier Google Drive et enregistre
 *  chaque entrée dans un Google Sheet (comme les RSVP).
 *
 *  ── INSTALLATION (5 minutes) ─────────────────────────
 *
 *  1. Aller sur script.google.com → Nouveau projet
 *  2. Renommer le projet en "Livre d'Or Audio - Mariage S&S"
 *  3. Copier-coller ce code dans l'éditeur
 *  4. Remplir les constantes [EDIT] ci-dessous
 *  5. Cliquer sur ▶ Exécuter → authoriser les permissions
 *     (Drive + Sheets)
 *  6. Déployer → Nouvelle déploiement → Application Web
 *     - Exécuter en tant que : Moi
 *     - Accès : N'importe qui
 *  7. Copier l'URL de déploiement
 *  8. La coller dans index.html → CONFIG.API_URL
 *
 * ═══════════════════════════════════════════════════════
 */

// ── CONFIGURATION ──────────────────────────────────────

// [EDIT] Nom du dossier Google Drive où stocker les audios.
// S'il n'existe pas, il sera créé automatiquement dans votre Drive.
const DRIVE_FOLDER_NAME = "Livre d'Or Audio — Mariage S&S 🎙️";

// [EDIT] ID du Google Sheet pour le registre des messages.
// Trouvez l'ID dans l'URL de votre Sheet :
//   https://docs.google.com/spreadsheets/d/ >>> ID_ICI <<< /edit
// Laissez '' pour désactiver l'enregistrement dans le Sheet.
const SHEET_ID = '';  // ← Collez l'ID ici

// [EDIT] Nom de l'onglet dans le Google Sheet
const SHEET_TAB_NAME = 'Messages Audio';

// ── RÉCEPTION DES MESSAGES (doPost) ───────────────────

/**
 * Point d'entrée : reçoit la requête POST du frontend.
 * Décode l'audio base64 et le sauvegarde dans Drive + Sheet.
 */
function doPost(e) {
  try {
    // Parser le JSON envoyé par le frontend
    const data = JSON.parse(e.postData.contents);

    const audioBase64 = data.audio;      // fichier audio en base64
    const mimeType    = data.mimeType || 'audio/webm';
    const filename    = sanitizeFilename(data.filename || (Date.now() + '_message.webm'));
    const guestName   = data.name     || 'Anonyme';
    const relation    = data.relation || '';
    const duration    = data.duration || 0;

    // 1. Décoder le base64 → bytes binaires
    const audioBytes = Utilities.base64Decode(audioBase64);

    // 2. Créer le blob audio
    const audioBlob = Utilities.newBlob(audioBytes, mimeType, filename);

    // 3. Récupérer (ou créer) le dossier Drive
    const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);

    // 4. Sauvegarder le fichier dans Drive
    const file    = folder.createFile(audioBlob);
    const fileUrl = file.getUrl();
    const fileId  = file.getId();

    // 5. Logger dans Google Sheet (si SHEET_ID est renseigné)
    if (SHEET_ID && SHEET_ID.trim() !== '') {
      logToSheet(guestName, relation, duration, filename, fileUrl, fileId);
    }

    // 6. Réponse de succès
    return buildResponse({ success: true, filename: filename, fileId: fileId });

  } catch (err) {
    Logger.log('❌ Erreur doPost : ' + err.toString());
    return buildResponse({ success: false, error: err.message });
  }
}

// ── FONCTIONS UTILITAIRES ──────────────────────────────

/**
 * Récupère le dossier Drive par son nom.
 * Le crée s'il n'existe pas encore.
 */
function getOrCreateFolder(name) {
  const existing = DriveApp.getFoldersByName(name);
  if (existing.hasNext()) {
    return existing.next();
  }
  const newFolder = DriveApp.createFolder(name);
  Logger.log('📁 Dossier créé : ' + name + ' (' + newFolder.getId() + ')');
  return newFolder;
}

/**
 * Ajoute une ligne dans le Google Sheet.
 * Crée l'onglet avec les en-têtes s'il n'existe pas.
 */
function logToSheet(name, relation, duration, filename, fileUrl, fileId) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_TAB_NAME);

    // Créer l'onglet s'il n'existe pas
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_TAB_NAME);

      // En-têtes de colonnes
      const headers = ['Date & Heure', 'Prénom', 'Relation', 'Durée (s)', 'Fichier', 'Lien Drive', 'ID Fichier'];
      sheet.appendRow(headers);

      // Mise en forme des en-têtes
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#5D262C');
      headerRange.setFontColor('#F9F7F2');
      sheet.setFrozenRows(1);

      // Largeurs de colonnes
      sheet.setColumnWidth(1, 160); // Date
      sheet.setColumnWidth(2, 120); // Prénom
      sheet.setColumnWidth(3, 180); // Relation
      sheet.setColumnWidth(4, 80);  // Durée
      sheet.setColumnWidth(5, 220); // Fichier
      sheet.setColumnWidth(6, 60);  // Lien
      sheet.setColumnWidth(7, 160); // ID

      Logger.log('✅ Onglet "' + SHEET_TAB_NAME + '" créé dans le Sheet.');
    }

    // Ajouter la ligne de données
    sheet.appendRow([
      new Date(),                          // Date & Heure
      name,                                // Prénom
      relation,                            // Relation (optionnel)
      Number(duration),                    // Durée en secondes
      filename,                            // Nom du fichier
      fileUrl ? '=HYPERLINK("' + fileUrl + '","▶ Écouter")' : '',  // Lien cliquable
      fileId                               // ID Drive (pour téléchargement)
    ]);

    Logger.log('✅ Enregistré dans le Sheet : ' + name + ' — ' + filename);

  } catch (err) {
    // Ne pas bloquer l'envoi si le Sheet échoue
    Logger.log('⚠️ Erreur Sheet (non bloquant) : ' + err.toString());
  }
}

/**
 * Nettoyer le nom de fichier pour éviter les caractères dangereux.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .slice(0, 120);
}

/**
 * Construire la réponse JSON avec les headers CORS.
 */
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── TEST & DIAGNOSTIC ──────────────────────────────────

/**
 * doGet : tester que le déploiement fonctionne.
 * Ouvrez l'URL de déploiement dans un navigateur → vous devez voir "✅ OK"
 */
function doGet() {
  const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
  const count  = countFilesInFolder(folder);

  return ContentService
    .createTextOutput(
      '✅ Livre d\'Or Audio — Script opérationnel\n' +
      'Dossier Drive : ' + DRIVE_FOLDER_NAME + '\n' +
      'Fichiers audios reçus : ' + count + '\n' +
      'Sheet configuré : ' + (SHEET_ID ? 'Oui (' + SHEET_ID + ')' : 'Non')
    )
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Compter les fichiers audio dans le dossier Drive.
 * (Pratique pour vérifier après le mariage)
 */
function countFilesInFolder(folder) {
  let count = 0;
  const files = folder.getFiles();
  while (files.hasNext()) { files.next(); count++; }
  return count;
}

/**
 * ── BONUS : Fonction pour récupérer tous les audios ──
 *
 * Après le mariage, exécutez cette fonction dans Apps Script
 * pour obtenir la liste complète de tous les messages reçus.
 * Le résultat s'affiche dans Affichage → Journaux d'exécution.
 */
function listerTousLesAudios() {
  const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
  const files  = folder.getFiles();
  let   total  = 0;

  Logger.log('═══════════════════════════════════════');
  Logger.log('  LIVRE D\'OR AUDIO — Messages reçus');
  Logger.log('═══════════════════════════════════════');

  while (files.hasNext()) {
    const f = files.next();
    total++;
    Logger.log(
      total + '. ' + f.getName() +
      ' | ' + (f.getSize() / 1024).toFixed(0) + ' Ko' +
      ' | ' + f.getDateCreated().toLocaleString('fr-FR') +
      ' | ' + f.getUrl()
    );
  }

  Logger.log('───────────────────────────────────────');
  Logger.log('Total : ' + total + ' message(s)');
  Logger.log('═══════════════════════════════════════');
}
