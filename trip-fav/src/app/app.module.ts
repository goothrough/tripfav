import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { mapToCanActivate, RouterModule, Routes } from '@angular/router';

// Component
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './component/confirm-modal/confirm-modal.component';
import { TopComponent } from './component/top/top.component';
import { HomeComponent } from './component/home/home.component';
import { LayoutComponent } from './component/layout/layout.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from "@angular/google-maps";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environments';
import { provideFirebaseApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideDatabase, getDatabase } from "@angular/fire/database";
import { FIREBASE_OPTIONS } from "@angular/fire/compat";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { LoginComponent } from './component/login/login.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { TripComponent } from './component/trip/trip.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { AddTripModalComponent } from './component/add-trip-modal/add-trip-modal.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { ShareTripModalComponent } from './component/share-trip-modal/share-trip-modal.component';


const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
    canActivate: mapToCanActivate([LoginGuard])
  },
  {
    path: 'signup', component: SignUpComponent,
    canActivate: mapToCanActivate([LoginGuard])
  },
  {
    path: 'home', component: HomeComponent,
    canActivate: mapToCanActivate([AuthGuard])
  },
  {
    path: 'top', component: TopComponent
  },
  {
    path: 'trip', component: TripComponent,
    canActivate: mapToCanActivate([AuthGuard])
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent,
    TopComponent,
    LayoutComponent,
    LoginComponent,
    SignUpComponent,
    TripComponent,
    ToolbarComponent,
    AddTripModalComponent,
    HomeComponent,
    ShareTripModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    GoogleMapsModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatProgressSpinnerModule,
    OverlayModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSnackBarModule,
    RouterModule.forRoot(routes,
      { enableTracing: true }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent]
})
export class AppModule { }
