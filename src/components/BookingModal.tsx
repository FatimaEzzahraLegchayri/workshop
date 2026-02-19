'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { newBooking } from '@/lib/service/bookingService'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl' 

interface Workshop {
  id: string
  title: string
  date: string
  startTime: string
  endTime?: string
  price: number
}

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  workshop: Workshop | null
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
}

export function BookingModal({ open, onOpenChange, onSuccess, workshop }: BookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [success, setSuccess] = useState(false)
  const t = useTranslations('bookingModal')

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData)
      setError('')
      setSuccess(false)
    }
  }, [open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('') 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!workshop) {
      setError('Workshop information is missing.')
      setLoading(false)
      return
    }

    try {
      await newBooking({
        workshopId: workshop.id,
        name: formData.name,
        email: formData.email ? formData.email.trim().toLowerCase() : null,
        phone: formData.phone,
      })

      setSuccess(true)
      setFormData(initialFormData)
      setTimeout(() => {
        onOpenChange(false)
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    
    const [hours, minutes] = timeString.split(':')
    const displayHour = hours.padStart(2, '0')
    const displayMinutes = minutes.padStart(2, '0')
    
    return `${displayHour}:${displayMinutes}`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'EEEE, MMM d')
    } catch {
      return dateString
    }
  }

  if (!workshop) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { workshop: workshop?.title })}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('bookingConfirmed')}</h3>
              <p className="text-muted-foreground">
                {t('bookingSubmitted')}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <div className="font-semibold">{workshop.title}</div>
              <div className="text-muted-foreground">
                {formatDate(workshop.date)} • {formatTime(workshop.startTime)}
                {workshop.endTime && ` - ${formatTime(workshop.endTime)}`}
              </div>
              <div className="text-primary font-semibold">{workshop.price} DH</div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={t('namePlaceholder')}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={t('emailPlaceholder')}                
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('confirmBooking')
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
