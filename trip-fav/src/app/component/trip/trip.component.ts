import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { LocationModalMode, Location, LocationModalData, ShareTripModalData } from '../../constants/type';
import { TripService } from 'src/app/service/trip/trip.service';
import * as _ from 'lodash';
import { LoadingSpinnerService } from 'src/app/service/loading-spinner/loading-spinner.service';
import * as firebase from 'firebase/auth';
import { take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ShareTripModalComponent } from '../share-trip-modal/share-trip-modal.component';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {
  locationName: string;
  address: string;
  geometry: google.maps.LatLngLiteral;
  user: firebase.User;
  locationListSubscription: Subscription;
  tripId: string;
  tripName: string;

  //google map settings
  center = { lat: 35.7, lng: 139.7 };
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false, label: '1' };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerLabel = {
    text: "\ue838", // codepoint from https://fonts.google.com/icons
    fontFamily: "Material Icons",
    color: "#ffffff",
    fontSize: "18px",
  };
  tempMarkerPositions: google.maps.LatLngLiteral[] = [];

  //tables settings
  displayedColumns: string[] = ['no', 'locationName', 'address', 'edit', 'delete'];
  dataSource: Location[] = [];

  constructor(public dialog: MatDialog,
    private tripService: TripService,
    private loadingSpinnerService: LoadingSpinnerService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,) {
  }

  //Add Location button flag
  isAddLocationDisabled: boolean;

  @ViewChild(MatTable) table: MatTable<Location> | undefined;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild('inputLocation') inputLocation: ElementRef;

  ngOnInit(): void {
    this.initializeMapAndTable();
    this.tripName = this.route.snapshot.paramMap.get('tripName');
    this.tripId = this.route.snapshot.paramMap.get('tripId');
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.locationListSubscription =
        this.tripService.selectLocationList(this.user.uid, this.tripId)
          .subscribe((locationList: any[]) => {
            this.loadingSpinnerService.show();
            // Set the table data
            this.dataSource = locationList;
            this.addMarkers();
            // Set the center of the map with initial lanlng or the first lanlng data of the dataSource
            this.center = this.dataSource.length === 0 ? this.center : this.dataSource[0].geometry;
            this.table?.renderRows();
            this.loadingSpinnerService.hide();
          });
    });
  }

  initializeMapAndTable() {
    this.isAddLocationDisabled = true;
    this.locationName = null;
    this.address = null;
    this.geometry = null;
    this.zoom = 12;
    this.infoWindow?.close();
    const inputElement = this.inputLocation?.nativeElement as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  ngAfterViewInit() {
    //Initialize the autocomplete
    const inputElement = this.inputLocation.nativeElement as HTMLInputElement;
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };
    const autocomplete = new google.maps.places.Autocomplete(inputElement, options);

    //When input text changes, invoke the autocomlete.
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        this.isAddLocationDisabled = true;
        return;
      }
      this.locationName = place.name;
      this.address = place.formatted_address;
      this.geometry = place.geometry.location.toJSON();
      this.tempMarkerPositions = [];
      this.tempMarkerPositions.push(place.geometry.location.toJSON());
      this.center = place.geometry.location.toJSON();
      this.zoom = 15;
      this.isAddLocationDisabled = false;

    });
  }

  openInfoWindow(marker: MapMarker) {
    //Find the location name and address from the datasource provided that the latlng is equal to the marker.
    const data = this.dataSource
      .find(({ geometry }) => _.isEqual(geometry, marker.getPosition().toJSON()));

    let locationName: string;
    let address: string;

    //If clicked location has not been added to the list yet, show "this" information, and vice versa.
    if (data) {
      locationName = data.locationName;
      address = data.address;
    } else {
      locationName = this.locationName;
      address = this.address;
    }

    const content = '<div style="font-weight: bold;">' + locationName + '</div>' + '<div>' + address + '</div>';

    this.infoWindow.infoWindow.setContent(content);
    this.infoWindow.open(marker);
  }

  openAddLocationDialog(): void {
    const location: Location = {
      locationId: null,
      locationName: this.locationName,
      address: this.address,
      geometry: this.geometry
    };
    const data: LocationModalData = {
      location,
      mode: LocationModalMode.register,
      uid: this.user.uid,
      tripId: this.tripId
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      //Initialize only when the confirm button clicked.
      if (result === 'success') {
        this.initializeMapAndTable();
      }
    });
  }

  openDeleteLocationDialog(location: Location): void {
    const data: LocationModalData = {
      location,
      mode: LocationModalMode.delete,
      uid: this.user.uid,
      tripId: this.tripId
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.initializeMapAndTable();
      }
    });
  }

  openEditLocationDialog(location: Location): void {
    const data: LocationModalData = {
      location,
      mode: LocationModalMode.update,
      uid: this.user.uid,
      tripId: this.tripId
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.initializeMapAndTable();
      }
    });
  }

  addMarkers() {
    this.markerPositions = this.dataSource.map(data => { return data.geometry });
  }

  focusLocation(location: Location) {

    // const content = '<div style="font-weight: bold;">' + location.locationName + '</div>' + '<div>' + location.address + '</div>';

    // this.infoWindow.infoWindow.setContent(content);
    // this.infoWindow.open(marker);

    this.center = location.geometry;
    this.zoom = 20;
  }

  openShareTripDialog() {
    const data: ShareTripModalData = {
      tripId: this.tripId
    };
    const dialogRef = this.dialog.open(ShareTripModalComponent, {
      data
    });
  }

  ngOnDestroy() {
    this.locationListSubscription.unsubscribe();
  }
}
