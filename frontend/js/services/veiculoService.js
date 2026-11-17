import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo: nunca confie só no front.
function preparar({ concessionariaId, marca, modelo, ano, placa, preco }) {
  if (!concessionariaId) throw new Error('Selecione a concessionária.');

  const dados = {
    marca: (marca ?? '').trim(),
    modelo: (modelo ?? '').trim(),
    placa: (placa ?? '').trim().toUpperCase(),
  };
  if (!dados.marca) throw new Error('Informe a marca.');
  if (!dados.modelo) throw new Error('Informe o modelo.');
  if (!dados.placa) throw new Error('Informe a placa.');

  if (ano === '' || Number.isNaN(Number(ano))) throw new Error('Informe o ano em números.');
  if (preco === '' || Number.isNaN(Number(preco)) || Number(preco) <= 0) {
    throw new Error('Informe um preço maior que zero.');
  }

  // Formulário só entrega string: convertemos antes de enviar.
  // precoCentavos é inteiro: evita o erro de ponto flutuante do dinheiro em float.
  return {
    ...dados,
    ano: Number(ano),
    precoCentavos: Math.round(Number(preco) * 100),
    concessionariaId: Number(concessionariaId),
  };
}

export const veiculoService = {
  listar() {
    return api.get('/veiculos');
  },

  async criar(dados) {
    return api.post('/veiculos', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/veiculos/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/veiculos/${id}`);
  },
};
