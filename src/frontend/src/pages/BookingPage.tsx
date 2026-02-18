import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateBooking, useMyBookings, useTransportOptionById, useDestinationById } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plane, Train, Calendar, Clock, Users, MapPin, AlertCircle } from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';
import type { Booking } from '../backend';

export default function BookingPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  // Get search params for prefilled booking
  const searchParams = useSearch({ strict: false }) as { 
    transportOptionId?: string; 
    destinationId?: string;
  };
  
  const transportOptionId = searchParams.transportOptionId ? BigInt(searchParams.transportOptionId) : 0n;
  const destinationId = searchParams.destinationId ? BigInt(searchParams.destinationId) : 0n;

  const { data: selectedOption, isLoading: optionLoading } = useTransportOptionById(transportOptionId);
  const { data: destination } = useDestinationById(destinationId);

  const [bookingType, setBookingType] = useState<'flight' | 'train'>('flight');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [formError, setFormError] = useState('');

  const createBookingMutation = useCreateBooking();
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useMyBookings();

  // Prefill form when transport option is selected
  useEffect(() => {
    if (selectedOption && destination) {
      setBookingType(selectedOption.transportType === 'flight' ? 'flight' : 'train');
      setTo(destination.city);
    }
  }, [selectedOption, destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!from.trim() || !to.trim() || !date || !time) {
      setFormError('Please fill in all fields');
      return;
    }

    const passengersNum = parseInt(passengers);
    if (isNaN(passengersNum) || passengersNum < 1) {
      setFormError('Passengers must be at least 1');
      return;
    }

    // Validate against available seats if transport option is selected
    if (selectedOption && BigInt(passengersNum) > selectedOption.availableSeats) {
      setFormError(`Only ${selectedOption.availableSeats.toString()} seat(s) available. Please reduce the number of passengers.`);
      return;
    }

    // Require transport option selection
    if (!selectedOption || transportOptionId === 0n) {
      setFormError('Please select a transport option from a destination page');
      return;
    }

    // Create booking details string
    const details = JSON.stringify({
      from: from.trim(),
      to: to.trim(),
      date,
      time,
      passengers: passengersNum,
      schedule: selectedOption.schedule,
      destinationName: destination?.name || to,
    });

    try {
      await createBookingMutation.mutateAsync({
        bookingType,
        details,
        transportOptionId,
      });

      // Reset form
      setFrom('');
      setTo('');
      setDate('');
      setTime('');
      setPassengers('1');
    } catch (error: any) {
      setFormError(error.message || 'Failed to create booking');
    }
  };

  const formatBookingDetails = (booking: Booking) => {
    try {
      const details = JSON.parse(booking.details);
      return details;
    } catch {
      return null;
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isInitializing) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Sign In Required</h1>
            <p className="text-lg text-muted-foreground">
              Please sign in to create and view your bookings
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  You need to be signed in to access the booking system. Sign in to create flight
                  and train bookings and view your booking history.
                </p>
                <Button asChild size="lg">
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Book Your Journey</h1>
          <p className="text-lg text-muted-foreground">
            Reserve your flights and train tickets for your next adventure
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Booking</CardTitle>
              <CardDescription>
                Fill in the details for your flight or train booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show selected transport option details */}
              {optionLoading && transportOptionId > 0n && (
                <div className="mb-6">
                  <Skeleton className="h-24 w-full" />
                </div>
              )}

              {selectedOption && destination && (
                <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        {selectedOption.transportType === 'flight' ? (
                          <Plane className="h-5 w-5 text-primary" />
                        ) : (
                          <Train className="h-5 w-5 text-primary" />
                        )}
                        <span className="capitalize">Selected {selectedOption.transportType}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedOption.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>To {destination.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-success font-medium">
                            {selectedOption.availableSeats.toString()} {Number(selectedOption.availableSeats) === 1 ? 'seat' : 'seats'} available
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedOption && transportOptionId === 0n && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please select a transport option from a destination page to book.{' '}
                    <Link to="/destinations" className="underline font-medium">
                      Browse destinations
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={bookingType} onValueChange={(v) => setBookingType(v as 'flight' | 'train')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="flight" disabled={!!selectedOption}>
                      <Plane className="mr-2 h-4 w-4" />
                      Flight
                    </TabsTrigger>
                    <TabsTrigger value="train" disabled={!!selectedOption}>
                      <Train className="mr-2 h-4 w-4" />
                      Train
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      From
                    </Label>
                    <Input
                      id="from"
                      placeholder="Departure city"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      To
                    </Label>
                    <Input
                      id="to"
                      placeholder="Arrival city"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                      disabled={!!selectedOption}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers">
                      <Users className="inline h-4 w-4 mr-1" />
                      Passengers
                    </Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max={selectedOption ? selectedOption.availableSeats.toString() : undefined}
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      required
                    />
                    {selectedOption && (
                      <p className="text-xs text-muted-foreground">
                        Maximum {selectedOption.availableSeats.toString()} passenger(s) for this option
                      </p>
                    )}
                  </div>
                </div>

                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                {createBookingMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {createBookingMutation.error?.message || 'Failed to create booking'}
                    </AlertDescription>
                  </Alert>
                )}

                {createBookingMutation.isSuccess && (
                  <Alert>
                    <AlertDescription>
                      Booking created successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={createBookingMutation.isPending || !selectedOption}
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      {bookingType === 'flight' ? (
                        <Plane className="mr-2 h-4 w-4" />
                      ) : (
                        <Train className="mr-2 h-4 w-4" />
                      )}
                      Create Booking
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>
                View your booking history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {bookingsError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load bookings
                  </AlertDescription>
                </Alert>
              )}

              {!bookingsLoading && !bookingsError && bookings.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No bookings yet. Create your first booking!</p>
                </div>
              )}

              {!bookingsLoading && !bookingsError && bookings.length > 0 && (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const details = formatBookingDetails(booking);
                    return (
                      <Card key={booking.id.toString()}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {booking.bookingType === 'flight' ? (
                                  <Plane className="h-5 w-5 text-primary" />
                                ) : (
                                  <Train className="h-5 w-5 text-primary" />
                                )}
                                <span className="font-semibold capitalize">
                                  {booking.bookingType}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                #{booking.id.toString()}
                              </span>
                            </div>

                            {details && (
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Route:</span>
                                  <span className="font-medium">
                                    {details.from} → {details.to}
                                  </span>
                                </div>
                                {details.schedule && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Schedule:</span>
                                    <span className="font-medium">{details.schedule}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Date:</span>
                                  <span className="font-medium">
                                    {details.date} at {details.time}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Passengers:</span>
                                  <span className="font-medium">{details.passengers}</span>
                                </div>
                              </div>
                            )}

                            <div className="pt-2 border-t text-xs text-muted-foreground">
                              Booked on {formatDate(booking.createdAt)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
