'use client'

import { useEffect, useState } from 'react'
import { SideBar } from '@/components/admin/side-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getWorkshops, deleteWorkshop } from '@/lib/service/workshopService'
import { WorkshopModal } from '@/components/workShop/WorkshopModal'
import { DeleteConfirmation } from '@/components/workShop/DeleteConfirmation'
import { Calendar, Clock, Users, DollarSign, Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { PaginationHelper } from '@/components/admin/pagination-helper'


interface Workshop {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  // duration: number
  category: string
  capacity: number
  bookedSeats: number
  price: number
  status: string
  image?: string | null
  createdAt: string
  updatedAt: string
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const data = await getWorkshops()
      setWorkshops(data as Workshop[])
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

  const totalPages = Math.ceil(workshops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentWorkshops = workshops.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'fully booked':
        return 'destructive'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const availableSeats = (capacity: number, bookedSeats: number) => {
    return capacity - bookedSeats
  }

  const handleDeleteClick = (workshop: Workshop) => {
    setWorkshopToDelete(workshop)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!workshopToDelete) return

    try {
      setDeleting(true)
      await deleteWorkshop(workshopToDelete.id)
      setIsDeleteDialogOpen(false)
      setWorkshopToDelete(null)
      fetchWorkshops() 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workshop')
      setIsDeleteDialogOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Workshops</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage and view all workshops
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingWorkshop(null)
                setIsModalOpen(true)
              }}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Workshop
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && workshops.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No workshops found</p>
            </div>
          )}

          {!loading && !error && workshops.length > 0 && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {currentWorkshops.map((workshop) => (
                <Card key={workshop.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {workshop.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={workshop.image}
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <CardTitle className="text-lg md:text-xl leading-tight">
                        {workshop.title}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(workshop.status)} className="shrink-0">
                        {workshop.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workshop.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{formatDate(workshop.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                          {workshop.startTime}
                          {workshop.endTime && ` - ${workshop.endTime}`}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>
                          {workshop.bookedSeats}/{workshop.capacity} booked
                        </span>
                        <span className="text-xs text-primary font-medium">
                          ({availableSeats(workshop.capacity, workshop.bookedSeats)} available)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold"> {workshop.price} DH</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground truncate">
                          Category: {workshop.category}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingWorkshop(workshop)
                              setIsModalOpen(true)
                            }}
                            className="h-9 w-9 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(workshop)}
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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

      <WorkshopModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setEditingWorkshop(null)
          }
        }}
        onSuccess={fetchWorkshops}
        workshop={editingWorkshop}
      />

      <DeleteConfirmation
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        workshopTitle={workshopToDelete?.title}
      />
    </div>
  )
}
