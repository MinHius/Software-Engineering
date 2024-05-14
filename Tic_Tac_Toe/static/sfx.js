const bgmAudio = document.getElementById("myAudio"); // Assuming the audio element ID is "myAudio"
const clickSound = new Audio("/static/click.wav"); // Replace with your sound file path

const muteButton = document.getElementById("muteButton");

muteButton.addEventListener("click", () => {
  clickSound.play();
  if (bgmAudio.muted) {
    bgmAudio.muted = false;
    muteButton.textContent = "Mute BGM";
  } else {
    bgmAudio.muted = true;
    muteButton.textContent = "Unmute BGM";
  }
});


function playClickSound() {
  const clickSound = new Audio("/static/click.wav"); // Replace with your sound file path
  if (clickSound) {
    clickSound.play();
  } else {
    console.error("Click sound element not found!");
  }
}