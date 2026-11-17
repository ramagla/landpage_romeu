import {summarize, whatsappUrl} from './intake-model.mjs';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Abrir menu');
  navigation?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {closeMenu();menu.focus();}
  if (event.key === 'Tab' && navigation?.classList.contains('is-open')) {
    const links = navigation.querySelectorAll('a');
    const last = links[links.length - 1];
    if (event.shiftKey && document.activeElement === menu) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();menu.focus();}
  }
});
window.matchMedia('(min-width: 1051px)').addEventListener('change', closeMenu);

// Contact panel: visitors choose the subject before opening the real WhatsApp link.
const whatsappLauncher = document.querySelector('[data-whatsapp-open]');
const whatsappPanel = document.querySelector('.whatsapp-panel');
const whatsappTopic = document.querySelector('[data-whatsapp-topic]');
const whatsappStart = document.querySelector('[data-whatsapp-start]');
const contactMessages = {
  horario: 'Olá, Romeu! Vim pelo site e gostaria de combinar um horário.',
  corte: 'Olá, Romeu! Vim pelo site e gostaria de conversar sobre corte e visagismo.',
  cor: 'Olá, Romeu! Vim pelo site e gostaria de conversar sobre cor, mechas ou Gloss Express.',
  glaucia: 'Olá! Vim pelo site e gostaria de consultar os serviços e horários com Glaucia.',
  domicilio: 'Olá, Romeu! Vim pelo site e gostaria de consultar as condições do atendimento a domicílio.'
};
function updateContactLink() {
  if (whatsappStart) whatsappStart.href = `https://wa.me/5511964698679?text=${encodeURIComponent(contactMessages[whatsappTopic.value] || contactMessages.horario)}`;
}
if (whatsappLauncher && whatsappPanel && typeof whatsappPanel.showModal === 'function') {
  whatsappLauncher.hidden = false;
  updateContactLink();
  whatsappLauncher.addEventListener('click', () => {
    closeMenu();
    whatsappPanel.showModal();
    whatsappLauncher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('contact-open');
  });
  whatsappPanel.querySelector('[data-whatsapp-close]').addEventListener('click', () => whatsappPanel.close());
  whatsappPanel.addEventListener('click', event => {
    const box = whatsappPanel.getBoundingClientRect();
    if (event.target === whatsappPanel && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) whatsappPanel.close();
  });
  whatsappPanel.addEventListener('close', () => {
    whatsappLauncher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('contact-open');
    whatsappLauncher.focus({preventScroll: true});
  });
  whatsappPanel.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const first = whatsappPanel.querySelector('[data-whatsapp-close]');
    const last = whatsappStart;
    if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
    else if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
  });
  whatsappTopic.addEventListener('change', updateContactLink);
}

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  gallery.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    gallery.classList.toggle('is-filtered', filter !== 'all');
    gallery.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    let matches = 0;
    const limit = Number(gallery.dataset.galleryLimit) || Infinity;
    gallery.querySelectorAll('[data-category]').forEach(card => {
      const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      if (match) matches++;
      card.hidden = !match || count >= limit;
      if (!card.hidden) count++;
    });
    gallery.querySelector('[data-gallery-status]').textContent = `${count} ${count === 1 ? 'resultado' : 'resultados'}${matches > count ? ' em destaque. Veja a seleção completa na página de resultados.' : ''}`;
    gallery.dispatchEvent(new Event('gallerychange'));
  }));
});

const dialog = document.querySelector('.image-dialog');
let imageOpener;
document.querySelectorAll('.image-open').forEach(button => button.addEventListener('click', () => {
  if (!dialog || typeof dialog.showModal !== 'function') {window.open(button.dataset.image, '_blank', 'noopener');return;}
  imageOpener = button;
  dialog.querySelector('img').src = button.dataset.image;
  dialog.querySelector('img').alt = button.dataset.caption;
  dialog.querySelector('p').textContent = button.dataset.caption;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
dialog?.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
dialog?.addEventListener('close', () => {document.body.classList.remove('dialog-open');imageOpener?.focus();});
document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
  document.querySelectorAll('video').forEach(other => {if (other !== video) other.pause();});
}));

