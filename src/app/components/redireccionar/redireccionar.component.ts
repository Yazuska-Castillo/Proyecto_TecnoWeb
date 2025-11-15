import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-redirect',
  template: '',
})
export class redireccionarComponent {
  constructor(private auth: AuthService, private router: Router) {
    const rol = this.auth.getRol();

    if (rol === 'admin') {
      this.router.navigate(['/admin']);
    } else if (rol === 'cliente') {
      this.router.navigate(['/catalogo']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
