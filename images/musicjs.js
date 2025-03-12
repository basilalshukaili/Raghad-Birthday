document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    let isPlaying = false;
    let audioContext = null;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    function createMusic() {
        if (!audioContext) initAudio();
        
        // Create multiple oscillators for a richer sound
        const leadOsc = audioContext.createOscillator();
        const chordOsc1 = audioContext.createOscillator();
        const chordOsc2 = audioContext.createOscillator();
        const bassOsc = audioContext.createOscillator();
        const noiseOsc = audioContext.createOscillator();

        // Create effects
        const leadGain = audioContext.createGain();
        const chordGain = audioContext.createGain();
        const bassGain = audioContext.createGain();
        const noiseGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        const delay = audioContext.createDelay();
        const delayGain = audioContext.createGain();
        const masterGain = audioContext.createGain();

        // Configure oscillators
        leadOsc.type = 'triangle';
        chordOsc1.type = 'sine';
        chordOsc2.type = 'sine';
        bassOsc.type = 'sawtooth';
        noiseOsc.type = 'whitenoise' in audioContext ? 'white' : 'sine'; // Fallback

        // Initial frequencies (C minor scale)
        const scale = [261.63, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]; // Cm scale
        let leadIndex = 0;
        let chordProgression = [
            [261.63, 311.13, 392.00],  // Cm
            [277.18, 329.63, 415.30],  // C#maj
            [233.08, 277.18, 349.23],  // A♭maj
            [246.94, 311.13, 392.00]   // B♭m
        ];
        let chordIndex = 0;

        // Set up effects
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        filter.Q.value = 2;

        delay.delayTime.value = 0.25;
        delayGain.gain.value = 0.3;

        // Volume levels
        leadGain.gain.value = 0.3;
        chordGain.gain.value = 0.2;
        bassGain.gain.value = 0.25;
        noiseGain.gain.value = 0.05;
        masterGain.gain.value = 0.8;

        // Connections
        leadOsc.connect(leadGain);
        chordOsc1.connect(chordGain);
        chordOsc2.connect(chordGain);
        bassOsc.connect(bassGain);
        noiseOsc.connect(noiseGain);

        leadGain.connect(filter);
        chordGain.connect(filter);
        bassGain.connect(filter);
        noiseGain.connect(filter);

        filter.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(filter); // Feedback loop
        filter.connect(masterGain);
        masterGain.connect(audioContext.destination);

        // Start time
        const startTime = audioContext.currentTime;
        leadOsc.start(startTime);
        chordOsc1.start(startTime);
        chordOsc2.start(startTime);
        bassOsc.start(startTime);
        noiseOsc.start(startTime);

        // Music animation
        function animateMusic() {
            if (!isPlaying) return;
            const now = audioContext.currentTime;

            // Lead melody
            leadOsc.frequency.setValueAtTime(
                scale[leadIndex % scale.length] * (Math.random() > 0.7 ? 2 : 1),
                now
            );
            leadIndex = (leadIndex + Math.floor(Math.random() * 3)) % scale.length;

            // Chord progression
            if (Math.floor(now * 2) % 4 === 0) {
                const currentChord = chordProgression[chordIndex];
                chordOsc1.frequency.setValueAtTime(currentChord[0], now);
                chordOsc2.frequency.setValueAtTime(currentChord[2], now);
                chordIndex = (chordIndex + 1) % chordProgression.length;
            }

            // Bass movement
            bassOsc.frequency.setValueAtTime(
                scale[0] / 2 + Math.sin(now * 0.5) * 10,
                now
            );

            // Filter sweep
            filter.frequency.setTargetAtTime(
                800 + Math.sin(now * 0.3) * 600,
                now,
                0.1
            );

            // Noise pulse
            noiseGain.gain.setTargetAtTime(
                0.05 + Math.sin(now * 4) * 0.03,
                now,
                0.05
            );

            // Schedule next update
            setTimeout(animateMusic, 150 + Math.random() * 100);
        }

        animateMusic();

        // Stop function
        function stopMusic() {
            leadOsc.stop();
            chordOsc1.stop();
            chordOsc2.stop();
            bassOsc.stop();
            noiseOsc.stop();
            isPlaying = false;
            playButton.textContent = 'Play Music';
        }

        return stopMusic;
    }

    let stopFunction = null;

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