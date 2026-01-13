'use client'

import { MapPin, Mail, Phone, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">{t('brand')}</h3>
            <p className="text-background/80 mb-4 max-w-md">
              {t('description')}
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
            <h4 className="font-bold mb-4">{t('contact.title')}</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  {t('contact.address.line1')}
                  <br />
                  {t('contact.address.line2')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{t('contact.email')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{t('contact.phone')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">{t('links.title')}</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#workshops" className="hover:text-background transition-colors text-sm">
                  {t('links.workshops')}
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-background transition-colors text-sm">
                  {t('links.schedule')}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-background transition-colors text-sm">
                  {t('links.faq')}
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-background transition-colors text-sm">
                  {t('links.terms')}
                </a>
              </li>
              <li>
                <a href="#private" className="hover:text-background transition-colors text-sm">
                  {t('links.privateEvents')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
