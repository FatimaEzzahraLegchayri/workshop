import { MapPin, Mail, Phone, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">My_Space</h3>
            <p className="text-background/80 mb-4 max-w-md">
              A creative workshop space where hands-on art experiences bring people together. Paint, mold, sew, and
              create something uniquely yours.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/10 border-background/20 hover:bg-background/20"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/10 border-background/20 hover:bg-background/20"
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  212 Creative Avenue
                  <br />
                  Casablanca, Maroc 11201
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">hello@myspace.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">(555) 212-3456</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#workshops" className="hover:text-background transition-colors text-sm">
                  Workshops
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-background transition-colors text-sm">
                  Schedule
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-background transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-background transition-colors text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#private" className="hover:text-background transition-colors text-sm">
                  Private Events
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2026 My_Space. All rights reserved. Crafted with love and creativity.</p>
        </div>
      </div>
    </footer>
  )
}
