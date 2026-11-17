export function togglePressed(elements, current) {
  for (const element of elements) element.setAttribute('aria-pressed', String(element === current));
}

export async function saveCanvas(canvas, filename) {
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(result => result ? resolve(result) : reject(new Error('Imagem indisponível')), 'image/png');
  });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), {href: url, download: filename});
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function photoFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Arquivo de imagem inválido')); };
    image.src = url;
  });
}
