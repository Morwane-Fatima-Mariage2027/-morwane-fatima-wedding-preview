(() => {
  const I18N = window.WEDDING_I18N || {};
  const root = document.documentElement;
  const body = document.body;
  const entry = document.getElementById('entry');
  const site = document.getElementById('site');
  const openButton = document.getElementById('openInvitation');
  const photo = document.getElementById('couplePhoto');
  const photoMissing = document.getElementById('photoMissing');
  const formLanguage = document.getElementById('formLanguage');
  let lang = localStorage.getItem('mf-wedding-lang') || 'fr';

  function setLanguage(nextLang) {
    if (!I18N[nextLang]) nextLang = 'fr';
    lang = nextLang;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (formLanguage) formLanguage.value = lang;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (I18N[lang][key] != null) node.textContent = I18N[lang][key];
    });
    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    localStorage.setItem('mf-wedding-lang', lang);
  }

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  function revealSite() {
    entry.classList.add('is-leaving');
    site.classList.add('is-visible');
    site.setAttribute('aria-hidden', 'false');
    body.classList.remove('is-locked');
    window.setTimeout(() => {
      entry.hidden = true;
    }, 720);
  }

  openButton.addEventListener('click', () => {
    entry.classList.add('is-opening');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(revealSite, reduced ? 40 : 1450);
  });

  function updateCountdown() {
    const target = new Date('2027-05-25T00:00:00');
    const diff = Math.max(0, target.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  if (photo) {
    photo.addEventListener('error', () => {
      photo.hidden = true;
      photoMissing.hidden = false;
    }, {once:true});
  }

  const revealNodes = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add('is-visible');
          observer.unobserve(item.target);
        }
      });
    }, {threshold:.12});
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  const travelContent = document.getElementById('travelContent');
  document.querySelectorAll('.travel-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.travel-tab').forEach((item) => item.classList.remove('is-active'));
      tab.classList.add('is-active');
      travelContent.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = I18N[lang]['travel.pending'];
      travelContent.appendChild(p);
    });
  });

  const form = document.getElementById('rsvpForm');
  const steps = [...form.querySelectorAll('.form-step')];
  const progress = [...form.querySelectorAll('.form-progress span')];
  const next = document.getElementById('nextStep');
  const prev = document.getElementById('prevStep');
  const submit = document.getElementById('submitRsvp');
  let currentStep = 0;

  function renderStep() {
    steps.forEach((step, index) => {
      const active = index === currentStep;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });
    progress.forEach((bar, index) => bar.classList.toggle('is-active', index <= currentStep));
    prev.hidden = currentStep === 0;
    next.hidden = currentStep === steps.length - 1;
    submit.hidden = currentStep !== steps.length - 1;
  }

  function currentStepValid() {
    const controls = [...steps[currentStep].querySelectorAll('input,textarea,select')];
    for (const control of controls) {
      if (!control.checkValidity()) {
        control.reportValidity();
        return false;
      }
    }
    return true;
  }

  next.addEventListener('click', () => {
    if (!currentStepValid()) return;
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    renderStep();
    steps[currentStep].scrollIntoView({behavior:'smooth', block:'center'});
  });
  prev.addEventListener('click', () => {
    currentStep = Math.max(currentStep - 1, 0);
    renderStep();
  });
  form.addEventListener('submit', (event) => {
    if (!currentStepValid()) event.preventDefault();
  });

  renderStep();
  setLanguage(lang);
})();