/* ============================================================
   Soufiane EL RHADI — Portfolio Bar
   Self-contained bar injected at the bottom of every sub-project.
   Auto-computes the back URL from the current pathname.
   Just include with:
     <script src="<relative>/_shared/portfolio-bar.js" defer></script>
   ============================================================ */
(function () {
    'use strict';

    if (window.__sefPortfolioBarInjected) return;
    window.__sefPortfolioBarInjected = true;

    // Ne pas afficher le bandeau si la page est chargée dans une iframe
    // (cas des builders Mariage / WeddingSuite, prévisualisations Kartell, etc.)
    try {
        if (window.self !== window.top) return;
    } catch (_) {
        // iframe cross-origin : on s'abstient pour ne pas polluer le rendu
        return;
    }

    function inject() {
        // ---- Compute back URL : everything up to /projects/ + /index.html
        var path = window.location.pathname;
        var marker = '/projects/';
        var idx = path.indexOf(marker);
        var backUrl;
        if (idx >= 0) {
            backUrl = path.slice(0, idx) + '/index.html';
        } else {
            // Fallback : try to go up one level
            backUrl = '../index.html';
        }

        // Avoid injecting on the landing page itself
        if (path.endsWith('/index.html') && idx < 0) return;

        // ---- Style (scoped via .sef-pf-bar prefix)
        var css = ''
            + '.sef-pf-bar{'
            +   'position:fixed;bottom:24px;right:24px;z-index:2147483646;'
            +   'display:inline-flex;align-items:center;gap:8px;'
            +   'padding:10px 16px;'
            +   'background:rgba(0,0,0,0.4);color:rgba(255,255,255,0.7);'
            +   'font-family:"Outfit",system-ui,-apple-system,sans-serif;'
            +   'font-weight:600;font-size:12px;letter-spacing:0.4px;'
            +   'text-decoration:none;border-radius:100px;'
            +   'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'
            +   'box-shadow:0 8px 32px rgba(0,0,0,0.1);'
            +   'transition:all .3s cubic-bezier(.23,1,.32,1);'
            +   'border:1px solid rgba(255,255,255,0.1);'
            +   'text-transform:uppercase;'
            + '}'
            + '.sef-pf-bar:hover{background:rgba(0,0,0,0.8);color:#fff;transform:translateY(-2px);border-color:rgba(255,255,255,0.3);}'
            + '.sef-pf-bar svg{width:14px;height:14px;flex-shrink:0;transition:transform .3s;}'
            + '.sef-pf-bar:hover svg{transform:translateX(-3px);}'
            + '@media print{.sef-pf-bar{display:none !important;}}'
            + '@media (max-width:480px){.sef-pf-bar{bottom:16px;right:16px;font-size:11px;padding:8px 12px;}}'
            + '@media (prefers-reduced-motion:reduce){.sef-pf-bar,.sef-pf-bar:hover{transition:none;transform:none;}}';

        var styleTag = document.createElement('style');
        styleTag.setAttribute('data-sef-pf-bar', '');
        styleTag.textContent = css;
        document.head.appendChild(styleTag);

        // ---- DOM
        var a = document.createElement('a');
        a.className = 'sef-pf-bar';
        a.href = backUrl;
        a.setAttribute('aria-label', 'Retour au portfolio de Soufiane EL RHADI');
        a.title = 'Retour au portfolio';

        // arrow icon
        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2.5');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        var path1 = document.createElementNS(svgNS, 'path');
        path1.setAttribute('d', 'M19 12H5');
        var path2 = document.createElementNS(svgNS, 'path');
        path2.setAttribute('d', 'M12 19l-7-7 7-7');
        svg.appendChild(path1);
        svg.appendChild(path2);
        a.appendChild(svg);

        var label = document.createElement('span');
        label.textContent = 'Portfolio';
        a.appendChild(label);

        document.body.appendChild(a);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
