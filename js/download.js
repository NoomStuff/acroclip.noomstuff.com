const releaseUrl = "https://github.com/NoomStuff/AcroClip/releases/latest/download/";
const releaseApi = "https://api.github.com/repos/NoomStuff/AcroClip/releases/latest";

const platforms = {
  windows: { name: "Windows", file: "AcroClip-windows-x64-setup.exe" },
  macos: { name: "macOS", file: "AcroClip-macos-arm64.dmg" },
  linux: { name: "Linux", file: "AcroClip-linux-x64.AppImage" },
};

const detectPlatform = () => {
  const platform = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
  const agent = navigator.userAgent.toLowerCase();

  if (/android|iphone|ipad|ipod/.test(agent)) return null;
  if (platform.includes("win") || agent.includes("windows")) return "windows";
  if (platform.includes("mac") || agent.includes("mac os")) return "macos";
  if (platform.includes("linux") || agent.includes("linux")) return "linux";
  return null;
};

document.addEventListener("DOMContentLoaded", () => {
  const detected = detectPlatform();
  const platform = platforms[detected];

  document.querySelectorAll("[data-file]").forEach((link) => {
    link.href = releaseUrl + link.dataset.file;
  });

  document.querySelectorAll("[data-download]").forEach((button) => {
    const label = button.querySelector(".label");
    const icon = button.querySelector(".icon");

    if (!platform) {
      button.href = "#downloads";
      return;
    }

    button.href = releaseUrl + platform.file;
    label.textContent = `Download for ${platform.name}`;
    icon.classList.replace("icon-download", `icon-${detected}`);
  });

  document.querySelectorAll("[data-platform]").forEach((card) => {
    card.classList.toggle("detected", card.dataset.platform === detected);
  });

  const versions = document.querySelectorAll("[data-version]");
  if (!versions.length) return;

  fetch(releaseApi)
    .then((response) => (response.ok ? response.json() : null))
    .then((release) => {
      if (!release?.tag_name) return;
      versions.forEach((element) => {
        element.textContent = release.tag_name;
      });
    })
    .catch(() => {});
});
