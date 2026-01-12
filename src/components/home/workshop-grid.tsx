'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Loader2 } from "lucide-react"
import { getWorkshops } from "@/lib/service/workshopService"
import { format } from "date-fns"
import { BookingModal } from "@/components/BookingModal"

interface Workshop {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  category: string
  capacity: number
  bookedSeats: number
  price: number
  status: string
  image?: string | null
}

export function WorkshopGrid() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const data = await getWorkshops()
      // Filter to only show published workshops
      const publishedWorkshops = (data as Workshop[]).filter(
        (w) => w.status === 'PUBLISHED'
      )
      setWorkshops(publishedWorkshops)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshops')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

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

  // Calculate time range
  const formatTimeRange = (startTime: string, endTime?: string) => {
    const start = formatTime(startTime)
    if (endTime) {
      const end = formatTime(endTime)
      return `${start} - ${end}`
    }
    return start
  }

  // Transform workshop data to match component expectations
  const transformedWorkshops = workshops.map((workshop) => {
    const seatsLeft = workshop.capacity - (workshop.bookedSeats || 0)
    const soldOut = seatsLeft <= 0 || workshop.status === 'fully booked'

    return {
      id: workshop.id,
      title: workshop.title,
      date: formatDate(workshop.date),
      time: formatTimeRange(workshop.startTime, workshop.endTime),
      price: `${workshop.price} DH`,
      seatsLeft,
      image: workshop.image || "/placeholder.svg",
      description: workshop.description,
      soldOut,
      // Keep original data for booking modal
      originalWorkshop: workshop,
    }
  })

  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsBookingModalOpen(true)
  }

  const handleBookingSuccess = () => {
    // Refresh workshops to update seat counts
    fetchWorkshops()
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (transformedWorkshops.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Creative Adventure</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From painting to pottery, find the perfect workshop to unleash your creativity
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No workshops available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section id="workshops" className="py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Creative Adventure</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From painting to pottery, find the perfect workshop to unleash your creativity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {transformedWorkshops.map((workshop) => (
            <Card key={workshop.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative overflow-hidden">
                <img
                  src={workshop.image || "/placeholder.svg"}
                  alt={workshop.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {workshop.soldOut ? (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">Fully Booked</Badge>
                ) : workshop.seatsLeft <= 3 ? (
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    Only {workshop.seatsLeft} left!
                  </Badge>
                ) : null}
              </div>

              <CardHeader>
                <h3 className="text-2xl font-bold mb-2">{workshop.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{workshop.date}</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {workshop.time}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4">{workshop.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {workshop.soldOut ? "Full" : `${workshop.seatsLeft} seats left`}
                  </span>
                  <span className="text-2xl font-bold text-primary">{workshop.price}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  disabled={workshop.soldOut}
                  variant={workshop.soldOut ? "secondary" : "default"}
                  onClick={() => handleBookNow(workshop.originalWorkshop)}
                >
                  {workshop.soldOut ? "Fully Booked" : "Book Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        onSuccess={handleBookingSuccess}
        workshop={
          selectedWorkshop
            ? {
                id: selectedWorkshop.id,
                title: selectedWorkshop.title,
                date: selectedWorkshop.date, // Keep original date format for display
                startTime: selectedWorkshop.startTime,
                endTime: selectedWorkshop.endTime,
                price: selectedWorkshop.price,
              }
            : null
        }
      />
    </section>
  )
}
