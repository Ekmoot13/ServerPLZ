// Strefa Kibica jest teraz stroną główną (/). Ten adres przekierowuje na /.
import { redirect } from 'next/navigation'

export default function StrefaKibicaRedirect() {
  redirect('/regatowastrefakibica')
}
