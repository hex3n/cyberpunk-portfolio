// Persistent background music across navigation
let player;

document.addEventListener("DOMContentLoaded", () => {
  // Prevent duplicate players if already active
  if (window.__musicInitialized) return;
  window.__musicInitialized = true;

  const tracks = [
    "assets/storage/mp3/bg1.mp3",
    "assets/storage/mp3/bg2.mp3",
    "assets/storage/mp3/bg3.mp3"
  ];

  // Create hidden audio element
  player = document.createElement("audio");
  player.volume = 0.4;
  player.loop = false;
  player.style.display = "none";
  document.body.appendChild(player);

  // Pick a random song
  let current = Math.floor(Math.random() * tracks.length);
  player.src = tracks[current];

  // Play next random track when one ends
  player.addEventListener("ended", () => {
    current = Math.floor(Math.random() * tracks.length);
    player.src = tracks[current];
    player.play();
  });

  // Try autoplay
  player.play().catch(() => {
    console.warn("Autoplay blocked — waiting for user interaction...");
    const resume = () => {
      player.play();
      document.removeEventListener("click", resume);
    };
    document.addEventListener("click", resume);
  });
});
