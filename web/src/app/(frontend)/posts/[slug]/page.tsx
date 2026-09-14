import type { Metadata } from 'next'

import WiecejNewsow, { type NewsKafel } from '@/components/site/WiecejNewsow'
import GaleriaRegat from '@/components/site/GaleriaRegat'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

// Treść newsa: szeroka kolumna (bez wąskiego pasa po bokach) i justowanie z dzieleniem
// wyrazów — `tresc-newsa` dokłada wyrównanie w globals.css.
const TRESC = 'prose prose-lg tresc-newsa mx-auto max-w-[72rem]'

// „Kolejne do przeczytania”: najpierw powiązane wpisy ustawione przez redaktora,
// a gdy ich nie ma — najnowsze newsy poza aktualnie czytanym.
async function kolejneDoPrzeczytania(post: any): Promise<NewsKafel[]> {
  const kafel = (p: any): NewsKafel => ({
    slug: p?.slug,
    title: p?.title,
    data: p?.publishedAt || null,
    kategoria: p?.categories?.[0]?.title || null,
    obraz: p?.heroImage?.url || p?.meta?.image?.url || null,
  })

  const powiazane: any[] = (post?.relatedPosts || []).filter((p: any) => p && typeof p === 'object' && p.slug)
  if (powiazane.length >= 4) return powiazane.slice(0, 4).map(kafel)

  const payload = await getPayload({ config: configPromise })
  const res = await payload
    .find({
      collection: 'posts',
      where: { _status: { equals: 'published' }, slug: { not_equals: post?.slug } },
      sort: '-publishedAt',
      limit: 8,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  const wynik: NewsKafel[] = powiazane.map(kafel)
  for (const p of res.docs as any[]) {
    if (wynik.length >= 4) break
    if (wynik.some((w) => w.slug === p.slug)) continue
    wynik.push(kafel(p))
  }
  return wynik
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const wiecej = await kolejneDoPrzeczytania(post)

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          {(post as any).trescHtml ? (
            <div
              className={TRESC}
              dangerouslySetInnerHTML={{ __html: (post as any).trescHtml }}
            />
          ) : post.content ? (
            <RichText className={TRESC} data={post.content} enableGutter={false} />
          ) : null}

          <GaleriaRegat />

          <WiecejNewsow items={wiecej} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
