import type { NextConfig } from 'next'
import { przekierowaniaNewsow } from './redirects-newsy'
import { klubyNaKlub, klubyNaListe, regatyNaListe, zawodnicyNaListe } from './redirects-stare'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Stare adresy newsow: /nazwa-newsa -> /posts/nazwa-newsa (301).
  // Musza byc PRZED regula IE, ktora lapie wszystkie sciezki.
  const newsy = przekierowaniaNewsow.map((slug) => ({
    source: `/${slug}`,
    destination: `/posts/${slug}`,
    permanent: true,
  }))

  // Stare profile z WordPressa: warianty klubow do klubu-matki, reszta na listy.
  const profile = [
    ...Object.entries(klubyNaKlub).map(([stary, nowy]) => ({
      source: `/kluby/${stary}`,
      destination: `/kluby/${nowy}`,
      permanent: true,
    })),
    ...klubyNaListe.map((s) => ({ source: `/kluby/${s}`, destination: '/kluby', permanent: true })),
    ...regatyNaListe.map((s) => ({ source: `/regaty/${s}`, destination: '/regaty', permanent: true })),
    ...zawodnicyNaListe.map((s) => ({
      source: `/zawodnicy/${s}`,
      destination: '/zawodnicy',
      permanent: true,
    })),
  ]

  return [...newsy, ...profile, internetExplorerRedirect]
}
