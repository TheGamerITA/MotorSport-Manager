/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/saveSystem.js
 * -----------------------------------------------------------------------------
 * SISTEMA DI SALVATAGGIO MULTI-SLOT (illimitati) + AUTO-SAVE.
 *
 * Persistenza su localStorage. Ogni slot contiene lo STATO COMPLETO e
 * SERIALIZZABILE di una carriera, così può essere ripristinato al 100%:
 *   - careerState (metadati + avanzamento carriera)
 *   - teamsSnapshot (deep copy di ALL_TEAMS[champId] con tutte le modifiche)
 *   - rngState (stato del generatore casuali, per replay deterministici)
 *
 * API pubblica:
 *   listSaves()           -> array di metadati (per la lista slot)
 *   createSave(name, data)-> crea slot, ritorna id
 *   loadSave(id)          -> ritorna l'intero stato salvato (per careerManager.restore)
 *   updateSave(id, data)  -> sovrascrive uno slot esistente (usato da autoSave)
 *   deleteSave(id)
 *   autoSave()            -> aggiorna lo slot "corrente" della carriera attiva
 *   exportSave(id)        -> scarica un file JSON come backup
 *   importSave(jsonText)  -> importa un backup JSON come nuovo slot
 *
 * Tutto è defensivo: se localStorage non è disponibile o pieno, degrada
 * gracefully segnalando l'errore senza crashare il gioco.
 * ========================================================================== */

const SaveSystem = (() => {

    const STORAGE_KEY = "umm_saves_v1";
    const MAX_SAVES_SOFT_CAP = 200; // soft cap: oltre avvisa ma non blocca

    /* --- accesso low-level a localStorage con fallback in memoria ---------- */
    const memoryFallback = {};
    function store() {
        try {
            if (typeof localStorage !== "undefined" && localStorage) return localStorage;
        } catch (_) { /* access blocked */ }
        return {
            getItem: k => memoryFallback[k] ?? null,
            setItem: (k, v) => { memoryFallback[k] = v; },
            removeItem: k => { delete memoryFallback[k]; },
        };
    }

    /* --- lettura/scrittura dell'array salvataggi -------------------------- */
    function _readAll() {
        try {
            const raw = store().getItem(STORAGE_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            console.error("SaveSystem: corrupted saves store, resetting.", e);
            return [];
        }
    }
    function _writeAll(arr) {
        try {
            store().setItem(STORAGE_KEY, JSON.stringify(arr));
            return true;
        } catch (e) {
            // QuotaExceededError: storage pieno
            console.error("SaveSystem: impossibile scrivere (storage pieno?).", e);
            return false;
        }
    }

    /* --- utility id univoco ----------------------------------------------- */
    function _uid() {
        return "save_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
    }

    /* --- availability check per UI ---------------------------------------- */
    function isAvailable() {
        try {
            const k = "__umm_test__";
            store().setItem(k, "1");
            store().removeItem(k);
            return true;
        } catch (_) { return false; }
    }

    /* =============================================================================
     * API PUBBLICA
     * ========================================================================== */

    /** Lista metadati di tutti gli slot, ordinati per ultimo aggiornamento. */
    function listSaves() {
        return _readAll()
            .map(s => ({
                id: s.id,
                name: s.name,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                season: s.data?.careerState?.season ?? 1,
                champId: s.data?.careerState?.champId ?? "?",
                champName: s.data?.careerState?.champName ?? "?",
                round: s.data?.careerState?.currentRound ?? 0,
                totalRounds: s.data?.careerState?.totalRounds ?? 0,
                playerTeamName: s.data?.careerState?.playerTeamName ?? "?",
            }))
            .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }

    /** Crea un nuovo slot. data = { careerState, teamsSnapshot, rngState }.
     *  Ritorna l'id dello slot o null in caso di fallimento. */
    function createSave(name, data) {
        const arr = _readAll();
        const id = _uid();
        const now = Date.now();
        const slot = {
            id, name: name || "Carriera senza nome",
            createdAt: now, updatedAt: now,
            data: _cloneData(data),
        };
        arr.push(slot);
        if (!_writeAll(arr)) return null;
        return id;
    }

    /** Aggiorna uno slot esistente (auto-save). Ritorna true/false. */
    function updateSave(id, data) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return false;
        slot.data = _cloneData(data);
        slot.updatedAt = Date.now();
        return _writeAll(arr);
    }

    /** Legge l'intero stato di uno slot (per careerManager.restore). */
    function loadSave(id) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return null;
        return slot.data;
    }

    /** Elimina uno slot. */
    function deleteSave(id) {
        const arr = _readAll().filter(s => s.id !== id);
        return _writeAll(arr);
    }

    /** Rinomina uno slot. */
    function renameSave(id, newName) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return false;
        slot.name = newName;
        slot.updatedAt = Date.now();
        return _writeAll(arr);
    }

    /** Esporta uno slot come file JSON scaricato (backup manuale). */
    function exportSave(id) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return false;
        const blob = new Blob([JSON.stringify(slot, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slot.name.replace(/[^\w\-]+/g, "_")}_${slot.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
    }

    /** Importa un backup JSON come nuovo slot. Ritorna id o null. */
    function importSave(jsonText) {
        try {
            const slot = JSON.parse(jsonText);
            if (!slot.data || !slot.data.careerState) throw new Error("Formato non valido");
            // rigenera id/timestamps per evitare collisioni
            const arr = _readAll();
            const newId = _uid();
            const now = Date.now();
            arr.push({
                id: newId,
                name: (slot.name || "Carriera importata") + " (import)",
                createdAt: slot.createdAt || now,
                updatedAt: now,
                data: slot.data,
            });
            if (!_writeAll(arr)) return null;
            return newId;
        } catch (e) {
            console.error("SaveSystem: import fallito.", e);
            return null;
        }
    }

    /** Restituisce il numero di slot occupati (per warning soft cap). */
    function countSaves() { return _readAll().length; }

    /* --- clonazione sicura dello stato (deep, serializzabile) ------------- */
    function _cloneData(data) {
        // JSON round-trip: scarta funzioni/riferimenti, lascia solo dati.
        return JSON.parse(JSON.stringify(data));
    }

    /* --- export per modulo ------------------------------------------------ */
    return {
        isAvailable, listSaves, createSave, updateSave, loadSave,
        deleteSave, renameSave, exportSave, importSave, countSaves,
    };
})();

/* Esposizione globale */
if (typeof window !== "undefined") window.SaveSystem = SaveSystem;
if (typeof module !== "undefined" && module.exports) module.exports = { SaveSystem };
