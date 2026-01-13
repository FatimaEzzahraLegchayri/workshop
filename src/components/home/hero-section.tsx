'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero')
  
  const scrollToWorkshops = () => {
    const workshopsSection = document.getElementById('workshops')
    if (workshopsSection) {
      workshopsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-36 h-36 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container mt-8 sm:mt-16 md:mt-24 lg:mt-[7.5rem] relative z-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 group"
              onClick={scrollToWorkshops}
            >
              {t('bookButton')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-transparent"
              onClick={scrollToWorkshops}
            >
              {t('exploreButton')}
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
            <img
              src="/diverse-group-of-people-joyfully-painting-tote-bag.jpg"
              alt={t('imageAlt')}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
