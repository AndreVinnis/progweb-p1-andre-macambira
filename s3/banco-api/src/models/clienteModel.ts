// "Banco de dados" em memória: um array. Na S5 vira SQLite.
export type Cliente = {
  id: number;
  nome: string;
  cpf: string;
  email: string | null;
};

export type ClienteInput = Omit<Cliente, 'id' | 'email'> & { email?: string | null };

let clientes: Cliente[] = [];
let proximoId = 1;

export const clienteModel = {
  listar(): Cliente[] {
    return clientes;
  },

  buscarPorId(id: number): Cliente | null {
    return clientes.find((c) => c.id === id) ?? null;
  },

  existeCpf(cpf: string): boolean {
    return clientes.some((c) => c.cpf === cpf);
  },

  inserir({ nome, cpf, email }: ClienteInput): Cliente {
    const novo: Cliente = { id: proximoId++, nome, cpf, email: email ?? null };
    clientes.push(novo);
    return novo;
  },

  atualizar(id: number, dados: Partial<Cliente>): Cliente | null {
    const i = clientes.findIndex((c) => c.id === id);
    if (i === -1) return null;
    clientes[i] = { ...clientes[i], ...dados, id }; // o id nunca muda
    return clientes[i];
  },

  remover(id: number): boolean {
    const antes = clientes.length;
    clientes = clientes.filter((c) => c.id !== id);
    return clientes.length < antes; // true = removeu
  },
};
