export interface Ride {
    id: string;
    passengerId: number;
    passengerName: string;
    driverId: number;
    driverName: string;
    vehicleId: number;
    vehicleName: string;
    vehicleRegister: string;
    startLatitude: string;
    startLongitude: string;
    startAddress: string;
    endLatitude: string;
    endLongitude: string;
    endAddress: string;
    baggage: string;
    status: number;
    fee: string;
    cancelationReason: string;
    numberOfPassengers: number;
    requestedAt: Date;
    updatedAt: Date;
}