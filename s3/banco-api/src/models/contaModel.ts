export const TIPOS = ['corrente', 'poupanca'] as const;
export type TipoConta = (typeof TIPOS)[number];

export type Conta = {
  id: number;
  tipo: TipoConta;
  saldo: number;
  clienteId: number;
  criadaEm: string;
};

export type ContaInput = Pick<Conta, 'tipo' | 'saldo' | 'clienteId'>;

let contas: Conta[] = [];
let proximoId = 1;

export const contaModel = {
  listar(): Conta[] {
    return contas;
  },

  listarPorCliente(clienteId: number): Conta[] {
    return contas.filter((c) => c.clienteId === clienteId);
  },

  buscarPorId(id: number): Conta | null {
    return contas.find((c) => c.id === id) ?? null;
  },

  inserir({ tipo, saldo, clienteId }: ContaInput): Conta {
    const nova: Conta = {
      id: proximoId++,
      tipo,
      saldo: Number(saldo),
      clienteId: Number(clienteId),
      criadaEm: new Date().toISOString(),
    };
    contas.push(nova);
    return nova;
  },

  atualizar(id: number, dados: Partial<Conta>): Conta | null {
    const i = contas.findIndex((c) => c.id === id);
    if (i === -1) return null;
    contas[i] = { ...contas[i], ...dados, id };
    return contas[i];
  },

  remover(id: number): boolean {
    const antes = contas.length;
    contas = contas.filter((c) => c.id !== id);
    return contas.length < antes;
  },
};
