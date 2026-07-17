/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/screenManager.js
 * -----------------------------------------------------------------------------
 * SCREEN MANAGER — gestisce la navigazione tra le schermate principali.
 * ========================================================================== */

const ScreenManager = (() => {

    const screens = {}; // Registro delle schermate { id: { onShow: fn } }

    /** Registra una schermata con il suo id e le callback opzionali */
    function register(id, screenObj) {
        if (!id) console.error("ScreenManager: id mancante nella registrazione");
        screens[id] = screenObj || {};
    }

    /** Mostra la schermata specificata e ne esegue la callback onShow */
    function show(id) {
        // Nascondi tutte le schermate
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        
        // Trova e mostra la schermata richiesta
        const el = document.getElementById(`screen-${id}`);
        if (el) {
            el.classList.add('active');
        } else {
            console.error(`ScreenManager: schermata 'screen-${id}' non trovata nel DOM`);
            return;
        }

        // Esegui la callback onShow se registrata
        if (screens[id] && typeof screens[id].onShow === 'function') {
            screens[id].onShow();
        }
    }

    return { register, show };
})();

if (typeof window !== "undefined") window.ScreenManager = ScreenManager;