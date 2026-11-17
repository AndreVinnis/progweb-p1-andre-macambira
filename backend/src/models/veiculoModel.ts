// "Banco de dados" em memória: um array. Na S5 vira SQLite.
export type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  precoCentavos: number; // dinheiro em inteiro de centavos: R$ 89.900,00 = 8990000
  concessionariaId: number;
};

export type VeiculoInput = Omit<Veiculo, 'id'>;

let veiculos: Veiculo[] = [];
let proximoId = 1;

export const veiculoModel = {
  listar(): Veiculo[] {
    return veiculos;
  },

  listarPorConcessionaria(concessionariaId: number): Veiculo[] {
    return veiculos.filter((v) => v.concessionariaId === concessionariaId);
  },

  buscarPorId(id: number): Veiculo | null {
    return veiculos.find((v) => v.id === id) ?? null;
  },

  existePlaca(placa: string, ignorarId?: number): boolean {
    return veiculos.some((v) => v.placa === placa && v.id !== ignorarId);
  },

  inserir(dados: VeiculoInput): Veiculo {
    const novo: Veiculo = { id: proximoId++, ...dados };
    veiculos.push(novo);
    return novo;
  },

  atualizar(id: number, dados: Partial<Veiculo>): Veiculo | null {
    const i = veiculos.findIndex((v) => v.id === id);
    if (i === -1) return null;
    veiculos[i] = { ...veiculos[i], ...dados, id };
    return veiculos[i];
  },

  remover(id: number): boolean {
    const antes = veiculos.length;
    veiculos = veiculos.filter((v) => v.id !== id);
    return veiculos.length < antes;
  },
};