document.querySelectorAll('[data-intake]').forEach(form => {
  let step = 0;
  const answers = {};
  const fields = Array.from(form.querySelectorAll('[data-step]'));
  const back = form.querySelector('[data-intake-back]');
  const next = form.querySelector('[data-intake-next]');
  const summary = form.querySelector('[data-intake-summary]');
  const stepLabel = form.querySelector('[data-step-label]');
  const progress = form.querySelector('[data-progress]');
  function render(focus = false) {
    const done = step === fields.length;
    fields.forEach((field, i) => {field.hidden = i !== step;field.disabled = i !== step;});
    summary.hidden = !done;
    back.hidden = step === 0;
    next.hidden = done;
    next.disabled = !done && !fields[step].querySelector('input:checked');
    next.firstChild.textContent = step === 2 ? 'Ver meu resumo ' : 'Continuar ';
    stepLabel.textContent = done ? 'Seu resumo' : ['Sua ideia', 'Sua rotina', 'Sua mudança'][step];
    progress.style.width = `${done ? 100 : (step + 1) / 3 * 100}%`;
    if (done) {
      const list = form.querySelector('[data-summary-list]');
      list.replaceChildren();
      summarize(answers).forEach(row => {
        const dt = document.createElement('dt');dt.textContent = row.label;
        const dd = document.createElement('dd');dd.textContent = row.text;
        list.append(dt, dd);
      });
      form.querySelector('[data-intake-whatsapp]').href = whatsappUrl(answers);
    }
    if (focus) {
      const target = done ? summary.querySelector('h3') : fields[step].querySelector('legend');
      target.setAttribute('tabindex', '-1');target.focus({preventScroll: true});
      if (window.innerWidth < 700) form.scrollIntoView({block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('change', event => {
    if (event.target.matches('input[type="radio"]')) {answers[event.target.name] = event.target.value;render();}
  });
  next.addEventListener('click', () => {
    const chosen = fields[step]?.querySelector('input:checked');
    if (!chosen) return;
    answers[chosen.name] = chosen.value;step++;render(true);
  });
  back.addEventListener('click', () => {step = Math.max(0, step - 1);render(true);});
  form.querySelector('[data-intake-reset]').addEventListener('click', () => {
    form.reset();Object.keys(answers).forEach(key => delete answers[key]);step = 0;render(true);
  });
  render();
});

const search = document.querySelector('#article-search');
let activeCategory = 'all';
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filterArticles() {
  const query = normalize(search?.value.trim() || '');
  let count = 0;
  document.querySelectorAll('[data-article]').forEach(card => {
    card.hidden = !(normalize(card.dataset.search).includes(query) && (activeCategory === 'all' || card.dataset.articleCategory === activeCategory));
    if (!card.hidden) count++;
  });
  const status = document.querySelector('[data-search-status]');
  if (status) status.textContent = `${count} ${count === 1 ? 'artigo encontrado' : 'artigos encontrados'}`;
  const empty = document.querySelector('[data-no-articles]');if (empty) empty.hidden = count > 0;
}
search?.addEventListener('input', filterArticles);
document.querySelectorAll('[data-blog-filter]').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.blogFilter;
  document.querySelectorAll('[data-blog-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterArticles();
}));

// Editorial tabs: a practical explanation of the choices behind visagismo.
document.querySelectorAll('.vision-tabs').forEach(list => {
  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
  function select(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    list.closest('.vision-chapter').dataset.focus = tab.dataset.vision;
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();select(tabs[next], true);
    });
  });
});

document.querySelectorAll('[data-films]').forEach(films => {
  const track = films.querySelector('[data-film-track]');
  const back = films.querySelector('[data-film-back]');
  const next = films.querySelector('[data-film-next]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function move(direction) {
    const card = track.querySelector('.video-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    track.scrollBy({left: direction * (card.getBoundingClientRect().width + gap), behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  function update() {
    back.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  back.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, {passive: true});
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault();move(event.key === 'ArrowRight' ? 1 : -1);}
  });
  window.addEventListener('resize', update, {passive: true});update();
});

