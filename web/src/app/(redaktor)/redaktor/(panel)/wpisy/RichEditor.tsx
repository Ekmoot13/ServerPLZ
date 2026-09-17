'use client'
import React, { useEffect, useRef, useState } from 'react'
import { uploadMedia } from '../../actions'

export default function RichEditor({ name, initialHtml }: { name: string; initialHtml?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // Osobny wybor pliku dla zdjecia, ktore ma byc odnosnikiem — adres
  // zapamietujemy, zanim otworzy sie okno wyboru.
  const fileLinkRef = useRef<HTMLInputElement>(null)
  const adresLinku = useRef<string>('')
  const [html, setHtml] = useState(initialHtml || '')

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHtml || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = () => {
    if (ref.current) setHtml(ref.current.innerHTML)
  }
  const cmd = (c: string, v?: string) => {
    document.execCommand(c, false, v)
    ref.current?.focus()
    sync()
  }
  /** Bezpieczne wstawienie adresu do atrybutu HTML. */
  const naAtrybut = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  /**
   * Tresc artykulu trafia na strone bez filtrowania, wiec adres wpisany
   * w okienku musi byc bezpieczny — dopuszczamy tylko http(s), mailto
   * i sciezki wzgledne. Blokuje to m.in. "javascript:".
   */
  const adresDozwolony = (url: string) => {
    const u = url.trim()
    if (!u) return false
    if (u.startsWith('/') || u.startsWith('#')) return true
    return /^(https?:|mailto:)/i.test(u)
  }

  /** Linki poza nasza strone otwieramy w nowej karcie, wewnetrzne w tej samej. */
  const czyZewnetrzny = (url: string) => {
    if (!/^https?:\/\//i.test(url)) return false
    try {
      return new URL(url).host !== window.location.host
    } catch {
      return false
    }
  }

  const otoczLinkiem = (wewnetrzneHtml: string, url: string) => {
    const cel = czyZewnetrzny(url) ? ' target="_blank" rel="noopener noreferrer"' : ''
    cmd('insertHTML', `<a href="${naAtrybut(url)}"${cel}>${wewnetrzneHtml}</a>`)
  }

  /** Zwraca zaznaczony obrazek albo null. */
  const zaznaczoneZdjecie = (): HTMLImageElement | null => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    const zakres = sel.getRangeAt(0)
    const kopia = zakres.cloneContents()
    const img = kopia.querySelector('img')
    if (img) return img
    const w = zakres.startContainer as HTMLElement
    if (w?.nodeType === 1 && (w as HTMLElement).tagName === 'IMG') return w as HTMLImageElement
    return null
  }

  const link = () => {
    const img = zaznaczoneZdjecie()
    const url = prompt(img ? 'Adres, do którego ma prowadzić zdjęcie:' : 'Adres URL linku:')
    if (!url) return
    if (!adresDozwolony(url)) {
      alert('Nieprawidłowy adres. Podaj pełny adres (https://…) albo ścieżkę na naszej stronie (/newsy).')
      return
    }
    // Zaznaczony obrazek owijamy recznie — createLink potrafi go pominac.
    if (img) otoczLinkiem(img.outerHTML, url)
    else cmd('createLink', url)
  }
  // Limit musi byc zgodny z experimental.serverActions.bodySizeLimit
  // w next.config.ts — inaczej blad wraca dopiero z serwera, bez powodu.
  const MAX_MB = 25

  /** Wgrywa plik i zwraca adres albo null; komunikaty pokazuje sama. */
  const wgraj = async (file: File): Promise<string | null> => {
    const mb = file.size / 1024 / 1024
    if (mb > MAX_MB) {
      alert(
        `Zdjęcie ma ${mb.toFixed(1)} MB, a maksimum to ${MAX_MB} MB.
` +
          'Zmniejsz je albo zapisz w mniejszej rozdzielczości.',
      )
      return null
    }
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { url } = await uploadMedia(fd)
      if (url) return url
      alert('Serwer nie zwrócił adresu zdjęcia. Spróbuj ponownie.')
      return null
    } catch (err) {
      const powod = err instanceof Error ? err.message : String(err)
      alert(`Nie udało się wgrać zdjęcia (${mb.toFixed(1)} MB).

${powod}`)
      return null
    }
  }

  /** Zdjęcie, które ma być odnośnikiem: najpierw pytamy o adres. */
  const zdjecieZLinkiem = () => {
    const url = prompt('Adres, do którego ma prowadzić zdjęcie:')
    if (!url) return
    if (!adresDozwolony(url)) {
      alert('Nieprawidłowy adres. Podaj pełny adres (https://…) albo ścieżkę na naszej stronie (/regatowastrefakibica).')
      return
    }
    adresLinku.current = url
    fileLinkRef.current?.click()
  }

  const onImageLink = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await wgraj(file)
    if (url) otoczLinkiem(`<img src="${naAtrybut(url)}" alt="" />`, adresLinku.current)
  }

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await wgraj(file)
    if (url) cmd('insertImage', url)
  }

  const btn = 'rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-200'
  return (
    <div className="rounded-lg border border-slate-300 bg-white">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" className={btn} onClick={() => cmd('bold')}>
          <b>B</b>
        </button>
        <button type="button" className={btn} onClick={() => cmd('italic')}>
          <i>I</i>
        </button>
        <button type="button" className={btn} onClick={() => cmd('formatBlock', 'h2')}>
          H2
        </button>
        <button type="button" className={btn} onClick={() => cmd('formatBlock', 'h3')}>
          H3
        </button>
        <button type="button" className={btn} onClick={() => cmd('formatBlock', 'p')}>
          P
        </button>
        <button type="button" className={btn} onClick={() => cmd('insertUnorderedList')}>
          • Lista
        </button>
        <button type="button" className={btn} onClick={() => cmd('insertOrderedList')}>
          1. Lista
        </button>
        <button type="button" className={btn} onClick={link}>
          Link
        </button>
        <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
          Zdjęcie
        </button>
        <button
          type="button"
          className={btn}
          onClick={zdjecieZLinkiem}
          title="Wgraj zdjęcie, które będzie odnośnikiem — np. baner prowadzący do Strefy Kibica"
        >
          Zdjęcie z linkiem
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />
        <input ref={fileLinkRef} type="file" accept="image/*" className="hidden" onChange={onImageLink} />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        className="prose min-h-[320px] max-w-none p-4 focus:outline-none"
      />
    </div>
  )
}
