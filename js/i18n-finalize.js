// i18n-finalize.js
// Last-resort initializer to ensure translations are applied after all other scripts
(function(){
    const runTranslate = () => {
        try {
            if (window.languageManager && typeof window.languageManager.translatePage === 'function') {
                console.debug('i18n-finalize: running translatePage');
                window.languageManager.translatePage();
                window.languageManager.updateLanguageSwitcherUI && window.languageManager.updateLanguageSwitcherUI();
            }
        } catch (err) {
            console.warn('i18n-finalize: translatePage failed', err);
        }
    };

    function scheduleRetries() {
        const delays = [50, 200, 500, 1000, 2000];
        delays.forEach(d => setTimeout(runTranslate, d));
    }

    // Run after load
    if (document.readyState === 'complete') {
        setTimeout(() => { runTranslate(); scheduleRetries(); }, 20);
    } else {
        window.addEventListener('load', () => { setTimeout(() => { runTranslate(); scheduleRetries(); }, 20); });
    }

    // Also respond to languageChanged events
    document.addEventListener('languageChanged', () => {
        setTimeout(runTranslate, 20);
        setTimeout(runTranslate, 200);
    });

    // Also small observer to catch late DOM insertions
    if ('MutationObserver' in window) {
        const obs = new MutationObserver((mutations) => {
            let seen = false;
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) { seen = true; break; }
            }
            if (seen) {
                setTimeout(runTranslate, 30);
            }
        });
        obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }
})();


