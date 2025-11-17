import { Promo } from 'src/app/models/promo.model';

export const PROMOCIONES_PREDEFINIDAS: Promo[] = [
  {
    id: 1,
    nombre: 'Tikitikiti',
    tipo: 'porcentaje',
    valor: 20,
    desde: '2025-09-13',
    hasta: '2025-09-18'
  },
  {
    id: 2,
    nombre: 'Findes',
    tipo: 'fijo',
    valor: 15000,
    desde: '2025-03-01',
    hasta: '2025-03-31'
  },
  {
    id: 3,
    nombre: 'Cyberday',
    tipo: 'porcentaje',
    valor: 80,
    desde: '2025-10-01',
    hasta: '2025-10-08'
  }
];
