const buzzer = document.getElementById("buzzer");
const soundToggle = document.getElementById("soundToggle");
const buzzerClip = document.getElementById("buzzerClip");

let audioContext;
let useSoundClip = true;
let clipReady = false;

soundToggle.classList.toggle("is-active", useSoundClip);
soundToggle.setAttribute("aria-checked", useSoundClip.toString());

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

async function prepareAudio() {
  if (clipReady) {
    return;
  }

  try {
    buzzerClip.load();

    buzzerClip.muted = true;

    await buzzerClip.play();

    buzzerClip.pause();
    buzzerClip.currentTime = 0;

    buzzerClip.muted = false;

    clipReady = true;
  } catch (error) {
    buzzerClip.muted = false;

    console.log("Audio preparation skipped:", error);
  }
}

function playSynthBuzzer() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "square";

  oscillator.frequency.setValueAtTime(110, context.currentTime);

  oscillator.frequency.exponentialRampToValueAtTime(
    90,
    context.currentTime + 0.5,
  );

  gain.gain.setValueAtTime(0.22, context.currentTime);

  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.55);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.55);
}

async function playSoundClip() {
  try {
    if (!clipReady) {
      await prepareAudio();
    }

    buzzerClip.pause();
    buzzerClip.currentTime = 0;

    await buzzerClip.play();
  } catch (error) {
    console.log("Audio clip could not be played:", error);
  }
}

function playBuzzerSound() {
  if (useSoundClip) {
    playSoundClip();
  } else {
    playSynthBuzzer();
  }
}

function pressBuzzer() {
  buzzer.classList.add("is-pressed");

  playBuzzerSound();

  setTimeout(() => {
    buzzer.classList.remove("is-pressed");
  }, 90);
}

function toggleSoundMode() {
  useSoundClip = !useSoundClip;

  soundToggle.classList.toggle("is-active", useSoundClip);

  soundToggle.setAttribute("aria-checked", useSoundClip.toString());

  if (useSoundClip) {
    prepareAudio();
  }
}

buzzer.addEventListener("click", pressBuzzer);
soundToggle.addEventListener("click", toggleSoundMode);
