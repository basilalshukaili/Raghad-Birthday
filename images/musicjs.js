document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    let isPlaying = false;
    let audioContext = null;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    function createShockMusic() {
        if (!audioContext) initAudio();

        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const osc3 = audioContext.createOscillator();
        const osc4 = audioContext.createOscillator();
        const noise = audioContext.createOscillator();

        const gain1 = audioContext.createGain();
        const gain2 = audioContext.createGain();
        const gain3 = audioContext.createGain();
        const masterGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        const distortion = audioContext.createWaveShaper();

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc3.type = 'triangle';
        osc4.type = 'sine';
        noise.type = 'whitenoise' in audioContext ? 'white' : 'square';

        distortion.curve = new Float32Array(44100).map((_, i) => 
            Math.tanh(i / 22050 * 20) * 0.5
        );
        distortion.oversample = '4x';

        filter.type = 'bandpass';
        filter.Q.value = 10;

        gain1.gain.value = 0.4;
        gain2.gain.value = 0.3;
        gain3.gain.value = 0.2;
        masterGain.gain.value = 0.9;

        osc1.connect(gain1);
        osc2.connect(gain1);
        osc3.connect(gain2);
        osc4.connect(gain3);
        noise.connect(gain3);
        gain1.connect(distortion);
        gain2.connect(filter);
        gain3.connect(filter);
        distortion.connect(masterGain);
        filter.connect(masterGain);
        masterGain.connect(audioContext.destination);

        const startTime = audioContext.currentTime;
        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);
        osc4.start(startTime);
        noise.start(startTime);

        function shockLoop() {
            if (!isPlaying) return;
            const now = audioContext.currentTime;

            osc1.frequency.setValueAtTime(
                200 + Math.pow(Math.sin(now * 5), 2) * 1000,
                now
            );
            osc2.frequency.setValueAtTime(
                300 + Math.cos(now * 3) * 800 * (Math.random() > 0.8 ? 2 : 1),
                now
            );
            osc3.frequency.setValueAtTime(
                100 + Math.sin(now * 8) * 400,
                now
            );
            osc4.frequency.setValueAtTime(
                50 + Math.pow(Math.random(), 3) * 2000,
                now
            );

            filter.frequency.setValueAtTime(
                500 + Math.sin(now * 10) * 4000,
                now
            );

            gain1.gain.setTargetAtTime(
                0.4 + Math.sin(now * 15) * 0.3,
                now,
                0.02
            );

            setTimeout(shockLoop, 50 + Math.random() * 100);
        }

        shockLoop();

        function stopShock() {
            osc1.stop();
            osc2.stop();
            osc3.stop();
            osc4.stop();
            noise.stop();
            isPlaying = false;
            playButton.textContent = 'Play Music';
        }

        return stopShock;
    }

    let stopFunction = null;

    playButton.addEventListener('click', () => {
        if (!isPlaying) {
            isPlaying = true;
            playButton.textContent = 'Stop Music';
            stopFunction = createShockMusic();
        } else {
            isPlaying = false;
            if (stopFunction) stopFunction();
        }
    });
});