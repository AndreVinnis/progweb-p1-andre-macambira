export class Conta {
    #number: string;
    #balance: number;
    #owner: string;


    constructor(number: string, owner: string) {
        if (new.target === Conta) {
            throw new Error('Conta é abstrata: crie ContaCorrente ou ContaPoupanca');
        }
        this.#number = number;
        this.#balance = 0;
        this.#owner = owner;
    }

    get number(): string {
        return this.#number;
    }   

    get balance(): number { 
        return this.#balance;
    }

    get owner(): string {
        return this.#owner;
    }

    set owner(nome) {
    if (typeof nome !== 'string' || nome.trim().length < 3) {
      throw new Error('Titular inválido');
    }
    this.#owner = nome.trim();
  }


    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("O valor do depósito deve ser positivo!");
        }   
        this.#balance += amount;

    }

    saldoDisponivel() {
        return this.#balance;
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error("O valor do saque deve ser positivo!");
        }   
        if(amount > this.saldoDisponivel()) {
            throw new Error("Saldo insuficiente.");
        }
        this.#balance -= amount;
    }

    // "método abstrato": cada tipo de conta TEM de dizer quanto cobra
    monthlyTax() {
        throw new Error('tarifaMensal() precisa ser implementado na subclasse');
    }

    // sobrescrevendo um método que veio de Object.prototype
    toString() {
        return `${this.constructor.name} ${this.number} · ${this.owner} · R$ ${this.balance.toFixed(2)}`;
    }
}