import { MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card card-shadow">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Anshin Map</h1>
            <p className="text-xs text-muted-foreground">Beta</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="tap-target gap-2"
            asChild
          >
            <a href="tel:119">
              <Phone className="h-4 w-4 text-emergency" />
              <span className="hidden sm:inline">Call 119</span>
            </a>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="tap-target"
            asChild
          >
            <a
              href="https://www.city.tsuchiura.lg.jp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Official City Page</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
