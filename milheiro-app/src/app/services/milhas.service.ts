import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MilhasService {
  constructor(private db: NgxIndexedDBService) {}

  addMilha(milha: any): Observable<number> {
    return this.db.add('pontos_milhas', milha);
  }
}
