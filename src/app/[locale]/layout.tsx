import type React from "react"
import type { Metadata } from "next"
import { Lexend, Caveat } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { defaultLocale } from '@/lib/i18n-config'
import "@/app/globals.css"

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
  // Get locale from request, fallback to default
  const locale = await getLocale() || defaultLocale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${lexend.variable} ${caveat.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
