import {
  concessionariaModel,
  type Concessionaria,
  type ConcessionariaInput,
} from '../models/concessionariaModel.ts';
import { veiculoModel } from '../models/veiculoModel.ts';
import { erro } from '../utils/erro.ts';

const CAMPOS = ['nome', 'cnpj', 'cidade'] as const;

// Lista branca: só os campos da entidade entram; o resto do body é ignorado
function extrair(entrada: Record<string, unknown>): Partial<Record<(typeof CAMPOS)[number], unknown>> {
  const dados: Partial<Record<(typeof CAMPOS)[number], unknown>> = {};
  for (const campo of CAMPOS) {
    if (entrada[campo] !== undefined) dados[campo] = entrada[campo];
  }
  return dados;
}

// Todo campo enviado precisa ser texto não vazio (null, número, "" → 400)
function validarTextos(dados: Partial<Record<string, unknown>>): asserts dados is Partial<ConcessionariaInput> {
  for (const [campo, valor] of Object.entries(dados)) {
    if (typeof valor !== 'string' || valor.trim() === '') {
      throw erro(400, `Campo "${campo}" deve ser um texto não vazio`);
    }
  }
}

export const concessionariaService = {
  listar(): Concessionaria[] {
    return concessionariaModel.listar();
  },

  buscarPorId(id: number): Concessionaria {
    const concessionaria = concessionariaModel.buscarPorId(id);
    if (!concessionaria) throw erro(404, 'Concessionária não encontrada');
    return concessionaria;
  },

  criar(entrada: Record<string, unknown> = {}): Concessionaria {
    const dados = extrair(entrada);
    // Regra 1: nome, cnpj e cidade são obrigatórios
    if (CAMPOS.some((campo) => dados[campo] === undefined)) {
      throw erro(400, 'Campos "nome", "cnpj" e "cidade" são obrigatórios');
    }
    validarTextos(dados);
    const { nome, cnpj, cidade } = dados as ConcessionariaInput;
    // Regra 2: cnpj é único
    if (concessionariaModel.existeCnpj(cnpj)) {
      throw erro(409, 'Já existe uma concessionária com este CNPJ');
    }
    return concessionariaModel.inserir({ nome, cnpj, cidade });
  },

  atualizar(id: number, entrada: Record<string, unknown> = {}): Concessionaria {
    if (!concessionariaModel.buscarPorId(id)) throw erro(404, 'Concessionária não encontrada');
    const dados = extrair(entrada);
    validarTextos(dados);
    if (dados.cnpj !== undefined && concessionariaModel.existeCnpj(dados.cnpj, id)) {
      throw erro(409, 'Já existe uma concessionária com este CNPJ');
    }
    return concessionariaModel.atualizar(id, dados)!;
  },

  remover(id: number): void {
    if (!concessionariaModel.buscarPorId(id)) throw erro(404, 'Concessionária não encontrada');
    // Regra 3: não remove concessionária que ainda tem veículos (não deixa veículo órfão)
    if (veiculoModel.listarPorConcessionaria(id).length > 0) {
      throw erro(409, 'Concessionária possui veículos cadastrados e não pode ser removida');
    }
    concessionariaModel.remover(id);
  },
};
