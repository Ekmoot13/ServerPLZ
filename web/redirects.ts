import type { NextConfig } from 'next'
import { przekierowaniaNewsow } from './redirects-newsy'

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

  return [...newsy, internetExplorerRedirect]
}
