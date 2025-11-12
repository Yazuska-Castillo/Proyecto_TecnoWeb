import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Promo } from '../models/promo.model';

@Injectable({ providedIn: 'root' })
export class PromocionesService {
  private _promos = new BehaviorSubject<Promo[]>([
    { id: 1, nombre: 'Tikitikiti',  tipo: 'porcentaje', valor: 20,    desde: '2025-09-13', hasta: '2025-09-18' },
    { id: 2, nombre: 'Findes',  tipo: 'fijo',       valor: 15000, desde: '2025-03-01', hasta: '2025-03-31' },
    { id: 3, nombre: 'Cyberday',  tipo: 'porcentaje',       valor: 80, desde: '2025-10-01', hasta: '2025-10-08' }
  ]);

  promos$ = this._promos.asObservable();

  get snapshot(): Promo[] {
    return this._promos.value;
  }

  add(p: Omit<Promo, 'id'>) {
    const id = Math.max(0, ...this.snapshot.map(x => x.id)) + 1;
    this._promos.next([...this.snapshot, { id, ...p }]);
  }

  remove(id: number) {
    this._promos.next(this.snapshot.filter(p => p.id !== id));
  }
}


