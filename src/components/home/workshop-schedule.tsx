'use client'

import { useEffect, useState } from "react"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWorkshops } from "@/lib/service/workshopService"
import { format } from "date-fns"

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

interface ScheduleItem {
  date: string
  day: string
  dateKey: string // Original date string for sorting
  workshops: {
    time: string
    title: string
    status: string
    available: boolean
  }[]
}

export function WorkshopSchedule() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

  // Format date to "Jan 18" format
  const formatDateShort = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM d')
    } catch {
      return dateString
    }
  }

  // Get day abbreviation (e.g., "SAT")
  const getDayAbbreviation = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'EEE').toUpperCase()
    } catch {
      return ''
    }
  }

  // Get status text based on seats left
  const getStatusText = (seatsLeft: number, capacity: number) => {
    if (seatsLeft <= 0) {
      return 'Fully Booked'
    } else if (seatsLeft <= 3) {
      return 'Almost full!'
    } else {
      return `${seatsLeft} seats left`
    }
  }

  // Group workshops by date and transform to schedule items
  const scheduleItems: ScheduleItem[] = workshops.reduce((acc, workshop) => {
    const seatsLeft = workshop.capacity - (workshop.bookedSeats || 0)
    const available = seatsLeft > 0 && workshop.status !== 'Fully Booked'
    const status = getStatusText(seatsLeft, workshop.capacity)
    const time = formatTime(workshop.startTime)

    const dateKey = workshop.date
    const existingItem = acc.find(item => item.dateKey === dateKey)

    const workshopItem = {
      time,
      title: workshop.title,
      status,
      available,
    }

    if (existingItem) {
      existingItem.workshops.push(workshopItem)
      // Sort workshops by time within each date
      existingItem.workshops.sort((a, b) => {
        const timeA = a.time
        const timeB = b.time
        return timeA.localeCompare(timeB)
      })
    } else {
      acc.push({
        date: formatDateShort(dateKey),
        day: getDayAbbreviation(dateKey),
        dateKey: dateKey, // Store original date for sorting
        workshops: [workshopItem],
      })
    }

    return acc
  }, [] as ScheduleItem[])

  // Sort schedule items by date (using original dateKey)
  scheduleItems.sort((a, b) => {
    try {
      const dateA = new Date(a.dateKey)
      const dateB = new Date(b.dateKey)
      return dateA.getTime() - dateB.getTime()
    } catch {
      return 0
    }
  })

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (scheduleItems.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Workshops</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plan your creative journey with our monthly schedule
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming workshops scheduled.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Workshops</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan your creative journey with our monthly schedule
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {scheduleItems.map((item, idx) => (
            <Card key={`${item.date}-${idx}`} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{item.date}</div>
                  <div className="text-sm text-muted-foreground">{item.day}</div>
                </div>
              </div>

              <div className="space-y-4">
                {item.workshops.map((workshop, widx) => (
                  <div key={`${workshop.title}-${widx}`} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {workshop.time}
                    </div>
                    <div className="font-semibold text-sm">{workshop.title}</div>
                    <Badge
                      variant={workshop.available ? "default" : "secondary"}
                      className={workshop.available ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                    >
                      {workshop.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
