import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Globe, ArrowLeft, AlertCircle, Plane, Train, Calendar, Users } from 'lucide-react';
import { useDestinationById, useTransportOptionsByDestination } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function DestinationDetailsPage() {
  const { id } = useParams({ from: '/destinations/$id' });
  const destinationId = BigInt(id);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: destination, isLoading, error } = useDestinationById(destinationId);
  const { 
    data: transportOptions = [], 
    isLoading: optionsLoading 
  } = useTransportOptionsByDestination(destinationId);

  const handleBookTransport = (transportOptionId: bigint) => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
      return;
    }
    navigate({ 
      to: '/booking',
      search: { 
        transportOptionId: transportOptionId.toString(),
        destinationId: destinationId.toString()
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container py-12 md:py-16">
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/destinations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? 'Failed to load destination details.' : 'Destination not found.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <Button asChild variant="ghost" className="mb-8">
        <Link to="/destinations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Destinations
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src="/assets/generated/destination-thumb-set.dim_6x_800x600.png"
              alt={destination.name}
              className="h-full w-full object-cover"
              style={{
                objectPosition: `${(Number(destination.id) % 6) * 16.666}% 0`,
                objectFit: 'cover',
              }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {destination.city}, {destination.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Coordinates</p>
                  <p className="text-sm text-muted-foreground">
                    {destination.latitude.toFixed(4)}°N, {destination.longitude.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>{destination.city}, {destination.country}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About This Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {destination.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Transport Options</CardTitle>
            </CardHeader>
            <CardContent>
              {optionsLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}

              {!optionsLoading && transportOptions.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No transport options available for this destination yet. Check back soon!
                  </AlertDescription>
                </Alert>
              )}

              {!optionsLoading && transportOptions.length > 0 && (
                <div className="space-y-3">
                  {transportOptions.map((option) => (
                    <Card key={option.id.toString()} className="border-2">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              {option.transportType === 'flight' ? (
                                <Plane className="h-5 w-5 text-primary" />
                              ) : (
                                <Train className="h-5 w-5 text-primary" />
                              )}
                              <span className="font-semibold capitalize">
                                {option.transportType}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{option.schedule}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>To {destination.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className={option.availableSeats > 0n ? 'text-success' : 'text-destructive'}>
                                  {option.availableSeats.toString()} {Number(option.availableSeats) === 1 ? 'seat' : 'seats'} available
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleBookTransport(option.id)}
                            disabled={option.availableSeats === 0n}
                            size="sm"
                          >
                            {option.availableSeats === 0n ? 'Sold Out' : 'Book Now'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isAuthenticated && transportOptions.length > 0 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please sign in to book transport options
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need More Information?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Have questions about {destination.name}? Get in touch with us to learn more about visiting this incredible destination.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
