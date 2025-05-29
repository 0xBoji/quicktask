"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { LogOut, Home, ListTodo } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import { signOut } from "@/lib/supabase";
import { toast } from "sonner";

// Navigation links configuration
const NAV_ITEMS = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: <Home className="h-4 w-4 mr-2" /> },
  { name: "Tasks", href: ROUTES.TASKS, icon: <ListTodo className="h-4 w-4 mr-2" /> },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
      router.push(ROUTES.HOME);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to log out. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Don't render header while loading or if not authenticated and not on home page
  if (loading) {
    return null;
  }

  if (!isAuthenticated && pathname !== ROUTES.HOME) {
    return null;
  }

  return (
    <header className="border-b sticky top-0 bg-background z-10" data-header="main">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        {/* Logo/App Name */}
        <Link href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="text-2xl font-bold">
          {APP_CONFIG.name}
        </Link>

        {/* Navigation - only show when authenticated */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth buttons when not authenticated */}
          {!isAuthenticated && pathname === ROUTES.HOME && (
            <>
              <Button asChild variant="outline">
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.REGISTER}>Register</Link>
              </Button>
            </>
          )}

          {/* Logout button when authenticated */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {isAuthenticated && (
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto p-2 border-t">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.name}
              variant={pathname === item.href ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={item.href} className="flex items-center justify-center">
                {item.icon}
                <span className="text-xs">{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
}