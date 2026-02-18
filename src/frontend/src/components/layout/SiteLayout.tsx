import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, Plane } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ to, children, onClick }: NavLinkProps) {
  const router = useRouterState();
  const isActive = router.location.pathname === to || 
    (to !== '/' && router.location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? 'text-primary' : 'text-foreground/80'
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/generated/dreamdestination-logo.dim_512x512.png" 
              alt="DreamDestination" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold tracking-tight">DreamDestination</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/destinations">Destinations</NavLink>
            <NavLink to="/booking">Booking</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/login">Login</NavLink>
          </nav>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/destinations" onClick={() => setMobileMenuOpen(false)}>
                  Destinations
                </NavLink>
                <NavLink to="/booking" onClick={() => setMobileMenuOpen(false)}>
                  Booking
                </NavLink>
                <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
                  About
                </NavLink>
                <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </NavLink>
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Plane className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">DreamDestination</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover the world's most beautiful destinations and create unforgettable memories.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Quick Links</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/destinations" className="text-muted-foreground hover:text-foreground transition-colors">
                  Destinations
                </Link>
                <Link to="/booking" className="text-muted-foreground hover:text-foreground transition-colors">
                  Booking
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Start planning your dream vacation today.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} DreamDestination. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'dreamdestination'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
