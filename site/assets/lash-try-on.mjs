import {photoFromFile, saveCanvas, togglePressed} from './beauty-tools.mjs';

// Relative lengths from the inner to the outer corner, interpreted visually.
const styles = {
  classico: {density:23, fan:1, length:.28, thickness:.011, spread:0, curl:'c', map:[.35,.61,.83,1,.94,.76,.43], text:'Fios individuais e leves, com comprimento equilibrado ao longo da pálpebra.'},
  brasileiro: {density:22, fan:2, length:.30, thickness:.010, spread:.15, curl:'c', map:[.25,.57,.81,.95,1,.87,.48], text:'Fios em Y, com um volume leve e mais aberto na metade externa.'},
  egipcio: {density:24, fan:3, length:.35, thickness:.009, spread:.27, centerFiber:true, curl:'d', map:[.25,.57,.88,1,.93,.79,.42], text:'Leques em W com fios centrais mais longos e maior preenchimento no centro do olhar.'},
  fox: {density:25, fan:2, length:.36, thickness:.010, spread:.14, curl:'l', map:[.26,.43,.61,.77,.94,1,.71], sweep:.32, text:'Comprimento concentrado perto do canto externo, com uma transição mais curta na extremidade.'},
  mega: {density:30, fan:5, length:.36, thickness:.008, spread:.25, curl:'d', map:[.42,.68,.91,1,1,.91,.53], text:'Leques finos e densos para um acabamento de maior volume.'},
};

const curls = {
  c: {lift:.87, sweep:.29, earlyLift:.29, earlySweep:.08, lateLift:.78, lateSweep:.08},
  d: {lift:1.06, sweep:.13, earlyLift:.42, earlySweep:.02, lateLift:.92, lateSweep:.06},
  l: {lift:.89, sweep:.46, earlyLift:.06, earlySweep:.45, lateLift:.57, lateSweep:.88},
};
const upperLids = [
  [33,246,161,160,159,158,157,173,133],
  [362,398,384,385,386,387,388,466,263],
];
const anchors = [
  {label:'o canto externo do olho à esquerda da foto', x:.34, y:.44},
  {label:'o centro da linha superior dos cílios à esquerda da foto', x:.40, y:.425},
  {label:'o canto interno do olho à esquerda da foto', x:.46, y:.44},
  {label:'o canto interno do olho à direita da foto', x:.54, y:.44},
  {label:'o centro da linha superior dos cílios à direita da foto', x:.60, y:.425},
  {label:'o canto externo do olho à direita da foto', x:.66, y:.44},
];
const tool = document.querySelector('[data-lash-tool]');
const canvas = tool.querySelector('canvas');
const context = canvas.getContext('2d');
const base = document.createElement('canvas');
const stage = tool.querySelector('[data-lash-stage]');
const placeholder = tool.querySelector('[data-lash-placeholder]');
const status = tool.querySelector('[data-tool-status]');
const manualHint = tool.querySelector('[data-manual-hint]');
const stylesButtons = [...tool.querySelectorAll('[data-lash-style]')];
const curlButtons = [...tool.querySelectorAll('[data-lash-curl]')];
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
let lidPaths = [];
let manual = null;
let style = 'classico';
let curl = 'auto';
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

function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function smoothLid(points) {
  const samples = [{...points[0], distance:0}];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[i];
    const c = points[i + 1];
    const d = points[Math.min(points.length - 1, i + 2)];
    for (let step = 1; step <= 8; step++) {
      const f = step / 8;
      const x = spline(a.x, b.x, c.x, d.x, f);
      const y = spline(a.y, b.y, c.y, d.y, f);
      const last = samples.at(-1);
      samples.push({x, y, distance:last.distance + Math.hypot(x - last.x, y - last.y)});
    }
  }
  return samples;
}

function spline(a, b, c, d, f) {
  return .5 * ((2 * b) + (c - a) * f + (2 * a - 5 * b + 4 * c - d) * f * f
    + (3 * b - a - 3 * c + d) * f * f * f);
}

function drawFiber(root, normal, across, length, lean, thickness, shape, alpha) {
  const {x, y} = root;
  const offset = (lift, sweep) => [
    x + length * (normal.x * lift + across.x * (sweep + lean * lift)),
    y + length * (normal.y * lift + across.y * (sweep + lean * lift)),
  ];
  const [firstX, firstY] = offset(shape.earlyLift, shape.earlySweep * shape.sweep);
  const [lastX, lastY] = offset(shape.lateLift, shape.lateSweep * shape.sweep);
  const [tipX, tipY] = offset(shape.lift, shape.sweep);
  const edgeX = across.x * thickness / 2;
  const edgeY = across.y * thickness / 2;
  const gradient = context.createLinearGradient(x, y, tipX, tipY);
  gradient.addColorStop(0, `rgba(32,22,25,${alpha})`);
  gradient.addColorStop(.63, `rgba(32,22,25,${alpha * .84})`);
  gradient.addColorStop(1, 'rgba(32,22,25,.17)');
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(x - edgeX, y - edgeY);
  context.bezierCurveTo(firstX - edgeX, firstY - edgeY, lastX - edgeX * .35, lastY - edgeY * .35, tipX, tipY);
  context.bezierCurveTo(lastX + edgeX * .35, lastY + edgeY * .35, firstX + edgeX, firstY + edgeY, x + edgeX, y + edgeY);
  context.fill();
}

