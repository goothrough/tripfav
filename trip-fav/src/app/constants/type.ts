export type Location = {
    locationId: string;
    locationName: string;
    address: string;
    geometry: google.maps.LatLngLiteral;
}

export type LocationSelectOutDto = {
    locationId: string;
    locationName: string;
    address: string;
    geometry: google.maps.LatLngLiteral;
}

export type LocationInsertInDto = {
    locationName: string;
    address: string;
    geometry: google.maps.LatLngLiteral;
}

export type LocationUpdateInDto = {
    locationId: string;
    locationName: string;
}

export type LocationDeleteInDto = {
    locationId: string;
    locationName: string;
    address: string;
    geometry: google.maps.LatLngLiteral;
}

export type LocationModalData = {
    location: Location;
    mode: string;
    uid: string;
    tripId: string;
}

export const LocationModalMode = {
    register: 'RESISTER',
    update: 'UPDATE',
    delete: 'DELETE'
} as const;

export type Trip = {
    tripName: string;
    tripId: string;
    sharedUsersUidList: string[];
}

export type TripModalData = {
    uid: string;
    mode: string;
}

export const TripModalMode = {
    create: 'CREATE',
    share: 'SHARE',
} as const;

export type ShareTripModalData = {
    tripId: string;
}