import { Conta } from './Conta.ts';

export class ContaPoupanca extends Conta {
    #monthlyFee: number;

    constructor(number: string, owner: string) {
            super(number, owner); // obrigatório ANTES de usar this
            this.#monthlyFee = 0.005;
    }

    // comportamento que só a poupança tem
    render() {
        const rendimento = this.balance * this.#monthlyFee;
        if (rendimento > 0) this.deposit(rendimento); // usa a interface pública da mãe
        return rendimento;
    }
}