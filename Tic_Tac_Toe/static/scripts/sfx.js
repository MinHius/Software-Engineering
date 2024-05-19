const bgmAudio = document.getElementById("myAudio"); // Assuming the audio element ID is "myAudio"
const clickSound = new Audio("/static/mp3/click.wav"); // Replace with your sound file path
const backButton = document.getElementById("back-button"); 

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
  const clickSound = new Audio("/static/mp3/click.wav"); // Replace with your sound file path
  if (clickSound) {
    clickSound.play();
  } else {
    console.error("Click sound element not found!");
  }
}

function handleBackButtonClick() {
  playClickSound();
  setTimeout(() => {
    window.history.back();
}, 300);
}


