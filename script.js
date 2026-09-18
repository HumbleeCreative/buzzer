const buzzer = document.getElementById("buzzer");
const soundToggle = document.getElementById("soundToggle");
const buzzerClip = document.getElementById("buzzerClip");
const switchClip = document.getElementById("switchClip");
const parpClip = document.getElementById("parpClip");
const parp2Clip = document.getElementById("parp2Clip");

let useBuzzerMode = true;
let switchPressCount = 0;
let isDebouncing = false;

const DEBOUNCE_MS = 500;

soundToggle.classList.toggle("is-active", useBuzzerMode);
soundToggle.setAttribute("aria-checked", useBuzzerMode.toString());

async function playClip(clip) {
  try {
    clip.pause();
    clip.currentTime = 0;
    await clip.play();
  } catch (error) {
    console.log("Audio clip could not be played:", error);
  }
}

function playSwitchSound() {
  switchPressCount += 1;

  if (switchPressCount === 7) {
    playClip(parpClip);
  } else if (switchPressCount === 8) {
    playClip(parp2Clip);
  } else {
    playClip(switchClip);
  }
}

function playBuzzerSound() {
  if (useBuzzerMode) {
    playClip(buzzerClip);
  } else {
    playSwitchSound();
  }
}

function pressBuzzer() {
  if (isDebouncing) {
    return;
  }

  isDebouncing = true;
  buzzer.classList.add("is-pressed");

  playBuzzerSound();

  setTimeout(() => {
    buzzer.classList.remove("is-pressed");
  }, 90);

  setTimeout(() => {
    isDebouncing = false;
  }, DEBOUNCE_MS);
}

function toggleSoundMode() {
  useBuzzerMode = !useBuzzerMode;

  soundToggle.classList.toggle("is-active", useBuzzerMode);
  soundToggle.setAttribute("aria-checked", useBuzzerMode.toString());
}

buzzer.addEventListener("click", pressBuzzer);
soundToggle.addEventListener("click", toggleSoundMode);


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.log("Service worker registration failed:", error);
    });
  });
}
