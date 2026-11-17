// Camada de UI: a única que toca no DOM das concessionárias.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
const el = {
  form: document.querySelector('#form-concessionaria'),
  salvar: document.querySelector('#conc-salvar'),
  cancelar: document.querySelector('#conc-cancelar'),
  carregando: document.querySelector('#concessionarias-carregando'),
  erro: document.querySelector('#concessionarias-erro'),
  erroMsg: document.querySelector('#concessionarias-erro-msg'),
  recarregar: document.querySelector('#concessionarias-recarregar'),
  vazio: document.querySelector('#concessionarias-vazio'),
  sucesso: document.querySelector('#concessionarias-sucesso'),
  linhas: document.querySelector('#concessionarias-linhas'),
};

function formatarCnpj(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto; // dado do usuário entra como TEXTO, nunca como HTML
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao; // vira data-acao="editar" no HTML
  b.dataset.id = id;
  return b;
}

function linha(concessionaria, editandoId) {
  const tr = document.createElement('tr');
  if (concessionaria.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', concessionaria.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', concessionaria.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(concessionaria.id),
    celula(concessionaria.nome),
    celula(formatarCnpj(concessionaria.cnpj), 'numero text-nowrap'),
    celula(concessionaria.cidade),
    acoes,
  );
  return tr;
}

export const concessionariaView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, concessionarias, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...concessionarias.map((c) => linha(c, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar concessionária';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(concessionaria) {
    el.form.nome.value = concessionaria.nome;
    el.form.cnpj.value = formatarCnpj(concessionaria.cnpj);
    el.form.cidade.value = concessionaria.cidade;
    el.form.nome.focus();
  },

  limparForm() {
    el.form.reset();
  },

  // --- Eventos: a view avisa; quem decide o que fazer é o main.js ---
  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault(); // sem isto, o navegador recarrega a página
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  // Delegação: UM listener no <tbody> atende os botões de todas as linhas.
  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id); // tudo que vem do DOM é string
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
