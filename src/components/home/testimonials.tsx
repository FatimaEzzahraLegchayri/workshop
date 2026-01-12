import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Emma Rodriguez",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "I made my first pottery bowl and I'm obsessed! Sarah's patient teaching style made something I thought was impossible feel totally doable. Can't wait for the next class!",
  },
  {
    name: "Marcus Johnson",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "The tote bag I painted is my favorite accessory now! Everyone asks where I got it. Such a fun, relaxing experience. Perfect date activity!",
  },
  {
    name: "Priya Patel",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "As someone who never thought they were 'artistic,' this workshop changed my perspective. The supportive environment and clear instruction helped me create something I'm genuinely proud of.",
  },
  {
    name: "James Chen",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Came with my sister and had an amazing time! The sewing workshop taught me practical skills while being incredibly fun. Sarah is a fantastic teacher.",
  },
  {
    name: "Lisa Thompson",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "I've attended three different workshops now and each one has been wonderful. The community here is so welcoming, and I love having handmade pieces to use and gift.",
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of happy makers who've discovered their creative side
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
