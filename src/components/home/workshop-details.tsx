'use client'

import { CheckCircle, Palette, Clock, Users, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export function WorkshopDetails() {
  const t = useTranslations('details')

  const workshopTypes = [
    {
      title: t('toteBag.title'),
      icon: Palette,
      details: [
        {
          icon: CheckCircle,
          label: t('labels.learn'),
          text: t('toteBag.learn'),
        },
        {
          icon: Package,
          label: t('labels.included'),
          text: t('toteBag.included'),
        },
        { 
          icon: Users, 
          label: t('labels.skillLevel'), 
          text: t('toteBag.skillLevel') 
        },
        { 
          icon: Clock, 
          label: t('labels.duration'), 
          text: t('toteBag.duration') 
        },
      ],
    },
    {
      title: t('pottery.title'),
      icon: Package,
      details: [
        {
          icon: CheckCircle,
          label: t('labels.learn'),
          text: t('pottery.learn'),
        },
        { 
          icon: Package, 
          label: t('labels.included'), 
          text: t('pottery.included') 
        },
        { 
          icon: Users, 
          label: t('labels.skillLevel'), 
          text: t('pottery.skillLevel') 
        },
        { 
          icon: Clock, 
          label: t('labels.duration'), 
          text: t('pottery.duration') 
        },
      ],
    },
    {
      title: t('sewing.title'),
      icon: CheckCircle,
      details: [
        {
          icon: CheckCircle,
          label: t('labels.learn'),
          text: t('sewing.learn'),
        },
        {
          icon: Package,
          label: t('labels.included'),
          text: t('sewing.included'),
        },
        { 
          icon: Users, 
          label: t('labels.skillLevel'), 
          text: t('sewing.skillLevel') 
        },
        { 
          icon: Clock, 
          label: t('labels.duration'), 
          text: t('sewing.duration') 
        },
      ],
    },
  ]

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-forest-green">{t('title')}</h2>
          <p className="text-xl text-soft-pink max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {workshopTypes.map((workshop, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="bg-soft-pink/5">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <workshop.icon className="h-6 w-6 text-forest-green" />
                  {workshop.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {workshop.details.map((detail, didx) => (
                    <div key={didx} className="flex gap-4">
                      <detail.icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">{detail.label}</div>
                        <div className="text-muted-foreground text-sm">{detail.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-accent/30 border-accent">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-3">{t('bring.title')}</h3>
              <p className="text-muted-foreground">
                {t('bring.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
