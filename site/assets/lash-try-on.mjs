import {photoFromFile, saveCanvas, togglePressed} from './beauty-tools.mjs';

const styles = {
  classico: {density:16, fan:1, length:.21, line:.014, band:.009, text:'Efeito mais leve, com fios espaçados e comprimento equilibrado.'},
  brasileiro: {density:21, fan:2, length:.25, line:.017, band:.015, text:'Volume intermediário, com mais definição ao longo dos olhos.'},
  egipcio: {density:22, fan:3, length:.28, line:.017, band:.018, cluster:true, text:'Efeito mais preenchido, com fios agrupados distribuídos pelo olhar.'},
  fox: {density:21, fan:2, length:.34, line:.018, band:.017, outer:true, text:'Fios mais longos nos cantos externos para alongar o olhar.'},
  mega: {density:25, fan:3, length:.33, line:.019, band:.024, text:'O efeito mais intenso da prévia, com maior densidade e contraste.'},
};
const upperLids = [
  [33,246,161,160,159,158,157,173,133],
  [362,398,384,385,386,387,388,466,263],
];
const anchors = [
  {label:'o canto externo do olho à esquerda da foto', x:.34, y:.44},
  {label:'o canto interno do olho à esquerda da foto', x:.46, y:.44},
  {label:'o canto interno do olho à direita da foto', x:.54, y:.44},
  {label:'o canto externo do olho à direita da foto', x:.66, y:.44},
];
const tool = document.querySelector('[data-lash-tool]');
const canvas = tool.querySelector('canvas');
const context = canvas.getContext('2d');
const base = document.createElement('canvas');
const stage = tool.querySelector('[data-lash-stage]');
const placeholder = tool.querySelector('[data-lash-placeholder]');
const status = tool.querySelector('[data-tool-status]');
const stylesButtons = [...tool.querySelectorAll('[data-lash-style]')];
const adjust = tool.querySelector('[data-adjust-eyes]');
const compare = tool.querySelector('[data-compare-lashes]');
const zoom = tool.querySelector('[data-zoom-lashes]');
const save = tool.querySelector('[data-save-lashes]');
const clear = tool.querySelector('[data-clear-photo]');
let detector;
let generation = 0;
let photoLoaded = false;
let frame;
let faceView;
let zoomed = false;
let eyes = [];
let manual = null;
let style = 'classico';
let original = false;

function getDetector() {
  if (!detector) {
    detector = (async () => {
      const root = '/assets/vendor/mediapipe-0.10.21/';
      const {FaceLandmarker, FilesetResolver} = await import(root + 'vision_bundle.mjs');
      const vision = await FilesetResolver.forVisionTasks(root + 'wasm');
      return FaceLandmarker.createFromOptions(vision, {
        baseOptions: {modelAssetPath: root + 'face_landmarker.task', delegate:'CPU'},
        runningMode:'IMAGE',
        numFaces:2,
        minFaceDetectionConfidence:.45,
      });
    })().catch(error => {
      detector = undefined;
      throw error;
    });
  }
  return detector;
}

function manualEye(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Array.from({length:9}, (_, index) => {
    const t = index / 8;
    const arc = Math.sin(Math.PI * t) * .14;
    return {x:start.x + dx * t + dy * arc, y:start.y + dy * t - dx * arc};
  });
}

