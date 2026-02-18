import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, LogOut, Shield, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, clear, loginStatus, identity, isInitializing, isLoggingIn, isLoginError, isLoginSuccess } = useInternetIdentity();

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Account Access</h1>
          <p className="text-lg text-muted-foreground">
            Sign in to access your personalized travel experience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isLoginSuccess ? 'Signed In' : 'Sign In'}
            </CardTitle>
            <CardDescription>
              {isLoginSuccess
                ? 'You are currently signed in to your account'
                : 'Use your secure identity to access DreamDestination'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isInitializing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isInitializing && !isLoginSuccess && (
              <>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sign in securely using your Internet Identity. This provides a safe and private
                    way to authenticate without passwords.
                  </p>
                  <Button
                    onClick={login}
                    disabled={isLoggingIn}
                    size="lg"
                    className="w-full"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </div>

                {isLoginError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to sign in. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {!isInitializing && isLoginSuccess && principal && (
              <>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Successfully signed in
                  </AlertDescription>
                </Alert>

                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Your Principal ID:</p>
                  <p className="break-all text-xs font-mono text-muted-foreground">
                    {principal}
                  </p>
                </div>

                <Button
                  onClick={clear}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">What is Internet Identity?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Internet Identity is a secure authentication system that allows you to sign in
              without passwords. It uses cryptographic keys stored on your device to provide
              a private and secure login experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
