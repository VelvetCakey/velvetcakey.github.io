const GREETINGS = [
  'Hi',       // English (start)
  'Hola',     // Spanish
  'Bonjour',  // French
  'Ciao',     // Italian
  'Hei',      // Norwegian/Finnish
  'Olá',      // Portuguese
  'Hallo',    // German/Dutch
  'Salut',    // Romanian/French informal
  'Привет',   // Russian
  'こんにちは', // Japanese
  '안녕',      // Korean
  'مرحبا',    // Arabic
  'Merhaba',  // Turkish
  'Xin chào', // Vietnamese
  'สวัสดี',   // Thai
  'Γεια',     // Greek
  'Cześć',    // Polish
  'Ahoj',     // Czech/Slovak
];

const TYPE_SPEED = 80;     // ms per character typed
const DELETE_SPEED = 50;   // ms per character deleted
const PAUSE_AFTER_TYPE = 1800; // ms to wait after fully typed
const PAUSE_BEFORE_TYPE = 200; // ms to wait before typing next

export function initGreeting() {
  const el = document.getElementById('greeting-text');
  if (!el) return;

  let currentIndex = 0;
  let currentText = GREETINGS[0];
  let isDeleting = false;
  let timeoutId = null;

  const tick = () => {
    const targetWord = GREETINGS[currentIndex];

    if (!isDeleting) {
      // Typing forward
      if (currentText.length < targetWord.length) {
        currentText = targetWord.slice(0, currentText.length + 1);
        el.textContent = currentText;
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        // Fully typed — pause then start deleting
        timeoutId = setTimeout(() => {
          isDeleting = true;
          tick();
        }, PAUSE_AFTER_TYPE);
      }
    } else {
      // Deleting backward
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        el.textContent = currentText;
        timeoutId = setTimeout(tick, DELETE_SPEED);
      } else {
        // Fully deleted — move to next greeting
        isDeleting = false;
        currentIndex = (currentIndex + 1) % GREETINGS.length;
        currentText = '';
        timeoutId = setTimeout(tick, PAUSE_BEFORE_TYPE);
      }
    }
  };

  // Start cycling after the initial greeting sits for a moment
  timeoutId = setTimeout(() => {
    isDeleting = true;
    tick();
  }, PAUSE_AFTER_TYPE);

  // Clean up on page unload
  window.addEventListener('beforeunload', () => clearTimeout(timeoutId));
}
