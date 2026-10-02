// agenda BRUNA - app.js (HTML puro + Supabase, sem LocalStorage)
let sb = null;
let categorias = [];
let transacoesMes = [];
let ignoradasSessao = new Set(); // só memória, não LocalStorage
let chartCat = null, chartEvo = null;

const $ = (id) => document.getElementById(id);
const BRL = (v) => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pad2 = (n) => String(n).padStart(2, '0');
const keyMes = (a, m) => `${a}-${pad2(m)}`;

function mesSelecionado() {
  return { mes: Number($('selMes').value), ano: Number($('selAno').value) };
}
function primeiroDia(a, m) { return `${a}-${pad2(m)}-01`; }
function ultimoDia(a, m) {
  const d = new Date(a, m, 0); // m 1-12 -> último dia
  return `${a}-${pad2(m)}-${pad2(d.getDate())}`;
}
function subtrairMeses(ano, mes, n) {
  const d = new Date(ano, mes - 1 - n, 1);
  return { ano: d.getFullYear(), mes: d.getMonth() + 1 };
}
function labelMes(a, m) {
  const nomes = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${nomes[m - 1]}/${String(a).slice(2)}`;
}

// ---------- INIT ----------
(function initSeletores() {
  const meses = [['1','Janeiro'],['2','Fevereiro'],['3','Março'],['4','Abril'],['5','Maio'],['6','Junho'],['7','Julho'],['8','Agosto'],['9','Setembro'],['10','Outubro'],['11','Novembro'],['12','Dezembro']];
  $('selMes').innerHTML = meses.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  const hoje = new Date();
  let anos = [];
  for (let a = hoje.getFullYear() - 2; a <= hoje.getFullYear() + 1; a++) anos.push(a);
  $('selAno').innerHTML = anos.map(a => `<option>${a}</option>`).join('');
  $('selMes').value = String(hoje.getMonth() + 1);
  $('selAno').value = String(hoje.getFullYear());
  $('trxData').valueAsDate = hoje;
})();

function conectar() {
  if (!window.supabase) { $('status').textContent = 'Erro: CDN Supabase não carregou.'; return false; }
  if (SUPABASE_URL.includes('COLE_AQUI') || SUPABASE_ANON_KEY.includes('COLE_AQUI')) {
    $('status').innerHTML = '⚠️ Configure o <b>config.js</b> com Project URL e anon key do Supabase. Veja COMO-PUBLICAR.md';
    return false;
  }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  $('status').textContent = 'Conectado ao Supabase ✓ (dados online)';
  return true;
}

async function carregarTudo() {
  if (!sb) return;
  await carregarCategorias();
  await carregarMes();
}

async function carregarCategorias() {
  const { data, error } = await sb.from('categorias').select('*').order('tipo').order('nome');
  if (error) { $('status').textContent = 'Erro categorias: ' + error.message; return; }
  categorias = data || [];
  renderCats();
  renderCatOptions();
}

function renderCats() {
  $('listaCats').innerHTML = categorias.map(c =>
    `<li><span><span class="badge ${c.tipo}">${c.tipo}</span> ${c.nome}</span>
     <button class="ghost" onclick="excluirCat('${c.id}')">excluir</button></li>`
  ).join('') || '<li>Nenhuma categoria. Cadastre acima.</li>';
}

function renderCatOptions() {
  const tipo = $('trxTipo').value;
  const filtradas = categorias.filter(c => c.tipo === tipo);
  $('trxCat').innerHTML = filtradas.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')
    || '<option value="">— cadastre uma categoria —</option>';
}

async function carregarMes() {
  const { mes, ano } = mesSelecionado();
  const ini = primeiroDia(ano, mes), fim = ultimoDia(ano, mes);
  const { data, error } = await sb.from('transacoes')
    .select('*, categorias(nome)')
    .gte('data', ini).lte('data', fim).order('data').order('created_at');
  if (error) { $('status').textContent = 'Erro ao carregar mês: ' + error.message; return; }
  transacoesMes = data || [];
  renderTabelas();
  renderResumo();
  renderGrafCat();
  await renderEvolucao();
  await renderSugestoesFixas();
}

// ---------- CATEGORIAS ----------
async function salvarCategoria() {
  const nome = $('catNome').value.trim();
  const tipo = $('catTipo').value;
  if (!nome) return alert('Informe o nome da categoria.');
  const { error } = await sb.from('categorias').insert({ nome, tipo });
  if (error) return alert('Erro: ' + error.message + (error.message.includes('duplicate') ? ' (já existe)' : ''));
  $('catNome').value = '';
  await carregarCategorias();
}
async function excluirCat(id) {
  if (transacoesMes.some(t => t.categoria_id === id)) return alert('Categoria em uso neste mês. Exclua os lançamentos antes.');
  // checa uso geral
  const { count } = await sb.from('transacoes').select('id', { count: 'exact', head: true }).eq('categoria_id', id);
  if ((count || 0) > 0) return alert(`Categoria usada em ${count} lançamento(s). Não pode excluir.`);
  if (!confirm('Excluir categoria?')) return;
  const { error } = await sb.from('categorias').delete().eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregarCategorias();
}

// ---------- TRANSAÇÕES ----------
async function salvarTransacao() {
  const id = $('editId').value || null;
  const tipo = $('trxTipo').value;
  const categoria_id = $('trxCat').value;
  const nome = $('trxNome').value.trim();
  const data = $('trxData').value;
  const valor = Number($('trxValor').value);
  const fixa = $('trxFixa').checked;
  const forma_pagamento = $('trxPagto').value || null;
  const observacao = $('trxObs').value.trim() || null;

  if (!categoria_id) return alert('Selecione uma categoria já cadastrada (obrigatório).');
  if (!nome) return alert('Informe o nome da entrada/gasto.');
  if (!data) return alert('Informe a data.');
  if (!(valor > 0)) return alert('Informe um valor maior que zero.');

  const payload = { tipo, categoria_id, nome, data, valor, fixa, forma_pagamento, observacao };
  let error;
  if (id) ({ error } = await sb.from('transacoes').update(payload).eq('id', id));
  else ({ error } = await sb.from('transacoes').insert(payload));
  if (error) return alert('Erro ao salvar: ' + error.message);
  limparForm();
  await carregarMes();
}

function limparForm() {
  $('editId').value = ''; $('trxNome').value = ''; $('trxValor').value = '';
  $('trxObs').value = ''; $('trxFixa').checked = false;
  $('btnCancelar').style.display = 'none';
  $('btnSalvar').textContent = 'Salvar';
}

function editarTrx(id) {
  const t = transacoesMes.find(x => x.id === id);
  if (!t) return;
  $('editId').value = t.id;
  $('trxTipo').value = t.tipo; renderCatOptions();
  $('trxCat').value = t.categoria_id;
  $('trxNome').value = t.nome; $('trxData').value = t.data;
  $('trxValor').value = t.valor; $('trxFixa').checked = !!t.fixa;
  $('trxPagto').value = t.forma_pagamento || ''; $('trxObs').value = t.observacao || '';
  $('btnCancelar').style.display = ''; $('btnSalvar').textContent = 'Atualizar';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function excluirTrx(id) {
  if (!confirm('Excluir este lançamento?')) return;
  const { error } = await sb.from('transacoes').delete().eq('id', id);
  if (error) return alert('Erro: ' + error.message);
  await carregarMes();
}

// ---------- TABELAS + RESUMO ----------
function renderTabelas() {
  const ent = transacoesMes.filter(t => t.tipo === 'entrada');
  const gas = transacoesMes.filter(t => t.tipo === 'gasto');
  const linha = (t) => {
    const cat = t.categorias?.nome || '';
    return `<tr><td>${t.data.slice(8, 10)}/${t.data.slice(5, 7)}</td>
      <td><b>${t.nome}</b><br><span class="foot">${cat}${t.forma_pagamento ? ' • ' + t.forma_pagamento : ''}${t.fixa ? ' • 🔁 fixa' : ''}</span></td>
      <td class="valor">${BRL(t.valor)}</td>
      <td><button class="ghost" onclick="editarTrx('${t.id}')">✏️</button>
      <button class="ghost" onclick="excluirTrx('${t.id}')">🗑️</button></td></tr>`;
  };
  $('tbodyEntradas').innerHTML = ent.map(linha).join('') || '<tr><td colspan="4" class="foot">Sem entradas neste mês.</td></tr>';
  $('tbodyGastos').innerHTML = gas.map(linha).join('') || '<tr><td colspan="4" class="foot">Sem gastos neste mês.</td></tr>';
  const te = ent.reduce((s, t) => s + Number(t.valor), 0);
  const tg = gas.reduce((s, t) => s + Number(t.valor), 0);
  $('totEntradas').textContent = BRL(te);
  $('totGastos').textContent = BRL(tg);
}

function renderResumo() {
  const te = transacoesMes.filter(t => t.tipo === 'entrada').reduce((s, t) => s + Number(t.valor), 0);
  const tg = transacoesMes.filter(t => t.tipo === 'gasto').reduce((s, t) => s + Number(t.valor), 0);
  $('kpiEntradas').textContent = BRL(te);
  $('kpiGastos').textContent = BRL(tg);
  $('kpiSaldo').textContent = BRL(te - tg);
}

// ---------- GRÁFICO POR CATEGORIA ----------
function renderGrafCat() {
  const tipo = $('selGrafCat').value;
  const lista = transacoesMes.filter(t => t.tipo === tipo);
  const porCat = {};
  lista.forEach(t => { const c = t.categorias?.nome || 'Sem categoria'; porCat[c] = (porCat[c] || 0) + Number(t.valor); });
  const labels = Object.keys(porCat), valores = Object.values(porCat);
  const total = valores.reduce((s, v) => s + v, 0);
  $('legendaCat').textContent = labels.length ? `Total: ${BRL(total)} em ${labels.length} categoria(s)` : 'Sem dados neste mês.';
  if (chartCat) chartCat.destroy();
  chartCat = new Chart($('grafCat'), {
    type: 'doughnut',
    data: { labels, datasets: [{ data: valores }] },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}

// ---------- GRÁFICO 13 MESES ----------
async function renderEvolucao() {
  const { mes, ano } = mesSelecionado();
  const meses = [];
  for (let i = 12; i >= 0; i--) meses.push(subtrairMeses(ano, mes, i));
  const ini = primeiroDia(meses[0].ano, meses[0].mes);
  const fim = ultimoDia(ano, mes);
  const { data, error } = await sb.from('transacoes').select('data,tipo,valor').gte('data', ini).lte('data', fim);
  if (error) return;
  const mapa = {};
  meses.forEach(({ ano: a, mes: m }) => { mapa[keyMes(a, m)] = { e: 0, g: 0, label: labelMes(a, m) }; });
  (data || []).forEach(t => {
    const k = t.data.slice(0, 7);
    if (!mapa[k]) return;
    if (t.tipo === 'entrada') mapa[k].e += Number(t.valor);
    else mapa[k].g += Number(t.valor);
  });
  const labels = meses.map(({ ano: a, mes: m }) => mapa[keyMes(a, m)].label);
  const dE = meses.map(({ ano: a, mes: m }) => mapa[keyMes(a, m)].e);
  const dG = meses.map(({ ano: a, mes: m }) => mapa[keyMes(a, m)].g);
  if (chartEvo) chartEvo.destroy();
  chartEvo = new Chart($('grafEvo'), {
    data: { labels, datasets: [
      { type: 'bar', label: 'Gasto', data: dG, backgroundColor: '#f87171' },
      { type: 'line', label: 'Recebido', data: dE, borderColor: '#16a34a', tension: .3 }
    ]},
    options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
  });
}

// ---------- FIXAS: sugerir automaticamente ----------
async function renderSugestoesFixas() {
  const { mes, ano } = mesSelecionado();
  $('fixasMesLabel').textContent = `${pad2(mes)}/${ano}`;
  // templates = fixas de meses anteriores (últimos 6 meses p/ performance)
  const ref = subtrairMeses(ano, mes, 6);
  const ini = primeiroDia(ref.ano, ref.mes), fim = ultimoDia(ano, mes);
  const { data } = await sb.from('transacoes').select('*, categorias(nome)')
    .eq('fixa', true).gte('data', ini).lte('data', fim).order('data', { ascending: false });
  const todas = data || [];
  const noMes = new Set(todas
    .filter(t => t.data.slice(0, 7) === keyMes(ano, mes))
    .map(t => normKey(t)));
  const vistos = new Set();
  const sugestoes = [];
  for (const t of todas) {
    if (t.data.slice(0, 7) === keyMes(ano, mes)) continue;
    const k = normKey(t);
    if (noMes.has(k) || vistos.has(k) || ignoradasSessao.has(k + keyMes(ano, mes))) continue;
    vistos.add(k); sugestoes.push(t);
  }
  const box = $('cardFixas');
  if (!sugestoes.length) { box.style.display = 'none'; $('listaFixas').innerHTML = ''; return; }
  box.style.display = '';
  const diaSugerido = (t) => pad2(Math.min(Number(t.data.slice(8, 10)), 28));
  $('listaFixas').innerHTML = sugestoes.map((t, i) =>
    `<div class="sugestao" id="sug-${i}">
      <div><b>${t.nome}</b> <span class="badge ${t.tipo}">${t.tipo}</span> <span class="badge">${t.categorias?.nome || ''}</span></div>
      <div class="row">
        <div><label>Data</label><input type="date" id="sdata-${i}" value="${ano}-${pad2(mes)}-${diaSugerido(t)}"></div>
        <div><label>Valor R$</label><input type="number" id="svalor-${i}" step="0.01" min="0.01" value="${t.valor}"></div>
      </div>
      <div class="row">
        <button onclick="confirmarFixa(${i})">Confirmar neste mês</button>
        <button class="sec" onclick="ignorarFixa(${i})">Ignorar</button>
      </div>
    </div>`).join('');
  window._sugestoes = sugestoes;
}
function normKey(t) { return `${t.tipo}|${t.categoria_id}|${t.nome.trim().toLowerCase()}`; }

async function confirmarFixa(i) {
  const t = window._sugestoes[i];
  const data = document.getElementById(`sdata-${i}`).value;
  const valor = Number(document.getElementById(`svalor-${i}`).value);
  if (!data || !(valor > 0)) return alert('Informe data e valor válidos.');
  const { error } = await sb.from('transacoes').insert({
    tipo: t.tipo, categoria_id: t.categoria_id, nome: t.nome,
    data, valor, fixa: true,
    forma_pagamento: t.forma_pagamento, observacao: t.observacao
  });
  if (error) return alert('Erro: ' + error.message);
  await carregarMes();
}
function ignorarFixa(i) {
  const t = window._sugestoes[i];
  const { mes, ano } = mesSelecionado();
  ignoradasSessao.add(normKey(t) + keyMes(ano, mes));
  document.getElementById(`sug-${i}`)?.remove();
  if (!document.querySelector('#listaFixas .sugestao')) $('cardFixas').style.display = 'none';
}

// ---------- EVENTOS ----------
$('btnSalvar').onclick = salvarTransacao;
$('btnCat').onclick = salvarCategoria;
$('btnCancelar').onclick = limparForm;
$('trxTipo').onchange = renderCatOptions;
$('selGrafCat').onchange = renderGrafCat;
$('selMes').onchange = carregarMes;
$('selAno').onchange = carregarMes;
$('btnPrev').onclick = () => { mudarMes(-1); };
$('btnNext').onclick = () => { mudarMes(1); };
$('btnHoje').onclick = () => { const h = new Date(); $('selMes').value = h.getMonth() + 1; $('selAno').value = h.getFullYear(); carregarMes(); };
function mudarMes(d) {
  let { mes, ano } = mesSelecionado();
  const dt = new Date(ano, mes - 1 + d, 1);
  mes = dt.getMonth() + 1; ano = dt.getFullYear();
  if (!$('selAno').querySelector(`option[value="${ano}"]`) && ![...$('selAno').options].some(o => o.value == ano)) {
    const o = document.createElement('option'); o.value = o.textContent = ano; $('selAno').appendChild(o);
  }
  $('selMes').value = mes; $('selAno').value = ano;
  carregarMes();
}

// expõe p/ onclick inline
window.editarTrx = editarTrx; window.excluirTrx = excluirTrx;
window.excluirCat = excluirCat; window.confirmarFixa = confirmarFixa; window.ignorarFixa = ignorarFixa;

// boot
if (conectar()) carregarTudo();
