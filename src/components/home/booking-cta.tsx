"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

export function BookingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('hero')
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToWorkshops = () => {
    const workshopsSection = document.getElementById('workshops')
    if (workshopsSection) {
      workshopsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Button 
        size="lg" 
        className="shadow-2xl text-lg px-8 py-6 group"
        onClick={scrollToWorkshops}
      >
        {t('bookButton')}
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  )
}
