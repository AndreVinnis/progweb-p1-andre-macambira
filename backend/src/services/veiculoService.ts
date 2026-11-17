import { veiculoModel, type Veiculo, type VeiculoInput } from '../models/veiculoModel.ts';
import { concessionariaModel } from '../models/concessionariaModel.ts';
import { erro } from '../utils/erro.ts';

const ANO_MINIMO = 1900;
const CAMPOS = ['marca', 'modelo', 'ano', 'placa', 'precoCentavos', 'concessionariaId'] as const;
const TEXTOS = ['marca', 'modelo', 'placa'] as const;

type Entrada = Partial<Record<(typeof CAMPOS)[number], unknown>>;

// Lista branca: só os campos da entidade entram; o resto do body é ignorado
function extrair(entrada: Record<string, unknown>): Entrada {
  const dados: Entrada = {};
  for (const campo of CAMPOS) {
    if (entrada[campo] !== undefined) dados[campo] = entrada[campo];
  }
  return dados;
}

// Valida tipo e valor de cada campo enviado (criar e atualizar) e devolve os dados padronizados
function validar(dados: Entrada, ignorarId?: number): Partial<VeiculoInput> {
  for (const campo of TEXTOS) {
    const valor = dados[campo];
    if (valor !== undefined && (typeof valor !== 'string' || valor.trim() === '')) {
      throw erro(400, `Campo "${campo}" deve ser um texto não vazio`);
    }
  }
  const limpo = { ...dados } as Partial<VeiculoInput>;
  if (limpo.placa !== undefined) limpo.placa = limpo.placa.trim().toUpperCase();

  if (dados.ano !== undefined) {
    const anoMaximo = new Date().getFullYear() + 1; // aceita o "ano-modelo" seguinte
    if (!Number.isInteger(dados.ano) || (dados.ano as number) < ANO_MINIMO || (dados.ano as number) > anoMaximo) {
      throw erro(400, `"ano" deve ser um inteiro entre ${ANO_MINIMO} e ${anoMaximo}`);
    }
  }
  if (dados.precoCentavos !== undefined) {
    if (!Number.isSafeInteger(dados.precoCentavos) || (dados.precoCentavos as number) <= 0) {
      throw erro(400, '"precoCentavos" deve ser um inteiro maior que zero');
    }
  }
  if (dados.concessionariaId !== undefined) {
    // aceita 1 ou "1"; true, null, "" e afins não viram id
    const id = typeof dados.concessionariaId === 'string' || typeof dados.concessionariaId === 'number'
      ? Number(dados.concessionariaId)
      : NaN;
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw erro(400, '"concessionariaId" deve ser um inteiro positivo');
    }
    // Regra de dependência: a concessionária precisa existir
    if (!concessionariaModel.buscarPorId(id)) throw erro(422, 'Concessionária informada não existe');
    limpo.concessionariaId = id;
  }
  if (limpo.placa !== undefined && veiculoModel.existePlaca(limpo.placa, ignorarId)) {
    throw erro(409, 'Já existe um veículo com esta placa');
  }
  return limpo;
}

export const veiculoService = {
  listar(concessionariaId?: string): Veiculo[] {
    if (concessionariaId) return veiculoModel.listarPorConcessionaria(Number(concessionariaId));
    return veiculoModel.listar();
  },

  buscarPorId(id: number): Veiculo {
    const veiculo = veiculoModel.buscarPorId(id);
    if (!veiculo) throw erro(404, 'Veículo não encontrado');
    return veiculo;
  },

  criar(entrada: Record<string, unknown> = {}): Veiculo {
    const dados = extrair(entrada);
    if (CAMPOS.some((campo) => dados[campo] === undefined)) {
      throw erro(400, 'Campos "marca", "modelo", "ano", "placa", "precoCentavos" e "concessionariaId" são obrigatórios');
    }
    return veiculoModel.inserir(validar(dados) as VeiculoInput);
  },

  atualizar(id: number, entrada: Record<string, unknown> = {}): Veiculo {
    if (!veiculoModel.buscarPorId(id)) throw erro(404, 'Veículo não encontrado');
    return veiculoModel.atualizar(id, validar(extrair(entrada), id))!;
  },

  remover(id: number): void {
    const removido = veiculoModel.remover(id);
    if (!removido) throw erro(404, 'Veículo não encontrado');
  },
};
