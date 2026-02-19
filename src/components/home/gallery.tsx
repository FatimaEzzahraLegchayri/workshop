'use client'

import { useTranslations } from 'next-intl'

export function Gallery() {
  const t = useTranslations('gallery')

  const images = [
    { url: "/gallery-1.jpg", altKey: "toteBag" },
    { url: "/gallery-2.jpg", altKey: "potteryWheel" },
    { url: "/gallery-3.jpg", altKey: "participants" },
    { url: "/gallery-4.jpg", altKey: "potteryPieces" },
    { url: "/gallery-5.jpg", altKey: "sewingWorkshop" },
    { url: "/gallery-6.jpg", altKey: "studioAtmosphere" },
    { url: "/gallery-7.jpg", altKey: "embroidery" },
    { url: "/gallery-8.jpg", altKey: "embroidery" },
    { url: "/gallery-9.jpg", altKey: "embroidery" },
    { url: "/gallery-10.jpg", altKey: "embroidery" },
    { url: "/gallery-11.jpg", altKey: "embroidery" },
    { url: "/gallery-12.jpg", altKey: "embroidery" },
    { url: "/gallery-13.jpg", altKey: "embroidery" },
    { url: "/gallery-15.jpg", altKey: "embroidery" },
    { url: "/gallery-16.jpg", altKey: "embroidery" },
    { url: "/unnamed.jpg", altKey: "embroidery" },
    { url: "/gallery-14.jpg", altKey: "embroidery" },
  ]

  const firstRow = images.slice(0, Math.ceil(images.length / 2));
  const secondRow = images.slice(Math.ceil(images.length / 2));

  const cardClass = "relative flex-shrink-0 w-64 h-64 mx-2 overflow-hidden rounded-lg group cursor-pointer";

  return (
    <section id="galleries" className="py-20 bg-[#fdfaf5] overflow-hidden">
      <style jsx global>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 30s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 30s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-forest-green">{t('title')}</h2>
        <p className="text-xl max-w-2xl mx-auto text-soft-pink">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="overflow-hidden">
          <div className="animate-marquee-left">
            {[...firstRow, ...firstRow].map((image, idx) => (
              <div key={`row1-${idx}`} className={cardClass}>
                <img
                  src={image.url}
                  alt={t(`alt.${image.altKey}`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="animate-marquee-right">
            {[...secondRow, ...secondRow].map((image, idx) => (
              <div key={`row2-${idx}`} className={cardClass}>
                <img
                  src={image.url}
                  alt={t(`alt.${image.altKey}`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}