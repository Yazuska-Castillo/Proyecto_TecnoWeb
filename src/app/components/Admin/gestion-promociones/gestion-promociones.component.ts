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

  constructor(private promoSrv: PromocionesService) {
    this.promoSrv.promos$.subscribe((p: Promo[]) => (this.promociones = p));
  }

  agregar() {
    if (!this.nombre || !this.desde || !this.hasta) return;
    this.promoSrv.add({
      nombre: this.nombre.trim(),
      tipo: this.tipo,
      valor: Number(this.valor) || 0,
      desde: this.desde,
      hasta: this.hasta,
    });
    this.limpiar();
  }

  eliminar(id: number) {
    this.promoSrv.remove(id);
  }

  limpiar() {
    this.nombre = '';
    this.tipo = 'porcentaje';
    this.valor = 0;
    this.desde = '';
    this.hasta = '';
  }
}
