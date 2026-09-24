import { Conta } from './Conta.ts';
import { ContaCorrente } from './ContaCorrente.ts';
import { ContaPoupanca } from './ContaPoupanca.ts';

const contas = [
  new ContaCorrente('0001', 'Ana Lima'),
  new ContaPoupanca('0002', 'Bruno Souza'),
];

    contas.forEach((c) => c.deposit(1000));

// Mesma mensagem, respostas diferentes: quem decide é o objeto, não um if
function fecharMes(listaDeContas: Conta[]) {
    for (const conta of listaDeContas) {
        let tax: number;
        if(conta instanceof ContaCorrente || conta instanceof ContaPoupanca) {
            tax = conta.monthlyTax();
            if (tax > 0) conta.withdraw(tax);
            console.log(`${conta} (tarifa: R$ ${tax.toFixed(2)})`);
        }
    }
}

fecharMes(contas);

// A abstração protegida: ninguém cria uma "conta genérica"
try {
    new Conta('0003', 'Carla Dias');
} catch (e) {
    console.log('Erro esperado →', e instanceof Error ? e.message : String(e));
}