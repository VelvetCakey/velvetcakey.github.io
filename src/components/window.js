export function initWindow() {
  const windowEl = document.getElementById('app-window');
  const titlebarEl = document.getElementById('window-titlebar');
  const closeBtn = document.getElementById('win-close');
  const minimizeBtn = document.getElementById('win-minimize');
  const maximizeBtn = document.getElementById('win-maximize');

  if (!windowEl || !titlebarEl) return;

  let isDragging = false;
  let isMaximized = false;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let grabOffsetX = 0;
  let grabOffsetY = 0;
  let animationFrameId = null;

  let isResizing = false;
  let resizeType = '';
  let startWidth = 0;
  let startHeight = 0;
  let resizeStartX = 0;
  let resizeStartY = 0;

  const isMobile = () =>
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  const fixPosition = () => {
    if (windowEl.dataset.fixedPos === 'true') return;
    const rect = windowEl.getBoundingClientRect();
    windowEl.style.opacity = '1';
    windowEl.style.animation = 'none';
    windowEl.style.transform = 'none';
    windowEl.style.position = 'fixed';
    windowEl.style.left = `${rect.left}px`;
    windowEl.style.top = `${rect.top}px`;
    windowEl.dataset.fixedPos = 'true';
    currentX = rect.left;
    currentY = rect.top;
    targetX = currentX;
    targetY = currentY;
  };

  windowEl.addEventListener('animationend', (e) => {
    if (e.target === windowEl) fixPosition();
  });

  const updatePhysics = () => {
    if (!isDragging) {
      const dist = Math.hypot(targetX - currentX, targetY - currentY);
      if (dist < 0.1) {
        currentX = targetX;
        currentY = targetY;
        windowEl.style.left = `${currentX}px`;
        windowEl.style.top = `${currentY}px`;
        animationFrameId = null;
        return;
      }
    }

    const lerp = 0.35;
    currentX += (targetX - currentX) * lerp;
    currentY += (targetY - currentY) * lerp;
    windowEl.style.left = `${currentX.toFixed(2)}px`;
    windowEl.style.top = `${currentY.toFixed(2)}px`;

    animationFrameId = requestAnimationFrame(updatePhysics);
  };

  const startDrag = (e) => {
    if (isMobile() || isMaximized) return;
    if (e.target.closest('.window__control') || e.target.closest('.window__resize-handle') || e.target.closest('button')) return;

    fixPosition();

    const rect = windowEl.getBoundingClientRect();
    currentX = rect.left;
    currentY = rect.top;
    targetX = currentX;
    targetY = currentY;
    grabOffsetX = e.clientX - rect.left;
    grabOffsetY = e.clientY - rect.top;

    isDragging = true;
    windowEl.classList.add('is-dragging');
    document.body.style.cursor = 'grabbing';

    window.addEventListener('mousemove', onDrag, { passive: false });
    window.addEventListener('mouseup', stopDrag);

    if (!animationFrameId)
      animationFrameId = requestAnimationFrame(updatePhysics);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    const rawX = e.clientX - grabOffsetX;
    const rawY = e.clientY - grabOffsetY;

    const titlebarH = titlebarEl.offsetHeight || 44;
    const minVisible = 100;

    targetX = Math.max(-(windowEl.offsetWidth - minVisible), Math.min(rawX, window.innerWidth - minVisible));
    targetY = Math.max(10, Math.min(rawY, window.innerHeight - titlebarH - 90));
  };

  const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    windowEl.classList.remove('is-dragging');
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  };

  const startResize = (e, type) => {
    if (isMobile() || isMaximized) return;
    e.preventDefault();
    e.stopPropagation();

    fixPosition();

    isResizing = true;
    resizeType = type;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    startWidth = windowEl.offsetWidth;
    startHeight = windowEl.offsetHeight;

    windowEl.classList.add('is-resizing');
    document.body.style.cursor = type === 'r' ? 'e-resize' : type === 'b' ? 's-resize' : 'se-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', onResize, { passive: false });
    window.addEventListener('mouseup', stopResize);
  };

  const onResize = (e) => {
    if (!isResizing) return;
    if (e.cancelable) e.preventDefault();

    const dx = e.clientX - resizeStartX;
    const dy = e.clientY - resizeStartY;
    const minW = 340, minH = 260;
    const maxW = window.innerWidth - currentX - 10;
    const maxH = window.innerHeight - currentY - 95;

    if (resizeType === 'r' || resizeType === 'se') {
      windowEl.style.width = `${Math.max(minW, Math.min(startWidth + dx, maxW))}px`;
    }
    if (resizeType === 'b' || resizeType === 'se') {
      const newH = Math.max(minH, Math.min(startHeight + dy, maxH));
      windowEl.style.height = `${newH}px`;
      windowEl.style.maxHeight = `${newH}px`;
    }
  };

  const stopResize = () => {
    if (!isResizing) return;
    isResizing = false;
    windowEl.classList.remove('is-resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', stopResize);
  };

  windowEl.querySelectorAll('.window__resize-handle').forEach((handle) => {
    handle.addEventListener('mousedown', (e) => startResize(e, handle.dataset.handle));
  });

  const toggleMaximize = () => {
    if (isMobile()) return;
    isMaximized = !isMaximized;
    windowEl.classList.toggle('is-maximized', isMaximized);

    if (!isMaximized && currentX && currentY) {
      windowEl.style.left = `${currentX}px`;
      windowEl.style.top = `${currentY}px`;
      windowEl.style.transform = 'none';
    }
  };

  titlebarEl.addEventListener('mousedown', startDrag);
  titlebarEl.addEventListener('dblclick', (e) => {
    if (isMobile() || e.target.closest('.window__control')) return;
    toggleMaximize();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => windowEl.classList.add('is-closed'));
  if (minimizeBtn) minimizeBtn.addEventListener('click', () => windowEl.classList.toggle('is-minimized'));
  if (maximizeBtn) maximizeBtn.addEventListener('click', toggleMaximize);

  document.addEventListener('click', (e) => {
    if (
      windowEl.classList.contains('is-closed') &&
      !e.target.closest('#app-window') &&
      !e.target.closest('#mac-dock')
    ) {
      windowEl.classList.remove('is-closed', 'is-minimized');
    }
  });
}
