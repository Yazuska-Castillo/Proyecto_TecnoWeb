import { Component } from '@angular/core';

interface Promo {
  id: number;
  nombre: string;
  tipo: 'porcentaje' | 'fijo'; // % o $ CLP
  valor: number;               // 20 (20%) o 15000 ($15.000)
  desde: string;               // YYYY-MM-DD
  hasta: string;               // YYYY-MM-DD
}

@Component({
  selector: 'app-gestion-promociones',
  templateUrl: './gestion-promociones.component.html',
  styleUrls: ['./gestion-promociones.component.css']
})
export class GestionPromocionesComponent {
  nombre = '';
  tipo: 'porcentaje' | 'fijo' = 'porcentaje';
  valor = 0;
  desde = '';
  hasta = '';

  promociones: Promo[] = [
    { id: 1, nombre: 'Tikitikiti',  tipo: 'porcentaje', valor: 20,    desde: '2025-09-13', hasta: '2025-09-18' },
    { id: 2, nombre: 'Findes',  tipo: 'fijo',       valor: 15000, desde: '2025-03-01', hasta: '2025-03-31' },
    { id: 3, nombre: 'Cyberday',  tipo: 'porcentaje',       valor: 80, desde: '2025-10-01', hasta: '2025-10-08' }

  ];

  agregarPromocion() {
    if (!this.nombre.trim()) return;
    const id = Math.max(0, ...this.promociones.map(p => p.id)) + 1;
    this.promociones.push({
      id,
      nombre: this.nombre.trim(),
      tipo: this.tipo,
      valor: Number(this.valor) || 0,
      desde: this.desde,
      hasta: this.hasta
    });
    this.nombre = ''; this.tipo = 'porcentaje'; this.valor = 0; this.desde = ''; this.hasta = '';
  }

  eliminar(id: number) {
    this.promociones = this.promociones.filter(p => p.id !== id);
  }
}
