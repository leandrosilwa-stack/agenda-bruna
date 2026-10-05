// Pendências - CRUD + concluir (sem LocalStorage, tudo Supabase)
let sb = null;
let itens = [];
const CATS = { 1: '1 - Prioridades', 2: '2 - Saúde & família', 3: '3 - Financeiro & burocracia', 4: '4 - Casa, compras & projetos', 5: '5 - Evento & planejamento' };
const $ = (id) => document.getElementById(id);

function conectar() {
  if (!window.supabase) { $('status').textContent = 'Erro CDN Supabase'; return false; }
  if (SUPABASE_URL.includes('COLE_AQUI')) { $('status').textContent = 'Configure config.js'; return false; }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  $('status').textContent = 'Conectado ✓';
  return true;
}

async function carregar() {
  const { data, error } = await sb.from('pendencias').select('*').order('created_at');
  if (error) { $('status').textContent = 'Erro: ' + error.message; return; }
  itens = data || [];
  render();
}

function render() {
  const box = $('cats');
  box.innerHTML = Object.entries(CATS).map(([id, nome]) => {
    const abertos = itens.filter(i => i.categoria === Number(id) && !i.concluida);
    return `<div class="card"><h2>${nome} <span class="badge">${abertos.length}</span></h2>
      <div class="row"><input id="in-${id}" placeholder="Nova atividade..."><button onclick="adicionar(${id})">＋</button></div>
      <div class="pend-lista">${abertos.map(linhaAberta).join('') || '<p class="foot">Nada pendente 🎉</p>'}</div>
    </div>`;
  }).join('');

  const conc = itens.filter(i => i.concluida).sort((a, b) => new Date(b.concluida_em || b.created_at) - new Date(a.concluida_em || a.created_at));
  $('totConc').textContent = conc.length;
  $('listaConc').innerHTML = conc.map(t => `<div class="pend-item concluida"><span><span class="badge">${CATS[t.categoria]}</span> ${esc(t.titulo)}</span>
    <span class="acoes"><button class="ghost" onclick="reabrir('${t.id}')">↩ reabrir</button>
    <button class="ghost" onclick="excluir('${t.id}')">🗑️</button></span></div>`).join('')
    || '<p class="foot">Nenhuma concluída ainda.</p>';
}

function linhaAberta(t) {
  return `<div class="pend-item"><span>${esc(t.titulo)}</span>
    <span class="acoes"><button class="ghost" title="Concluir" onclick="concluir('${t.id}')">✅</button>
    <button class="ghost" onclick="editar('${t.id}')">✏️</button>
    <button class="ghost" onclick="excluir('${t.id}')">🗑️</button></span></div>`;
}
function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

async function adicionar(cat) {
  const inp = $(`in-${cat}`);
  const titulo = inp.value.trim();
  if (!titulo) return alert('Digite a atividade.');
  const { error } = await sb.from('pendencias').insert({ categoria: cat, titulo });
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}
async function concluir(id) {
  const { error } = await sb.from('pendencias').update({ concluida: true, concluida_em: new Date().toISOString() }).eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}
async function reabrir(id) {
  const { error } = await sb.from('pendencias').update({ concluida: false, concluida_em: null }).eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}
async function editar(id) {
  const t = itens.find(x => x.id === id);
  const novo = prompt('Editar atividade:', t.titulo);
  if (novo === null) return;
  if (!novo.trim()) return alert('Título vazio.');
  const { error } = await sb.from('pendencias').update({ titulo: novo.trim() }).eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}
async function excluir(id) {
  if (!confirm('Excluir?')) return;
  const { error } = await sb.from('pendencias').delete().eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}

window.adicionar = adicionar; window.concluir = concluir;
window.reabrir = reabrir; window.editar = editar; window.excluir = excluir;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id && e.target.id.startsWith('in-')) {
    adicionar(Number(e.target.id.replace('in-', '')));
  }
});

if (conectar()) carregar();
