// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    let isPlaying = false;
    let audioContext = null;

    // Initialize Audio Context
    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create and play the music
    function createMusic() {
        if (!audioContext) initAudio();

        // Create oscillators for a rich sound
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const osc3 = audioContext.createOscillator();

        // Create gain nodes for volume control
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        // Configure oscillators
        osc1.type = 'sine';      // Base melody
        osc1.frequency.value = 261.63; // Middle C

        osc2.type = 'triangle';  // Harmony
        osc2.frequency.value = 329.63; // E

        osc3.type = 'sawtooth';  // Bass
        osc3.frequency.value = 130.81; // C an octave below

        // Configure filter
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        filter.Q.value = 1;

        // Create a simple arpeggio pattern
        let time = audioContext.currentTime;
        const pattern = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C (octave up)
        let patternIndex = 0;

        // Connect nodes
        osc1.connect(filter);
        osc2.connect(filter);
        osc3.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Set initial gain
        gainNode.gain.setValueAtTime(0.2, time);

        // Start oscillators
        osc1.start(time);
        osc2.start(time);
        osc3.start(time);

        // Animation function for dynamic music
        function animateMusic() {
            if (!isPlaying) return;

            const now = audioContext.currentTime;
            
            // Arpeggio pattern
            osc1.frequency.setValueAtTime(pattern[patternIndex], now);
            patternIndex = (patternIndex + 1) % pattern.length;

            // Modulate filter
            filter.frequency.setTargetAtTime(
                500 + Math.sin(now) * 300,
                now,
                0.1
            );

            // Pulse the bass
            osc3.frequency.setTargetAtTime(
                130.81 + Math.sin(now * 2) * 20,
                now,
                0.1
            );

            // Schedule next update
            setTimeout(animateMusic, 250);
        }

        // Stop function
        function stopMusic() {
            osc1.stop();
            osc2.stop();
            osc3.stop();
            isPlaying = false;
            playButton.textContent = 'Play Music';
        }

        // Animate the music
        animateMusic();

        return stopMusic;
    }

    let stopFunction = null;

    // Button click handler
    playButton.addEventListener('click', () => {
        if (!isPlaying) {
            isPlaying = true;
            playButton.textContent = 'Stop Music';
            stopFunction = createMusic();
        } else {
            isPlaying = false;
            if (stopFunction) stopFunction();
        }
    });
});