import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private overlay: Overlay
  ) { }


  show(){
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
  }

  hide(){
    this.overlayRef.detach();
  }
}
