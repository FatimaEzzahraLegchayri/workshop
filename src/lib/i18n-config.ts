const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

const defaultLocale: Locale = 'fr'

export { locales, defaultLocale }
