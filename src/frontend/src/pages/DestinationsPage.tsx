import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, AlertCircle } from 'lucide-react';
import { useDestinations } from '@/hooks/useQueries';

const DESTINATION_IMAGES = [
  '/assets/generated/destination-thumb-set.dim_6x_800x600.png',
];

function getDestinationImage(index: number): string {
  return DESTINATION_IMAGES[0];
}

export default function DestinationsPage() {
  const { data: destinations, isLoading, error } = useDestinations();

  return (
    <div className="container py-12 md:py-16">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Explore Destinations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover amazing places around the world. Each destination offers unique experiences and unforgettable memories.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load destinations. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : destinations && destinations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <Card key={Number(destination.id)} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={getDestinationImage(index)}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  style={{
                    objectPosition: `${(index % 6) * 16.666}% 0`,
                    objectFit: 'cover',
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{destination.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {destination.city}, {destination.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {destination.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/destinations/$id" params={{ id: destination.id.toString() }}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No destinations available at the moment.</p>
        </div>
      )}
    </div>
  );
}
