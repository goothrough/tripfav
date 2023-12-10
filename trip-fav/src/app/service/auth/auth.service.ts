import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, mergeMap, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  createUser(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut()
  }

  authCanActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => {
      if (!user) {
        //Redirect to Login page.
        this.router.navigateByUrl('/login');
      }
      return true;
    }));
  }

  loginCanActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : Observable<boolean>{
      return this.afAuth.authState.pipe(map(user => {
        if (user) {
          //Redirect to Home page.
          this.router.navigateByUrl('/home');
        }
        return true;
      }));
  }
}


