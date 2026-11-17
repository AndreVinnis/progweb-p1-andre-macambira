// "Banco de dados" em memória: um array. Na S5 vira SQLite.
export type Concessionaria = {
  id: number;
  nome: string;
  cnpj: string;
  cidade: string;
};

export type ConcessionariaInput = Omit<Concessionaria, 'id'>;

let concessionarias: Concessionaria[] = [];
let proximoId = 1;

export const concessionariaModel = {
  listar(): Concessionaria[] {
    return concessionarias;
  },

  buscarPorId(id: number): Concessionaria | null {
    return concessionarias.find((c) => c.id === id) ?? null;
  },

  // ignorarId: na atualização, a própria concessionária não conta como duplicata
  existeCnpj(cnpj: string, ignorarId?: number): boolean {
    return concessionarias.some((c) => c.cnpj === cnpj && c.id !== ignorarId);
  },

  inserir({ nome, cnpj, cidade }: ConcessionariaInput): Concessionaria {
    const nova: Concessionaria = { id: proximoId++, nome, cnpj, cidade };
    concessionarias.push(nova);
    return nova;
  },

  atualizar(id: number, dados: Partial<Concessionaria>): Concessionaria | null {
    const i = concessionarias.findIndex((c) => c.id === id);
    if (i === -1) return null;
    concessionarias[i] = { ...concessionarias[i], ...dados, id }; // o id nunca muda
    return concessionarias[i];
  },

  remover(id: number): boolean {
    const antes = concessionarias.length;
    concessionarias = concessionarias.filter((c) => c.id !== id);
    return concessionarias.length < antes; // true = removeu
  },
};
