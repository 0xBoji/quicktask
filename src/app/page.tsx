"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { CheckCircle, ListChecks, Share2, Zap } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }
  return (
    <>
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Manage Tasks Efficiently with {APP_CONFIG.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              A simple, easy-to-use task management app that helps you track and complete all your tasks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={ROUTES.REGISTER}>Sign Up Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ListChecks className="h-10 w-10" />}
                title="Task Management"
                description="Create, categorize, and track task progress easily."
              />
              <FeatureCard
                icon={<Share2 className="h-10 w-10" />}
                title="Share & Collaborate"
                description="Share tasks with colleagues and collaborate effectively."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10" />}
                title="Real-time Updates"
                description="Receive notifications and updates instantly when changes occur."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10" />}
                title="Track Progress"
                description="View statistics and reports on your task progress."
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">{APP_CONFIG.name}</h2>
              <p className="text-muted-foreground">Efficient Task Management</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-2">Product</h3>
                <ul className="space-y-1">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Company</h3>
                <ul className="space-y-1">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="text-primary mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
