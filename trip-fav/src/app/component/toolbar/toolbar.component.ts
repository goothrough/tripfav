import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/service/auth/auth.service';
import * as firebase from 'firebase/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  user : firebase.User;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Subscribe the user's login condition.
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().
      then(() => {
        this.router.navigateByUrl('login');
      });
  }
}
