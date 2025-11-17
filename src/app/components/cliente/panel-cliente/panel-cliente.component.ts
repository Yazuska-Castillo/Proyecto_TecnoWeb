import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-panel-cliente',
  templateUrl: './panel-cliente.component.html',
  styleUrls: ['./panel-cliente.component.css']
})
export class PanelClienteComponent implements OnInit {

  usuario: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuarioActual();

    if (!this.usuario) {
      console.error("⚠ No hay usuario logueado");
    }
  }
}
