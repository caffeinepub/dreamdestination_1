import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Globe, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            About DreamDestination
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Your gateway to discovering the world's most incredible destinations
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p>
            DreamDestination is your trusted companion for exploring the world's most beautiful and
            captivating places. We believe that travel enriches lives, broadens perspectives, and
            creates memories that last a lifetime.
          </p>
          <p>
            Our mission is to inspire and empower travelers by providing comprehensive information
            about destinations around the globe. Whether you're seeking adventure, relaxation,
            culture, or natural beauty, we're here to help you discover your next dream destination.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Global Coverage</CardTitle>
              <CardDescription>
                Explore destinations from every corner of the world, from iconic landmarks to hidden gems.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Curated Experiences</CardTitle>
              <CardDescription>
                Each destination is carefully selected and described to help you make informed travel decisions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Travel Inspiration</CardTitle>
              <CardDescription>
                Discover new places and get inspired to plan your next adventure with detailed location information.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Community Focused</CardTitle>
              <CardDescription>
                We're building a community of passionate travelers who share a love for exploration and discovery.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We envision a world where everyone has the opportunity to explore, learn, and grow
              through travel. By making destination information accessible and inspiring, we aim to
              break down barriers and encourage people to step outside their comfort zones.
            </p>
            <p className="text-muted-foreground">
              Whether you're planning a weekend getaway or a once-in-a-lifetime journey,
              DreamDestination is here to guide you every step of the way.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
