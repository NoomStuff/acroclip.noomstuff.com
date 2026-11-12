// The header shows up once the visitor has scrolled a bit into the page.
const headerThreshold = 240;

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const update = () => header.classList.toggle("visible", window.scrollY > headerThreshold);
  window.addEventListener("scroll", update, { passive: true });
  update();
});
