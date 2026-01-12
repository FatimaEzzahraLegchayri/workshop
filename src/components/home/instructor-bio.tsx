import { Card } from "@/components/ui/card"
import { Award, Heart, Palette } from "lucide-react"

export function InstructorBio() {
  return (
    <section className="py-20 ">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Your Instructor</h2>
            <p className="text-xl text-muted-foreground">Learn from a passionate artist and educator</p>
          </div>

          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-5 gap-8 p-8">
              <div className="md:col-span-2">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img src="/friendly-female-artist-instructor-smiling-in-creat.jpg" alt="Sarah Chen" className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">Sarah Chen</h3>
                  <p className="text-muted-foreground">Founder & Lead Instructor</p>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <p className="text-lg leading-relaxed">
                  Sarah founded My_Space with a vision to make art accessible to everyone. With over 15 years of
                  experience in textile arts, ceramics, and mixed media, she believes that creativity is not a
                  talent—it's a practice that anyone can develop.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">MFA Ceramics</div>
                    <div className="text-sm text-muted-foreground">Rhode Island School of Design</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-secondary/10 rounded-lg">
                    <Palette className="h-8 w-8 text-secondary mb-2" />
                    <div className="font-semibold">500+ Students</div>
                    <div className="text-sm text-muted-foreground">Taught & inspired</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-accent/30 rounded-lg">
                    <Heart className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">Community Builder</div>
                    <div className="text-sm text-muted-foreground">Creating spaces for connection</div>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  "My favorite part of teaching is watching that moment when someone realizes they're capable of
                  creating something beautiful. That spark of confidence changes everything."
                </blockquote>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
