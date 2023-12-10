import { inject, Injectable } from "@angular/core";
import { AuthService } from "../service/auth/auth.service";

@Injectable({providedIn: 'root'})
export class LoginGuard {
  canActivate(route, state) {
    return inject(AuthService).loginCanActivate(route, state);
  }
}

