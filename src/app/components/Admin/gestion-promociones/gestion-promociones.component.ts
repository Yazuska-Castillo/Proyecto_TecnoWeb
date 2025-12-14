import { Component } from '@angular/core';
import { PromocionesService } from '../../../services/promociones.service';
import { Promo, TipoPromo } from '../../../models/promo.model';

@Component({
  selector: 'app-gestion-promociones',
  templateUrl: './gestion-promociones.component.html',
  styleUrls: ['./gestion-promociones.component.css'],
})
export class GestionPromocionesComponent {
  nombre = '';
  tipo: TipoPromo = 'porcentaje';
  valor = 0;
  desde = '';
  hasta = '';

  promociones: Promo[] = [];

  hoyISO = new Date().toISOString().split('T')[0];

  errores: string[] = [];
  editandoId: number | null = null;

  constructor(private promoSrv: PromocionesService) {
    this.promoSrv.promos$.subscribe(p => (this.promociones = p));
  }

  guardar() {
    this.errores = [];

    const nombreLimpio = (this.nombre || '').trim();
    const v = Number(this.valor);

    if (!nombreLimpio) this.errores.push('El nombre es obligatorio.');

    if (!Number.isFinite(v)) {
      this.errores.push('El valor debe ser numérico.');
    } else {
      if (this.tipo === 'porcentaje') {
        if (v < 1 || v > 100) this.errores.push('El porcentaje debe estar entre 1 y 100.');
      }
      if (this.tipo === 'fijo') {
        if (v <= 0) this.errores.push('El monto fijo debe ser mayor que 0.');
      }
    }

    if (!this.desde) this.errores.push('La fecha "Desde" es obligatoria.');
    if (!this.hasta) this.errores.push('La fecha "Hasta" es obligatoria.');


    if (this.desde && this.desde < this.hoyISO) {
      this.errores.push('La fecha desde no puede ser anterior a hoy.');
    }
    if (this.desde && this.hasta && this.hasta < this.desde) {
      this.errores.push('La fecha hasta no puede ser anterior a desde.');
    }

    if (this.errores.length) return;

    if (this.editandoId) {
      this.promoSrv.update(this.editandoId, {
        nombre: nombreLimpio,
        tipo: this.tipo,
        valor: v,
        desde: this.desde,
        hasta: this.hasta,
      });
    } else {
      this.promoSrv.add({
        nombre: nombreLimpio,
        tipo: this.tipo,
        valor: v,
        desde: this.desde,
        hasta: this.hasta,
      });
    }

    this.limpiar();
  }

  editar(p: Promo) {
    this.errores = [];
    this.editandoId = p.id;

    this.nombre = p.nombre;
    this.tipo = p.tipo;
    this.valor = Number(p.valor) || 0;

    this.desde = this.toIsoDate(p.desde);
    this.hasta = this.toIsoDate(p.hasta);
  }

  eliminar(id: number) {
    this.promoSrv.remove(id);
    if (this.editandoId === id) this.limpiar();
  }

  limpiar() {
    this.nombre = '';
    this.tipo = 'porcentaje';
    this.valor = 0;
    this.desde = '';
    this.hasta = '';
    this.editandoId = null;
    this.errores = [];
  }

  private toIsoDate(s: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
      const [dd, mm, yyyy] = s.split('-');
      return `${yyyy}-${mm}-${dd}`;
    }

    return s;
  }
}
