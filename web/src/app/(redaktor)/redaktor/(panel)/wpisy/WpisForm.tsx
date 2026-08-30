'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import RichEditor from './RichEditor'

export type WpisInitial = {
  title: string
  slug: string
  status: string // 'draft' | 'published'
  publishedAt: string // ISO lub ''
  heroUrl?: string
  trescHtml: string
  categories: string[] // ids
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

export default function WpisForm({
  action,
  id,
  initial,
  categories,
  ok,
}: {
  action: (formData: FormData) => void | Promise<void>
  id?: string
  initial: WpisInitial
  categories: { id: string; title: string }[]
  ok?: boolean
}) {
  const [selCats, setSelCats] = useState<string[]>(initial.categories || [])
  const toggle = (cid: string) =>
    setSelCats((prev) => (prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]))

  const dtLocal = initial.publishedAt ? new Date(initial.publishedAt).toISOString().slice(0, 16) : ''

  return (
    <form action={action} className="space-y-6">
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="categories" value={JSON.stringify(selCats)} />

      {ok && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          Zapisano.
        </div>
      )}

      {/* Tytuł */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tytuł</label>
        <input name="title" defaultValue={initial.title} required className={inputCls} />
      </div>

      {/* Slug + data + status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Adres (slug)</label>
          <input name="slug" defaultValue={initial.slug} placeholder="auto z tytułu" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Data publikacji</label>
          <input type="datetime-local" name="publishedAt" defaultValue={dtLocal} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select name="status" defaultValue={initial.status || 'draft'} className={inputCls}>
            <option value="draft">Szkic</option>
            <option value="published">Opublikowany</option>
          </select>
        </div>
      </div>

      {/* Zdjęcie główne */}
      <div className="flex items-center gap-4">
        {initial.heroUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.heroUrl} alt="" className="h-24 w-40 rounded-lg object-cover" />
        ) : (
          <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
            brak
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Zdjęcie główne (podmień)</label>
          <input type="file" name="heroImage" accept="image/*" className="text-sm" />
        </div>
      </div>

      {/* Kategorie */}
      {categories.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Kategorie</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <label
                key={c.id}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                  selCats.includes(c.id)
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selCats.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                {c.title}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Treść */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Treść</label>
        <RichEditor name="trescHtml" initialHtml={initial.trescHtml} />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
        <button type="submit" className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500">
          Zapisz
        </button>
        <Link href="/redaktor/wpisy" className="text-sm text-slate-500 hover:underline">
          ← Wróć do listy
        </Link>
      </div>
    </form>
  )
}
