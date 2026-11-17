export const options = Object.freeze({
  goal: {corte: 'Renovar o corte', cor: 'Mudar ou iluminar a cor', 'corte-cor': 'Pensar corte e cor juntos', orientacao: 'Conversar sobre possibilidades'},
  routine: {pratica: 'Praticidade em primeiro lugar', flexivel: 'Um pouco de tempo para finalizar', produzida: 'Gosto de caprichar na finalização'},
  change: {discreta: 'Uma mudança sutil', equilibrada: 'Uma mudança visível, com equilíbrio', marcante: 'Uma mudança marcante'}
});
export function summarize(answers) {
  return ['goal', 'routine', 'change'].map(key => {
    if (!Object.hasOwn(options[key], answers[key])) throw new Error(`Resposta inválida: ${key}`);
    return {label: {goal: 'Minha ideia', routine: 'Minha rotina', change: 'Meu momento'}[key], text: options[key][answers[key]]};
  });
}
export function whatsappUrl(answers) {
  const rows = summarize(answers);
  const message = 'Olá, Romeu! Vim pelo site e organizei algumas preferências para o meu próximo visual.\n\n'
    + rows.map(row => `${row.label}: ${row.text}.`).join('\n')
    + '\n\nGostaria de conversar sobre as possibilidades e consultar um horário.';
  return `https://wa.me/5511964698679?text=${encodeURIComponent(message)}`;
}
