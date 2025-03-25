import * as React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, Database, LogIn, LogOut, ClipboardList } from "lucide-react";

export function NavBar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-primary font-bold text-xl flex items-center">
              <Database className="h-5 w-5 mr-2" />
              <span>MediData</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="hidden lg:flex lg:space-x-4">
              <Link 
                href="/"
                className={`px-3 py-2 text-sm font-medium flex items-center ${
                  location === "/"
                    ? "text-primary"
                    : "text-neutral-600 hover:text-primary"
                } rounded-md`}
              >
                <ClipboardList className="h-4 w-4 mr-1" />
                <span>Home</span>
              </Link>
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 text-sm font-medium flex items-center ${
                        location === "/admin"
                          ? "text-primary"
                          : "text-neutral-600 hover:text-primary"
                      } rounded-md`}
                    >
                      <Database className="h-4 w-4 mr-1" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary rounded-md flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className={`px-3 py-2 text-sm font-medium flex items-center ${
                    location === "/auth"
                      ? "text-primary"
                      : "text-neutral-600 hover:text-primary"
                  } rounded-md`}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                location === "/"
                  ? "text-primary"
                  : "text-neutral-600 hover:text-primary"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      location === "/admin"
                        ? "text-primary"
                        : "text-neutral-600 hover:text-primary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary flex items-center"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link
                href="/auth"
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location === "/auth"
                    ? "text-primary"
                    : "text-neutral-600 hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
