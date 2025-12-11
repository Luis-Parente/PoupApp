import {Component, output, signal} from '@angular/core';
import {BotaoComponent} from '../../../compartilhados/botao/botao.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from '../../../compartilhados/modal/modal.component';
import {TipoTransacao} from '../../compartilhados/transacao.model';
import {Conta} from '../../compartilhados/conta.model';

@Component({
  selector: 'app-botao-adicionar-conta',
  imports: [
    BotaoComponent,
    FormsModule,
    ModalComponent,
    ReactiveFormsModule
  ],
  templateUrl: './botao-adicionar-conta.component.html',
  styleUrl: './botao-adicionar-conta.component.css',
})
export class BotaoAdicionarContaComponent {

  protected readonly tiposTransacao = TipoTransacao;

  modalAberto = signal(false);

  contaCriada = output<Conta>()

  novaContaForm = {
    nome: '',
    saldoInicial: ''
  }

  abrirModal() {
    this.modalAberto.set(true);
  }

  aoSubmeter() {
    const novaConta = new Conta(this.novaContaForm.nome, Number(this.novaContaForm.saldoInicial))

    this.contaCriada.emit(novaConta);
    this.modalAberto.set(false);
  }
}
