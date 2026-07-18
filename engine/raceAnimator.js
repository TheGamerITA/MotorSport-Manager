/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/raceAnimator.js
 * -----------------------------------------------------------------------------
 * ANIMATORE GARA — interpola le timeline generate dal RaceCalculator.
 * Prende i dati statici della simulazione e li rende fluidi per il Canvas.
 * ========================================================================== */

class RaceAnimator {
    constructor() {
        this.timelines = []; // Dati grezzi da engine.simulateEvent()
        this.raceType = "CircuitRace";
        this.durationMs = 0; // Durata totale gara per sincronizzare la fine
        this.currentTimeMs = 0;
        this.speed = 1; // Moltiplicatore di velocità (1x, 2x, 5x)
        this.isPlaying = false;
        this.animationFrameId = null;
        this.lastTimestamp = null;
        this.onUpdateCallback = null;
    }

    /** Carica i risultati di una simulazione e li prepara per l'animazione */
    loadEventData(eventData) {
        this.timelines = eventData.timelines || [];
        this.raceType = eventData.raceType;

        // Costruisce l'insieme dei piloti ritirati (DNF) dalla classifica
        // finale: è l'unico modo affidabile per distinguere un DNF (timeline
        // troncata a metà gara) da un pilota semplicemente veloce (finisce
        // prima degli altri ma ha completato tutti i giri).
        this.dnfDriverIds = new Set();
        if (Array.isArray(eventData.results)) {
            for (const r of eventData.results) {
                if (r.position === "DNF" || r.timeStr === "DNF") {
                    this.dnfDriverIds.add(r.driverId);
                }
            }
        }
        
        // Calcola la durata trovando il tempo massimo di chi ha finito
        this.durationMs = 0;
        for (const t of this.timelines) {
            if (t.timeline.length > 0) {
                const lastT = t.timeline[t.timeline.length - 1].t;
                if (lastT > this.durationMs && lastT !== Infinity) {
                    this.durationMs = lastT;
                }
            }
        }
        this.currentTimeMs = 0;
        this.speed = 1;
    }

    /** Avvia il loop di animazione */
    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.lastTimestamp = performance.now();
        this._loop();
    }

    /** Mette in pausa */
    pause() {
        this.isPlaying = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    /** Resetta al via */
    reset() {
        this.pause();
        this.currentTimeMs = 0;
        if (this.onUpdateCallback) this.onUpdateCallback(this.getState());
    }

    /** Imposta la velocità di riproduzione */
    setSpeed(s) { this.speed = s; }

    /** Registra chi vuole ricevere gli aggiornamenti posizione (il Renderer) */
    onUpdate(fn) { this.onUpdateCallback = fn; }

    /** Loop interno requestAnimationFrame */
    _loop() {
        if (!this.isPlaying) return;
        
        const now = performance.now();
        const deltaMs = (now - this.lastTimestamp) * this.speed; // Moltiplica per la velocità
        this.lastTimestamp = now;

        this.currentTimeMs += deltaMs;

        // Ferma la simulazione alla fine della gara
        if (this.currentTimeMs >= this.durationMs) {
            this.currentTimeMs = this.durationMs;
            this.isPlaying = false;
        }

        // Calcola le posizioni attuali e notifica il renderer
        if (this.onUpdateCallback) {
            this.onUpdateCallback(this.getState());
        }

        if (this.isPlaying) {
            this.animationFrameId = requestAnimationFrame(() => this._loop());
        }
    }

    /** Estrae le coordinate (progress) attuali per ogni pilota */
    getState() {
        const state = {
            currentTimeMs: this.currentTimeMs,
            durationMs: this.durationMs,
            isFinished: !this.isPlaying && this.currentTimeMs >= this.durationMs,
            drivers: []
        };

        for (const driverData of this.timelines) {
            const tl = driverData.timeline;
            if (tl.length === 0) continue;

            let currentProgress = 0;
            let lap = 1;

            // Trova l'ultimo punto della timeline precedente a currentTimeMs
            let i = 0;
            while (i < tl.length - 1 && tl[i + 1].t <= this.currentTimeMs) {
                i++;
            }

            const currentPoint = tl[i];
            const nextPoint = tl[i + 1];

            if (nextPoint) {
                // Interpolazione lineare tra due punti della timeline
                const segmentDuration = nextPoint.t - currentPoint.t;
                const segmentProgress = segmentDuration > 0 
                    ? (this.currentTimeMs - currentPoint.t) / segmentDuration 
                    : 0;
                
                // Interpola il progress (gestisce sia giri che SS lineari)
                currentProgress = currentPoint.progress + (nextPoint.progress - currentPoint.progress) * segmentProgress;
            } else {
                currentProgress = currentPoint.progress;
            }

            // Per le gare su pista, il progress è cumulativo (1, 2, 3...). 
            // Per il canvas ci serve solo la posizione nel giro attuale (0..1)
            let trackProgress = currentProgress;
            if (this.raceType === "CircuitRace" || this.raceType === "EnduranceRace") {
                lap = Math.floor(currentProgress);
                trackProgress = currentProgress % 1; // Da 0 a 1 dentro il giro
                if (trackProgress < 0) trackProgress += 1; // Corregge partenza
            }

            // Determina se il pilota è ritirato (DNF) consultando l'insieme
            // costruito in loadEventData dalla classifica finale.
            const isDNF = this.dnfDriverIds && this.dnfDriverIds.has(driverData.driverId);

            // Per i DNF: congela il pilota nell'ultima posizione nota della
            // sua timeline (dove si è ritirato), così il renderer può mostrarlo
            // come un punto grigio fermo sul tracciato invece di farlo sparire.
            let finalProgress = trackProgress;
            if (isDNF) {
                const last = tl[tl.length - 1];
                if (this.raceType === "CircuitRace" || this.raceType === "EnduranceRace") {
                    finalProgress = (last.progress % 1 + 1) % 1;
                } else {
                    finalProgress = last.progress;
                }
            }

            state.drivers.push({
                id: driverData.driverId,
                name: driverData.driver,
                teamId: driverData.teamId,
                color: driverData.color,
                trackProgress: finalProgress,
                lap: lap,
                finished: !isDNF,
                dnf: isDNF
            });
        }

        return state;
    }
}

// Esposizione globale
if (typeof window !== "undefined") window.RaceAnimator = RaceAnimator;
if (typeof module !== "undefined" && module.exports) module.exports = { RaceAnimator };