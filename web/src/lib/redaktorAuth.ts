// Uwierzytelnianie dla panelu redaktora (na bazie sesji Payload).
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config })
    const hdrs = await nextHeaders()
    const { user } = await payload.auth({ headers: hdrs })
    return user || null
  } catch {
    return null
  }
}

// Wymusza zalogowanie — w przeciwnym razie przekierowuje na logowanie panelu.
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/redaktor/login')
  return user
}
