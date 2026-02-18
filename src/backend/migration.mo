import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Float "mo:core/Float";

module {
  type Destination = {
    id : Nat;
    name : Text;
    description : Text;
    country : Text;
    city : Text;
    longitude : Float;
    latitude : Float;
  };

  type ContactInquiry = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type OldBooking = {
    id : Nat;
    userId : Principal;
    bookingType : BookingType;
    details : Text;
    createdAt : Int;
    // No transportOptionId in old version
  };

  type NewBooking = {
    id : Nat;
    userId : Principal;
    bookingType : BookingType;
    details : Text;
    createdAt : Int;
    transportOptionId : ?Nat;
  };

  type BookingType = {
    #flight;
    #train;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  type TransportOption = {
    id : Nat;
    destinationId : Nat;
    transportType : TransportType;
    schedule : Text;
    availableSeats : Nat;
  };

  type TransportType = {
    #flight;
    #train;
  };

  type OldActor = {
    nextDestinationId : Nat;
    destinations : Map.Map<Nat, Destination>;
    contactInquiries : Map.Map<Nat, ContactInquiry>;
    nextContactId : Nat;
    bookings : Map.Map<Nat, OldBooking>;
    nextBookingId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    nextDestinationId : Nat;
    destinations : Map.Map<Nat, Destination>;
    contactInquiries : Map.Map<Nat, ContactInquiry>;
    nextContactId : Nat;
    bookings : Map.Map<Nat, NewBooking>;
    nextBookingId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    transportOptions : Map.Map<Nat, TransportOption>;
    nextTransportOptionId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookings.map<Nat, OldBooking, NewBooking>(
      func(_id, oldBooking) {
        { oldBooking with transportOptionId = null };
      }
    );

    {
      old with
      bookings = newBookings;
      transportOptions = Map.empty<Nat, TransportOption>();
      nextTransportOptionId = 1 : Nat;
    };
  };
};
