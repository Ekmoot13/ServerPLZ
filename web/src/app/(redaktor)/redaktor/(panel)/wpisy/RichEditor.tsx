'use client'
import React, { useEffect, useRef, useState } from 'react'
import { uploadMedia } from '../../actions'

export default function RichEditor({ name, initialHtml }: { name: string; initialHtml?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
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
  const link = () => {
    const url = prompt('Adres URL linku:')
    if (url) cmd('createLink', url)
  }
  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { url } = await uploadMedia(fd)
      if (url) cmd('insertImage', url)
    } catch {
      alert('Nie udało się wgrać zdjęcia.')
    }
    e.target.value = ''
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
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />
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
