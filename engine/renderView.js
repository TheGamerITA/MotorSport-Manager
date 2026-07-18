/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: ui/renderView.js (WAYPOINTS VERSION)
 * ----------------------------------------------------------------------------- */

const RenderView = (() => {
    let canvas, ctx;
    let animator;
    let currentRaceData = null;
    let trackPath = []; // Cache of the calculated track points

    const COLORS = {
        track: '#555555',
        trackBorder: '#333333',
        grass: '#1a2e1a',
        line: '#FFFFFF'
    };

    function init(canvasId) {
        canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn("Canvas not found, RenderView disabled.");
            return;
        }
        ctx = canvas.getContext('2d');
        
        // Check that RaceAnimator exists
        if (typeof RaceAnimator === 'undefined') {
            console.error("RaceAnimator not loaded!");
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
        if (!ctx) return; // If canvas is not initialized, exit
        currentRaceData = eventResult;
        trackPath = []; // Reset path
        animator.loadEventData(eventResult);
        
        // Pre-compute the track path if waypoints are available
        if (currentRaceData.track && currentRaceData.track.waypoints) {
            trackPath = buildPath(currentRaceData.track);
        }
        
        draw(animator.getState());
        animator.play();
    }

    /* Shows a static track preview (without driver animation)
       used for practice and qualifying sessions, where there are no
       timelines to animate. Avoids the "green canvas" during these sessions. */
    function showTrackPreview(trackId, label) {
        if (!ctx) return;
        if (typeof getTrack !== "function") return;
        const track = getTrack(trackId);
        if (!track) { clearCanvas(); return; }

        currentRaceData = { track, results: [], timelines: [] };
        trackPath = track.waypoints ? buildPath(track) : [];
        animator.pause();
        draw({ currentTimeMs: 0, durationMs: 0, drivers: [], _previewLabel: label || "" });
    }

    /* Clears the canvas showing only the grass (empty background). */
    function clearCanvas() {
        if (!ctx) return;
        currentRaceData = null;
        trackPath = [];
        const w = canvas.width, h = canvas.height;
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(0, 0, w, h);
    }

    let speedLevels = [1, 2, 5, 15];
    let currentSpeedIdx = 0;
    function toggleSpeed() {
        currentSpeedIdx = (currentSpeedIdx + 1) % speedLevels.length;
        animator.setSpeed(speedLevels[currentSpeedIdx]);
        const btn = document.getElementById('btn-speed');
        if(btn) btn.innerText = `Speed: ${speedLevels[currentSpeedIdx]}x`;
    }

    /* Converts 0..1000 waypoints to canvas pixels */
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

    /* Get X,Y coordinates based on progress (0..1) */
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

        // Draw drivers
        for (const d of state.drivers) {
            if (d.trackProgress === null || d.trackProgress === undefined) continue;

            let pos;
            if (isCircuit) {
                pos = getPositionOnPath(d.trackProgress);
            } else {
                pos = getLinearCoords(d.trackProgress, w, h);
            }

            // Retired drivers (DNF) are shown as stationary gray dots
            if (d.dnf) {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath(); ctx.arc(pos.x+2, pos.y+2, 6, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#555';
                ctx.beginPath(); ctx.arc(pos.x, pos.y, 6, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#888'; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = '#aaa';
                ctx.font = '9px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('✕ ' + d.name, pos.x, pos.y - 10);
                continue;
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
        if (state._previewLabel) {
            ctx.fillText(state._previewLabel, 20, h - 20);
        } else {
            ctx.fillText(`Time: ${formatTime(state.currentTimeMs)} / ${formatTime(state.durationMs)}`, 20, h - 20);
        }
    }

    function drawTrackFromWaypoints() {
        if (trackPath.length < 2) return;
        const track = currentRaceData.track || {};
        // track width from trackWidth (0..1): Monaco narrow, Monza wide
        const tw = (typeof track.trackWidth === "number") ? track.trackWidth : 0.7;
        const trackW = Math.max(14, 18 + tw * 34); // 14..52 px
        const borderW = trackW + 6;

        // asphalt/surface color
        const surfaceColors = {
            asphalt: { track: '#4a4a4a', border: '#2a2a2a' },
            gravel:  { track: '#8a7a5a', border: '#5a4a3a' },
            snow:    { track: '#d8d8e0', border: '#a8a8b8' },
            sand:    { track: '#c8a868', border: '#9a8048' },
            dirt:    { track: '#7a5a3a', border: '#5a3a2a' },
        };
        const sc = surfaceColors[track.surface] || surfaceColors.asphalt;

        // track border (dark)
        ctx.beginPath();
        ctx.moveTo(trackPath[0].x, trackPath[0].y);
        for (let i = 1; i < trackPath.length; i++) {
            ctx.lineTo(trackPath[i].x, trackPath[i].y);
        }
        ctx.lineWidth = borderW;
        ctx.strokeStyle = sc.border;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // asphalt/surface
        ctx.beginPath();
        ctx.moveTo(trackPath[0].x, trackPath[0].y);
        for (let i = 1; i < trackPath.length; i++) {
            ctx.lineTo(trackPath[i].x, trackPath[i].y);
        }
        ctx.lineWidth = trackW;
        ctx.strokeStyle = sc.track;
        ctx.stroke();

        // center line (dashed, closed circuit only)
        if (track.type === "closed") {
            ctx.beginPath();
            ctx.setLineDash([10, 14]);
            ctx.moveTo(trackPath[0].x, trackPath[0].y);
            for (let i = 1; i < trackPath.length; i++) {
                ctx.lineTo(trackPath[i].x, trackPath[i].y);
            }
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // start/finish line (checkered)
        const start = trackPath[0];
        const next = trackPath[1] || trackPath[0];
        const angle = Math.atan2(next.y - start.y, next.x - start.x);
        const halfW = trackW / 2 + 2;
        ctx.save();
        ctx.translate(start.x, start.y);
        ctx.rotate(angle);
        for (let r = 0; r < 4; r++) {
            ctx.fillStyle = (r % 2 === 0) ? '#FFFFFF' : '#222';
            ctx.fillRect(-3, -halfW + (r * halfW * 2) / 4, 6, (halfW * 2) / 4);
        }
        ctx.restore();

        // For open tracks (rally/raid/hillclimb): directional arrows and
        // checkered flag at finish, to clarify it's point-to-point.
        if (track.type === "open") {
            const end = trackPath[trackPath.length - 1];
            // Checkered flag at finish
            ctx.save();
            ctx.translate(end.x, end.y);
            const endAngle = Math.atan2(
                end.y - (trackPath[trackPath.length - 2] || end).y,
                end.x - (trackPath[trackPath.length - 2] || end).x
            );
            ctx.rotate(endAngle);
            const flagW = halfW + 4;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 2; c++) {
                    ctx.fillStyle = ((r + c) % 2 === 0) ? '#000' : '#FFF';
                    ctx.fillRect(-3 + c * 3, -flagW + (r * flagW * 2) / 4, 3, (flagW * 2) / 4);
                }
            }
            ctx.restore();

            // Directional arrows along the path every N segments
            const arrowInterval = Math.max(3, Math.floor(trackPath.length / 6));
            for (let i = arrowInterval; i < trackPath.length - 1; i += arrowInterval) {
                const p = trackPath[i];
                const pNext = trackPath[i + 1];
                const a = Math.atan2(pNext.y - p.y, pNext.x - p.x);
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(a);
                ctx.fillStyle = 'rgba(255,255,255,0.45)';
                ctx.beginPath();
                ctx.moveTo(8, 0);
                ctx.lineTo(-4, -5);
                ctx.lineTo(-4, 5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        // track info overlay (name, country, features)
        if (track.name) {
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(10, 10, 320, 58);
            ctx.fillStyle = '#00d4ff';
            ctx.font = 'bold 15px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(track.name, 20, 32);
            ctx.fillStyle = '#aab';
            ctx.font = '11px Arial';
            const feats = (track.features || []).slice(0, 4).join(' · ');
            ctx.fillText(`${track.country || ''}  ${track.lengthKm ? track.lengthKm + ' km' : ''}`, 20, 50);
            if (feats) ctx.fillText(feats, 20, 64);
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

    return { init, loadAndPlay, showTrackPreview, clearCanvas };
})();

if (typeof window !== "undefined") window.RenderView = RenderView;