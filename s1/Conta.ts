export class Conta {
    number: string;
    balance: number;
    owner: string;


    constructor(number: string, owner: string) {
        this.number = number;
        this.balance = 0;
        this.owner = owner;
    }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("O valor do depósito deve ser positivo!");
        }   
        this.balance += amount;

    }
    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error("O valor do saque deve ser positivo!");
        }   
        if(amount > this.balance) {
            throw new Error("Saldo insuficiente.");
        }
        this.balance -= amount;
    }

}