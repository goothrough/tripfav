import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard {
  canActivate(route, state) {
    return inject(AuthService).authCanActivate(route, state);
  }
}