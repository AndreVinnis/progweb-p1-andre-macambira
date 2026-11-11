// DUPLA: André Vinícius Barros Macambira e Myllena de Sousa Medeiros Um e Nome Dois

// ============================================================
// S2_library-bad.js — Mãos à Obra da Semana 2 (Parte A)
// Este código FUNCIONA (rode: node S2_library-bad.js). E é ruim de propósito.
// Sua tarefa, em dupla: NÃO refatore. Apenas leia e marque os cheiros.
//   Use // SMELL: <nome>        para cada code smell (nomes do slide 16)
//   Use // VIOLA: <S|O|L|I|D>   para cada princípio SOLID violado (slide 4)
// ============================================================


class Library { // SMELL: <God Class> (Deveria ser uma classe separada da main)
  constructor() {
    this.bks = []; 
    this.us = [];
    this.lns = []; // SMELL: <Nome obscuro> (Até agora eu não sei o que lns quer dizer)
  }


  // VIOLA: <S> (Essa função faz coisa demais e viola o single responsability).
  // VIOLA: <O> (Essa função não da para expandir pq ninguém consegue entender, e precisa ser modificada urgentemente)
  doStuff(book, userId, action) { // SMELL: <Nome obscuro | Long Function> (Deveria dizer o que essa funcão faz, fazer somente uma ação)
    if (action === 'add') { // SMELL: <Switch sobre tipo> (Deveria ter uma função para cada ação no lugar desse Switch)
      this.bks.push(book);
      console.log('Added: ' + book.t);
    } else if (action === 'lend') {
      var u = null;
      for (var i = 0; i < this.us.length; i++) {
        if (this.us[i].id === userId) { u = this.us[i]; }
      }
      var b = null;
      for (var j = 0; j < this.bks.length; j++) {
        if (this.bks[j].t === book.t) { b = this.bks[j]; }
      }
      if (u != null && b != null && b.cp > 0) {
        b.cp = b.cp - 1;
        this.lns.push({ uid: userId, bt: book.t, d: new Date(), st: 1 });
        // 1 = active, 2 = returned, 3 = overdue // SMELL: <Comentário-desodorante> (Esse comentário não serve pra muita coisa, não precisava dele)
        fetch('http://email.api/send', {
          method: 'POST',
          body: JSON.stringify({ to: u.em, msg: 'Você pegou ' + book.t })
        }).then(r => { /* nada */ }).catch(e => {}); // SMELL: <Erro engolido> (Esse catch não pega nada e nem faz nada)
      }
    } else if (action === 'return') {
      for (var k = 0; k < this.lns.length; k++) {
        if (this.lns[k].uid === userId && this.lns[k].bt === book.t && this.lns[k].st === 1) {
          this.lns[k].st = 2;
          for (var m = 0; m < this.bks.length; m++) {
            if (this.bks[m].t === book.t) { this.bks[m].cp = this.bks[m].cp + 1; }
          }
        }
      }
    } else if (action === 'overdue') {
      for (var n = 0; n < this.lns.length; n++) {
        var diff = (new Date() - this.lns[n].d) / (1000 * 60 * 60 * 24);
        if (this.lns[n].st === 1 && diff > 7) {
          this.lns[n].st = 3;
          var usr = null;
          for (var p = 0; p < this.us.length; p++) {
            if (this.us[p].id === this.lns[n].uid) { usr = this.us[p]; }
          }
          if (usr) {
            fetch('http://email.api/send', {
              method: 'POST',
              body: JSON.stringify({ to: usr.em, msg: 'Atrasado: ' + this.lns[n].bt })
            });
          }
        }
      }
    }
  }

  registerUser(n, e, ph, addr, cty, st, zp, isAdm) {
    this.us.push({ id: this.us.length + 1, n: n, em: e, ph: ph, addr: addr, cty: cty, st: st, zp: zp, isAdm: isAdm });// SMELL: <Data Clumps> (Tudo isso poderia ser uma classe)
  }

  report(type) {
    if (type === 1) {
      console.log('Total de livros: ' + this.bks.length);
    } else if (type === 2) {
      console.log('Total de usuários: ' + this.us.length);
    } else if (type === 3) {
      console.log('Total de empréstimos: ' + this.lns.length);
    }
  }
}

// Uso:
const lib = new Library();
lib.registerUser('Ana', 'ana@uepb.edu.br', '83999990000', 'Rua X, 10', 'Patos', 'PB', '58700-000', false);
lib.doStuff({ t: 'Clean Code', cp: 3 }, null, 'add');
lib.doStuff({ t: 'Clean Code' }, 1, 'lend');
lib.report(1);