import { discordIcon, robloxIcon, tiktokIcon, githubIcon } from './icons.js';

export function renderDock(socials) {
  return `
    <div class="dock-wrapper">
      <nav class="dock" id="mac-dock" aria-label="Social Dock">
        <a class="dock-item" href="${socials.discord}" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <span class="dock-item__tooltip">Discord</span>
          <div class="dock-item__icon">
            ${discordIcon}
          </div>
          <span class="dock-item__dot"></span>
        </a>

        <a class="dock-item" href="${socials.roblox}" target="_blank" rel="noopener noreferrer" aria-label="Roblox">
          <span class="dock-item__tooltip">Roblox</span>
          <div class="dock-item__icon">
            ${robloxIcon}
          </div>
          <span class="dock-item__dot"></span>
        </a>

        <a class="dock-item" href="${socials.tiktok}" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <span class="dock-item__tooltip">TikTok</span>
          <div class="dock-item__icon">
            ${tiktokIcon}
          </div>
          <span class="dock-item__dot"></span>
        </a>

        <a class="dock-item" href="${socials.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <span class="dock-item__tooltip">GitHub</span>
          <div class="dock-item__icon">
            ${githubIcon}
          </div>
          <span class="dock-item__dot"></span>
        </a>
      </nav>
    </div>
  `;
}

export function initDock() {
  const dock = document.getElementById('mac-dock');
  if (!dock) return;

  const items = dock.querySelectorAll('.dock-item');
  const maxDistance = 80;
  const maxScale = 1.1;

  const handleMouseMove = (e) => {
    if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches) return;

    const mouseX = e.clientX;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);

      if (distance < maxDistance) {
        const normDist = distance / maxDistance;
        const scale = 1 + (maxScale - 1) * Math.cos(normDist * (Math.PI / 2));
        const translateY = (1 - scale) * 8;
        item.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(2)}px)`;
        item.style.margin = `0 ${(scale - 1) * 4}px`;
      } else {
        item.style.transform = 'scale(1) translateY(0px)';
        item.style.margin = '0 0px';
      }
    });
  };

  const handleMouseLeave = () => {
    items.forEach((item) => {
      item.style.transform = 'scale(1) translateY(0px)';
      item.style.margin = '0 0px';
    });
  };

  dock.addEventListener('mousemove', handleMouseMove);
  dock.addEventListener('mouseleave', handleMouseLeave);
}
