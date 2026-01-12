import { CheckCircle, Palette, Clock, Users, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const workshopTypes = [
  {
    title: "Tote Bag Painting",
    icon: Palette,
    details: [
      {
        icon: CheckCircle,
        label: "What you'll learn",
        text: "Color mixing, stencil techniques, fabric paint application, design composition",
      },
      {
        icon: Package,
        label: "What's included",
        text: "Canvas tote bag, fabric paints, brushes, stencils, apron, all materials",
      },
      { icon: Users, label: "Skill level", text: "Beginner-friendly - No experience needed!" },
      { icon: Clock, label: "Duration", text: "2 hours of creative fun" },
    ],
  },
  {
    title: "Pottery Wheel",
    icon: Package,
    details: [
      {
        icon: CheckCircle,
        label: "What you'll learn",
        text: "Centering clay, pulling walls, shaping bowls and cylinders, trimming basics",
      },
      { icon: Package, label: "What's included", text: "3 lbs of clay, glazing service, kiln firing, apron" },
      { icon: Users, label: "Skill level", text: "Beginner to intermediate - Patient instruction provided" },
      { icon: Clock, label: "Duration", text: "3 hours on the wheel" },
    ],
  },
  {
    title: "Sewing Workshop",
    icon: CheckCircle,
    details: [
      {
        icon: CheckCircle,
        label: "What you'll learn",
        text: "Machine basics, straight stitching, following patterns, finishing techniques",
      },
      {
        icon: Package,
        label: "What's included",
        text: "Sewing machine use, fabric, thread, patterns, tools, take-home project",
      },
      { icon: Users, label: "Skill level", text: "Complete beginners welcome" },
      { icon: Clock, label: "Duration", text: "3 hours of hands-on practice" },
    ],
  },
]

export function WorkshopDetails() {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Workshop Details</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to know before booking</p>
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {workshopTypes.map((workshop, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <workshop.icon className="h-6 w-6 text-primary" />
                  {workshop.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {workshop.details.map((detail, didx) => (
                    <div key={didx} className="flex gap-4">
                      <detail.icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">{detail.label}</div>
                        <div className="text-muted-foreground text-sm">{detail.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-accent/30 border-accent">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-3">What to Bring</h3>
              <p className="text-muted-foreground">
                Just bring yourself and your creativity! We provide all materials, tools, and equipment. Wear
                comfortable clothes you don't mind getting a little messy. We provide aprons, but fabric paint and clay
                can sometimes find their way onto clothing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
