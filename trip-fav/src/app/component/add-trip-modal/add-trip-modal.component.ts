import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripModalData, TripModalMode } from 'src/app/constants/type';
import { LoadingSpinnerService } from 'src/app/service/loading-spinner/loading-spinner.service';
import { TripService } from 'src/app/service/trip/trip.service';

@Component({
  selector: 'app-add-trip-modal',
  templateUrl: './add-trip-modal.component.html',
  styleUrls: ['./add-trip-modal.component.scss']
})
export class AddTripModalComponent {

  result: string;
  isDisabledConfirm: boolean;
  @ViewChild('inputTripName') inputTripName: ElementRef;
  @ViewChild('inputTripId') inputTripId: ElementRef;

  constructor(public dialogRef: MatDialogRef<AddTripModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TripModalData,
    private tripService: TripService,
    private loadingSpinnerService: LoadingSpinnerService) {
    this.isDisabledConfirm = false;
  }

  onConfirm() {
    this.isDisabledConfirm = true;
    this.loadingSpinnerService.show();

    switch (this.data.mode) {
      case TripModalMode.create:
        const tripName = this.inputTripName.nativeElement.value;
        this.tripService.createNewTrip(this.data.uid, tripName)
          .then(() => {
            this.result = 'success';
            this.dialogRef.close(this.result);
          })
          .catch(error => {
            this.loadingSpinnerService.hide();
          });
        break;
      case TripModalMode.share:
        const tripId = this.inputTripId.nativeElement.value;
        this.tripService.addSharedTrip(this.data.uid, tripId)
          .then(() => {
            this.result = 'success';
            this.dialogRef.close(this.result);
          })
          .catch(error => {
            console.error(error)
            this.loadingSpinnerService.hide();
          });
        break;
    }
    this.loadingSpinnerService.hide();
  }
}
