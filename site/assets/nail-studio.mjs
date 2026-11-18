import {saveCanvas, togglePressed} from './beauty-tools.mjs';

// Coordinates and nail beds measured on the 800-pixel-wide hand photo.
const fingers = [
  {name:'Polegar', x:63, y:486, angle:-.59, left:-25, right:30, tip:-37, base:31},
  {name:'Indicador', x:272, y:119, angle:-.10, left:-22, right:23, tip:-28, base:27},
  {name:'Dedo médio', x:422, y:57, angle:.025, left:-25, right:26, tip:-32, base:31},
  {name:'Anelar', x:562, y:117, angle:.17, left:-22, right:23, tip:-29, base:29},
  {name:'Mínimo', x:697, y:258, angle:.29, left:-19, right:18, tip:-23, base:25},
];
const templateSize = 800;
const imageTop = 52;
const imageLeft = 21;
const colors = {
  natural:null, nude:'#bf8379', rosa:'#d892a1', bordo:'#732742',
  vermelho:'#ab292e', marfim:'#f1e4cf', chocolate:'#704339', preto:'#232027', lilas:'#ad8ac1',
};
const lengthFactors = {curta:0, media:.21, longa:.51};
const shapes = {
  oval: {tipWidth:0, shoulder:.65, edge:0},
  quadrada: {tipWidth:.83, shoulder:.91, edge:.10},
  amendoada: {tipWidth:0, shoulder:.33, edge:.014},
  bailarina: {tipWidth:.57, shoulder:.72, edge:.085},
};
const translucentPolish = {natural:.54, nude:.71, rosa:.82, marfim:.93, lilas:.93};
const initial = {color:'natural', shape:'oval', length:'curta', design:'nenhuma', finish:'brilho'};
const presets = {
  nude: {...initial, color:'nude'},
  francesinha: {...initial, color:'nude', shape:'oval', length:'media', design:'francesinha'},
  bordo: {...initial, color:'bordo', shape:'bailarina', length:'media'},
};
const studio = document.querySelector('[data-nail-studio]');
const canvas = studio.querySelector('canvas');
const context = canvas.getContext('2d');
const stage = studio.querySelector('[data-nail-stage]');
const palette = [...studio.querySelectorAll('[data-choice]')];
const categoryButtons = [...studio.querySelectorAll('[data-nail-category]')];
const categoryPanels = [...studio.querySelectorAll('[data-nail-options]')];
const status = studio.querySelector('[data-tool-status]');
const selection = studio.querySelector('[data-current-nail]');
const save = studio.querySelector('[data-save-nails]');
const hand = new Image();
const designs = fingers.map(() => ({...presets.nude}));
let nailLighting = [];
let selected = 1;
let drag;
let draggedButton;

const targets = fingers.map((finger, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nail-target';
  button.dataset.finger = index;
  button.setAttribute('aria-label', finger.name);
  button.style.left = 100 * (finger.x + imageLeft) / templateSize + '%';
  button.style.top = 100 * (finger.y + imageTop) / templateSize + '%';
  button.addEventListener('click', () => select(index));
  stage.append(button);
  return button;
});

function select(index) {
  selected = index;
  togglePressed(targets, targets[index]);
  selection.textContent = fingers[index].name;
  for (const button of palette) {
    const isCurrent = designs[index][button.dataset.choice] === button.dataset.value;
    button.setAttribute('aria-pressed', String(isCurrent));
  }
}

