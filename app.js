(() => {
  'use strict';
  const promotion = document.getElementById('promotion-dialog');
  const preview = document.getElementById('preview-dialog');
  const checkout = document.getElementById('checkout-dialog');
  const dialogs = [promotion, preview, checkout];
  let lastFocus = null;

  function openDialog(dialog) {
    const previous = document.activeElement;
    const origin = previous instanceof HTMLElement && previous.closest('dialog') ? lastFocus : previous;
    dialogs.forEach(other => { if (other !== dialog && other.open) other.close(); });
    if (!dialog.open) {
      lastFocus = origin;
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
    }
  }

  function goToCheckout(offer) {
    const raw = window.SALES_CHECKOUTS?.[offer] || '';
    let url;
    try { url = new URL(raw); } catch { openDialog(checkout); return; }
    if (!['https:', 'http:'].includes(url.protocol)) { openDialog(checkout); return; }
    window.location.assign(url.href);
  }

  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'basic') openDialog(promotion);
      else if (action === 'full') goToCheckout('full');
      else if (action === 'promotion') goToCheckout('promotion');
      else if (action === 'decline') goToCheckout('basic');
    });
  });

  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('preview-dialog-title').textContent = button.dataset.title;
      const image = document.getElementById('preview-image');
      image.src = button.dataset.preview;
      image.alt = button.querySelector('img').alt;
      openDialog(preview);
    });
  });

  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.close).close());
  });

  dialogs.forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!dialogs.some(other => other.open)) {
        document.documentElement.classList.remove('dialog-open');
        if (lastFocus instanceof HTMLElement && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
      }
    });
  });
})();

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) { const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});},{threshold:.08}); document.querySelectorAll('.section-heading,.method-steps article,.preview-grid figure,.content-list li,.bonus-item,.offer-card,.faq-list').forEach(element=>{element.classList.add('reveal-ready');revealObserver.observe(element);}); }
