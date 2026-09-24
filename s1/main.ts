import { Conta } from './Conta.ts';

const conta = new Conta('0001', 'Ana Lima');
conta.deposit(100); 
conta.withdraw(30);
console.log('Saldo:', conta.balance);

// Quatro tentativas de burlar as regras
const tentativas = [
  () => { conta.balance = -5000; },
  () => conta.deposit(-50),
  () => conta.withdraw(1000),
  () => { conta.owner = ''; },
];

for (const tentar of tentativas) {
  try {
    tentar();
  } catch (e) {
    console.log('Bloqueado →', e instanceof Error ? e.message : String(e));
  }
}

console.log('Saldo continua:', conta.balance);
console.log(conta); // repare: #saldo e #titular não aparecem