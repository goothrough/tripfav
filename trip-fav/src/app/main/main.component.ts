import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapGeocoder, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { PlaceAddComponent } from '../place-add/place-add.component';
import { Location } from '../type/type';

let locationList: Location[] = [
  { no: 1, locationName: 'スターバックスコーヒー', address: '東京都北区東田端', geometry: { lat: 35.7, lng: 139.7 } },
  { no: 2, locationName: 'ウェルシア', address: '東京都荒川区', geometry: { lat: 35.7, lng: 140.0 } }
]

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  locationName: string;
  address: string;
  geometry: google.maps.LatLngLiteral;

  //google map settings
  center = { lat: 35.7, lng: 139.7 };
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = { draggable: false, label: '1' };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerLabel =  {
    text: "\ue838", // codepoint from https://fonts.google.com/icons
    fontFamily: "Material Icons",
    color: "#ffffff",
    fontSize: "18px",
  };
  tempMarkerPositions:google.maps.LatLngLiteral[] = [];

  //tables settings
  displayedColumns: string[] = ['no', 'locationName', 'address', 'edit', 'delete'];
  dataSource = locationList;
  constructor(public dialog: MatDialog,private ngZone:NgZone) {
  }

  //Add Location button flag
  isAddLocationDisabled: boolean;

  @ViewChild(MatTable) table: MatTable<Location> | undefined;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild('inputLocation') inputLocation: ElementRef;

  ngOnInit(): void {
    this.isAddLocationDisabled = true;
    this.addMarkers();
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
      this.tempMarkerPositions =[];
      this.tempMarkerPositions.push(place.geometry.location.toJSON());
      this.center = place.geometry.location.toJSON();
      this.isAddLocationDisabled = false;
    });
  }

  openInfoWindow(marker: MapMarker) {
    //Find the location name and address from the datasource provided that the latlng is equal to the marker.
    const data = this.dataSource.find(({ geometry }) => JSON.stringify(geometry) === JSON.stringify(marker.getPosition().toJSON()));

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

  openDialog(): void {
    const dialogRef = this.dialog.open(PlaceAddComponent, {
      data: { locationName: this.locationName, address: this.address, geometry: this.geometry },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.no = this.dataSource.length + 1;
        this.dataSource.push(result);
        // this.markerPositions = this.dataSource.map(data => { return data.geometry });
        this.addMarkers();
        this.infoWindow.close();
        this.table?.renderRows();
        const inputElement = this.inputLocation.nativeElement as HTMLInputElement;
        inputElement.value = '';
      }

    });
  }

  addMarkers() {
    this.markerPositions = this.dataSource.map(data => { return data.geometry });
  }

}
