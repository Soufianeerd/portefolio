/**
 * EVORIA — LOGIQUE MÉTIER & GÉNÉRATION DYNAMIQUE
 */

document.addEventListener('DOMContentLoaded', () => {
    const seal = document.getElementById('introBtn');
    const screen = document.getElementById('introScreen');
    const main = document.getElementById('mainContent');

    if (seal && screen && main) {
        seal.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            seal.style.opacity = '0';
            seal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                screen.classList.add('open');
                document.body.classList.remove('locked');
                
                setTimeout(() => {
                    main.classList.add('revealed');
                }, 400);
                
                setTimeout(() => {
                    screen.style.display = 'none';
                }, 2500); 
            }, 300);
        });
    }

    window.onload = () => window.scrollTo(0, 0);

    // --- LOGIQUE COMPTE À REBOURS ET CALENDRIER DYNAMIQUE ---
    let targetDate = new Date('June 12, 2027 15:00:00');
    let countdownInterval;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            const el = document.getElementById('countdown');
            if(el) el.innerHTML = "C'est le grand jour !";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');
        
        if (dEl) dEl.innerText = days.toString().padStart(2, '0');
        if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
        if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
        if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
    };

    const generateMiniCalendar = (date) => {
        const grid = document.querySelector('.calendar-grid');
        const header = document.querySelector('.calendar-header');
        if (!grid || !header) return;

        const months = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        header.innerText = `${months[month]} ${year}`;

        grid.innerHTML = `
            <div class="day-name">Lu</div><div class="day-name">Ma</div><div class="day-name">Me</div>
            <div class="day-name">Je</div><div class="day-name">Ve</div><div class="day-name">Sa</div><div class="day-name">Di</div>
        `;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let startOffset = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < startOffset; i++) {
            grid.innerHTML += `<div></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            if (i === day) {
                grid.innerHTML += `<div class="special-day">${i}</div>`;
            } else {
                grid.innerHTML += `<div>${i}</div>`;
            }
        }
    };

    const initTimers = () => {
        clearInterval(countdownInterval);
        generateMiniCalendar(targetDate);
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    };

    // Attempt to load date from state
    const stateStr = localStorage.getItem('evoria_state');
    if (stateStr) {
        try {
            const s = JSON.parse(stateStr);
            if (s.texts.dateObj) {
                const parsedDate = new Date(s.texts.dateObj + "T15:00:00");
                if (!isNaN(parsedDate)) targetDate = parsedDate;
            }
        } catch (e) {}
    }

    initTimers();

    window.addEventListener('evoria:date-changed', (e) => {
        const newDate = new Date(e.detail.getTime());
        newDate.setHours(15, 0, 0);
        targetDate = newDate;
        initTimers();
    });

    const smartCalBtn = document.getElementById('smartCalendarBtn');
    if (smartCalBtn) {
        smartCalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            let s = stateStr ? JSON.parse(stateStr) : { texts: {} };
            const eventTitle = "Mariage de " + (s.texts.coupleNames || "Élise & Gabriel").replace(/<[^>]*>?/gm, '');
            const eventDateStr = s.texts.dateObj ? s.texts.dateObj.replace(/-/g, '') : "20270612";
            
            const event = {
                title: eventTitle,
                description: "Cérémonie civile suivie de la réception.",
                location: "Adresse de l'événement",
                start: eventDateStr + "T130000Z",
                end: eventDateStr + "T230000Z"
            };

            const escapeICS = (str) => str.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, '\\n');
            const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
            
            if (isApple) {
                const icsContent = [
                    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Evoria//Wedding//FR", "METHOD:PUBLISH", "BEGIN:VEVENT",
                    `DTSTART:${event.start}`, `DTEND:${event.end}`,
                    `SUMMARY:${escapeICS(event.title)}`, `DESCRIPTION:${escapeICS(event.description)}`, `LOCATION:${escapeICS(event.location)}`,
                    "END:VEVENT", "END:VCALENDAR"
                ].join("\r\n");

                const icsData = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
                window.location.href = icsData;
            } else {
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
                window.location.href = googleUrl;
            }
        });
    }
});
