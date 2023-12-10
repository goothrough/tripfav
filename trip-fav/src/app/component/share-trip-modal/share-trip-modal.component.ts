import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareTripModalData } from 'src/app/constants/type';

@Component({
  selector: 'app-share-trip-modal',
  templateUrl: './share-trip-modal.component.html',
  styleUrls: ['./share-trip-modal.component.scss']
})
export class ShareTripModalComponent {

  constructor(public dialogRef: MatDialogRef<ShareTripModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:ShareTripModalData,private _snackBar: MatSnackBar) {

  }

  copyTripId(){
    navigator.clipboard.writeText(this.data.tripId).then(()=>{
      this._snackBar.open('Copied.','Close',{
        duration: 2000
      });
    });
  }
}
