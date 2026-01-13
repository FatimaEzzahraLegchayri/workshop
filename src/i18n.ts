import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { defaultLocale, locales } from './lib/i18n-config'

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request (set by middleware)
  let locale = await requestLocale

  // If no locale from request, use default
  if (!locale) {
    locale = defaultLocale
  }

  // Validate that the locale is valid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./locals/${locale}.json`)).default
  }
})
