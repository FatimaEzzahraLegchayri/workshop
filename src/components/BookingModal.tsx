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

interface Workshop {
  id: string
  title: string
  date: string // Original date format from Firestore
  startTime: string // Original time format from Firestore
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData)
      setError('')
      setSuccess(false)
    }
  }, [open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('') // Clear error when user starts typing
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
        email: formData.email,
        phone: formData.phone,
      })

      // Show success message
      setSuccess(true)
      
      // Reset form
      setFormData(initialFormData)

      // Close modal after a short delay and refresh workshops
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

  // Format time from "10:00" to "10:00 AM"
  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Format date from "2026-01-18" to "Saturday, Jan 18"
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
          <DialogTitle>Book Workshop</DialogTitle>
          <DialogDescription>
            Complete your booking for <strong>{workshop.title}</strong>
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
              <h3 className="text-lg font-semibold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your booking has been submitted successfully.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Workshop Info */}
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
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"                
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
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
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
