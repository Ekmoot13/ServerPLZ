'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { uploadMedia } from '../../actions'

/**
 * Edytor treści wpisu — obsługa zbliżona do edytora tekstu: formatowanie,
 * wyrównanie, listy, odnośniki, zdjęcia (także jako odnośnik) i tabele.
 *
 * Treść zapisujemy i wczytujemy jako HTML (pole `trescHtml`), bo tak renderuje
 * ją strona artykułu. Ukryte pole niesie HTML do formularza.
 */

// --- Zdjęcie, które może być odnośnikiem -----------------------------------
// TipTap trzyma obrazek jako blok, a odnośnik jako znacznik tekstu — nie da się
// więc po prostu zaznaczyć obrazka i nałożyć linku. Dokładamy zamiast tego
// atrybut `href`, a przy renderowaniu owijamy obrazek w <a>. Dzięki temu HTML
// wychodzi taki sam jak dotąd i strona artykułu nie wymaga żadnej zmiany.
const Obrazek = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: (el: HTMLElement) => {
          const rodzic = el.parentElement
          return rodzic && rodzic.tagName === 'A' ? rodzic.getAttribute('href') : null
        },
        renderHTML: () => ({}), // href trafia do <a>, nie do <img>
      },
    }
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const { href, ...obraz } = HTMLAttributes
    if (!href) return ['img', obraz]
    const zewnetrzny = /^https?:\/\//i.test(String(href))
    const a: Record<string, string> = { href: String(href) }
    if (zewnetrzny) {
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
    }
    return ['a', a, ['img', obraz]]
  },
})

// --- Odnośnik ---------------------------------------------------------------
// TipTap domyślnie dokleja do każdego odnośnika target="_blank" i rel z nofollow,
// także do naszych własnych adresów. Konfiguracja scala się pomijając null, więc
// tych domyślnych wartości nie da się wyzerować — renderujemy znacznik sami:
// w nowej karcie otwierają się wyłącznie adresy wychodzące poza serwis.
function czyWychodzi(href: string): boolean {
  if (!/^https?:/i.test(href)) return false
  try {
    return new URL(href).host !== window.location.host
  } catch {
    return true
  }
}

const Odnosnik = Link.extend({
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const atrybuty = { ...HTMLAttributes }
    delete atrybuty.target
    delete atrybuty.rel
    if (czyWychodzi(String(HTMLAttributes.href || ''))) {
      atrybuty.target = '_blank'
      atrybuty.rel = 'noopener noreferrer'
    }
    return ['a', atrybuty, 0]
  },
})

// --- Pomocnicze -------------------------------------------------------------

/**
 * Treść artykułu trafia na stronę bez filtrowania, więc adres z okienka musi
 * być bezpieczny — dopuszczamy tylko http(s), mailto i ścieżki względne.
 * Blokuje to m.in. „javascript:".
 */
function adresDozwolony(url: string): boolean {
  const u = url.trim()
  if (!u) return false
  if (u.startsWith('/') || u.startsWith('#')) return true
  return /^(https?:|mailto:)/i.test(u)
}

const BLEDNY_ADRES =
  'Nieprawidłowy adres. Podaj pełny adres (https://…) albo ścieżkę na naszej stronie (/newsy).'

// Limit musi być zgodny z experimental.serverActions.bodySizeLimit
// w next.config.ts — inaczej błąd wraca dopiero z serwera, bez powodu.
const MAX_MB = 25

// --- Przyciski paska --------------------------------------------------------

