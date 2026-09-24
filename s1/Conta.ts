export class Conta {
    #number: string;
    #balance: number;
    #owner: string;


    constructor(number: string, owner: string) {
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
    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error("O valor do saque deve ser positivo!");
        }   
        if(amount > this.#balance) {
            throw new Error("Saldo insuficiente.");
        }
        this.#balance -= amount;
    }

}