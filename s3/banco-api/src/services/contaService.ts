import { contaModel, TIPOS, type Conta, type TipoConta } from '../models/contaModel.ts';
import { clienteModel } from '../models/clienteModel.ts';
import { erro } from '../utils/erro.ts';

export const contaService = {
  listar(clienteId?: string): Conta[] {
    if (clienteId) return contaModel.listarPorCliente(Number(clienteId));
    return contaModel.listar();
  },

  buscarPorId(id: number): Conta {
    const conta = contaModel.buscarPorId(id);
    if (!conta) throw erro(404, 'Conta não encontrada');
    return conta;
  },

  criar({ tipo, saldo, clienteId }: Partial<Conta> = {}): Conta {
    if (!tipo || saldo === undefined || !clienteId) {
      throw erro(400, 'Campos "tipo", "saldo" e "clienteId" são obrigatórios');
    }
    if (!TIPOS.includes(tipo as TipoConta)) throw erro(400, `Tipo deve ser um de: ${TIPOS.join(', ')}`);
    // Regra: o cliente precisa existir
    if (!clienteModel.buscarPorId(Number(clienteId))) throw erro(422, 'Cliente informado não existe');
    return contaModel.inserir({ tipo, saldo, clienteId });
  },

  atualizar(id: number, dados: Partial<Conta> = {}): Conta {
    const atualizada = contaModel.atualizar(id, dados);
    if (!atualizada) throw erro(404, 'Conta não encontrada');
    return atualizada;
  },

  remover(id: number): void {
    const removida = contaModel.remover(id);
    if (!removida) throw erro(404, 'Conta não encontrada');
  },
};
