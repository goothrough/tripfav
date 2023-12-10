import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingSpinnerService } from 'src/app/service/loading-spinner/loading-spinner.service';
import { TripService } from 'src/app/service/trip/trip.service';
import { LocationModalData, LocationModalMode, Location, LocationDeleteInDto, LocationInsertInDto, LocationUpdateInDto } from '../../constants/type';



@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  isLocationNameInputDisabled: boolean;
  result: string;

  @ViewChild('inputLocationName') inputLocationName: ElementRef;
  @ViewChild('inputAddress') inputAddress: ElementRef;

  constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationModalData, private tripService: TripService,
    private loadingSpinnerService: LoadingSpinnerService) {
  }

  ngOnInit(): void {
    this.isLocationNameInputDisabled = (this.data.mode === LocationModalMode.delete) ? true : false;
  }

  onConfirm(): void {
    this.loadingSpinnerService.show();
    const location = this.data.location;
    const locationName = this.inputLocationName.nativeElement.value;
    const address = this.inputAddress.nativeElement.value;

    switch (this.data.mode) {
      case LocationModalMode.register:
        const locationInsertInDto: LocationInsertInDto = { locationName: locationName, address, geometry: location.geometry };
        this.tripService.insertLocation(this.data.uid, this.data.tripId, locationInsertInDto);
        break;
      case LocationModalMode.update:
        const locationUpdateInDto: LocationUpdateInDto = { locationId: location.locationId, locationName };
        this.tripService.updateLocation(this.data.uid, this.data.tripId, locationUpdateInDto);
        break;
      case LocationModalMode.delete:
        const locationDeleteInDto: LocationDeleteInDto = { ...location };
        this.tripService.deleteLocation(this.data.uid, this.data.tripId, locationDeleteInDto);
        break;
    }

    this.result = 'success';
    this.dialogRef.close(this.result);
    this.loadingSpinnerService.hide();
  }

}