function nailPath(ctx, finger, top, shape) {
  const {left, right, tip, base} = finger;
  const center = (left + right) / 2;
  const half = (right - left) / 2;
  const bedHeight = base - tip;
  const shoulderY = tip + bedHeight * .44;
  const rim = Math.min(4, half * .16);
  const tipHalf = half * shape.tipWidth;
  const curve = bedHeight * shape.edge;
  const extension = tip - top;

  ctx.beginPath();
  ctx.moveTo(center - half * .65, base);
  ctx.bezierCurveTo(center - half * .18, base + 3, center + half * .52, base + 2, center + half * .73, base - 3);
  ctx.bezierCurveTo(right - 2, base - 7, right, base - bedHeight * .26, right, shoulderY);
  ctx.bezierCurveTo(right - 1, tip + bedHeight * (.17 - shape.shoulder * .08),
    center + half * shape.shoulder, top + curve, center + tipHalf, top);
  ctx.quadraticCurveTo(center, top - (tipHalf ? rim * .38 : 0), center - tipHalf, top);
  ctx.bezierCurveTo(center - half * shape.shoulder, top + curve,
    left + 2, tip + bedHeight * .11 + extension * .05, left, shoulderY);
  ctx.bezierCurveTo(left - 1, base - bedHeight * .31, left + 1, base - 4, center - half * .65, base);
  ctx.closePath();
}

