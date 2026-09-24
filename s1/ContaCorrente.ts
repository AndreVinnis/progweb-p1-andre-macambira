import { Conta } from './Conta.ts';
    export class ContaCorrente extends Conta {
        #limit: number;

        constructor(number: string, owner: string) {
            super(number, owner); // obrigatório ANTES de usar this
            this.#limit = 500;
        }

    // sobrescrita: conta corrente pode entrar no limite
    saldoDisponivel() {
        return this.balance + this.#limit;
    }
}