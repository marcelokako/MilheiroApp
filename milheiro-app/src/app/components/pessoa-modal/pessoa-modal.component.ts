import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pessoa-modal',
  templateUrl: './pessoa-modal.component.html',
  styleUrls: ['./pessoa-modal.component.css'],
})
export class PessoaModalComponent {
  nome: string = '';
  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<PessoaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.nome = data.nome || '';
      this.email = data.email || '';
    }
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  salvar(): void {
    if (!this.nome || !this.email) {
      alert('Preencha todos os campos.');
      return;
    }
    this.dialogRef.close({ nome: this.nome, email: this.email });
  }
}
