// Planner mensal independente (sem vínculo com Pendências)
// Mesmo código serve para Planner principal e Planner JP (body data-planner)
const PLANNER = document.body.dataset.planner || 'principal';
let sb = null, eventos = [];
let anoA = new Date().getFullYear(), mesA = new Date().getMonth() + 1;
const $ = (id) => document.getElementById(id);
const pad2 = (n) => String(n).padStart(2, '0');
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const ST = { a_fazer: 'A fazer', fazendo: 'Fazendo', feito: 'Feito' };

function conectar() {
  if (SUPABASE_URL.includes('COLE_AQUI')) { $('status').textContent = 'Configure config.js'; return false; }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  $('status').textContent = 'Conectado ✓';
  return true;
}

async function carregar() {
  const ini = `${anoA}-${pad2(mesA)}-01`;
  const ultimo = new Date(anoA, mesA, 0).getDate();
  const fim = `${anoA}-${pad2(mesA)}-${pad2(ultimo)}`;
  const { data, error } = await sb.from('planner_eventos').select('*').eq('planner', PLANNER).gte('data', ini).lte('data', fim).order('data');
  if (error) { $('status').textContent = 'Erro: ' + error.message; return; }
  eventos = data || [];
  render();
}

function render() {
  $('mesLabel').textContent = `${MESES[mesA - 1]} ${anoA}`;
  $('folhaTitulo').textContent = `${MESES[mesA - 1]} de ${anoA}`;
  $('totLabel').textContent = `${eventos.length} evento(s)`;
  $('dowRow').innerHTML = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => `<div class="dow">${d}</div>`).join('');
  const primeiroDow = new Date(anoA, mesA - 1, 1).getDay();
  const diasMes = new Date(anoA, mesA, 0).getDate();
  const diasAnt = new Date(anoA, mesA - 1, 0).getDate();
  let cells = [];
  for (let i = primeiroDow - 1; i >= 0; i--) cells.push({ dia: diasAnt - i, outro: true, data: null });
  for (let d = 1; d <= diasMes; d++) cells.push({ dia: d, outro: false, data: `${anoA}-${pad2(mesA)}-${pad2(d)}` });
  while (cells.length % 7) cells.push({ dia: '', outro: true, data: null });

  $('calGrid').innerHTML = cells.map(c => {
    if (!c.data) return `<div class="dia outro"><span class="num">${c.dia}</span></div>`;
    const evs = eventos.filter(e => e.data === c.data).slice(0, 4);
    const total = eventos.filter(e => e.data === c.data).length;
    return `<div class="dia"><span class="num">${c.dia}</span>
      ${evs.map(e => `<div class="ev ${e.prioridade} ${e.status === 'feito' ? 'feito' : ''}" title="${e.titulo} • ${ST[e.status]}" onclick="editar('${e.id}')">● ${e.titulo}<br><span class="st">${ST[e.status]}</span></div>`).join('')}
      ${total > 4 ? `<span class="foot">+${total - 4} mais</span>` : ''}
    </div>`;
  }).join('');
}

