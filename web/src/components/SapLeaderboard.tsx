import React from 'react'
import { pobierzWyniki } from '@/lib/sap'
import TabelaWynikow from './TabelaWynikow'

/**
 * Serwerowa otoczka tabeli wyników: pobiera pierwszy komplet danych, żeby
 * tabela była w HTML-u od razu, a dalsze odświeżanie bierze na siebie
 * komponent kliencki.
 */
export default async function SapLeaderboard({ name, base }: { name: string; base?: string }) {
  const dane = await pobierzWyniki(name, base).catch(() => null)
  return <TabelaWynikow poczatkowe={dane} />
}