function drawLashes(samples, settings, side) {
  const start = samples[0];
  const end = samples.at(-1);
  const width = Math.hypot(end.x - start.x, end.y - start.y);
  if (width < 6) return;
  const axis = {x:(end.x - start.x) / width, y:(end.y - start.y) / width};
  const outward = side === 0 ? -1 : 1;
  const across = {x:axis.x * outward, y:axis.y * outward};
  const shape = curls[curl === 'auto' ? settings.curl : curl];

  // Distribute roots by arc length, so irregular landmark spacing does not bunch up the fibers.
  let segment = 1;
  for (let i = 0; i < settings.density; i++) {
    const t = .065 + .885 * (i + .5 + Math.sin(i * 17.3) * .22) / settings.density;
    const arc = end.distance * t;
    while (samples[segment].distance < arc) segment++;
    const a = samples[segment - 1];
    const b = samples[segment];
    const mix = (arc - a.distance) / (b.distance - a.distance);
    const normalX = interpolate(axis.y, (b.y - a.y) / (b.distance - a.distance), .36);
    const normalY = interpolate(-axis.x, -(b.x - a.x) / (b.distance - a.distance), .36);
    const norm = Math.hypot(normalX, normalY);
    const normal = {x:normalX / norm, y:normalY / norm};
    const root = {
      x:interpolate(a.x, b.x, mix) + normal.x * width * .006,
      y:interpolate(a.y, b.y, mix) + normal.y * width * .006,
    };
    const outer = side === 0 ? 1 - t : t;
    const zone = outer * (settings.map.length - 1);
    const index = Math.floor(zone);
    const envelope = interpolate(settings.map[index], settings.map[index + 1], zone - index);
    const texture = 1 + Math.sin(i * 13.7 + side * .37) * .14;
    const length = width * settings.length * envelope * texture;
    const lean = -.44 + outer * (.64 + (settings.sweep || 0)) + Math.sin(i * 6.2 + side) * .07;

    for (let strand = 0; strand < settings.fan; strand++) {
      const spread = (strand - (settings.fan - 1) / 2) * settings.spread;
      const taper = settings.centerFiber && strand !== 1 ? .82 : 1;
      const strandLength = length * taper * (1 - Math.abs(spread) * .28);
      drawFiber(root, normal, across, strandLength, lean + spread,
        Math.max(.58, width * settings.thickness), shape, settings.fan === 1 ? .92 : .80);
    }
  }
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
  if (!showOriginal && !manual) lidPaths.forEach((eye, side) => drawLashes(eye, styles[style], side));
  manualHint.hidden = !manual;
  if (manual) {
    manualHint.textContent = 'Ponto ' + (manual.points.length + 1) + ' de ' + anchors.length + ' · Marque ' + anchors[manual.points.length].label + '.';
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
  const landmarks = eyes.flatMap(eye => [eye[0], eye[Math.floor(eye.length / 2)], eye.at(-1)]);
  return landmarks[index] ? {...landmarks[index]} : {x:frame.x + anchor.x * canvas.width, y:frame.y + anchor.y * canvas.height};
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
    const [leftOuter, leftCenter, leftInner, rightInner, rightCenter, rightOuter] = manual.points;
    if ([leftOuter, leftInner, rightInner, rightOuter].some((point, index, corners) => index > 0 && point.x <= corners[index - 1].x)
        || leftCenter.x <= leftOuter.x || leftCenter.x >= leftInner.x
        || rightCenter.x <= rightInner.x || rightCenter.x >= rightOuter.x) {
      beginManual('Marque cada olho da esquerda para a direita.');
      return;
    }
    eyes = [[leftOuter, leftCenter, leftInner], [rightInner, rightCenter, rightOuter]];
    lidPaths = eyes.map(smoothLid);
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
  lidPaths = [];
  manual = null;
  photoLoaded = false;
  faceView = undefined;
  zoomed = false;
  original = false;
  base.width = base.height = 1;
  canvas.width = canvas.height = 1;
  canvas.hidden = true;
  placeholder.hidden = false;
  manualHint.hidden = true;
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
      lidPaths = eyes.map(smoothLid);
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

for (const button of curlButtons) {
  button.addEventListener('click', () => {
    curl = button.dataset.lashCurl;
    original = false;
    togglePressed(curlButtons, button);
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
