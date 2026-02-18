import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Compass, Heart, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/dreamdestination-hero.dim_1920x800.png"
            alt="Explore the world"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
        </div>
        
        <div className="container relative flex h-full items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Dream Destination Awaits
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Discover breathtaking locations around the globe. From pristine beaches to majestic mountains, 
              find your perfect escape and create memories that last a lifetime.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="text-base">
                <Link to="/destinations">
                  Explore Destinations
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose DreamDestination?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We help you discover the world's most incredible places with expert guidance and personalized recommendations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Global Destinations</CardTitle>
              <CardDescription>
                Access to stunning locations across every continent
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Curated Selection</CardTitle>
              <CardDescription>
                Hand-picked destinations for unforgettable experiences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Expert Guidance</CardTitle>
              <CardDescription>
                Detailed information to help you plan your journey
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Memorable Moments</CardTitle>
              <CardDescription>
                Create lasting memories in the world's most beautiful places
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse our collection of stunning destinations and find the perfect place for your next journey.
            </p>
            <Button asChild size="lg" className="text-base">
              <Link to="/destinations">
                View All Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
