import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Allow for data migration
(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  type Booking = {
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

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type TransportOption = {
    id : Nat;
    destinationId : Nat;
    transportType : TransportType;
    schedule : Text;
    availableSeats : Nat;
  };

  public type TransportType = {
    #flight;
    #train;
  };

  var nextDestinationId = 1;
  let destinations = Map.empty<Nat, Destination>();

  let contactInquiries = Map.empty<Nat, ContactInquiry>();
  var nextContactId = 1;

  let bookings = Map.empty<Nat, Booking>();
  var nextBookingId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  let transportOptions = Map.empty<Nat, TransportOption>();
  var nextTransportOptionId = 1;

  func seedDestinations() {
    destinations.clear();
    nextDestinationId := 1;

    addDestination({
      id = 1;
      name = "Sagrada Família";
      description = "A large unfinished Roman Catholic minor basilica in Barcelona, designed by architect Antoni Gaudí.";
      country = "Spain";
      city = "Barcelona";
      longitude = 2.17403;
      latitude = 41.4036;
    });

    addDestination({
      id = 2;
      name = "The Louvre Museum";
      description = "The world's largest art museum and a historic monument in Paris, France.";
      country = "France";
      city = "Paris";
      longitude = 2.3364;
      latitude = 48.8609;
    });
  };

  func addDestination(destination : Destination) {
    destinations.add(destination.id, destination);
    nextDestinationId += 1;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Destinations - Public read access for all users including guests
  public query ({ caller }) func getDestinations() : async [Destination] {
    if (destinations.size() == 0) {
      seedDestinations();
    };

    destinations.values().toArray();
  };

  public query ({ caller }) func getDestinationById(id : Nat) : async Destination {
    switch (destinations.get(id)) {
      case (null) { Runtime.trap("Destination not found") };
      case (?destination) { destination };
    };
  };

  // Contact Inquiries - Any user including guests can submit
  public shared ({ caller }) func submitContactInquiry(name : Text, email : Text, message : Text, timestamp : Int) : async () {
    if (message.size() == 0) {
      Runtime.trap("Message cannot be empty");
    };

    let inquiry : ContactInquiry = {
      name;
      email;
      message;
      timestamp;
    };

    contactInquiries.add(nextContactId, inquiry);
    nextContactId += 1;
  };

  // Admin-only: View all contact inquiries
  public query ({ caller }) func getAllContactInquiries() : async [ContactInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all contact inquiries");
    };
    contactInquiries.values().toArray();
  };

  // Transport Options
  public shared ({ caller }) func addTransportOption(destinationId : Nat, transportType : TransportType, schedule : Text, availableSeats : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add transport options");
    };

    switch (destinations.get(destinationId)) {
      case (null) { Runtime.trap("Destination not found") };
      case (?_) {
        let transportOption : TransportOption = {
          id = nextTransportOptionId;
          destinationId;
          transportType;
          schedule;
          availableSeats;
        };

        transportOptions.add(nextTransportOptionId, transportOption);
        nextTransportOptionId += 1;
        transportOption.id;
      };
    };
  };

  public query ({ caller }) func getTransportOptionsByDestination(destinationId : Nat) : async [TransportOption] {
    let options = transportOptions.values().toArray();
    options.filter(func(option) { option.destinationId == destinationId });
  };

  public query ({ caller }) func getTransportOptionById(id : Nat) : async TransportOption {
    switch (transportOptions.get(id)) {
      case (null) { Runtime.trap("Transport option not found") };
      case (?option) { option };
    };
  };

  // Bookings - User-only operations
  public shared ({ caller }) func createBooking(bookingType : BookingType, details : Text, createdAt : Int, transportOptionId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    let transportOption = switch (transportOptions.get(transportOptionId)) {
      case (null) { Runtime.trap("Transport option not found") };
      case (?option) { option };
    };

    // Check transport type matches booking type
    if ((transportOption.transportType == #flight and bookingType != #flight) or (transportOption.transportType == #train and bookingType != #train)) {
      Runtime.trap("Booking type does not match transport option type");
    };

    // Check available seats
    if (transportOption.availableSeats == 0) {
      Runtime.trap("No available seats for this transport option");
    };

    // Update bookings
    let booking : Booking = {
      id = nextBookingId;
      userId = caller;
      bookingType;
      details;
      createdAt;
      transportOptionId = ?transportOptionId;
    };

    bookings.add(nextBookingId, booking);
    nextBookingId += 1;

    // Update available seats (replace with new TransportOption)
    let newTransportOption : TransportOption = {
      transportOption with availableSeats = transportOption.availableSeats - 1;
    };
    transportOptions.add(transportOptionId, newTransportOption);

    booking.id;
  };

  public query ({ caller }) func getBookingsByCaller() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    bookings.values().toArray().filter(func(b) { b.userId == caller });
  };

  public query ({ caller }) func getBookingById(bookingId : Nat) : async Booking {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        // Users can only view their own bookings, admins can view all
        if (booking.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        booking;
      };
    };
  };
};