function sampleNailLighting(finger) {
  const sample = document.createElement('canvas');
  sample.width = 32;
  sample.height = 42;
  const ctx = sample.getContext('2d', {willReadFrequently:true});
  const {x, y, angle, left, right, tip, base} = finger;
  const width = (right - left) * .55;
  const height = (base - tip) * .61;
  ctx.translate(sample.width / 2, sample.height / 2);
  ctx.scale(sample.width / width, sample.height / height);
  ctx.translate(-(left + right) / 2, -(tip + base) / 2);
  ctx.rotate(-angle);
  ctx.drawImage(hand, -x, -y);
  const light = ctx.getImageData(0, 0, sample.width, sample.height);
  const values = new Float32Array(sample.width * sample.height);
  for (let index = 0; index < values.length; index++) {
    const i = index * 4;
    values[index] = light.data[i] * .2126 + light.data[i + 1] * .7152 + light.data[i + 2] * .0722;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  for (let index = 0; index < values.length; index++) {
    const i = index * 4;
    const delta = values[index] - mean;
    const tone = delta > 0 ? 255 : 0;
    light.data[i] = light.data[i + 1] = light.data[i + 2] = tone;
    light.data[i + 3] = Math.min(92, Math.abs(delta) * 2.5);
  }
  ctx.putImageData(light, 0, 0);
  return sample;
}

function gelSurface(ctx, width, top, height, glossy, lighting) {
  // The darker sidewalls and broad reflected light give the coat its cross-section.
  const curvature = ctx.createLinearGradient(-width * .49, 0, width * .51, 0);
  curvature.addColorStop(0, '#3f1c2b35');
  curvature.addColorStop(.18, '#4d2d3510');
  curvature.addColorStop(.42, '#fff3ed18');
  curvature.addColorStop(.64, '#fff5ed0b');
  curvature.addColorStop(.86, '#34202a15');
  curvature.addColorStop(1, '#3f1c2b32');
  ctx.fillStyle = curvature;
  ctx.fillRect(-width, top - 3, width * 2, height + 8);

  ctx.save();
  ctx.globalAlpha = glossy ? .54 : .34;
  ctx.drawImage(lighting, -width * .51, top - 1, width * 1.04, height + 5);
  ctx.restore();

  // A soft highlight follows the light in the photo and fades before the cuticle.
  ctx.save();
  ctx.translate(-width * .095, top + height * .38);
  ctx.rotate(-.085);
  ctx.scale(width * .27, height * .42);
  const reflection = ctx.createRadialGradient(0, 0, .05, 0, 0, 1);
  reflection.addColorStop(0, glossy ? '#fff9f650' : '#fff9f61e');
  reflection.addColorStop(.27, glossy ? '#fff8f444' : '#fff9f617');
  reflection.addColorStop(.68, glossy ? '#ffedf52b' : '#fff9f609');
  reflection.addColorStop(1, '#fff9f600');
  ctx.fillStyle = reflection;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

function drawDecoration(ctx, design, width, top, height) {
  if (design === 'francesinha') {
    const edge = top + height * .135;
    ctx.fillStyle = '#fff5ebeb';
    ctx.beginPath();
    ctx.moveTo(-width, top - 3);
    ctx.lineTo(width, top - 3);
    ctx.lineTo(width, edge - height * .12);
    ctx.quadraticCurveTo(0, edge + height * .17, -width, edge - height * .12);
    ctx.closePath();
    ctx.fill();
  } else if (design === 'glitter') {
    for (let i = 0; i < 34; i++) {
      const x = ((i * 73 % 97) / 97 - .5) * width;
      const y = top + (i * 41 % 93) / 93 * height;
      ctx.fillStyle = i % 2 ? '#fff1b8bb' : '#ffe5ce88';
      ctx.beginPath();
      ctx.arc(x, y, .5 + i % 3 * .47, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (design === 'coracao') {
    const size = width * .23;
    const y = top + height * .54;
    ctx.fillStyle = '#ffefe1';
    ctx.beginPath();
    ctx.moveTo(0, y + size);
    ctx.bezierCurveTo(-size * 2, y - size * .20, -size, y - size * 1.5, 0, y - size * .45);
    ctx.bezierCurveTo(size, y - size * 1.5, size * 2, y - size * .20, 0, y + size);
    ctx.fill();
  } else if (design === 'flor') {
    const y = top + height * .53;
    const radius = width * .115;
    ctx.fillStyle = '#fff2e7';
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius * 1.53, y + Math.sin(angle) * radius * 1.53, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#b68349';
    ctx.beginPath();
    ctx.arc(0, y, radius * .66, 0, Math.PI * 2);
    ctx.fill();
  }
}

function render() {
  if (!hand.complete || !hand.naturalWidth) return;
  context.save();
  context.scale(canvas.width / templateSize, canvas.height / templateSize);
  const photoWidth = templateSize - imageLeft;
  const photoHeight = templateSize - imageTop;
  context.drawImage(hand, 0, 0, photoWidth, 1, imageLeft, 0, photoWidth, imageTop);
  context.drawImage(hand, 0, 0, 1, 1, 0, 0, imageLeft, imageTop);
  context.drawImage(hand, 0, 0, 1, photoHeight, 0, imageTop, imageLeft, photoHeight);
  context.drawImage(hand, 0, 0, photoWidth, photoHeight, imageLeft, imageTop, photoWidth, photoHeight);

  for (const [index, finger] of fingers.entries()) {
    const config = designs[index];
    if (Object.keys(initial).every(key => config[key] === initial[key])) continue;

    const {x, y, angle, left, right, tip, base} = finger;
    const width = right - left;
    const newShape = config.shape !== initial.shape;
    const extension = (base - tip) * lengthFactors[config.length] + (newShape ? 4 : 0);
    const top = tip - extension;
    const height = base - top;
    const glossy = config.finish === 'brilho';

    context.save();
    context.translate(x + imageLeft, y + imageTop);
    context.rotate(angle);
    nailPath(context, finger, top, shapes[config.shape]);
    if (extension > 4) {
      context.save();
      context.shadowColor = '#4f30262b';
      context.shadowBlur = 2.3;
      context.shadowOffsetY = 1.9;
      context.fillStyle = '#4f30262f';
      context.fill();
      context.restore();
    }
    context.clip();

    // Keep the photo's own detail in translucent colors and lay gel over the free edge.
    if (colors[config.color] || extension > 0 || !glossy) {
      const coverage = translucentPolish[config.color] ?? .98;
      const pigment = colors[config.color] || '#dbac9c';
      const coat = context.createLinearGradient(0, top, 0, base + 3);
      const edge = extension / height;
      coat.addColorStop(0, pigment);
      coat.addColorStop(Math.max(.035, edge), pigment);
      coat.addColorStop(Math.min(.76, edge + .20), pigment + Math.round(coverage * 255).toString(16).padStart(2, '0'));
      coat.addColorStop(1, pigment + Math.round(coverage * 237).toString(16).padStart(2, '0'));
      context.fillStyle = coat;
      context.fillRect(-width, top - 3, width * 2, height + 8);
    }
    drawDecoration(context, config.design, width, top, height);
    gelSurface(context, width, top, height, glossy, nailLighting[index]);
    context.restore();
  }
  context.restore();
}

function applyOption(button, index) {
  const {choice, value} = button.dataset;
  designs[index][choice] = value;
  select(index);
  render();
  status.textContent = 'Opção ' + button.textContent.trim().toLocaleLowerCase('pt-BR') + ' aplicada à unha do ' + fingers[index].name.toLowerCase() + '.';
}

function dropTarget(event) {
  return document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-finger]');
}

function finishDrag(event, cancelled = false) {
  if (!drag || drag.pointer !== event.pointerId) return;
  if (drag.ghost) {
    const target = cancelled ? null : dropTarget(event);
    draggedButton = drag.button;
    if (target) applyOption(drag.button, Number(target.dataset.finger));
    drag.ghost.remove();
    stage.classList.remove('is-dragging');
    for (const target of targets) target.classList.remove('is-drop-target');
  }
  drag = undefined;
}

for (const button of palette) {
  button.addEventListener('click', event => {
    if (draggedButton === button && event.detail > 0) {
      draggedButton = undefined;
      return;
    }
    applyOption(button, selected);
  });
  button.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag) return;
    draggedButton = undefined;
    button.setPointerCapture(event.pointerId);
    drag = {button, pointer:event.pointerId, x:event.clientX, y:event.clientY};
  });
  button.addEventListener('pointermove', event => {
    if (drag?.pointer !== event.pointerId) return;
    if (!drag.ghost && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8) {
      drag.ghost = document.createElement('span');
      drag.ghost.className = 'tool-drag-ghost';
      drag.ghost.textContent = button.textContent.trim();
      drag.ghost.setAttribute('aria-hidden', 'true');
      document.body.append(drag.ghost);
      stage.classList.add('is-dragging');
    }
    if (!drag.ghost) return;
    drag.ghost.style.left = event.clientX + 'px';
    drag.ghost.style.top = event.clientY + 'px';
    const target = dropTarget(event);
    for (const finger of targets) finger.classList.toggle('is-drop-target', finger === target);
  });
  button.addEventListener('pointerup', finishDrag);
  button.addEventListener('pointercancel', event => finishDrag(event, true));
  button.addEventListener('lostpointercapture', event => finishDrag(event, true));
}

for (const button of categoryButtons) {
  button.addEventListener('click', () => {
    togglePressed(categoryButtons, button);
    for (const panel of categoryPanels) panel.hidden = panel.dataset.nailOptions !== button.dataset.nailCategory;
  });
}
for (const button of studio.querySelectorAll('[data-nail-preset]')) {
  button.addEventListener('click', () => {
    for (const design of designs) Object.assign(design, presets[button.dataset.nailPreset]);
    select(selected);
    render();
    status.textContent = 'Modelo aplicado a todas as unhas.';
  });
}

studio.querySelector('[data-apply-all]').addEventListener('click', () => {
  const source = {...designs[selected]};
  for (const design of designs) Object.assign(design, source);
  render();
  status.textContent = 'O desenho foi aplicado a todas as unhas.';
});
studio.querySelector('[data-reset-nails]').addEventListener('click', () => {
  for (const design of designs) Object.assign(design, initial);
  select(1);
  render();
  status.textContent = 'O desenho foi limpo.';
});
save.addEventListener('click', async () => {
  try {
    await saveCanvas(canvas, 'romeu-beauty-minhas-unhas-em-gel.png');
    status.textContent = 'Referência pronta para enviar à Giovana.';
  } catch {
    status.textContent = 'Não foi possível salvar. Tente novamente.';
  }
});
select(1);
hand.onload = () => {
  nailLighting = fingers.map(sampleNailLighting);
  render();
  save.disabled = false;
};
hand.onerror = () => { status.textContent = 'Não foi possível carregar a mão. Atualize a página para tentar de novo.'; };
hand.src = '/assets/images/atelie-mao.jpg';
for (const swatch of studio.querySelectorAll('.nail-swatch')) {
  const color = colors[swatch.closest('button').dataset.value] || '#e5af9d';
  swatch.style.setProperty('--swatch', color);
}
