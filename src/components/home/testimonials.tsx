'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from 'next-intl'

export function Testimonials() {
  const t = useTranslations('testimonials')

  const testimonials = [
    {
      name: t('items.0.name'),
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: t('items.0.text'),
    },
    {
      name: t('items.1.name'),
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: t('items.1.text'),
    },
    {
      name: t('items.2.name'),
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: t('items.2.text'),
    },
    {
      name: t('items.3.name'),
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: t('items.3.text'),
    },
    {
      name: t('items.4.name'),
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: t('items.4.text'),
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto justify-items-center">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
