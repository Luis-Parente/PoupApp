import {Component, computed, signal} from '@angular/core';
import {SaldoComponent} from "./saldo/saldo.component";
import {TransacoesComponent} from "./transacoes/transacoes.component";
import {ContasComponent} from "./contas/contas.component";
import {Conta} from './compartilhados/conta.model';
import {TipoTransacao, Transacao} from './compartilhados/transacao.model';

@Component({
  selector: 'app-area-financeira',
  imports: [SaldoComponent, TransacoesComponent, ContasComponent],
  templateUrl: './area-financeira.component.html',
  styleUrl: './area-financeira.component.css'
})
export class AreaFinanceiraComponent {

  saldo = computed(() => {
    return this.contas().reduce((acc, conta) => {
      return acc + conta.saldo;
    }, 0);
  });

  transacoes = signal<Transacao[]>([])

  contasComSaldoInicial = signal<Conta[]>([]);

  contas = computed(() => {
    return this.contasComSaldoInicial().map(conta => {
      const saldoAtualizado = this.calculaSaldoAtualizado(conta);
      return {
        ...conta,
        saldo: saldoAtualizado
      }
    });
  });

  calculaSaldoAtualizado(contaInicial: Conta) {
    const transacoesDaConta = this.transacoes().filter((transacao) => {
      return transacao.conta === contaInicial.nome;
    });

    const novoSaldo = transacoesDaConta.reduce((acc, transacao) => {
      switch (transacao.tipo) {
        case TipoTransacao.SAQUE:
          return acc - transacao.valor;
        case TipoTransacao.DEPOSITO:
          return acc + transacao.valor;
        default:
          throw new Error("Tipo de transação não identificado!")
      }
    }, contaInicial.saldo)

    return novoSaldo;
  }

  processarTransacao(transacao: Transacao) {
    this.transacoes.update((transacoes) => [transacao, ...transacoes]);
  }

  processarConta(conta: Conta) {
    this.contasComSaldoInicial.update((contas) => [...contas, conta]);
  }
}
