const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create master effects chain
const compressor = audioContext.createDynamicsCompressor();
const reverb = audioContext.createConvolver();
const delay = audioContext.createDelay();
const gainNode = audioContext.createGain();

// Connect effects
compressor.connect(reverb);
reverb.connect(delay);
delay.connect(gainNode);
gainNode.connect(audioContext.destination);

// Configure effects
compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
compressor.knee.setValueAtTime(40, audioContext.currentTime);
compressor.ratio.setValueAtTime(12, audioContext.currentTime);

delay.delayTime.value = 0.3;
gainNode.gain.value = 0.3;

// Create reverb impulse response
const reverbLength = 3;
const reverbBuffer = audioContext.createBuffer(2, 
    audioContext.sampleRate * reverbLength, 
    audioContext.sampleRate);
const channelLeft = reverbBuffer.getChannelData(0);
const channelRight = reverbBuffer.getChannelData(1);

for (let i = 0; i < reverbBuffer.length; i++) {
    channelLeft[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbBuffer.length, 1);
    channelRight[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbBuffer.length, 1);
}
reverb.buffer = reverbBuffer;

// Musical scale (Dorian mode)
const scale = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37]; // D4-E4-F#4-G4-A4-B4-C#5

// Create synth voice
function createSynth(frequency, time, type = 'sine', decay = 0.5) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, time);
    
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + decay);
    
    osc.connect(gain);
    gain.connect(compressor);
    
    osc.start(time);
    osc.stop(time + decay);
}

// Create arpeggiator
function createArpeggio(baseNote, pattern, tempo = 120) {
    const interval = 60 / tempo;
    let time = audioContext.currentTime + 0.1;
    
    pattern.forEach((step, index) => {
        if(step) {
            createSynth(baseNote * Math.pow(2, index/12), time, 'triangle', 0.8);
        }
        time += interval;
    });
}

// Create rhythmic percussion
function createPercussionSequence(steps, tempo = 120) {
    const interval = 60 / tempo;
    let time = audioContext.currentTime + 0.1;
    
    steps.forEach(velocity => {
        if(velocity > 0) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.frequency.setValueAtTime(50 + Math.random() * 100, time);
            gain.gain.setValueAtTime(velocity, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
            
            osc.connect(gain);
            gain.connect(compressor);
            
            osc.start(time);
            osc.stop(time + 0.1);
        }
        time += interval;
    });
}

// Main composition
function playMusic() {
    // Chords progression
    const chords = [
        [scale[0], scale[2], scale[4]], // D minor
        [scale[1], scale[3], scale[5]], // G major
        [scale[3], scale[5], scale[0]*2] // C suspended
    ];
    
    // Create evolving arpeggios
    chords.forEach((chord, index) => {
        const startTime = audioContext.currentTime + index * 2;
        chord.forEach((note, voice) => {
            createArpeggio(note, [1,0,1,0,1,1,0,1], 240);
        });
    });
    
    // Add percussion
    createPercussionSequence([0.8, 0, 0.5, 0, 0.3, 0, 0.5, 0.2], 240);
    
    // Bass line
    const bassPattern = [scale[0]/2, scale[3]/2, scale[4]/2, scale[5]/2];
    bassPattern.forEach((note, index) => {
        const time = audioContext.currentTime + index * 1;
        createSynth(note, time, 'sawtooth', 1.2);
    });
    
    // High melody
    setTimeout(() => {
        const melody = [scale[4], scale[5], scale[3], scale[2], scale[0]];
        melody.forEach((note, index) => {
            const time = audioContext.currentTime + index * 0.5;
            createSynth(note * 2, time, 'square', 0.3);
        });
    }, 3000);
}

// Initialize play button
document.getElementById('playButton').addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    playMusic();
});