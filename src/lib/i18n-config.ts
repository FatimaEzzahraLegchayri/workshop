const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

const defaultLocale: Locale = 'fr'

// Re-export for use in i18n.ts
export { locales, defaultLocale }
