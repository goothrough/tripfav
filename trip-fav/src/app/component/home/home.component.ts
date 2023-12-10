import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { TripService } from 'src/app/service/trip/trip.service';
import * as firebase from 'firebase/auth';
import { take } from 'rxjs';
import { Trip, TripModalMode } from 'src/app/constants/type';
import { MatDialog } from '@angular/material/dialog';
import { AddTripModalComponent } from '../add-trip-modal/add-trip-modal.component';
import { LoadingSpinnerService } from 'src/app/service/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-top',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: firebase.User;
  welcomeMessage: string;
  dataSource: Trip[] = [];
  displayedColumns: string[] = ['no', 'tripName'];

  constructor(private tripService: TripService,
    private afAuth: AngularFireAuth,
    private router: Router,
    public dialog: MatDialog,
    private loadingSpinnerService: LoadingSpinnerService) { }

  ngOnInit(): void {
    this.afAuth.authState.pipe(take(1))
      .subscribe(user => {
        this.user = user;
        this.welcomeMessage = 'Welcome ' + this.user.email;

        this.tripService.selectTripList(this.user.uid).subscribe((tripList: Trip[]) => {
          this.loadingSpinnerService.show();
          this.dataSource = tripList;
          this.loadingSpinnerService.hide();
        })
      })
  }

  goTripDetails(trip: any) {
    const param = {
      tripName: trip.tripName,
      tripId: trip.tripId
    }
    this.router.navigate(['trip/', param]);
  }

  openCreateANewTripDialog(): void {
    const dialogRef = this.dialog.open(AddTripModalComponent, {
      data: {
        uid: this.user.uid,
        mode: TripModalMode.create
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openAddASharedTripDialog(): void {
    const dialogRef = this.dialog.open(AddTripModalComponent, {
      data: {
        uid: this.user.uid,
        mode: TripModalMode.share
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
