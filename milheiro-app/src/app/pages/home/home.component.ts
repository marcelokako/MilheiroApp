import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';
import { ModalManagerService } from '../../services/modal-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','../../components/pessoas/pessoas.component.css']
})
export class HomeComponent {
  

  constructor(
    private databaseService: DatabaseService, 
    private dialog: MatDialog,
    private modalManager: ModalManagerService
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
    this.modalManager.openAddPontosModal().subscribe((data_plataforma)=>{
      if(data_plataforma){
        
      }
    })
  }
}
