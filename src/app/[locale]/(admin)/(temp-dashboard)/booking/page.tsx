'use client'

import { useEffect, useState } from 'react'
import { SideBar } from '@/components/admin/side-bar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBookings, updateWorkshopBookingStatus } from '@/lib/service/bookingService'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner' 
import { PaginationHelper } from '@/components/admin/pagination-helper'


interface Booking {
  id: string
  workshopId: string
  workshopTitle: string
  name: string
  email: string
  phone: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getBookings()
      const sortedBookings = (data as Booking[]).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setBookings(sortedBookings)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const totalPages = Math.ceil(bookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'canceled':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'pending':
      default:
        return 'bg-white text-gray-800 border-gray-300'
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId)
      await updateWorkshopBookingStatus(bookingId, newStatus)
      
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      )
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    <SideBar />
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Bookings</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View and manage all workshop bookings
          </p>
        </div>
  
        {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{error}</div>
          ) : bookings.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">No bookings found</Card>
          ) : (
          <>
            <Card className="hidden md:block overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {booking.email || <span className="text-muted-foreground italic">None</span>}
                        </TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell>{booking.workshopTitle}</TableCell>
                        <TableCell>
                          <Select 
                            disabled={updatingId === booking.id}
                            value={booking.status} 
                            onValueChange={(value) => handleStatusChange(booking.id, value)}
                          >
                            <SelectTrigger className={`w-[130px] ${getStatusStyles(booking.status)}`}>
                              {updatingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDate(booking.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
  
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {currentBookings.map((booking) => (
                <Card key={booking.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{booking.name}</h3>
                      <p className="text-sm text-primary font-medium">{booking.workshopTitle}</p>
                    </div>
                    <Select 
                      disabled={updatingId === booking.id}
                      value={booking.status} 
                      onValueChange={(value) => handleStatusChange(booking.id, value)}
                    >
                      <SelectTrigger className={`w-[110px] h-8 text-xs ${getStatusStyles(booking.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Phone</p>
                      <p>{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Date</p>
                      <p>{formatDate(booking.createdAt)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Email</p>
                      <p className="break-all">{booking.email || 'None'}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <PaginationHelper 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
              
          </>
        )}
      </div>
    </main>
  </div>
  )
}