import { MapPin, Phone, ExternalLink, Menu, X, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Hospital Finder", path: "/", icon: MapPin },
  { name: "Coverage Analysis", path: "/coverage", icon: Activity },
  { name: "Accessibility", path: "/accessibility", icon: TrendingUp },
  { name: "Service Gap", path: "/service-gap", icon: AlertTriangle },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card card-shadow">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Anshin Map</h1>
            <p className="text-xs text-muted-foreground">Beta</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="tap-target gap-2 hidden sm:flex"
            asChild
          >
            <a href="tel:119">
              <Phone className="h-4 w-4 text-emergency" />
              <span>Call 119</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="tap-target hidden sm:flex"
            asChild
          >
            <a
              href="https://www.city.tsuchiura.lg.jp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden tap-target"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-card overflow-hidden"
          >
            <nav className="container px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-2 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <a href="tel:119">
                    <Phone className="h-5 w-5 text-emergency" />
                    Emergency Call 119
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <a
                    href="https://www.city.tsuchiura.lg.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Official City Page
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
