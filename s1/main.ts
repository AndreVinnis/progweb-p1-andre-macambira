import { Conta } from './Conta.ts';
import { ContaCorrente } from './ContaCorrente.ts';
import { ContaPoupanca } from './ContaPoupanca.ts';

const cc = new ContaCorrente('0001', 'Ana Lima');
const cp = new ContaPoupanca('0002', 'Bruno Souza');

cc.deposit(100); // depositar() foi herdado de Conta
cc.withdraw(400); // só passa por causa do limite
console.log('CC saldo:', cc.balance);

cp.deposit(1000);
console.log('Rendeu:', cp.render(), '→ saldo:', cp.balance);

try {
  cp.withdraw(5000); // poupança não tem limite
} catch (e) {
  console.log('Poupança →', e instanceof Error ? e.message : e);
}

console.log(cc instanceof ContaCorrente, cc instanceof Conta);
// A cadeia de protótipos, à mostra:
console.log(Object.getPrototypeOf(ContaCorrente.prototype) === Conta.prototype);