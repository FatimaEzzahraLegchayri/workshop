import { HeroSection } from "@/components/home/hero-section"
import { WorkshopSchedule } from "@/components/home/workshop-schedule"
import { WorkshopGrid } from "@/components/home/workshop-grid"
import { WorkshopDetails } from "@/components/home/workshop-details"
import { InstructorBio } from "@/components/home/instructor-bio"
import { Gallery } from "@/components/home/gallery"
import { Testimonials } from "@/components/home/testimonials"
import { Footer } from "@/components/home/footer"
import { BookingCTA } from "@/components/home/booking-cta"
import { NavBar } from "@/components/home/nav-bar"

export default function HomePage() {
  return (
    <div>
      <NavBar />
    <main className="min-h-screen">
      <HeroSection />
      <WorkshopSchedule />
      <WorkshopGrid />
      <WorkshopDetails />
      <InstructorBio />
      <Gallery />
      <Testimonials />
      <Footer />
      <BookingCTA />
    </main>
    </div>
  )
}