async function salvar() {
  const id = $('editId').value || null;
  const titulo = $('evTitulo').value.trim();
  const data = $('evData').value;
  const status = $('evStatus').value;
  const prioridade = $('evPrior').value;
  const observacao = $('evObs').value.trim() || null;
  if (!titulo) return alert('Informe o título.');
  if (!data) return alert('Informe a data.');
  const payload = { titulo, data, status, prioridade, observacao };
  const { error } = id
    ? await sb.from('planner_eventos').update(payload).eq('id', id)
    : await sb.from('planner_eventos').insert({ ...payload, planner: PLANNER });
  if (error) return alert('Erro: ' + error.message);
  limpar();
  const [a, m] = data.split('-').map(Number);
  anoA = a; mesA = m;
  await carregar();
}
function limpar() {
  $('editId').value = ''; $('evTitulo').value = ''; $('evObs').value = '';
  $('evStatus').value = 'a_fazer'; $('evPrior').value = 'media';
  $('btnCancelar').style.display = 'none'; $('btnExcluir').style.display = 'none';
  $('btnRepetir').style.display = 'none';
  $('btnSalvar').textContent = 'Salvar';
}
function editar(id) {
  const alvo = eventos.find(x => x.id === id);
  if (!alvo) return;
  $('editId').value = alvo.id; $('evTitulo').value = alvo.titulo;
  $('evData').value = alvo.data; $('evStatus').value = alvo.status;
  $('evPrior').value = alvo.prioridade; $('evObs').value = alvo.observacao || '';
  $('btnCancelar').style.display = ''; $('btnExcluir').style.display = '';
  $('btnRepetir').style.display = '';
  $('btnSalvar').textContent = 'Atualizar';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
async function excluir(id) {
  if (!confirm('Excluir evento?')) return;
  const { error } = await sb.from('planner_eventos').delete().eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  limpar(); await carregar();
}

// ---------- REPETIR EVENTO ----------
let repAno = 0, repMes = 0, repSel = new Set(), repOrigem = '';
function abrirRepetir() {
  if (!$('evTitulo').value.trim()) return alert('Preencha o título do evento antes de repetir.');
  const dataBase = $('evData').value;
  if (!dataBase) return alert('Informe a data do evento antes de repetir.');
  repOrigem = dataBase;
  const [a, m] = dataBase.split('-').map(Number);
  repAno = a; repMes = m; repSel = new Set();
  montarModal();
  renderMini();
}
function fecharRepetir() {
  const el = $('modalRepetir');
  if (el) el.remove();
}
function montarModal() {
  fecharRepetir();
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.id = 'modalRepetir';
  bg.innerHTML = `<div class="modal">
    <h3>🔁 Repetir evento</h3>
    <p class="foot" style="margin:0 0 8px">Escolha um ou mais dias. O dia original (<b>${repOrigem.split('-').reverse().join('/')}</b>) não é duplicado.</p>
    <div class="row" style="align-items:center">
      <button class="sec" id="repPrev" style="flex:0 0 auto">◀</button>
      <b id="repLabel" style="text-align:center"></b>
      <button class="sec" id="repNext" style="flex:0 0 auto">▶</button>
    </div>
    <div class="mini-grid" id="repDow"></div>
    <div class="mini-grid" id="repGrid"></div>
    <div class="modal-acoes">
      <button class="sec" onclick="fecharRepetir()">Cancelar</button>
      <button id="repConfirmar">Repetir</button>
    </div>
  </div>`;
  document.body.appendChild(bg);
  $('repDow').innerHTML = ['D','S','T','Q','Q','S','S'].map(d => `<div class="mini-dow">${d}</div>`).join('');
  $('repPrev').onclick = () => { const d = new Date(repAno, repMes - 2, 1); repAno = d.getFullYear(); repMes = d.getMonth() + 1; renderMini(); };
  $('repNext').onclick = () => { const d = new Date(repAno, repMes, 1); repAno = d.getFullYear(); repMes = d.getMonth() + 1; renderMini(); };
  $('repConfirmar').onclick = confirmarRepetir;
  bg.addEventListener('click', (e) => { if (e.target === bg) fecharRepetir(); });
}
function renderMini() {
  $('repLabel').textContent = `${MESES[repMes - 1]} ${repAno}`;
  const primeiroDow = new Date(repAno, repMes - 1, 1).getDay();
  const diasMes = new Date(repAno, repMes, 0).getDate();
  let html = '';
  for (let i = 0; i < primeiroDow; i++) html += '<div class="mini-dia vazio"></div>';
  for (let d = 1; d <= diasMes; d++) {
    const iso = `${repAno}-${pad2(repMes)}-${pad2(d)}`;
    const origem = iso === repOrigem;
    const sel = repSel.has(iso);
    html += `<div class="mini-dia ${sel ? 'sel' : ''} ${origem ? 'origem' : ''}" data-iso="${iso}" ${origem ? '' : `onclick="toggleRepDia('${iso}')"`}>${d}</div>`;
  }
  $('repGrid').innerHTML = html;
  $('repConfirmar').textContent = repSel.size ? `Repetir em ${repSel.size} dia(s)` : 'Repetir';
}
function toggleRepDia(iso) {
  if (repSel.has(iso)) repSel.delete(iso); else repSel.add(iso);
  renderMini();
}
async function confirmarRepetir() {
  if (!repSel.size) return alert('Selecione ao menos um dia.');
  const titulo = $('evTitulo').value.trim();
  const status = $('evStatus').value;
  const prioridade = $('evPrior').value;
  const observacao = $('evObs').value.trim() || null;
  const linhas = [...repSel].sort().map(data => ({ titulo, data, status, prioridade, observacao, planner: PLANNER }));
  const { error } = await sb.from('planner_eventos').insert(linhas);
  if (error) return alert('Erro ao repetir: ' + error.message);
  fecharRepetir();
  repSel = new Set();
  await carregar();
  alert(`Evento repetido em ${linhas.length} dia(s).`);
}

window.editar = editar;
window.fecharRepetir = fecharRepetir;
window.toggleRepDia = toggleRepDia;

$('btnSalvar').onclick = salvar;
$('btnCancelar').onclick = limpar;
$('btnExcluir').onclick = async () => { const id = $('editId').value; if (id) await excluir(id); };
$('btnRepetir').onclick = abrirRepetir;
$('btnPrev').onclick = () => { const d = new Date(anoA, mesA - 2, 1); anoA = d.getFullYear(); mesA = d.getMonth() + 1; carregar(); };
$('btnNext').onclick = () => { const d = new Date(anoA, mesA, 1); anoA = d.getFullYear(); mesA = d.getMonth() + 1; carregar(); };
$('btnHoje').onclick = () => { const h = new Date(); anoA = h.getFullYear(); mesA = h.getMonth() + 1; carregar(); };

if (conectar()) carregar();
