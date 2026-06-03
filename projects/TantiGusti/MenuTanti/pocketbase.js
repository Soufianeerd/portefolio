/* ============================================================
   TANTI GUSTI II — POCKETBASE CONFIG
   Fichier : pocketbase.js
   ============================================================ */

try {
    if (typeof PocketBase === 'undefined') {
        console.error("❌ SDK PocketBase introuvable. Vérifiez l'import dans le HTML.");
    } else {
        const pb = new PocketBase('http://127.0.0.1:8090');
        pb.autoCancellation(false);
        window.pb = pb;
        console.log("✅ PocketBase initialisé sur http://127.0.0.1:8090");
    }
} catch (e) {
    console.error("❌ Erreur lors de l'initialisation de PocketBase:", e);
}
