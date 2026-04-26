// Tiny prototype interactions: play button toggle + follow button toggle.
// Visual-only; no real audio playback.
document.addEventListener("click", (e) => {
  const play = e.target.closest(".play");
  if (play) {
    e.preventDefault();
    document.querySelectorAll(".play.playing").forEach((b) => {
      if (b !== play) b.classList.remove("playing");
    });
    play.classList.toggle("playing");
    return;
  }
  const follow = e.target.closest(".btn-follow");
  if (follow) {
    e.preventDefault();
    const on = follow.classList.toggle("following");
    follow.textContent = on ? "Following" : "Follow author";
  }
});
