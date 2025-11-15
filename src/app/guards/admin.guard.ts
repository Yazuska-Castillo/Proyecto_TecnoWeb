import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLogged().pipe(
    map((logged) => {
      if (!logged) {
        router.navigate(['/login']);
        return false;
      }
      if (auth.getRol() === 'admin') {
        return true;
      }
      router.navigate(['/inicio']);
      return false;
    })
  );
};
