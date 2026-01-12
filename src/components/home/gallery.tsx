export function Gallery() {
  const images = [
    { url: "/person-painting-colorful-floral-design-on-white-to.jpg", alt: "Tote bag painting in progress" },
    { url: "/hands-shaping-wet-clay-on-pottery-wheel-closeup.jpg", alt: "Pottery wheel session" },
    { url: "/group-of-happy-people-holding-their-finished-paint.jpg", alt: "Happy workshop participants" },
    { url: "/beautiful-handmade-ceramic-bowls-and-mugs-on-woode.jpg", alt: "Finished pottery pieces" },
    { url: "/colorful-sewing-workspace-with-fabrics-and-pattern.jpg", alt: "Sewing workshop in action" },
    { url: "/creative-art-studio-with-natural-light-and-colorfu.jpg", alt: "Studio atmosphere" },
    { url: "/close-up-of-embroidery-hoop-with-colorful-thread-w.jpg", alt: "Embroidery detail" },
    { url: "/placeholder.svg?height=600&width=800", alt: "Creative community" },
    { url: "/placeholder.svg?height=600&width=800", alt: "Ceramic collection" },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Moments of creativity and connection from our workshops
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {images.map((image, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
