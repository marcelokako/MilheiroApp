import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ModalManagerService } from '../../services/modal-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','../../components/pessoas/pessoas.component.css']
})
export class HomeComponent {
  

  constructor(
    private databaseService: DatabaseService, 
    private modalManager: ModalManagerService,
    private snackBar: MatSnackBar
  ) {}

  cadastrarPlataforma(){
    this.modalManager.openPlataformaModal().subscribe((data_plataforma)=>{
      if(data_plataforma){
        this.databaseService.addPlataforma(data_plataforma).subscribe({
          next: (p) => {
            // loadplataformas
          },
          error: (e)=>{
            console.error("Erro ao adicionar pessoa: ", e)
          }
        });
      }
    })
  
  }
  AddPonto(){
    this.modalManager.openAddPontosModal().subscribe((obj_pontos_add)=>{
      if(obj_pontos_add){
        this.databaseService.AddPonto(obj_pontos_add).subscribe({
          next: (obj_ponto) => {
            this.snackBar.open(`${obj_ponto.pontos} pontos adicionados com sucesso!`, 'Fechar', {
              duration: 3000, // Duração do popup (ms)
              horizontalPosition: 'right', // Posição horizontal ('start', 'center', 'end', 'left', 'right')
              verticalPosition: 'top', // Posição vertical ('top', 'bottom')
              panelClass: ['success-snackbar'], // Classe CSS para personalizar
            });
          },
          error: (e)=>{
            console.error("Erro ao adicionar ponto: ", e)
          }
        });
      }
    })
  }

  CalculadoraPontos(){
    this.modalManager.openCalculadoraModal();
  }

  UsarPonto(){
    this.modalManager.openUsarPontosModal().subscribe((obj_pontos_used)=>{
      if(obj_pontos_used){
        this.databaseService.AddPonto(obj_pontos_used).subscribe({
          next: (obj_ponto) => {
            this.snackBar.open(`${-1*obj_ponto.pontos} pontos usados com sucesso!`, 'Fechar', {
              duration: 3000, 
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
          },
          error: (e)=>{
            console.error("Erro ao usar pontos: ", e)
          }
        });
      }
    })
  }
}
