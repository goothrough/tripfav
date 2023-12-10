import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { config } from 'src/app/constants/constants';
import { LocationDeleteInDto, LocationInsertInDto, LocationUpdateInDto } from 'src/app/constants/type';
import { arrayUnion, serverTimestamp } from '@angular/fire/firestore'


@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private db: AngularFirestore) { }

  selectTripList(uid: string): Observable<any> {
    return this.db.collection(config.DB_COLLECTION_ID,
      ref => ref.where('logicalDeleteFlag', '==', false)
        .where('sharedUsersUidList', 'array-contains', uid)
        .orderBy('updatedDate', 'desc'))
      .valueChanges({ idField: 'tripId' });
  }

  selectLocationList(uid: string, tripId: string): Observable<any> {
    return this.db.collection(config.DB_COLLECTION_ID,
      ref => ref.where('logicalDeleteFlag', '==', false).where('sharedUsersUidList', 'array-contains', uid))
      .doc(tripId)
      .collection((tripId + config.LOCATIONS),
        ref => ref.where('logicalDeleteFlag', '==', false))
      .valueChanges({ idField: 'locationId' });
  }

  insertLocation(uid: string, tripId: string, location: LocationInsertInDto) {
    this.db.collection(config.DB_COLLECTION_ID)
      .doc(tripId)
      .collection(tripId + config.LOCATIONS)
      .add({
        ...location,
        logicalDeleteFlag: false,
        createUser: uid,
        createdDate: serverTimestamp(),
        updateUser: uid,
        updatedDate: serverTimestamp()
      });
  }

  deleteLocation(uid: string, tripId: string, location: LocationDeleteInDto) {
    this.db.collection(config.DB_COLLECTION_ID)
      .doc(tripId)
      .collection(config.LOCATIONS)
      .doc(location.locationId)
      .update({
        logicalDeleteFlag: true,
        updateUser: uid,
        updatedDate: serverTimestamp()
      });
  }

  updateLocation(uid: string, tripId: string, location: LocationUpdateInDto) {
    return this.db.collection(config.DB_COLLECTION_ID)
      .doc(tripId)
      .collection(config.LOCATIONS)
      .doc(location.locationId)
      .update({
        locationName: location.locationName,
        updateUser: uid,
        updatedDate: serverTimestamp()
      });
  }

  createNewTrip(uid: string, tripName: string) {
    return this.db.collection(config.DB_COLLECTION_ID)
      .add(
        {
          tripName,
          sharedUsersUidList: [uid],
          logicalDeleteFlag: false,
          createUser: uid,
          createdDate: serverTimestamp(),
          updateUser: uid,
          updatedDate: serverTimestamp()
        }
      );
  }

  addSharedTrip(uid: string, tripId: string) {
    console.log(uid);
    return this.db.collection(config.DB_COLLECTION_ID)
      .doc(tripId)
      .update({
        sharedUsersUidList: arrayUnion(uid),
        updateUser: uid,
        updatedDate: serverTimestamp()
      });

  }

}
