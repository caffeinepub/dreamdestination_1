import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Destination {
    id: bigint;
    latitude: number;
    country: string;
    city: string;
    name: string;
    description: string;
    longitude: number;
}
export interface TransportOption {
    id: bigint;
    destinationId: bigint;
    availableSeats: bigint;
    transportType: TransportType;
    schedule: string;
}
export interface Booking {
    id: bigint;
    userId: Principal;
    createdAt: bigint;
    transportOptionId?: bigint;
    bookingType: BookingType;
    details: string;
}
export interface ContactInquiry {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum BookingType {
    train = "train",
    flight = "flight"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTransportOption(destinationId: bigint, transportType: TransportType, schedule: string, availableSeats: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(bookingType: BookingType, details: string, createdAt: bigint, transportOptionId: bigint): Promise<bigint>;
    getAllContactInquiries(): Promise<Array<ContactInquiry>>;
    getBookingById(bookingId: bigint): Promise<Booking>;
    getBookingsByCaller(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDestinationById(id: bigint): Promise<Destination>;
    getDestinations(): Promise<Array<Destination>>;
    getTransportOptionById(id: bigint): Promise<TransportOption>;
    getTransportOptionsByDestination(destinationId: bigint): Promise<Array<TransportOption>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactInquiry(name: string, email: string, message: string, timestamp: bigint): Promise<void>;
}
