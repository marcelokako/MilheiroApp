import { Component } from '@angular/core';
import { MilhasService } from '../../services/milhas.service';


@Component({
  selector: 'app-registro-milhas',
  templateUrl: './registro-milhas.component.html',
  styleUrls: ['./registro-milhas.component.css']
})
export class RegistroMilhasComponent {
  milha = {
    pessoa: '',
    plataforma: '',
    pontos: 0,
    valor: 0,
    media: 0,
    origem: '',
    data: '',
    created_by: '',
    created_at: new Date()
  };

  constructor(private milhasService: MilhasService) {}

  onSubmit() {
    this.milhasService.addMilha(this.milha).subscribe(result => {
      console.log('Milha registrada:', result);
    });
  }
}
