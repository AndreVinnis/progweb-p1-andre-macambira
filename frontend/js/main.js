// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { concessionariaService } from './services/concessionariaService.js';
import { concessionariaView } from './ui/concessionariaView.js';
import { veiculoService } from './services/veiculoService.js';
import { veiculoView } from './ui/veiculoView.js';
import { aviso } from './ui/aviso.js';

// ===================== CONCESSIONÁRIAS =====================
const concessionarias = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  concessionarias: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
concessionarias.assinar(concessionariaView.render);

async function carregarConcessionarias() {
  concessionarias.set({ status: 'carregando', erro: null });
  try {
    const lista = await concessionariaService.listar();
    concessionarias.set({ status: lista.length ? 'sucesso' : 'vazio', concessionarias: lista });
  } catch (e) {
    concessionarias.set({ status: 'erro', erro: e.message });
  }
}

async function salvarConcessionaria(dados) {
  const { editandoId } = concessionarias.get();
  aviso.limpar();
  concessionarias.set({ salvando: true });
  try {
    if (editandoId) await concessionariaService.atualizar(editandoId, dados);
    else await concessionariaService.criar(dados);

    aviso.sucesso(editandoId ? 'Concessionária atualizada.' : 'Concessionária cadastrada.');
    concessionariaView.limparForm();
    concessionarias.set({ editandoId: null });
    await carregarConcessionarias();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    concessionarias.set({ salvando: false });
  }
}

function editarConcessionaria(id) {
  const concessionaria = concessionarias.get().concessionarias.find((c) => c.id === id);
  concessionariaView.preencherForm(concessionaria);
  concessionarias.set({ editandoId: id });
}

function cancelarEdicaoConcessionaria() {
  concessionariaView.limparForm();
  concessionarias.set({ editandoId: null });
}

async function removerConcessionaria(id) {
  if (!confirm(`Remover a concessionária #${id}?`)) return;
  aviso.limpar();
  try {
    await concessionariaService.remover(id);
    aviso.sucesso('Concessionária removida.');
    if (concessionarias.get().editandoId === id) cancelarEdicaoConcessionaria();
    await carregarConcessionarias();
  } catch (e) {
    aviso.erro(e.message);
  }
}

concessionariaView.aoEnviar(salvarConcessionaria);
concessionariaView.aoCancelar(cancelarEdicaoConcessionaria);
concessionariaView.aoRecarregar(carregarConcessionarias);
concessionariaView.aoClicarNaLista({ editar: editarConcessionaria, remover: removerConcessionaria });

// ===================== VEÍCULOS =====================
const veiculos = criarStore({
  status: 'carregando',
  veiculos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

veiculos.assinar(veiculoView.render);

// Os veículos dependem das concessionárias: mudou a lista de concessionárias,
// refaz o <select> e redesenha os nomes na tabela de veículos.
concessionarias.assinar((estado) => {
  veiculoView.preencherConcessionarias(estado.concessionarias);
  veiculoView.render(veiculos.get());
});

async function carregarVeiculos() {
  veiculos.set({ status: 'carregando', erro: null });
  try {
    const lista = await veiculoService.listar();
    veiculos.set({ status: lista.length ? 'sucesso' : 'vazio', veiculos: lista });
  } catch (e) {
    veiculos.set({ status: 'erro', erro: e.message });
  }
}

async function salvarVeiculo(dados) {
  const { editandoId } = veiculos.get();
  aviso.limpar();
  veiculos.set({ salvando: true });
  try {
    if (editandoId) await veiculoService.atualizar(editandoId, dados);
    else await veiculoService.criar(dados);

    aviso.sucesso(editandoId ? 'Veículo atualizado.' : 'Veículo cadastrado.');
    veiculoView.limparForm();
    veiculos.set({ editandoId: null });
    await carregarVeiculos();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    veiculos.set({ salvando: false });
  }
}

function editarVeiculo(id) {
  const veiculo = veiculos.get().veiculos.find((v) => v.id === id);
  veiculoView.preencherForm(veiculo);
  veiculos.set({ editandoId: id });
}

function cancelarEdicaoVeiculo() {
  veiculoView.limparForm();
  veiculos.set({ editandoId: null });
}

async function removerVeiculo(id) {
  if (!confirm(`Remover o veículo #${id}?`)) return;
  aviso.limpar();
  try {
    await veiculoService.remover(id);
    aviso.sucesso('Veículo removido.');
    if (veiculos.get().editandoId === id) cancelarEdicaoVeiculo();
    await carregarVeiculos();
  } catch (e) {
    aviso.erro(e.message);
  }
}

veiculoView.aoEnviar(salvarVeiculo);
veiculoView.aoCancelar(cancelarEdicaoVeiculo);
veiculoView.aoRecarregar(carregarVeiculos);
veiculoView.aoClicarNaLista({ editar: editarVeiculo, remover: removerVeiculo });

// ===================== INÍCIO =====================
carregarConcessionarias();
carregarVeiculos();
