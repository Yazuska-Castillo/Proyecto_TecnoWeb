export type TipoPromo = 'porcentaje' | 'fijo';

export interface Promo {
  id: number;
  nombre: string;
  tipo: TipoPromo;
  valor: number;
  desde: string; 
  hasta: string; 
}
