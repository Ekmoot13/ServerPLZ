'use client'
import React, { useState } from 'react'

const inp =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
const lab = 'mb-1 block text-xs font-medium text-slate-600'

/** ISO -> wartosc dla input[type=datetime-local] w czasie lokalnym. */
function naInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function zaGodzin(godziny: number): string {
  const d = new Date(Date.now() + godziny * 3600000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

const SZYBKIE = [
  { etykieta: '1 h', godziny: 1 },
  { etykieta: '6 h', godziny: 6 },
  { etykieta: '24 h', godziny: 24 },
  { etykieta: '3 dni', godziny: 72 },
]

/**
 * Pola schowane przez aktualny wybor nadal musza pojechac z formularzem —
 * inaczej powrot na tryb "aktualnosci" skasowalby ID kanalu i reszte ustawien.
 */
function Zachowaj({ pola }: { pola: Record<string, string> }) {
  return (
    <>
      {Object.entries(pola).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </>
  )
}

export default function KafelekEditor({ initial, aktualnosci }: { initial: any; aktualnosci?: any }) {
  const k = initial || {}
  const A = aktualnosci || {}
  const [tryb, setTryb] = useState<string>(k.tryb || 'newsy')
  const [platforma, setPlatforma] = useState<string>(k.platforma || 'youtube')
  const [zrodlo, setZrodlo] = useState<string>(k.zrodlo || 'auto')
  const [wygasa, setWygasa] = useState<string>(naInput(k.wygasa))
  // Dane dostepowe Mety mieszkaja w grupie `aktualnosci`, ale uzupelnia sie je
  // tutaj — tam, gdzie sa potrzebne. Trzymamy je w stanie, zeby te akurat
  // niewidoczne mogly pojechac z formularzem jako pola ukryte.
  const [igUserId, setIgUserId] = useState<string>(A.igUserId || '')
  const [igToken, setIgToken] = useState<string>(A.igToken || '')
  const [fbPageId, setFbPageId] = useState<string>(A.fbPageId || '')
  const [fbToken, setFbToken] = useState<string>(A.fbToken || '')
  // kontrolowane, bo od ich zawartosci zalezy komunikat "czy kafelek sie pokaze"
  const [kanalId, setKanalId] = useState<string>(k.kanalId || '')
  const [postUrl, setPostUrl] = useState<string>(k.postUrl || '')
  const [recznyObraz, setRecznyObraz] = useState<string>(k.recznyObraz || '')

  const podmiana = tryb === 'platforma'
  const metowa = platforma === 'instagram' || platforma === 'facebook'
  // TikTok nie ma publicznego API do pobrania najnowszego posta z konta
  const autoMozliwe = platforma !== 'tiktok'
  const efektywneZrodlo = autoMozliwe ? zrodlo : 'link'
  const wygasloJuz = Boolean(wygasa) && new Date(wygasa).getTime() <= Date.now()
  // dane Mety pokazujemy tylko wtedy, gdy sa faktycznie potrzebne
  const pokazDaneMety = podmiana && metowa && efektywneZrodlo === 'auto'
  const komplet = platforma === 'instagram' ? Boolean(igUserId && igToken) : Boolean(fbPageId && fbToken)

  // Dlaczego kafelek moze sie nie pokazac — liczone tak samo jak na stronie.
  // Obrazek NIE jest juz wymagany recznie: z wklejonego linku bierzemy zdjecie,
  // nazwe konta i opis ze znacznikow Open Graph (IG/FB) albo z oEmbed (YT/TikTok).
  const przeszkoda: string | null = !podmiana
    ? null
    : efektywneZrodlo === 'link' && !postUrl.trim()
      ? 'Brakuje linku do posta.'
      : pokazDaneMety && !komplet
        ? 'Brakuje danych dostępowych — bez nich nic się nie pobierze.'
        : efektywneZrodlo === 'auto' && platforma === 'youtube' && !kanalId.trim()
          ? 'Brakuje ID kanału lub playlisty YouTube.'
          : wygasloJuz
            ? 'Termin podmiany już minął.'
            : null

  return (
    <div className="space-y-4">
      <div>
        <label className={lab}>Co pokazuje największy kafelek</label>
        <select name="kgTryb" value={tryb} onChange={(e) => setTryb(e.target.value)} className={inp}>
          <option value="newsy">Najnowsza aktualność (domyślnie) — razem 5 newsów</option>
          <option value="platforma">Post z social mediów — z boku 4 najnowsze newsy</option>
        </select>
      </div>

      {/* Dane Mety niewidoczne w danym momencie i tak muszą pojechać z formularzem,
          inaczej zapis skasowałby token przy każdej innej zmianie na stronie. */}
      {!pokazDaneMety ? (
        <Zachowaj
          pola={{ kgIgUserId: igUserId, kgIgToken: igToken, kgFbPageId: fbPageId, kgFbToken: fbToken }}
        />
      ) : platforma === 'instagram' ? (
        <Zachowaj pola={{ kgFbPageId: fbPageId, kgFbToken: fbToken }} />
      ) : (
        <Zachowaj pola={{ kgIgUserId: igUserId, kgIgToken: igToken }} />
      )}

      {!podmiana && (
        <>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Duży kafelek pokazuje najnowszą aktualność, a obok niej cztery kolejne. Ustawienia podmiany
            zostają zapamiętane.
          </p>
          <Zachowaj
            pola={{
              kgPlatforma: platforma,
              kgZrodlo: zrodlo,
              kgKanalId: kanalId,
              kgPostUrl: postUrl,
              kgWygasa: wygasa,
              kgRecznaNazwa: k.recznaNazwa || '',
              kgRecznyObraz: recznyObraz,
              kgRecznyOpis: k.recznyOpis || '',
            }}
          />
        </>
      )}

      {podmiana && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lab}>Platforma</label>
              <select
                name="kgPlatforma"
                value={platforma}
                onChange={(e) => setPlatforma(e.target.value)}
                className={inp}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            <div>
              <label className={lab}>Skąd brać post</label>
              <select
                name="kgZrodlo"
                value={efektywneZrodlo}
                onChange={(e) => setZrodlo(e.target.value)}
                disabled={!autoMozliwe}
                className={`${inp} disabled:bg-slate-100 disabled:text-slate-500`}
              >
                <option value="auto">Automatycznie — najnowszy z kanału/konta</option>
                <option value="link">Konkretny post — wklejony link</option>
              </select>
            </div>
          </div>

          {!autoMozliwe && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              TikTok nie udostępnia publicznie najnowszego posta z konta — wymagałoby to zatwierdzonej
              aplikacji TikTok Display API. Wklej link do konkretnego filmu; miniaturkę, autora i opis
              pobierzemy automatycznie.
            </p>
          )}

          {efektywneZrodlo === 'auto' && platforma === 'youtube' && (
            <div>
              <label className={lab}>ID kanału (UC…) lub playlisty (PL…)</label>
              <input
                name="kgKanalId"
                value={kanalId}
                onChange={(e) => setKanalId(e.target.value)}
                placeholder="UCxxxxxxxxxxxxxxxxxxxxxx"
                className={inp}
              />
              <p className="mt-1 text-xs text-slate-500">
                Bierzemy najnowszy film z publicznego kanału RSS — bez klucza API.
              </p>
            </div>
          )}

          {pokazDaneMety && (
            <div
              className={`rounded-lg border p-3 ${
                komplet ? 'border-slate-200 bg-slate-50' : 'border-amber-300 bg-amber-50'
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-700">
                  Dostęp do {platforma === 'instagram' ? 'Instagrama' : 'Facebooka'}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    komplet ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {komplet ? 'uzupełnione' : 'brakuje danych'}
                </span>
              </div>

              {platforma === 'instagram' ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={lab}>ID konta (IG Business/Creator)</label>
                    <input
                      name="kgIgUserId"
                      value={igUserId}
                      onChange={(e) => setIgUserId(e.target.value)}
                      placeholder="17841400000000000"
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className={lab}>Token dostępu (długożyciowy)</label>
                    <input
                      name="kgIgToken"
                      type="password"
                      autoComplete="off"
                      value={igToken}
                      onChange={(e) => setIgToken(e.target.value)}
                      placeholder="IGQ…"
                      className={inp}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={lab}>ID strony</label>
                    <input
                      name="kgFbPageId"
                      value={fbPageId}
                      onChange={(e) => setFbPageId(e.target.value)}
                      placeholder="1234567890"
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className={lab}>Token strony (długożyciowy)</label>
                    <input
                      name="kgFbToken"
                      type="password"
                      autoComplete="off"
                      value={fbToken}
                      onChange={(e) => setFbToken(e.target.value)}
                      placeholder="EAA…"
                      className={inp}
                    />
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs text-slate-600">
                {komplet
                  ? 'Najnowszy post pobierze się automatycznie.'
                  : 'Bez tych danych nic się nie pobierze. Token zakładasz w aplikacji Meta (developers.facebook.com) — to ta sama para, której używa sekcja Aktualności.'}
              </p>
              {!komplet && (
                <p className="mt-1 text-xs text-slate-600">
                  Nie masz ich pod ręką? Przełącz „Skąd brać post" na <strong>konkretny post</strong> i wklej
                  link — wtedy wystarczy uzupełnić obrazek i opis niżej.
                </p>
              )}
            </div>
          )}


          {/* ID kanalu widac tylko przy automacie na YouTube, link tylko w trybie
              "konkretny post" — to, czego nie widac, jedzie ukryte. */}
          {!(efektywneZrodlo === 'auto' && platforma === 'youtube') && (
            <Zachowaj pola={{ kgKanalId: kanalId }} />
          )}
          {efektywneZrodlo !== 'link' && <Zachowaj pola={{ kgPostUrl: postUrl }} />}

          {efektywneZrodlo === 'link' && (
            <div>
              <label className={lab}>Link do posta / filmu</label>
              <input
                name="kgPostUrl"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://…"
                className={inp}
              />
              <p className="mt-1 text-xs text-slate-500">
                {metowa
                  ? 'Zdjęcie, nazwę konta i opis pobierzemy z samego linku. Post musi być publiczny.'
                  : 'Miniaturkę, autora i opis pobierzemy automatycznie.'}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className={lab}>Podmiana obowiązuje do</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {SZYBKIE.map((s) => (
                <button
                  key={s.godziny}
                  type="button"
                  onClick={() => setWygasa(zaGodzin(s.godziny))}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-sky-400 hover:text-sky-700"
                >
                  {s.etykieta}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setWygasa('')}
                className="rounded-full px-3 py-1 text-xs text-slate-500 hover:text-slate-800"
              >
                bezterminowo
              </button>
            </div>
            <input
              type="datetime-local"
              name="kgWygasa"
              value={wygasa}
              onChange={(e) => setWygasa(e.target.value)}
              className={inp}
            />
            <p className="mt-1 text-xs text-slate-500">
              {wygasa
                ? wygasloJuz
                  ? 'Uwaga: ta data już minęła — kafelek pokazuje zwykłe aktualności.'
                  : 'Po tej godzinie kafelek sam wróci do najnowszej aktualności.'
                : 'Puste pole = podmiana bez terminu, do ręcznego wyłączenia.'}
            </p>
          </div>

          {/* Status liczony tak samo jak na stronie — redaktor ma wiedzieć od razu,
              czy tak ustawiony kafelek w ogóle się pokaże. */}
          <div
            className={`rounded-lg border px-3 py-2 text-xs ${
              przeszkoda
                ? 'border-red-300 bg-red-50 text-red-800'
                : 'border-emerald-300 bg-emerald-50 text-emerald-800'
            }`}
          >
            <strong>{przeszkoda ? 'Kafelek się NIE pokaże. ' : 'Gotowe — kafelek się pokaże. '}</strong>
            {przeszkoda ?? 'Po zapisaniu duży kafelek pokaże wskazany post.'}
          </div>

          <details className="rounded-lg border border-slate-200 p-3">
            <summary className="cursor-pointer text-xs font-medium text-slate-600">
              Uzupełnienia ręczne (gdy platforma nie odda danych)
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className={lab}>Nazwa kanału</label>
                <input
                  name="kgRecznaNazwa"
                  defaultValue={k.recznaNazwa || ''}
                  placeholder="np. Polska Liga Żeglarska"
                  className={inp}
                />
              </div>
              <div>
                <label className={lab}>URL obrazka</label>
                <input
                  name="kgRecznyObraz"
                  value={recznyObraz}
                  onChange={(e) => setRecznyObraz(e.target.value)}
                  placeholder="https://…"
                  className={inp}
                />
              </div>
              <div>
                <label className={lab}>Opis</label>
                <textarea name="kgRecznyOpis" defaultValue={k.recznyOpis || ''} rows={2} className={inp} />
              </div>
              <p className="text-xs text-slate-500">
                Normalnie niepotrzebne — wszystko pobiera się z linku. Przydaje się, gdy post jest
                prywatny albo platforma nic nie odda: wypełnione pola mają wtedy pierwszeństwo.
                Kafelek bez żadnego obrazka nie zadziała i wróci do zwykłej aktualności.
              </p>
            </div>
          </details>
        </>
      )}
    </div>
  )
}
