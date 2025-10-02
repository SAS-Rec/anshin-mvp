import { AlertCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container px-4 py-6">
        <div className="flex items-start gap-3 rounded-lg bg-emergency/5 p-4 mb-4">
          <AlertCircle className="h-5 w-5 text-emergency shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground mb-1">
              Emergency Disclaimer
            </p>
            <p className="text-muted-foreground">
              In a life-threatening emergency, always call 119 immediately. This map is for informational purposes only. Data accuracy and real-time availability are not guaranteed.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            Last updated: October 2, 2025
          </p>
          <p>
            Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">OpenStreetMap</a> contributors
          </p>
        </div>
      </div>
    </footer>
  );
}
