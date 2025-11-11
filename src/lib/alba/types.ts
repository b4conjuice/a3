export interface Territory {
  addresses: number
  city?: string
  date?: string | null
  dateObject: {
    year: number
    month?: number
    day: number
  } | null
  dateString?: string | null
  // description?: string
  // description: any
  details?: string | null
  id?: string | null
  name?: string | null
  number?: string | null
  out: boolean
  person?: string | null
  print: string
  status?: string | null
  url: string | null
  prevId?: string | null
  nextId?: string | null
  assignments?: Assignment[]
}

export interface SimpleAddress {
  id: string | null | undefined
  name: string | null | undefined
  address: string | null | undefined
}

export interface Address {
  id: string
  rounds: unknown
  check: boolean
  status: string | null
  name: string | null
  addressText: string
  address: {
    streetAddress: string | null | undefined
    suite: string | null | undefined
    city: string | undefined
  }
  notes: string
  visits: Array<
    | {
        check: boolean
        date: string | undefined
      }
    | undefined
  >
  phone: string | null | undefined
  phoneLink: string | null
  lat: string | null | undefined
  lng: string | null | undefined
}

export type Assignment = {
  id: number
  territoryId: string
  name: string
  date: Date
  out: boolean
}

export type Account = {
  id: string
  name: string
}
