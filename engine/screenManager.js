/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/screenManager.js
 * -----------------------------------------------------------------------------
 * SCREEN MANAGER — manages navigation between the main screens.
 * ========================================================================== */

const ScreenManager = (() => {

    const screens = {}; // Registry of screens { id: { onShow: fn } }

    /** Registers a screen with its id and optional callbacks */
    function register(id, screenObj) {
        if (!id) console.error("ScreenManager: id missing in registration");
        screens[id] = screenObj || {};
    }

    /** Shows the specified screen and runs its onShow callback */
    function show(id) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

        // Find and show the requested screen
        const el = document.getElementById(`screen-${id}`);
        if (el) {
            el.classList.add('active');
        } else {
            console.error(`ScreenManager: screen 'screen-${id}' not found in DOM`);
            return;
        }

        // Run the onShow callback if registered
        if (screens[id] && typeof screens[id].onShow === 'function') {
            screens[id].onShow();
        }
    }

    return { register, show };
})();

if (typeof window !== "undefined") window.ScreenManager = ScreenManager;