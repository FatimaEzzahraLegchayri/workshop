'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToWorkshops = () => {
    const workshopsSection = document.getElementById('workshops')
    if (workshopsSection) {
      workshopsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMenuOpen(false) // Close mobile menu if open
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-lg font-bold">M</span>
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline-block">
            My_Space
          </span>
        </Link>

        {/* Desktop Navigation - Simple, just CTA */}
        <div className="hidden md:flex items-center">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={scrollToWorkshops}
          >
            Book Your Seat
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button 
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={scrollToWorkshops}
          >
            Book
          </Button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-in slide-in-from-top-2">
          <div className="container px-4 py-4 space-y-2">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={scrollToWorkshops}
            >
              Book Your Seat
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
