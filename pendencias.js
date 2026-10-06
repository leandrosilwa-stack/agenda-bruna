// Pendências - categorias editáveis + atividades (Supabase, sem LocalStorage)
let sb = null;
let itens = [];
let cats = [];
const $ = (id) => document.getElementById(id);

function conectar() {
  if (!window.supabase) { $('status').textContent = 'Erro CDN Supabase'; return false; }
  if (SUPABASE_URL.includes('COLE_AQUI')) { $('status').textContent = 'Configure config.js'; return false; }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  $('status').textContent = 'Conectado ✓';
  return true;
}

async function carregar() {
  const rc = await sb.from('pendencias_categorias').select('*').order('id');
  if (rc.error) { $('status').textContent = 'Rode a migration de categorias: ' + rc.error.message; return; }
  cats = rc.data || [];
  const ri = await sb.from('pendencias').select('*').order('created_at');
  if (ri.error) { $('status').textContent = 'Erro: ' + ri.error.message; return; }
  itens = ri.data || [];
  // compat: atividades com categoria antiga que não existe mais
  render();
}
function nomeCat(id) { return (cats.find(c => c.id === id) || {}).nome || `Cat ${id}`; }

function render() {
  $('cats').innerHTML = cats.map(c => {
    const abertos = itens.filter(i => i.categoria === c.id && !i.concluida);
    return `<div class="card"><h2>${esc(c.nome)} <span class="badge">${abertos.length}</span></h2>
      <div class="acoes" style="display:flex;gap:4px;margin-bottom:6px">
        <button class="ghost" onclick="editarCat(${c.id})">✏️ categoria</button>
        <button class="ghost" onclick="excluirCat(${c.id})">🗑️ categoria</button>
      </div>
      <div class="row"><input id="in-${c.id}" placeholder="Nova atividade em ${esc(c.nome)}..."><button onclick="adicionar(${c.id})">＋</button></div>
      <div class="pend-lista">${abertos.map(linhaAberta).join('') || '<p class="foot">Nada pendente 🎉</p>'}</div>
    </div>`;
  }).join('') || '<div class="card">Crie a primeira categoria acima.</div>';

  const conc = itens.filter(i => i.concluida).sort((a, b) => new Date(b.concluida_em || b.created_at) - new Date(a.concluida_em || a.created_at));
  $('totConc').textContent = conc.length;
  $('listaConc').innerHTML = conc.map(t => `<div class="pend-item concluida"><span><span class="badge">${esc(nomeCat(t.categoria))}</span> ${esc(t.titulo)}</span>
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

// ---- categorias ----
async function adicionarCat() {
  const nome = $('inNovaCat').value.trim();
  if (!nome) return alert('Digite o nome da categoria.');
  const nextId = cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1;
  const { error } = await sb.from('pendencias_categorias').insert({ id: nextId, nome });
  if (error) return alert('Erro: ' + error.message);
  $('inNovaCat').value = '';
  await carregar();
}
async function editarCat(id) {
  const c = cats.find(x => x.id === id);
  const novo = prompt('Editar categoria:', c.nome);
  if (novo === null) return;
  if (!novo.trim()) return alert('Nome vazio.');
  const { error } = await sb.from('pendencias_categorias').update({ nome: novo.trim() }).eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}
async function excluirCat(id) {
  if (itens.some(i => i.categoria === id)) return alert('Categoria com atividades (pendentes ou concluídas). Mova/exclua as atividades antes.');
  if (!confirm(`Excluir categoria "${nomeCat(id)}"?`)) return;
  const { error } = await sb.from('pendencias_categorias').delete().eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregar();
}

// ---- atividades ----
async function adicionar(cat) {
  const titulo = $(`in-${cat}`).value.trim();
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
window.adicionarCat = adicionarCat; window.editarCat = editarCat; window.excluirCat = excluirCat;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'inNovaCat') adicionarCat();
  if (e.key === 'Enter' && e.target.id && e.target.id.startsWith('in-')) adicionar(Number(e.target.id.replace('in-', '')));
});

if (conectar()) carregar();
