import {saveCanvas, togglePressed} from './beauty-tools.mjs';

const fingers = [
  {name:'Polegar', x:85, y:681, width:76, height:99, angle:-.59},
  {name:'Indicador', x:379, y:164, width:70, height:81, angle:-.10},
  {name:'Médio', x:593, y:81, width:77, height:86, angle:0},
  {name:'Anelar', x:792, y:165, width:68, height:82, angle:.17},
  {name:'Mínimo', x:979, y:364, width:55, height:72, angle:.29},
];
const templateWidth = 1122;
const templateHeight = 1402;
const colors = {
  natural:null, nude:'#b97469', rosa:'#d892a1', bordo:'#732742',
  vermelho:'#ab292e', marfim:'#f1e4cf', chocolate:'#704339', preto:'#232027', lilas:'#ad8ac1',
};
const lengthFactors = {curta:0, media:.20, longa:.40};
const initial = {color:'natural', shape:'oval', length:'curta', design:'nenhuma'};
const studio = document.querySelector('[data-nail-studio]');
const canvas = studio.querySelector('canvas');
const context = canvas.getContext('2d');
const stage = studio.querySelector('[data-nail-stage]');
const palette = [...studio.querySelectorAll('[data-choice]')];
const status = studio.querySelector('[data-tool-status]');
const selection = studio.querySelector('[data-current-nail]');
const save = studio.querySelector('[data-save-nails]');
const hand = new Image();
const designs = fingers.map(() => ({...initial}));
let selected = 1;
let drag;
let draggedButton;

const targets = fingers.map((finger, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nail-target';
  button.dataset.finger = index;
  button.setAttribute('aria-label', finger.name);
  button.style.left = 100 * finger.x / templateWidth + '%';
  button.style.top = 100 * finger.y / templateHeight + '%';
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

function nailPath(ctx, width, top, bottom, shape) {
  const side = width / 2;
  ctx.beginPath();
  ctx.moveTo(-side, bottom - 4);
  ctx.quadraticCurveTo(-side, bottom, -side * .63, bottom);
  ctx.quadraticCurveTo(0, bottom + 3, side * .63, bottom);
  ctx.quadraticCurveTo(side, bottom, side, bottom - 4);
  if (shape === 'quadrada') {
    ctx.lineTo(side, top + 5);
    ctx.quadraticCurveTo(side, top, side * .78, top);
    ctx.lineTo(-side * .78, top);
    ctx.quadraticCurveTo(-side, top, -side, top + 5);
  } else if (shape === 'amendoada') {
    ctx.bezierCurveTo(side, top + 14, side * .43, top + 1, 0, top);
    ctx.bezierCurveTo(-side * .43, top + 1, -side, top + 14, -side, bottom - 4);
  } else {
    ctx.bezierCurveTo(side, top + 5, side * .57, top, 0, top);
    ctx.bezierCurveTo(-side * .57, top, -side, top + 5, -side, bottom - 4);
  }
  ctx.closePath();
}

function drawDecoration(ctx, design, width, top, height) {
  if (design === 'francesinha') {
    ctx.strokeStyle = '#fff5e7';
    ctx.lineWidth = Math.max(3, height * .10);
    ctx.beginPath();
    ctx.moveTo(-width * .68, top + height * .24);
    ctx.quadraticCurveTo(0, top - height * .05, width * .68, top + height * .24);
    ctx.stroke();
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
  context.drawImage(hand, 0, 0, canvas.width, canvas.height);
  context.save();
  context.scale(canvas.width / templateWidth, canvas.height / templateHeight);
  for (let index = 0; index < fingers.length; index++) {
    const config = designs[index];
    const color = colors[config.color];
    if (!color && config.shape === initial.shape && config.length === initial.length && config.design === initial.design) continue;
    const {x,y,angle,width,height} = fingers[index];
    const bottom = height * .46;
    const top = -height * (.52 + lengthFactors[config.length]);
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    nailPath(context, width, top, bottom, config.shape);
    context.clip();
    if (color || config.length !== initial.length || config.shape !== initial.shape) {
      context.fillStyle = color || '#d3a18b';
      context.fillRect(-width, top, width * 2, bottom - top + 4);
      const shine = context.createLinearGradient(-width / 2, 0, width / 2, 0);
      shine.addColorStop(0, '#21110e40');
      shine.addColorStop(.29, '#fff9e73b');
      shine.addColorStop(.62, '#fff9e708');
      shine.addColorStop(1, '#21110e34');
      context.fillStyle = shine;
      context.fillRect(-width, top, width * 2, bottom - top + 4);
    }
    drawDecoration(context, config.design, width, top, bottom - top);
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
    await saveCanvas(canvas, 'romeu-beauty-minhas-unhas.png');
    status.textContent = 'Referência pronta para enviar à Giovana.';
  } catch {
    status.textContent = 'Não foi possível salvar. Tente novamente.';
  }
});
select(1);
hand.onload = () => { render(); save.disabled = false; };
hand.onerror = () => { status.textContent = 'Não foi possível carregar a mão. Atualize a página para tentar de novo.'; };
hand.src = '/assets/images/atelie-mao.jpg';
for (const swatch of studio.querySelectorAll('.nail-swatch')) {
  const color = colors[swatch.closest('button').dataset.value] || '#e5af9d';
  swatch.style.setProperty('--swatch', color);
}
