import { site, experience, intro } from '../config.js';
import { renderLanyardShell } from './lanyard.js';
import { renderDock } from './dock.js';

export function renderPage() {
  const roles = site.roles.join(' · ');

  return `
    <div class="window" id="app-window">
      <div class="window__titlebar" id="window-titlebar">
        <div class="window__titlebar-left">
          <div class="window__controls">
            <button class="window__control window__control--close" id="win-close" title="Close" aria-label="Close window">
              <svg viewBox="0 0 12 12" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="window__control window__control--minimize" id="win-minimize" title="Minimize" aria-label="Minimize window">
              <svg viewBox="0 0 12 12" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M2 6h8" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="window__control window__control--maximize" id="win-maximize" title="Maximize" aria-label="Maximize window">
              <svg viewBox="0 0 12 12" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.6">
                <rect x="2" y="2" width="8" height="8" rx="1"/>
              </svg>
            </button>
          </div>
          <span class="window__title">
            <span class="window__title-badge">cakeyvelvet.github.io</span>
          </span>
        </div>
        <div class="window__titlebar-right">
          <span class="window__drag-icon" title="Drag Window">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="6" r="1.2" fill="currentColor"/>
              <circle cx="15" cy="6" r="1.2" fill="currentColor"/>
              <circle cx="9" cy="12" r="1.2" fill="currentColor"/>
              <circle cx="15" cy="12" r="1.2" fill="currentColor"/>
              <circle cx="9" cy="18" r="1.2" fill="currentColor"/>
              <circle cx="15" cy="18" r="1.2" fill="currentColor"/>
            </svg>
          </span>
        </div>
      </div>

      <div class="window__body" id="window-body">
        <header class="header anim-stagger" style="--stagger: 1">
          <div class="header__row">
            <div class="header__pfp-wrap" id="header-pfp-wrap" hidden>
              <img class="header__pfp" id="header-pfp" src="" alt="" width="56" height="56" hidden />
              <img class="header__pfp-decoration" id="header-pfp-decoration" src="" alt="" width="78" height="78" hidden />
            </div>
            <div class="header__text">
              <h1 class="header__name">
                <span class="header__greeting" id="greeting-text">Hi</span><span class="header__greeting-comma">,</span> I'm ${site.name}
              </h1>
              <p class="header__tagline">${site.tagline}</p>
            </div>
          </div>
        </header>

        <div class="page-main anim-stagger" style="--stagger: 2">
          <section class="intro" aria-labelledby="intro-heading">
            <p class="intro__meta">${roles}</p>
            <p class="intro__lead" id="intro-heading">${intro}</p>
          </section>

          <section class="experience" aria-labelledby="experience-heading">
            <h2 class="section-label" id="experience-heading">Experience</h2>
            <ul class="experience__list">
              ${experience.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </section>
        </div>

        <div class="page-bottom anim-stagger" style="--stagger: 3">
          ${renderLanyardShell()}
        </div>
      </div>

      <div class="window__resize-handle window__resize-handle--r" data-handle="r"></div>
      <div class="window__resize-handle window__resize-handle--b" data-handle="b"></div>
      <div class="window__resize-handle window__resize-handle--se" data-handle="se" title="Resize Window">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="9" y1="1" x2="1" y2="9"/>
          <line x1="9" y1="5" x2="5" y2="9"/>
          <line x1="9" y1="8" x2="8" y2="9"/>
        </svg>
      </div>
    </div>

    ${renderDock(site.socials)}
  `;
}