function drawLashes(points, settings, side) {
  const start = points[0];
  const end = points[points.length - 1];
  const width = Math.hypot(end.x - start.x, end.y - start.y);
  if (width < 6) return;
  const tx = (end.x - start.x) / width;
  const ty = (end.y - start.y) / width;
  const nx = ty;
  const ny = -tx;
  const ink = '#211217';
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = ink + 'b5';
  context.lineWidth = Math.max(.65, width * settings.band);
  context.beginPath();
  points.slice(1, -1).forEach((point, index) => {
    const x = point.x + nx * width * .015;
    const y = point.y + ny * width * .015;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();

  for (let i = 1; i <= settings.density; i++) {
    const t = i / (settings.density + 1);
    const outer = side === 0 ? 1 - t : t;
    const scaled = t * (points.length - 1);
    const lower = Math.floor(scaled);
    const mix = scaled - lower;
    const a = points[lower];
    const b = points[lower + 1];
    const x = a.x + (b.x - a.x) * mix + nx * width * .009;
    const y = a.y + (b.y - a.y) * mix + ny * width * .009;
    const profile = settings.outer ? .27 + .73 * outer ** 1.55 : .38 + .62 * Math.sin(Math.PI * t) ** .58;
    const texture = settings.cluster ? (i % 3 === 0 ? 1.15 : .81) : 1 + ((i * 7 % 11) - 5) / 37;
    const length = width * settings.length * profile * texture;

    for (let strand = 0; strand < settings.fan; strand++) {
      const spread = (strand - (settings.fan - 1) / 2) * length * .38;
      const lean = (side === 0 ? -1 : 1) * length * (.22 + outer * (settings.outer ? .65 : .37)) + spread;
      const tipX = x + nx * length + tx * lean;
      const tipY = y + ny * length + ty * lean;
      const gradient = context.createLinearGradient(x, y, tipX, tipY);
      gradient.addColorStop(0, ink + 'ef');
      gradient.addColorStop(.59, ink + 'bf');
      gradient.addColorStop(1, ink + '25');
      context.strokeStyle = gradient;
      context.lineWidth = Math.max(.65, width * settings.line * (strand === 0 ? 1 : .8));
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(
        x + nx * length * .40, y + ny * length * .40,
        tipX - tx * lean * .18 - nx * length * .25, tipY - ty * lean * .18 - ny * length * .25,
        tipX, tipY,
      );
      context.stroke();
    }
  }
  context.restore();
}

function setFrame(x, y, width, height) {
  frame = {
    x: Math.max(0, Math.min(base.width - width, Math.round(x))),
    y: Math.max(0, Math.min(base.height - height, Math.round(y))),
    width,
    height,
  };
  canvas.width = width;
  canvas.height = height;
}

function frameFace(x, y, desiredSize) {
  const size = Math.min(base.width, base.height, Math.max(1, Math.round(desiredSize)));
  setFrame(x - size / 2, y - size / 2, size, size);
  faceView = {...frame};
  zoomed = false;
}

function zoomEyes(enabled) {
  if (enabled) {
    const left = eyes[0][0];
    const right = eyes[1].at(-1);
    const span = Math.max(1,right.x - left.x);
    const width = Math.min(base.width,Math.max(1,Math.round(span * 1.48)));
    const height = Math.min(base.height,Math.max(1,Math.round(width * .55)));
    setFrame((left.x + right.x - width) / 2,(left.y + right.y - height) / 2 - span * .09,width,height);
  } else {
    setFrame(faceView.x,faceView.y,faceView.width,faceView.height);
  }
  zoomed = enabled;
  render();
}

function render(showOriginal = original) {
  if (!photoLoaded) return;
  context.drawImage(base,frame.x,frame.y,frame.width,frame.height,0,0,canvas.width,canvas.height);
  context.save();
  context.translate(-frame.x,-frame.y);
  if (!showOriginal && !manual) eyes.forEach((eye, side) => drawLashes(eye, styles[style], side));
  if (manual) {
    context.save();
    context.lineWidth = Math.max(2, canvas.width * .003);
    for (const [index, point] of [...manual.points, manual.cursor].entries()) {
      context.strokeStyle = index === manual.points.length ? '#8d3254' : '#fff7e9';
      context.beginPath();
      context.arc(point.x, point.y, Math.max(6, canvas.width * .012), 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();
  }
  context.restore();
  compare.textContent = original ? 'Ver simulação' : 'Ver foto original';
  compare.setAttribute('aria-pressed', String(original));
  zoom.textContent = zoomed ? 'Ver rosto todo' : 'Ampliar olhos';
  zoom.setAttribute('aria-pressed', String(zoomed));
}

function setActions(detecting = false) {
  adjust.disabled = !photoLoaded || detecting;
  compare.disabled = !eyes.length || detecting || Boolean(manual);
  save.disabled = compare.disabled;
  zoom.disabled = compare.disabled;
  clear.disabled = !photoLoaded && !detecting;
}

function cursorFor(index) {
  const anchor = anchors[index];
  const corners = eyes.length ? [eyes[0][0],eyes[0].at(-1),eyes[1][0],eyes[1].at(-1)] : [];
  return corners[index] ? {...corners[index]} : {x:frame.x + anchor.x * canvas.width, y:frame.y + anchor.y * canvas.height};
}

function beginManual(message = '') {
  manual = {points:[], cursor:cursorFor(0)};
  original = false;
  stage.classList.add('is-calibrating');
  canvas.tabIndex = 0;
  adjust.textContent = 'Recomeçar ajuste';
  status.textContent = (message ? message + ' ' : '') + 'Marque ' + anchors[0].label + '.';
  setActions();
  render();
  canvas.focus();
}

function markPoint(point) {
  if (!manual) return;
  manual.points.push(point);
  const count = manual.points.length;
  if (count < anchors.length) {
    manual.cursor = cursorFor(count);
    status.textContent = 'Marque ' + anchors[count].label + '.';
  } else {
    const [leftOuter,leftInner,rightInner,rightOuter] = manual.points;
    if (leftInner.x - leftOuter.x < 6 || rightOuter.x - rightInner.x < 6) {
      beginManual('Marque cada olho da esquerda para a direita.');
      return;
    }
    eyes = [manualEye(leftOuter,leftInner),manualEye(rightInner,rightOuter)];
    const outerWidth = rightOuter.x - leftOuter.x;
    frameFace((leftOuter.x + rightOuter.x) / 2,(leftOuter.y + rightOuter.y) / 2 + outerWidth * .17,outerWidth * 2);
    manual = null;
    canvas.removeAttribute('tabindex');
    adjust.textContent = 'Ajustar posição';
    stage.classList.remove('is-calibrating');
    status.textContent = 'Posição ajustada. Escolha o estilo para comparar.';
    setActions();
  }
  render();
}

function removePhoto() {
  generation++;
  eyes = [];
  manual = null;
  photoLoaded = false;
  faceView = undefined;
  zoomed = false;
  original = false;
  base.width = base.height = 1;
  canvas.width = canvas.height = 1;
  canvas.hidden = true;
  placeholder.hidden = false;
  canvas.removeAttribute('tabindex');
  stage.classList.remove('is-calibrating');
  adjust.textContent = 'Ajustar posição';
  tool.setAttribute('aria-busy','false');
  setActions();
}

async function load(file) {
  if (!file) return;
  if (file.size > 18 * 1024 * 1024) {
    status.textContent = 'Escolha uma foto de até 18 MB.';
    return;
  }
  removePhoto();
  const current = generation;
  tool.setAttribute('aria-busy','true');
  status.textContent = 'Abrindo a foto…';
  setActions(true);
  try {
    const photo = await photoFromFile(file);
    if (current !== generation) return;
    const scale = Math.min(1, 1100 / Math.max(photo.naturalWidth, photo.naturalHeight));
    base.width = Math.max(1, Math.round(photo.naturalWidth * scale));
    base.height = Math.max(1, Math.round(photo.naturalHeight * scale));
    setFrame(0,0,base.width,base.height);
    base.getContext('2d').drawImage(photo,0,0,base.width,base.height);
    photoLoaded = true;
    canvas.hidden = false;
    placeholder.hidden = true;
    render();
    status.textContent = 'Localizando os olhos no aparelho…';
    try {
      const Model = await getDetector();
      if (current !== generation) return;
      const {faceLandmarks} = Model.detect(base);
      if (faceLandmarks.length !== 1) {
        beginManual(faceLandmarks.length > 1 ? 'Há mais de um rosto na foto. Marque os olhos que deseja simular.' : 'Não conseguimos localizar os olhos automaticamente.');
        return;
      }
      const landmarks = faceLandmarks[0];
      eyes = upperLids.map(lid => lid.map(index => ({
        x:landmarks[index].x * base.width,
        y:landmarks[index].y * base.height,
      })));
      const [forehead, chin] = [landmarks[10], landmarks[152]];
      const faceWidth = Math.abs(landmarks[454].x - landmarks[234].x) * base.width;
      const faceHeight = Math.abs(chin.y - forehead.y) * base.height;
      frameFace((forehead.x + chin.x) * base.width / 2,(forehead.y + chin.y) * base.height / 2,Math.max(faceWidth * 1.45,faceHeight * 1.24));
      status.textContent = 'Prévia pronta. Troque o estilo para comparar.';
      render();
    } catch {
      if (current === generation) beginManual('A detecção automática ficou indisponível.');
    }
  } catch {
    if (current === generation) status.textContent = 'Não foi possível abrir a foto. Tente um arquivo JPG, PNG ou WebP.';
  } finally {
    if (current === generation) {
      tool.setAttribute('aria-busy','false');
      setActions();
    }
  }
}

for (const input of tool.querySelectorAll('input[type="file"]')) {
  input.addEventListener('change', () => {
    const file = input.files[0];
    input.value = '';
    void load(file);
  });
}

for (const button of stylesButtons) {
  button.addEventListener('click', () => {
    style = button.dataset.lashStyle;
    original = false;
    togglePressed(stylesButtons,button);
    tool.querySelector('[data-lash-description]').textContent = styles[style].text;
    render();
  });
}

canvas.addEventListener('click', event => {
  if (!manual) return;
  const box = canvas.getBoundingClientRect();
  markPoint({
    x:frame.x + (event.clientX - box.left) * canvas.width / box.width,
    y:frame.y + (event.clientY - box.top) * canvas.height / box.height,
  });
});
canvas.addEventListener('keydown', event => {
  if (!manual) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    markPoint({...manual.cursor});
    return;
  }
  const moves = {ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1]};
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  const delta = event.shiftKey ? 12 : 3;
  manual.cursor.x = Math.max(frame.x,Math.min(frame.x + canvas.width - 1,manual.cursor.x + move[0] * delta));
  manual.cursor.y = Math.max(frame.y,Math.min(frame.y + canvas.height - 1,manual.cursor.y + move[1] * delta));
  render();
});
adjust.addEventListener('click', () => beginManual());
compare.addEventListener('click', () => { original = !original; render(); });
zoom.addEventListener('click', () => zoomEyes(!zoomed));
clear.addEventListener('click', () => {
  removePhoto();
  status.textContent = 'Foto removida da simulação.';
});
save.addEventListener('click', async () => {
  const preview = document.createElement('canvas');
  preview.width = canvas.width;
  preview.height = canvas.height;
  render(false);
  preview.getContext('2d').drawImage(canvas,0,0);
  render();
  try {
    await saveCanvas(preview,'romeu-beauty-previa-de-cilios.png');
    status.textContent = 'Prévia pronta para guardar ou compartilhar.';
  } catch {
    status.textContent = 'Não foi possível salvar. Tente novamente.';
  }
});
for (const button of tool.querySelectorAll('[data-pick-photo]')) {
  button.addEventListener('click', () => {
    tool.querySelector('[data-photo-input="' + button.dataset.pickPhoto + '"]').click();
  });
}
