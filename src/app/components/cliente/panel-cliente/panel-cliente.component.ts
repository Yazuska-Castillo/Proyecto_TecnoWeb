import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-panel-cliente',
  templateUrl: './panel-cliente.component.html',
  styleUrls: ['./panel-cliente.component.css'],
})
export class PanelClienteComponent implements OnInit {
  usuario: any = null;

  constructor(
    private auth: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    const email = this.auth.getEmailDesdeToken();
    if (!email) return;

    this.usuario = this.usuariosService.buscarUsuarioPorEmail(email);
  }
}
