import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://versiliahomes.it'

  const admin = createAdminClient()
  const { data: properties } = await admin
    .from('properties')
    .select('slug, updated_at')
    .eq('is_active', true)

  const propertyUrls = (properties || []).map((p) => ({
    url: `${baseUrl}/appartamenti/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/appartamenti`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/chi-siamo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...propertyUrls,
  ]
}
