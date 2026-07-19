/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/saveSystem.js
 * -----------------------------------------------------------------------------
 * MULTI-SLOT SAVE SYSTEM (unlimited) + AUTO-SAVE.
 *
 * Persistence on localStorage. Each slot contains the COMPLETE and
 * SERIALIZABLE state of a career, so it can be restored 100%:
 *   - careerState (metadata + career progress)
 *   - teamsSnapshot (deep copy of ALL_TEAMS[champId] with all changes)
 *   - rngState (state of the random generator, for deterministic replays)
 *
 * Public API:
 *   listSaves()           -> array of metadata (for the slot list)
 *   createSave(name, data)-> creates slot, returns id
 *   loadSave(id)          -> returns the entire saved state (for careerManager.restore)
 *   updateSave(id, data)  -> overwrites an existing slot (used by autoSave)
 *   deleteSave(id)
 *   exportSave(id)        -> downloads a JSON file as backup
 *   importSave(jsonText)  -> imports a JSON backup as a new slot
 *
 * Everything is defensive: if localStorage is not available or full, it degrades
 * gracefully reporting the error without crashing the game.
 * ========================================================================== */

const SaveSystem = (() => {

    const STORAGE_KEY = "umm_saves_v1";
    const MAX_SAVES_SOFT_CAP = 200; // soft cap: above this it warns but doesn't block

    /* --- low-level localStorage access with in-memory fallback ---------- */
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

    /* --- read/write of the saves array ------------------------------------ */
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
            // QuotaExceededError: storage full
            console.error("SaveSystem: unable to write (storage full?).", e);
            return false;
        }
    }

    /* --- unique id utility ------------------------------------------------- */
    function _uid() {
        return "save_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
    }

    /* --- availability check for UI ---------------------------------------- */
    function isAvailable() {
        try {
            const k = "__umm_test__";
            store().setItem(k, "1");
            store().removeItem(k);
            return true;
        } catch (_) { return false; }
    }

    /* =============================================================================
     * PUBLIC API
     * ========================================================================== */

    /** Lists metadata of all slots, ordered by last update. */
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

    /** Creates a new slot. data = { careerState, teamsSnapshot, rngState }.
     *  Returns the slot id or null on failure. */
    function createSave(name, data) {
        const arr = _readAll();
        const id = _uid();
        const now = Date.now();
        const slot = {
            id, name: name || "Untitled career",
            createdAt: now, updatedAt: now,
            data: _cloneData(data),
        };
        arr.push(slot);
        if (!_writeAll(arr)) return null;
        return id;
    }

    /** Updates an existing slot (auto-save). Returns true/false. */
    function updateSave(id, data) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return false;
        slot.data = _cloneData(data);
        slot.updatedAt = Date.now();
        return _writeAll(arr);
    }

    /** Reads the entire state of a slot (for careerManager.restore). */
    function loadSave(id) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return null;
        return slot.data;
    }

    /** Deletes a slot. */
    function deleteSave(id) {
        const arr = _readAll().filter(s => s.id !== id);
        return _writeAll(arr);
    }

    /** Renames a slot. */
    function renameSave(id, newName) {
        const arr = _readAll();
        const slot = arr.find(s => s.id === id);
        if (!slot) return false;
        slot.name = newName;
        slot.updatedAt = Date.now();
        return _writeAll(arr);
    }

    /** Exports a slot as a downloaded JSON file (manual backup). */
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

    /** Imports a JSON backup as a new slot. Returns id or null. */
    function importSave(jsonText) {
        try {
            const slot = JSON.parse(jsonText);
            if (!slot.data || !slot.data.careerState) throw new Error("Invalid format");
            // regenerate id/timestamps to avoid collisions
            const arr = _readAll();
            const newId = _uid();
            const now = Date.now();
            arr.push({
                id: newId,
                name: (slot.name || "Imported career") + " (import)",
                createdAt: slot.createdAt || now,
                updatedAt: now,
                data: slot.data,
            });
            if (!_writeAll(arr)) return null;
            return newId;
        } catch (e) {
            console.error("SaveSystem: import failed.", e);
            return null;
        }
    }

    /** Returns the number of occupied slots (for soft cap warning). */
    function countSaves() { return _readAll().length; }

    /* --- safe state cloning (deep, serializable) ------------------------- */
    function _cloneData(data) {
        // JSON round-trip: discards functions/references, leaves only data.
        return JSON.parse(JSON.stringify(data));
    }

    /* --- module export ---------------------------------------------------- */
    return {
        isAvailable, listSaves, createSave, updateSave, loadSave,
        deleteSave, renameSave, exportSave, importSave, countSaves,
    };
})();

/* Global exposure */
if (typeof window !== "undefined") window.SaveSystem = SaveSystem;
if (typeof module !== "undefined" && module.exports) module.exports = { SaveSystem };