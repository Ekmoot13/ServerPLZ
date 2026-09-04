import React from 'react'
import TerminForm from '../TerminForm'
import { createTermin } from '../../../actions'

export const dynamic = 'force-dynamic'

export default function NowyTerminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nowy termin</h1>
      <TerminForm
        action={createTermin}
        initial={{
          nazwa: '',
          poziom: '',
          miejsce: '',
          dataOd: '',
          dataDo: '',
          link: '',
          autoStatus: true,
          statusReczny: 'zaplanowane',
          kolejnosc: '',
        }}
      />
    </div>
  )
}
