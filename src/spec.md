# Specification

## Summary
**Goal:** Add destination-linked transport options (flights/trains) with schedules and seat availability, and enable booking those options from destination and booking pages.

**Planned changes:**
- Backend: add data and query API to return bookable flight/train options for a given destination, including schedule details and total/available seats, with deterministic defaults for seeded destinations.
- Backend: update booking creation to target a specific transport option, decrement available seats on booking, and reject bookings that exceed remaining seats; ensure booking history includes destination and schedule info.
- Frontend: update Destination Details page to show a “Book flight/train” section listing options with schedule and available seats, and route unauthenticated users to login before booking.
- Frontend: update Booking page and React Query hooks to fetch options, prefill booking from a selected option, display full option details (including availability), create bookings via the updated API, and show English validation/errors.

**User-visible outcome:** Users can view available flight/train options for a destination (with departure info and remaining seats) and book a specific option; bookings respect seat limits and appear in “My Bookings” with destination and schedule details.