// One scheduled frame per native scroll. No wheel interception or scroll library.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const portraitMotion = window.matchMedia('(max-width: 600px) and (min-height: 620px)');
const movingPlanes = Array.from(document.querySelectorAll('[data-parallax]:not(.hero-image-plane)'));
const header = document.querySelector('.site-header');
const hero = document.querySelector('.atelier-hero');
const heroStage = document.querySelector('[data-hero-stage]');
const vision = document.querySelector('.vision-chapter');
const gloss = document.querySelector('.gloss-editorial');
const galleryScenes = Array.from(document.querySelectorAll('.page-home [data-gallery]')).map(gallery => ({
  gallery, stage: gallery.querySelector('[data-gallery-stage]'), window: gallery.querySelector('.gallery-window'),
  track: gallery.querySelector('.results-grid'), back: gallery.querySelector('[data-gallery-back]'),
  next: gallery.querySelector('[data-gallery-next]'), count: gallery.querySelector('[data-gallery-count]'),
  cards: [], travel: 0, runway: 0, index: 0, active: false, stickyTop: 90
}));
let frame = 0;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const motionEnabled = () => !reduceMotion.matches;
function measureGalleries() {
  galleryScenes.forEach(scene => {
    scene.active = portraitMotion.matches && motionEnabled();
    scene.gallery.classList.toggle('gallery-motion', scene.active);
    scene.cards = Array.from(scene.track.querySelectorAll('.result-card')).filter(card => !card.hidden);
    if (!scene.active) {
      scene.stage.style.removeProperty('--gallery-stage-height');
      scene.gallery.style.removeProperty('--gallery-x');
      return;
    }
    const width = scene.window.clientWidth;
    const gap = parseFloat(getComputedStyle(scene.track).columnGap) || 24;
    const cardWidth = scene.cards[0]?.getBoundingClientRect().width || width;
    // Use the CSS width, not the perspective-transformed bounding box, on resize.
    scene.cardWidth = parseFloat(getComputedStyle(scene.cards[0]).width) || cardWidth;
    scene.gap = gap;
    scene.travel = Math.max(0, scene.cards.length * (scene.cardWidth + gap) - gap - width);
    scene.runway = scene.travel * .92;
    scene.windowWidth = width;
    scene.stage.style.setProperty('--gallery-stage-height', `${Math.ceil(scene.window.offsetHeight + scene.runway)}px`);
    scene.gallery.style.setProperty('--gallery-x', '0px');
  });
  scheduleScroll();
}
function syncMotion() {
  document.documentElement.classList.toggle('motion-active', motionEnabled());
  document.documentElement.classList.toggle('motion-paused', !motionEnabled());
  measureGalleries();
}
function moveGallery(scene, index, behavior = 'smooth') {
  if (!scene.active || !scene.runway) return;
  const next = clamp(index, 0, scene.cards.length - 1);
  const y = window.scrollY + scene.stage.getBoundingClientRect().top - scene.stickyTop + scene.runway * next / (scene.cards.length - 1);
  window.scrollTo({top: y, behavior: motionEnabled() ? behavior : 'instant'});
}
galleryScenes.forEach(scene => {
  scene.gallery.addEventListener('gallerychange', measureGalleries);
  scene.back.addEventListener('click', () => moveGallery(scene, scene.index - 1));
  scene.next.addEventListener('click', () => moveGallery(scene, scene.index + 1));
  scene.track.addEventListener('focusin', event => {
    if (!scene.active || !event.target.matches(':focus-visible')) return;
    const index = scene.cards.indexOf(event.target.closest('.result-card'));
    if (index >= 0) moveGallery(scene, index, 'instant');
  });
  let touchStart;
  let suppressClickUntil = 0;
  scene.track.addEventListener('pointerdown', event => {
    if (scene.active && event.pointerType === 'touch') touchStart = {x: event.clientX, y: event.clientY};
  }, {passive: true});
  scene.track.addEventListener('pointercancel', () => {touchStart = null;}, {passive: true});
  scene.track.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      suppressClickUntil = performance.now() + 450;
      moveGallery(scene, scene.index + (dx < 0 ? 1 : -1));
    }
  }, {passive: true});
  scene.track.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) {event.preventDefault();event.stopPropagation();}
  }, true);
});
function paintScroll() {
  frame = 0;
  const height = window.innerHeight;
  const max = document.documentElement.scrollHeight - height;
  document.documentElement.style.setProperty('--page-progress', max > 0 ? String(window.scrollY / max) : '0');
  header?.classList.toggle('is-scrolled', window.scrollY > 30);
  const mobile = window.innerWidth < 700;
  const updates = movingPlanes.map(plane => {
    const rect = plane.getBoundingClientRect();
    const scene = plane.closest('[data-scene]');
    const box = scene ? scene.getBoundingClientRect() : rect;
    const active = box.bottom > -100 && box.top < height + 100;
    const shift = !motionEnabled() || !active ? 0 : clamp((height / 2 - (box.top + box.height / 2)) / height, -1, 1) * Number(plane.dataset.parallax) * (mobile ? 620 : 650);
    return [plane, clamp(shift, mobile ? -70 : -52, mobile ? 70 : 52)];
  });
  const heroBox = hero?.getBoundingClientRect();
  const stageBox = heroStage?.getBoundingClientRect();
  const visionBox = vision?.getBoundingClientRect();
  const glossBox = gloss?.getBoundingClientRect();
  const galleryUpdates = galleryScenes.filter(scene => scene.active).map(scene => {
    const box = scene.stage.getBoundingClientRect();
    const progress = scene.runway ? clamp((scene.stickyTop - box.top) / scene.runway) : 0;
    return {scene, progress, x: -scene.travel * progress};
  });
  // Layout reads precede writes so the scroll frame doesn't repeatedly force reflow.
  updates.forEach(([plane, shift]) => plane.style.setProperty('--shift-y', `${shift.toFixed(2)}px`));
  if (heroBox) {
    const progress = motionEnabled() ? clamp((74 - stageBox.top) / (portraitMotion.matches ? Math.max(1, stageBox.height - heroBox.height) : heroBox.height)) : 0;
    hero.classList.toggle('is-in-view', heroBox.bottom > 0 && heroBox.top < height);
    hero.style.setProperty('--hero-photo-y', `${(-progress * (mobile ? 110 : 95)).toFixed(1)}px`);
    hero.style.setProperty('--hero-photo-scale', (1 + progress * .075).toFixed(3));
    hero.style.setProperty('--hero-type-x', `${(progress * (mobile ? 12 : 22)).toFixed(1)}px`);
    hero.style.setProperty('--hero-type-y', `${(-progress * (mobile ? 49 : 35)).toFixed(1)}px`);
    hero.style.setProperty('--arc-x', `${(progress * 90).toFixed(1)}px`);
    hero.style.setProperty('--arc-y', `${(-progress * 80).toFixed(1)}px`);
    hero.style.setProperty('--arc-rotation', `${(-23 + progress * 38).toFixed(1)}deg`);
  }
  if (visionBox) {
    const progress = motionEnabled() ? clamp((height - visionBox.top) / (height + visionBox.height)) : .5;
    vision.style.setProperty('--contour-turn', `${(-32 + progress * 64).toFixed(1)}deg`);
    vision.style.setProperty('--contour-roll', `${(-8 + progress * 16).toFixed(1)}deg`);
    vision.style.setProperty('--contour-draw', motionEnabled() ? (1400 * (1 - clamp(progress * 3.2))).toFixed(1) : '0');
    vision.style.setProperty('--portrait-shift', motionEnabled() ? `${((progress - .5) * 28).toFixed(1)}px` : '0px');
  }
  if (glossBox) {
    const progress = motionEnabled() ? clamp((height - glossBox.top) / (height + glossBox.height)) : .5;
    gloss.classList.toggle('is-in-view', glossBox.bottom > 0 && glossBox.top < height);
    gloss.style.setProperty('--metal-position', `${(progress * 100).toFixed(1)}%`);
    gloss.style.setProperty('--gloss-x', `${((progress - .5) * 40).toFixed(1)}px`);
    gloss.style.setProperty('--gloss-turn', `${((progress - .5) * -7).toFixed(1)}deg`);
  }
  galleryUpdates.forEach(({scene, progress, x}) => {
    scene.gallery.style.setProperty('--gallery-x', `${x.toFixed(1)}px`);
    scene.gallery.style.setProperty('--gallery-progress', String((1 + progress * (scene.cards.length - 1)) / scene.cards.length));
    scene.index = Math.round(progress * (scene.cards.length - 1));
    scene.count.textContent = `Fotografia ${scene.index + 1} de ${scene.cards.length}`;
    scene.back.disabled = scene.index === 0;
    scene.next.disabled = scene.index === scene.cards.length - 1;
    scene.cards.forEach((card, index) => {
      const relative = clamp((index * (scene.cardWidth + scene.gap) + scene.cardWidth / 2 + x - scene.windowWidth / 2) / scene.windowWidth, -1, 1);
      card.style.setProperty('--card-turn', `${(-relative * 11).toFixed(2)}deg`);
      card.style.setProperty('--card-scale', (1 - Math.abs(relative) * .08).toFixed(3));
    });
  });
}
function scheduleScroll() {if (!frame) frame = requestAnimationFrame(paintScroll);}
window.addEventListener('scroll', scheduleScroll, {passive: true});
window.addEventListener('resize', measureGalleries, {passive: true});
reduceMotion.addEventListener('change', syncMotion);
portraitMotion.addEventListener('change', measureGalleries);
document.fonts.ready.then(measureGalleries);
syncMotion();paintScroll();
// Only visible primary actions run the light sweep.
// The reduced-motion preference disables the effect.
if ('IntersectionObserver' in window) {
  const ctaObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('cta-in-view', entry.isIntersecting);
  }), {threshold: .35});
  document.querySelectorAll('.button-solid, .nav-cta').forEach(button => ctaObserver.observe(button));
}
if (hero) {
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || !motionEnabled()) return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 18}px`);
    hero.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 12}px`);
  }, {passive: true});
  hero.addEventListener('pointerleave', () => {hero.style.setProperty('--pointer-x', '0px');hero.style.setProperty('--pointer-y', '0px');});
}
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }), {threshold: .06, rootMargin: '0px 0px 20px 0px'});
  document.querySelectorAll('.result-card, .service-row, .team-card, .article-card, .gloss-editorial-copy, .vision-content, .portfolio-heading h2, .people-heading h2, .intake-intro h2, .guide-heading h2').forEach(item => {
    if (item.matches('.result-card') && item.closest('.page-home')) return;
    item.classList.add('reveal-ready');observer.observe(item);
  });
  reduceMotion.addEventListener('change', event => {
    if (event.matches) {observer.disconnect();document.querySelectorAll('.reveal-ready').forEach(item => item.classList.add('is-visible'));}
  });
}
