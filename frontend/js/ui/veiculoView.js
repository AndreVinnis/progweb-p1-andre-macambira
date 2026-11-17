// Camada de UI dos veículos. Mesmo molde da concessionariaView, com um <select> a mais.
const el = {
  form: document.querySelector('#form-veiculo'),
  concessionaria: document.querySelector('#veic-concessionaria'),
  salvar: document.querySelector('#veic-salvar'),
  cancelar: document.querySelector('#veic-cancelar'),
  carregando: document.querySelector('#veiculos-carregando'),
  erro: document.querySelector('#veiculos-erro'),
  erroMsg: document.querySelector('#veiculos-erro-msg'),
  recarregar: document.querySelector('#veiculos-recarregar'),
  vazio: document.querySelector('#veiculos-vazio'),
  sucesso: document.querySelector('#veiculos-sucesso'),
  linhas: document.querySelector('#veiculos-linhas'),
};

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// id → nome, para mostrar a dona do veículo sem outra requisição
let nomeDaConcessionaria = new Map();

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(veiculo, editandoId) {
  const tr = document.createElement('tr');
  if (veiculo.id === editandoId) tr.className = 'editando';

  const dona = nomeDaConcessionaria.get(veiculo.concessionariaId)
    ?? `concessionária #${veiculo.concessionariaId} (removida)`; // veículo órfão: assunto da S5

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', veiculo.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', veiculo.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(veiculo.id),
    celula(dona),
    celula(`${veiculo.marca} ${veiculo.modelo}`),
    celula(veiculo.ano, 'numero'),
    celula(veiculo.placa, 'numero text-nowrap'),
    celula(reais.format(veiculo.precoCentavos / 100), 'numero text-end text-nowrap'),
    acoes,
  );
  return tr;
}

export const veiculoView = {
  // Preenche o <select> com as concessionárias que existem agora
  preencherConcessionarias(concessionarias) {
    nomeDaConcessionaria = new Map(concessionarias.map((c) => [c.id, c.nome]));
    const escolhida = el.concessionaria.value;

    const opcoes = concessionarias.map((c) => new Option(`${c.nome} (#${c.id})`, c.id));
    el.concessionaria.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    // mantém a escolha, se a concessionária ainda existir
    if (nomeDaConcessionaria.has(Number(escolhida))) el.concessionaria.value = escolhida;
  },

  render({ status, veiculos, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...veiculos.map((v) => linha(v, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar veículo';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(veiculo) {
    el.form.concessionariaId.value = veiculo.concessionariaId;
    el.form.marca.value = veiculo.marca;
    el.form.modelo.value = veiculo.modelo;
    el.form.ano.value = veiculo.ano;
    el.form.placa.value = veiculo.placa;
    el.form.preco.value = veiculo.precoCentavos / 100;
    el.form.marca.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
