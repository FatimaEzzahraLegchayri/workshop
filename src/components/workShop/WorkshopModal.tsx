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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addWorkshop, updateWorkshop } from '@/lib/service/workshopService'
import { Loader2 } from 'lucide-react'
import { cloudinaryConfig } from '@/lib/cloudinaryConfig'

interface Workshop {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  duration?: number
  category: string
  capacity: number
  bookedSeats?: number
  price: number
  status: string
  image?: string | null
}

interface WorkshopModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  workshop?: Workshop | null
}

const initialFormData = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  category: '',
  capacity: '',
  price: '',
  status: 'draft',
  image: '',
}

export function WorkshopModal({ open, onOpenChange, onSuccess, workshop }: WorkshopModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const isEditMode = !!workshop

  useEffect(() => {
    if (workshop && open) {
      setFormData({
        title: workshop.title || '',
        description: workshop.description || '',
        date: workshop.date || '',
        startTime: workshop.startTime || '',
        endTime: workshop.endTime || '',
        category: workshop.category || '',
        capacity: workshop.capacity?.toString() || '',
        price: workshop.price?.toString() || '',
        status: workshop.status || 'draft',
        image: workshop.image || '',
      })
      setImagePreview(workshop.image || null)
      setImageFile(null)
    } else if (!workshop && open) {
      setFormData(initialFormData)
      setImagePreview(null)
      setImageFile(null)
    }
  }, [workshop, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
  
      setImageFile(file)
      setFormData((prev) => ({ ...prev, image: '' }))
      setError('')
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
    if (url) {
      setImagePreview(url)
      setImageFile(null)
    } else {
      setImagePreview(null)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: '' }))
  }

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    let finalImageUrl = formData.image;

    if (imageFile) {
      try {
        const uploadedUrl = await cloudinaryConfig(imageFile, "workshops-covers");
        if (!uploadedUrl) throw new Error("Cloudinary returned no URL");
        finalImageUrl = uploadedUrl; 
      } catch (uploadErr) {
        throw new Error("Image upload failed. Please try a different image.");
      }
    }

    const workshopData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || undefined,
      category: formData.category,
      capacity: parseInt(formData.capacity),
      price: parseFloat(formData.price),
      status: formData.status,
      image: finalImageUrl || null,
    };

    if (isEditMode && workshop) {
      await updateWorkshop(workshop.id, workshopData);
    } else {
      await addWorkshop(workshopData);
    }

    setFormData(initialFormData);
    setImagePreview(null);
    setImageFile(null);
    onOpenChange(false);
    if (onSuccess) onSuccess();

  } catch (err: any) {
    console.error("Submit Error:", err);
    setError(err.message || "An unexpected error occurred.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl md:text-2xl">
            {isEditMode ? 'Edit Workshop' : 'Add New Workshop'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditMode
              ? 'Update the workshop details below'
              : 'Fill in the details to create a new workshop'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Workshop title"
                required
                disabled={loading}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Painting, Pottery"
                required
                disabled={loading}
                className="text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Workshop description"
              rows={3}
              required
              disabled={loading}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="cursor-pointer text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Upload an image file (max 5MB)
              </p>
            </div>
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-2 right-2 h-8 px-2"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                disabled={loading}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                disabled={loading}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="fully booked">Fully Booked</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                required
                disabled={loading}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                disabled={loading}
                className="text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2 col-span-1">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="20"
                min="1"
                required
                disabled={loading}
                className="text-base"
              />
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="45.00"
                step="0.01"
                min="0"
                required
                disabled={loading}
                className="text-base"
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-2 rounded-md text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Workshop' : 'Add Workshop'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