function Przycisk({
  aktywny,
  wylaczony,
  tytul,
  onClick,
  children,
}: {
  aktywny?: boolean
  wylaczony?: boolean
  tytul: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={tytul}
      aria-label={tytul}
      aria-pressed={aktywny}
      disabled={wylaczony}
      onMouseDown={(e) => e.preventDefault()} // nie gubimy zaznaczenia w treści
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm transition disabled:opacity-30 ${
        aktywny ? 'bg-sky-100 text-sky-800' : 'text-slate-700 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function Rozdzielacz() {
  return <span className="mx-1 h-6 w-px shrink-0 self-center bg-slate-300" />
}

// --- Pasek narzędzi ---------------------------------------------------------

function Pasek({ editor, akcje }: { editor: Editor; akcje?: React.ReactNode }) {
  const plikRef = useRef<HTMLInputElement>(null)
  const plikLinkRef = useRef<HTMLInputElement>(null)
  const adresLinku = useRef('')
  const [wgrywanie, setWgrywanie] = useState(false)

  /** Wgrywa plik i zwraca adres albo null; komunikaty pokazuje sama. */
  const wgraj = useCallback(async (file: File): Promise<string | null> => {
    const mb = file.size / 1024 / 1024
    if (mb > MAX_MB) {
      alert(
        `Zdjęcie ma ${mb.toFixed(1)} MB, a maksimum to ${MAX_MB} MB.\n` +
          'Zmniejsz je albo zapisz w mniejszej rozdzielczości.',
      )
      return null
    }
    const fd = new FormData()
    fd.append('file', file)
    setWgrywanie(true)
    try {
      const { url } = await uploadMedia(fd)
      if (url) return url
      alert('Serwer nie zwrócił adresu zdjęcia. Spróbuj ponownie.')
      return null
    } catch (err) {
      const powod = err instanceof Error ? err.message : String(err)
      alert(`Nie udało się wgrać zdjęcia (${mb.toFixed(1)} MB).\n\n${powod}`)
      return null
    } finally {
      setWgrywanie(false)
    }
  }, [])

  const wstawZdjecie = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await wgraj(file)
    if (url) editor.chain().focus().setImage({ src: url, alt: '' }).run()
  }

  const wstawZdjecieZLinkiem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await wgraj(file)
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: '', href: adresLinku.current } as any)
        .run()
    }
  }

  const zapytajOZdjecieZLinkiem = () => {
    const url = prompt('Adres, do którego ma prowadzić zdjęcie:')
    if (!url) return
    if (!adresDozwolony(url)) return alert(BLEDNY_ADRES)
    adresLinku.current = url
    plikLinkRef.current?.click()
  }

  const odnosnik = () => {
    const obecny = editor.getAttributes('link').href || ''
    const url = prompt('Adres URL odnośnika:', obecny)
    if (url === null) return
    if (!url.trim()) return editor.chain().focus().unsetLink().run()
    if (!adresDozwolony(url)) return alert(BLEDNY_ADRES)
    // target i rel dokłada samo renderowanie znacznika — tu wystarczy adres.
    editor.chain().focus().setLink({ href: url }).run()
  }

  const wTabeli = editor.isActive('table')

  return (
    <div className="sticky top-0 z-30 rounded-t-lg border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-0.5 p-2">
        <Przycisk tytul="Cofnij (Ctrl+Z)" wylaczony={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </Przycisk>
        <Przycisk tytul="Ponów (Ctrl+Y)" wylaczony={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </Przycisk>

        <Rozdzielacz />

        <select
          title="Styl akapitu"
          aria-label="Styl akapitu"
          value={
            editor.isActive('heading', { level: 2 })
              ? 'h2'
              : editor.isActive('heading', { level: 3 })
                ? 'h3'
                : editor.isActive('heading', { level: 4 })
                  ? 'h4'
                  : 'p'
          }
          onChange={(e) => {
            const v = e.target.value
            if (v === 'p') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run()
          }}
          className="h-8 rounded border border-slate-300 bg-white px-2 text-sm text-slate-700"
        >
          <option value="p">Tekst</option>
          <option value="h2">Nagłówek 1</option>
          <option value="h3">Nagłówek 2</option>
          <option value="h4">Nagłówek 3</option>
        </select>

        <Rozdzielacz />

        <Przycisk tytul="Pogrubienie (Ctrl+B)" aktywny={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Przycisk>
        <Przycisk tytul="Kursywa (Ctrl+I)" aktywny={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </Przycisk>
        <Przycisk tytul="Podkreślenie (Ctrl+U)" aktywny={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </Przycisk>
        <Przycisk tytul="Przekreślenie" aktywny={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </Przycisk>
        <Przycisk tytul="Wyczyść formatowanie" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          ⌫
        </Przycisk>

        <Rozdzielacz />

        <Przycisk tytul="Do lewej" aktywny={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          ⯇
        </Przycisk>
        <Przycisk tytul="Wyśrodkuj" aktywny={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          ⯈⯇
        </Przycisk>
        <Przycisk tytul="Do prawej" aktywny={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          ⯈
        </Przycisk>
        <Przycisk tytul="Wyjustuj" aktywny={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
          ☰
        </Przycisk>

        <Rozdzielacz />

        <Przycisk tytul="Lista punktowana" aktywny={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •
        </Przycisk>
        <Przycisk tytul="Lista numerowana" aktywny={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </Przycisk>
        <Przycisk tytul="Cytat" aktywny={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </Przycisk>
        <Przycisk tytul="Linia pozioma" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          —
        </Przycisk>

        <Rozdzielacz />

        <Przycisk tytul="Odnośnik" aktywny={editor.isActive('link')} onClick={odnosnik}>
          🔗
        </Przycisk>
        <Przycisk tytul="Usuń odnośnik" wylaczony={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}>
          ⛓
        </Przycisk>
        <Przycisk tytul="Wstaw zdjęcie" wylaczony={wgrywanie} onClick={() => plikRef.current?.click()}>
          🖼
        </Przycisk>
        <Przycisk
          tytul="Zdjęcie jako odnośnik — np. baner prowadzący do Strefy Kibica"
          wylaczony={wgrywanie}
          onClick={zapytajOZdjecieZLinkiem}
        >
          🖼🔗
        </Przycisk>

        <Rozdzielacz />

        <Przycisk
          tytul="Wstaw tabelę 3×3 z nagłówkiem"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          ▦
        </Przycisk>

        {akcje && <div className="ml-auto flex items-center gap-2 pl-2">{akcje}</div>}
      </div>

      {/* Narzędzia tabeli — pokazujemy dopiero, gdy kursor stoi w tabeli. */}
      {wTabeli && (
        <div className="flex flex-wrap items-center gap-0.5 border-t border-slate-200 bg-white/70 px-2 py-1.5">
          <span className="mr-1 text-xs font-medium text-slate-500">Tabela:</span>
          <Przycisk tytul="Kolumna przed" onClick={() => editor.chain().focus().addColumnBefore().run()}>
            ←|
          </Przycisk>
          <Przycisk tytul="Kolumna po" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            |→
          </Przycisk>
          <Przycisk tytul="Usuń kolumnę" onClick={() => editor.chain().focus().deleteColumn().run()}>
            ⌦|
          </Przycisk>
          <Rozdzielacz />
          <Przycisk tytul="Wiersz nad" onClick={() => editor.chain().focus().addRowBefore().run()}>
            ↑+
          </Przycisk>
          <Przycisk tytul="Wiersz pod" onClick={() => editor.chain().focus().addRowAfter().run()}>
            ↓+
          </Przycisk>
          <Przycisk tytul="Usuń wiersz" onClick={() => editor.chain().focus().deleteRow().run()}>
            ⌦—
          </Przycisk>
          <Rozdzielacz />
          <Przycisk tytul="Scal komórki" onClick={() => editor.chain().focus().mergeCells().run()}>
            ⧉
          </Przycisk>
          <Przycisk tytul="Podziel komórkę" onClick={() => editor.chain().focus().splitCell().run()}>
            ⧈
          </Przycisk>
          <Przycisk tytul="Przełącz nagłówek wiersza" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
            H—
          </Przycisk>
          <Rozdzielacz />
          <Przycisk tytul="Usuń tabelę" onClick={() => editor.chain().focus().deleteTable().run()}>
            🗑
          </Przycisk>
        </div>
      )}

      <input ref={plikRef} type="file" accept="image/*" className="hidden" onChange={wstawZdjecie} />
      <input ref={plikLinkRef} type="file" accept="image/*" className="hidden" onChange={wstawZdjecieZLinkiem} />
    </div>
  )
}

// --- Edytor -----------------------------------------------------------------

export default function RichEditor({
  name,
  initialHtml,
  onZmiana,
  akcje,
}: {
  name: string
  initialHtml?: string
  /** Wołane po każdej zmianie treści — formularz pilnuje na tej podstawie zapisu. */
  onZmiana?: () => void
  /** Miejsce po prawej stronie paska — tam siedzi przycisk zapisu. */
  akcje?: React.ReactNode
}) {
  const [html, setHtml] = useState(initialHtml || '')
  // Pierwsze wywołanie onUpdate przychodzi od samego wczytania treści —
  // nie może liczyć się jako zmiana redaktora.
  const gotowy = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false, // własna wersja niżej — Odnosnik
      }),
      Odnosnik.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Obrazek.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialHtml || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[420px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
      if (gotowy.current) onZmiana?.()
    },
  })

  useEffect(() => {
    if (editor) gotowy.current = true
  }, [editor])

  return (
    <div className="rounded-lg border border-slate-300 bg-white">
      <style>{`
        .edytor-tresci table { border-collapse: collapse; width: 100%; margin: 1rem 0; table-layout: fixed }
        .edytor-tresci th, .edytor-tresci td { border: 1px solid #cbd5e1; padding: .4rem .6rem; vertical-align: top }
        .edytor-tresci th { background: #f1f5f9; font-weight: 700; text-align: left }
        .edytor-tresci .selectedCell { background: #e0f2fe }
        .edytor-tresci .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: 0; width: 4px; background: #0ea5e9 }
        .edytor-tresci img { max-width: 100%; height: auto }
        .edytor-tresci .ProseMirror-gapcursor { display: block }
      `}</style>

      <input type="hidden" name={name} value={html} />
      {editor && <Pasek editor={editor} akcje={akcje} />}
      <div className="edytor-tresci">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
