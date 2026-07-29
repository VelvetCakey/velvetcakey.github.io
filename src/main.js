import './styles/base.css';
import './styles/theme.css';
import './styles/background.css';
import './styles/noise.css';
import './styles/layout.css';
import { site } from './config.js';
import { renderPage } from './components/page.js';
import { initLanyard } from './components/lanyard.js';
import { initWindow } from './components/window.js';
import { initDock } from './components/dock.js';
import { initGreeting } from './components/greeting.js';

const app = document.getElementById('app');
app.innerHTML = renderPage();

initWindow();
initDock();
initGreeting();
initLanyard(site.discordUserId);
