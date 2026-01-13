'use client'

import { Card } from "@/components/ui/card"
import { Award, Heart, Palette } from "lucide-react"
import { useTranslations } from 'next-intl'

export function InstructorBio() {
  const t = useTranslations('bio')

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
            <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
          </div>

          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-5 gap-8 p-8">
              <div className="md:col-span-2">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img src="/friendly-female-artist-instructor-smiling-in-creat.jpg" alt={t('name')} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">{t('name')}</h3>
                  <p className="text-muted-foreground">{t('role')}</p>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <p className="text-lg leading-relaxed">
                  {t('description')}
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">{t('degree.title')}</div>
                    <div className="text-sm text-muted-foreground">{t('degree.school')}</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-secondary/10 rounded-lg">
                    <Palette className="h-8 w-8 text-secondary mb-2" />
                    <div className="font-semibold">{t('students.count')}</div>
                    <div className="text-sm text-muted-foreground">{t('students.description')}</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-accent/30 rounded-lg">
                    <Heart className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">{t('community.title')}</div>
                    <div className="text-sm text-muted-foreground">{t('community.description')}</div>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  {t('quote')}
                </blockquote>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
