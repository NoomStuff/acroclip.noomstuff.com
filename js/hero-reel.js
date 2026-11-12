const reelDuration = 6000;

document.addEventListener("DOMContentLoaded", () => {
  const videos = [...document.querySelectorAll("#hero-reel video")];
  const timeline = document.getElementById("hero-timeline");
  if (!videos.length || !timeline) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const glows = [...document.querySelectorAll("#hero-glow img")];

  const segments = videos.map((video, index) => {
    const segment = document.createElement("button");
    segment.type = "button";
    segment.className = "segment";
    segment.setAttribute("aria-label", video.dataset.game);
    segment.innerHTML = `<span class="segment-track"><span class="segment-fill"></span><i></i></span>`;
    segment.addEventListener("click", () => show(index));
    timeline.append(segment);
    return segment;
  });

  let current = 0;
  let startedAt = 0;

  const show = (index) => {
    current = index;
    startedAt = performance.now();

    videos.forEach((video, videoIndex) => {
      const active = videoIndex === index;
      video.classList.toggle("active", active);
      if (active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    });

    glows.forEach((glow, glowIndex) => glow.classList.toggle("active", glowIndex === index));

    segments.forEach((segment, segmentIndex) => {
      segment.classList.toggle("active", segmentIndex === index);
      segment.classList.toggle("played", segmentIndex < index);
      segment.setAttribute("aria-pressed", String(segmentIndex === index));
      segment.style.setProperty("--played", reducedMotion && segmentIndex === index ? "100%" : "0%");
    });
  };

  show(0);

  if (reducedMotion) return;

  const tick = (time) => {
    const progress = Math.min((time - startedAt) / reelDuration, 1);
    segments[current].style.setProperty("--played", `${progress * 100}%`);
    if (progress >= 1) show((current + 1) % videos.length);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});
