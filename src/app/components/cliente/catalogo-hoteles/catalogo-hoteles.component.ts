import { Component, OnInit } from '@angular/core';
import { HotelesService } from 'src/app/services/hoteles.service';
import { Hotel } from 'src/app/models/hotel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo-hoteles',
  templateUrl: './catalogo-hoteles.component.html',
  styleUrls: ['./catalogo-hoteles.component.css']
})
export class CatalogoHotelesComponent implements OnInit {

  hoteles: Hotel[] = [];
  filtro: string = '';

  constructor(
    private hotelesService: HotelesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hoteles = this.hotelesService.obtenerHoteles();
  }

  verHabitaciones(hotelId: number) {
    this.router.navigate(['/cliente/habitaciones'], {
      queryParams: { hotelId }
    });
  }

  get hotelesFiltrados(): Hotel[] {
    return this.hoteles.filter(h =>
      h.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      h.ubicacion.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}
