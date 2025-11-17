import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Promo } from '../models/promo.model';
import { PROMOCIONES_PREDEFINIDAS } from 'src/data/promociones-predefinidas';

@Injectable({ providedIn: 'root' })
export class PromocionesService {
  private storageKey = 'promociones';
  private _promos!: BehaviorSubject<Promo[]>;   // 👈 con "!"
  promos$!: Observable<Promo[]>;                // 👈 se inicializa en el constructor

  constructor() {
    const guardadas = localStorage.getItem(this.storageKey);
    let base: Promo[];

    if (guardadas) {
      try {
        base = JSON.parse(guardadas) as Promo[];
      } catch {
        base = PROMOCIONES_PREDEFINIDAS;
      }
    } else {
      base = PROMOCIONES_PREDEFINIDAS;
    }

    this._promos = new BehaviorSubject<Promo[]>(base);
    this.promos$ = this._promos.asObservable();   // 👈 AHORA sí existe _promos
  }

  get snapshot(): Promo[] {
    return this._promos.value;
  }

  private guardarEnLocalStorage(promos: Promo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(promos));
  }

  add(p: Omit<Promo, 'id'>) {
    const id = Math.max(0, ...this.snapshot.map(x => x.id)) + 1;
    const nuevas = [...this.snapshot, { id, ...p }];
    this._promos.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  remove(id: number) {
    const nuevas = this.snapshot.filter(p => p.id !== id);
    this._promos.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  // ======== LÓGICA PARA EL CLIENTE ========

  getPromosActivas(fecha: Date = new Date()): Promo[] {
    const hoy = fecha.toISOString().slice(0, 10); // YYYY-MM-DD
    return this.snapshot.filter(p => p.desde <= hoy && p.hasta >= hoy);
  }

  getMejorPromo(fecha: Date = new Date()): Promo | null {
    const activas = this.getPromosActivas(fecha);
    if (activas.length === 0) return null;

    return activas.reduce((best, current) =>
      current.valor > best.valor ? current : best
    );
  }

  calcularPrecioConPromo(precioBase: number, fecha: Date = new Date()): number {
    const promo = this.getMejorPromo(fecha);
    if (!promo) return precioBase;

    if (promo.tipo === 'porcentaje') {
      const descuento = precioBase * (promo.valor / 100);
      return Math.max(0, Math.round(precioBase - descuento));
    } else {
      return Math.max(0, precioBase - promo.valor);
    }
  }
}
