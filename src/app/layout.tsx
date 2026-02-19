import type React from "react"
import type { Metadata } from "next"
import { Lexend, Caveat } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { defaultLocale } from '@/lib/i18n-config'
import "@/app/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { Bodoni_Moda, Cormorant_Garamond } from "next/font/google";

const bodoni = Bodoni_Moda({ 
  subsets: ["latin"], 
  variable: "--font-elegant" 
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"]
});


const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" })
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" })

export const metadata: Metadata = {
  title: "Broderie by Bel | Customized Embroidery in Montreal",
  description:
    "Join hands-on art workshops for painting, pottery, and sewing. Create, connect, and craft your story at My_Space in Brooklyn, NY.",
  generator: "v0.app",
  keywords: [
    "art workshops",
    "pottery classes",
    "tote bag painting",
    "sewing classes",
    "Brooklyn workshops",
    "creative classes",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale() || defaultLocale
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${bodoni.variable} ${cormorant.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
