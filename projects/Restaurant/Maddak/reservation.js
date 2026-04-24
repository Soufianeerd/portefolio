/**
 * ══════════════════════════════════════════════════════════════════
 * FICHIER : reservation.js
 * RÔLE    : Logique du widget de réservation Maddak
 * FONCTIONS : 
 *   - Gestion de l'ouverture/fermeture de la modale
 *   - Restriction des dates (pas de dates passées)
 *   - Génération dynamique des créneaux horaires (Midi/Soir)
 *   - Envoi des données vers Google Apps Script
 * ══════════════════════════════════════════════════════════════════
 */

// ── CONFIGURATION ──
// REMPLACE CETTE URL PAR TON URL DE WEB APP GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec"; 

document.addEventListener('DOMContentLoaded', () => {
    
    // ── ÉLÉMENTS UI ──
    const modal = document.getElementById('reservationModal');
    const triggers = document.querySelectorAll('.btn-reserver-trigger');
    const closeBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
    const form = document.getElementById('reservationForm');
    const successScreen = document.getElementById('resSuccess');
    const dateInput = document.getElementById('resDate');
    const momentBtns = document.querySelectorAll('.pill-btn');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const resTimeInput = document.getElementById('resTime');
    const submitBtn = document.getElementById('submitRes');
    const statusMsg = document.getElementById('resMessage');

    // ── INITIALISATION DATE ──
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;

    // ── GESTION MODALE ──
    const openModal = (e) => {
        if(e) e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        generateSlots('midi'); // Par défaut
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        // Reset form après fermeture si succès affiché
        setTimeout(() => {
            form.style.display = 'flex';
            successScreen.style.display = 'none';
            form.reset();
            dateInput.value = today;
            statusMsg.textContent = '';
        }, 400);
    };

    triggers.forEach(btn => btn.addEventListener('click', openModal));
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Fermer si clic à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ── GESTION DES CRÉNEAUX ──
    const slots = {
        midi: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"],
        soir: ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"]
    };

    function generateSlots(moment) {
        timeSlotsContainer.innerHTML = '';
        resTimeInput.value = '';
        
        slots[moment].forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'slot-btn';
            btn.textContent = time;
            
            // Logique de désactivation si date = aujourd'hui et heure passée
            const now = new Date();
            const selectedDate = new Date(dateInput.value);
            if (selectedDate.toDateString() === now.toDateString()) {
                const [h, m] = time.split(':');
                if (parseInt(h) < now.getHours() || (parseInt(h) === now.getHours() && parseInt(m) <= now.getMinutes())) {
                    btn.disabled = true;
                }
            }

            btn.onclick = () => {
                document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                resTimeInput.value = time;
                checkFormValidity();
            };
            timeSlotsContainer.appendChild(btn);
        });
        checkFormValidity();
    }

    momentBtns.forEach(btn => {
        btn.onclick = () => {
            momentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            generateSlots(btn.dataset.moment);
        };
    });

    dateInput.onchange = () => {
        const activeMoment = document.querySelector('.pill-btn.active').dataset.moment;
        generateSlots(activeMoment);
    };

    // ── VALIDATION ──
    function checkFormValidity() {
        const isFilled = form.checkValidity() && resTimeInput.value !== '';
        submitBtn.disabled = !isFilled;
    }

    form.addEventListener('input', checkFormValidity);

    // ── ENVOI FORMULAIRE ──
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        if (submitBtn.disabled) return;

        submitBtn.disabled = true;
        statusMsg.className = 'res-status-msg loading';
        statusMsg.textContent = 'Envoi de votre demande...';

        const formData = {
            date: dateInput.value,
            persons: document.getElementById('resPersons').value,
            time: resTimeInput.value,
            firstName: document.getElementById('resFirstName').value,
            lastName: document.getElementById('resLastName').value,
            phone: document.getElementById('resPhone').value,
            comment: document.getElementById('resComment').value
        };

        try {
            // Utilisation de fetch mode 'no-cors' si Apps Script pose problème, 
            // mais 'cors' est préférable si le script est bien configuré.
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Apps Script Web App en POST ne renvoie souvent pas de headers CORS corrects sans bibliothèque
                cache: "no-cache",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            // Note: avec no-cors, on ne peut pas lire le status JSON. 
            // On assume le succès si fetch ne throw pas.
            showSuccess();

        } catch (error) {
            console.error("Erreur de réservation:", error);
            statusMsg.className = 'res-status-msg error';
            statusMsg.textContent = "Oops ! Une erreur est survenue. Réessayez ou appelez-nous.";
            submitBtn.disabled = false;
        }
    };

    function showSuccess() {
        form.style.display = 'none';
        successScreen.style.display = 'block';
        statusMsg.textContent = '';
    }
});
