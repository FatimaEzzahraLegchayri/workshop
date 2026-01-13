'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Menu, X, Languages } from 'lucide-react'
import { useState } from 'react'
import { locales } from '@/lib/i18n-config'

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()

  const scrollToWorkshops = () => {
    const workshopsSection = document.getElementById('workshops')
    if (workshopsSection) {
      workshopsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMenuOpen(false) // Close mobile menu if open
  }

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname if it exists
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    // Navigate to new locale using window.location for full page reload
    window.location.href = `/${newLocale}${pathWithoutLocale}`
  }

  const getLocaleLabel = (loc: string) => {
    return loc === 'en' ? 'English' : 'Français'
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
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

        {/* Desktop Navigation - CTA and Language Switcher */}
        <div className="hidden md:flex items-center gap-4">
          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-[140px] h-9">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue>
                {getLocaleLabel(locale)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {locales.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {getLocaleLabel(loc)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue>
                {locale.toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {locales.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {getLocaleLabel(loc)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <div className="container mx-auto px-4 py-4 space-y-2">
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
