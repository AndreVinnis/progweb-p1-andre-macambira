import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo: nunca confie só no front.
function preparar({ nome, cnpj, cidade }) {
  const dados = {
    nome: (nome ?? '').trim(),
    cnpj: (cnpj ?? '').replace(/\D/g, ''), // fica só com os dígitos
    cidade: (cidade ?? '').trim(),
  };
  if (!dados.nome) throw new Error('Informe o nome.');
  if (dados.cnpj.length !== 14) throw new Error('O CNPJ precisa ter 14 dígitos.');
  if (!dados.cidade) throw new Error('Informe a cidade.');
  return dados;
}

export const concessionariaService = {
  listar() {
    return api.get('/concessionarias');
  },

  async criar(dados) {
    return api.post('/concessionarias', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/concessionarias/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/concessionarias/${id}`);
  },
};
