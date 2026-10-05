// Menu compartilhado - adicione novas telas aqui (1 linha por tela)
const TELAS = [
  { id: 'financeiro', label: '💰 Financeiro', href: 'index.html' },
  { id: 'pendencias', label: '✅ Pendências', href: 'pendencias.html' },
  // Ex futuro: { id: 'estudos', label: '📚 Estudos', href: 'estudos.html' },
];

function renderNav() {
  const el = document.getElementById('appNav');
  if (!el) return;
  const atual = document.body.dataset.tela || '';
  el.innerHTML = TELAS.map(t =>
    `<a href="${t.href}" class="${t.id === atual ? 'ativo' : ''}">${t.label}</a>`
  ).join('');
}
document.addEventListener('DOMContentLoaded', renderNav);
