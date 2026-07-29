import { discordIcon } from './icons.js';

const LANYARD_API = 'https://api.lanyard.rest/v1/users';

const STATUS_LABELS = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do not disturb',
  offline: 'Offline',
};

function avatarUrl(user) {
  if (!user?.id) return null;
  if (user.avatar) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
  }
  const index = Number(BigInt(user.id) >> 22n) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function decorationUrl(decorationData) {
  if (!decorationData?.asset) return null;
  return `https://cdn.discordapp.com/avatar-decoration-presets/${decorationData.asset}.png?size=160&passthrough=true`;
}

function setHeaderPfp(url, decoration) {
  const wrap = document.getElementById('header-pfp-wrap');
  const img = document.getElementById('header-pfp');
  const deco = document.getElementById('header-pfp-decoration');
  if (!img || !url) return;

  img.src = url;
  img.hidden = false;
  if (wrap) wrap.hidden = false;

  if (deco && decoration) {
    deco.src = decoration;
    deco.hidden = false;
  } else if (deco) {
    deco.hidden = true;
  }
}

function parseActivityImage(activity) {
  const image = activity.assets?.large_image || activity.assets?.small_image;
  if (!image) return null;

  if (image.startsWith('mp:external/')) {
    const path = image.slice('mp:external/'.length);
    const slash = path.indexOf('/');
    if (slash === -1) return null;
    return `https://media.discordapp.net/external/${path.slice(0, slash)}/${path.slice(slash + 1)}`;
  }

  if (image.startsWith('spotify:')) {
    return `https://i.scdn.co/image/${image.replace('spotify:', '')}`;
  }

  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
  }

  return null;
}

function getPresence(data) {
  const { listening_to_spotify, spotify, activities } = data;

  if (listening_to_spotify && spotify) {
    return {
      label: 'Listening to Spotify',
      title: spotify.song,
      subtitle: spotify.artist,
      image: spotify.album_art_url,
    };
  }

  const game = activities?.find((activity) => activity.type === 0);
  if (game) {
    return {
      label: 'Playing',
      title: game.name,
      subtitle: [game.details, game.state].filter(Boolean).join(' · ') || null,
      image: parseActivityImage(game),
    };
  }

  const listening = activities?.find((activity) => activity.type === 2);
  if (listening) {
    return {
      label: 'Listening to Spotify',
      title: listening.details,
      subtitle: listening.state,
      image: parseActivityImage(listening),
    };
  }

  return null;
}

function statusMarkup(status) {
  const label = STATUS_LABELS[status] ?? STATUS_LABELS.offline;
  return `<span class="status-dot status-dot--${status}" role="img" aria-label="${label}"></span>`;
}

function avatarMarkup(avatar, decoration) {
  if (!avatar) return '';

  const decorationHtml = decoration
    ? `<img class="discord-status__decoration" src="${decoration}" alt="" width="56" height="56" />`
    : '';

  return `
    <div class="discord-status__avatar-wrap">
      <img class="discord-status__avatar" src="${avatar}" alt="" width="40" height="40" />
      ${decorationHtml}
    </div>
  `;
}

function usernameMarkup(displayName, username) {
  if (displayName === username) {
    return `<span class="discord-status__username">${displayName}</span>`;
  }

  return `
    <span class="discord-status__username">
      <span class="discord-status__display-name">${displayName}</span>
      <span class="discord-status__handle">(@${username})</span>
    </span>
  `;
}

function presenceMarkup(presence) {
  if (!presence) return '';

  return `
    <div class="discord-status__presence">
      ${
        presence.image
          ? `<img class="discord-status__presence-art" src="${presence.image}" alt="" width="40" height="40" />`
          : ''
      }
      <div class="discord-status__presence-text">
        <p class="discord-status__presence-label">${presence.label}</p>
        <p class="discord-status__presence-title">${presence.title}</p>
        ${presence.subtitle ? `<p class="discord-status__presence-sub">${presence.subtitle}</p>` : ''}
      </div>
    </div>
  `;
}

export function renderLanyardShell() {
  return `
    <section class="discord-status" aria-labelledby="discord-status-heading">
      <div class="discord-status__label" id="discord-status-heading">
        ${discordIcon}
        <span>Discord status</span>
      </div>
      <div class="discord-status__panel" id="lanyard" aria-live="polite">
        <p class="discord-status__loading">Loading my Discord status…</p>
      </div>
    </section>
  `;
}

export async function initLanyard(userId) {
  const container = document.getElementById('lanyard');
  if (!container) return;

  if (!userId) {
    container.innerHTML = `<p class="discord-status__empty">My Discord status is unavailable.</p>`;
    return;
  }

  try {
    const response = await fetch(`${LANYARD_API}/${userId}`);
    const payload = await response.json();

    if (!payload.success || !payload.data) {
      container.innerHTML = `<p class="discord-status__empty">My Discord status is unavailable.</p>`;
      return;
    }

    const data = payload.data;
    const { discord_user: user, discord_status: status } = data;
    const avatar = avatarUrl(user);
    const decoration = decorationUrl(user.avatar_decoration_data);
    const presence = getPresence(data);
    const displayName = user.global_name || user.display_name || user.username;
    const userName = user.username;

    if (avatar) setHeaderPfp(avatar, decoration);

    container.innerHTML = `
      <div class="discord-status__card${presence ? '' : ' discord-status__card--compact'}">
        ${avatarMarkup(avatar, decoration)}
        <div class="discord-status__info">
          <p class="discord-status__user">
            ${statusMarkup(status)}
            ${usernameMarkup(displayName, userName)}
          </p>
          ${presenceMarkup(presence)}
        </div>
      </div>
    `;
  } catch {
    container.innerHTML = `<p class="discord-status__empty">My Discord status is unavailable.</p>`;
  }
}
