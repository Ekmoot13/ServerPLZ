// Stary adres — kalendarz jest teraz pod /kalendarz.
import { redirect } from 'next/navigation'

export default function KalendariumRedirect() {
  redirect('/kalendarz')
}
