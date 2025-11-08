// panel-cliente.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-cliente',
  templateUrl: './panel-cliente.component.html',
  styleUrls: ['./panel-cliente.component.css']
})
export class PanelClienteComponent {
  usuario = {
    nombre: 'Juan Pérez',
    email: 'juanperez@example.com'
  };
}
