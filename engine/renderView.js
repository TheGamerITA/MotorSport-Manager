/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: ui/renderView.js (VERSIONE WAYPOINTS)
 * ----------------------------------------------------------------------------- */

const RenderView = (() => {
    let canvas, ctx;
    let animator;
    let currentRaceData = null;
    let trackPath = []; // Cache dei punti calcolati della pista

    const COLORS = {
        track: '#555555',
        trackBorder: '#333333',
        grass: '#1a2e1a',
        line: '#FFFFFF'
    };

    function init(canvasId) {
        canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn("Canvas non trovato, RenderView disattivato.");
            return;
        }
        ctx = canvas.getContext('2d');
        
        // Verifica che RaceAnimator esista
        if (typeof RaceAnimator === 'undefined') {
            console.error("RaceAnimator non caricato!");
            return;
        }
        
        animator = new RaceAnimator();
        animator.onUpdate((state) => draw(state));
        
        const btnPlay = document.getElementById('btn-play');
        const btnPause = document.getElementById('btn-pause');
        const btnReset = document.getElementById('btn-reset');
        const btnSpeed = document.getElementById('btn-speed');

        if(btnPlay) btnPlay.addEventListener('click', () => animator.play());
        if(btnPause) btnPause.addEventListener('click', () => animator.pause());
        if(btnReset) btnReset.addEventListener('click', () => animator.reset());
        if(btnSpeed) btnSpeed.addEventListener('click', toggleSpeed);
    }

    function loadAndPlay(eventResult) {
        if (!ctx) return; // Se il canvas non è inizializzato, esce
        currentRaceData = eventResult;
        trackPath = []; // Resetta percorso
        animator.loadEventData(eventResult);
        
        // Pre-calcola il percorso del tracciato se ci sono i waypoint
        if (currentRaceData.track && currentRaceData.track.waypoints) {
            trackPath = buildPath(currentRaceData.track);
        }
        
        draw(animator.getState());
        animator.play();
    }

    let speedLevels = [1, 2, 5, 15];
    let currentSpeedIdx = 0;
    function toggleSpeed() {
        currentSpeedIdx = (currentSpeedIdx + 1) % speedLevels.length;
        animator.setSpeed(speedLevels[currentSpeedIdx]);
        const btn = document.getElementById('btn-speed');
        if(btn) btn.innerText = `Velocità: ${speedLevels[currentSpeedIdx]}x`;
    }

    /* Converte i waypoint 0..1000 in pixel del canvas */
    function buildPath(track) {
        const w = canvas.width;
        const h = canvas.height;
        const padding = 40;
        const usableW = w - padding * 2;
        const usableH = h - padding * 2;
        
        let pts = track.waypoints.map(p => ({
            x: padding + (p[0] / 1000) * usableW,
            y: padding + (p[1] / 1000) * usableH
        }));

        if (track.type === "closed") {
            pts.push({ ...pts[0] }); 
        }
        return pts;
    }

    /* Ottieni le coordinate X,Y in base al progress (0..1) */
    function getPositionOnPath(progress) {
        if (trackPath.length < 2) return { x: 0, y: 0 };
        
        let exactIndex = progress * (trackPath.length - 1);
        let index = Math.floor(exactIndex);
        let fraction = exactIndex - index;
        
        if (index >= trackPath.length - 1) return trackPath[trackPath.length - 1];

        let p1 = trackPath[index];
        let p2 = trackPath[index + 1];

        return {
            x: p1.x + (p2.x - p1.x) * fraction,
            y: p1.y + (p2.y - p1.y) * fraction
        };
    }

    function draw(state) {
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(0, 0, w, h);

        if (!currentRaceData) return;

        const isCircuit = trackPath.length > 0;

        if (isCircuit) {
            drawTrackFromWaypoints();
        } else {
            drawLinearTrack(w, h);
        }

        if (!state || !state.drivers) return;

        // Disegna piloti
        for (const d of state.drivers) {
            let pos;
            if (isCircuit) {
                pos = getPositionOnPath(d.trackProgress);
            } else {
                pos = getLinearCoords(d.trackProgress, w, h);
            }

            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath(); ctx.arc(pos.x+2, pos.y+2, 7, 0, Math.PI*2); ctx.fill();

            ctx.fillStyle = d.color || '#FFFFFF';
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 7, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#FFF'; ctx.lineWidth = 1.5; ctx.stroke();
            
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(d.name, pos.x, pos.y - 12);
        }

        // HUD
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(10, h - 40, 250, 30);
        ctx.fillStyle = '#00d4ff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Tempo: ${formatTime(state.currentTimeMs)} / ${formatTime(state.durationMs)}`, 20, h - 20);
    }

    function drawTrackFromWaypoints() {
        if (trackPath.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(trackPath[0].x, trackPath[0].y);
        for (let i = 1; i < trackPath.length; i++) {
            ctx.lineTo(trackPath[i].x, trackPath[i].y);
        }
        ctx.lineWidth = 42;
        ctx.strokeStyle = COLORS.trackBorder;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(trackPath[0].x, trackPath[0].y);
        for (let i = 1; i < trackPath.length; i++) {
            ctx.lineTo(trackPath[i].x, trackPath[i].y);
        }
        ctx.lineWidth = 36;
        ctx.strokeStyle = COLORS.track;
        ctx.stroke();

        if (trackPath.length > 10) {
            ctx.beginPath();
            ctx.moveTo(trackPath[0].x, trackPath[0].y - 15);
            ctx.lineTo(trackPath[0].x, trackPath[0].y + 15);
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    function drawLinearTrack(w, h) {
        const padding = 50;
        ctx.fillStyle = COLORS.track;
        ctx.fillRect(padding, h/2 - 20, w - padding*2, 40);
        ctx.strokeStyle = COLORS.trackBorder; ctx.lineWidth = 2;
        ctx.strokeRect(padding, h/2 - 20, w - padding*2, 40);
    }

    function getLinearCoords(progress, w, h) {
        const padding = 50;
        const wave = Math.sin(progress * Math.PI * 8) * 40; 
        return {
            x: padding + (w - padding*2) * progress,
            y: h/2 + wave
        };
    }

    function formatTime(ms) {
        if (!ms || !isFinite(ms)) return "0:00.000";
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const milli = Math.floor(ms % 1000);
        return `${m}:${s.toString().padStart(2,'0')}.${milli.toString().padStart(3,'0')}`;
    }

    return { init, loadAndPlay };
})();

if (typeof window !== "undefined") window.RenderView = RenderView;