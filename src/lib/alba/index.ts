import { JSDOM } from 'jsdom'

import fetcher from '@/lib/fetcher'
import months from '@/lib/alba/months'
import type { Territory, SimpleAddress } from '@/lib/alba/types'

interface AlbaResponse {
  data: {
    html: {
      territories: string
    }
  }
}

// const monthRegex = /\w+\s\d{1,2},\s\d{4}/
const getDateObjectFromString = (dateString: string) => {
  if (!dateString) return null
  const [monthDay, year] = dateString.split(', ')
  const [monthString, day] = monthDay?.split(' ') ?? []
  const month = months.find(m => monthString?.includes(m.name))
  return { year: Number(year), month: month?.number, day: Number(day) }
}

// const fetchAlba = async (byCity: boolean) => {
export async function fetchTerritories(cookie: string) {
  const url =
    'https://www.mcmxiv.com/alba/ts?mod=assigned&cmd=search&q=&sort=number&order=asc&av=true&so=true&tk0=true&tk1=true&tk2=true'

  const assigned = await fetcher<AlbaResponse>(url, {
    method: 'GET',
    // cors: 'no-cors',
    headers: {
      Cookie: cookie,
    },
  }).catch(err => {
    console.log(err)
    // return { err, cookie: process.env.ALBA_COOKIE }
  })
  // if (assigned.err) return { ...assigned }
  if (!assigned) return null
  const {
    data: {
      html: { territories: html },
    },
  } = assigned
  const dom = new JSDOM(
    `<!DOCTYPE html><table><tbody>${html}</tbody><table></html>`
  )

  const rows = dom.window.document.querySelectorAll('tr')
  const rowArray = Array.from(rows)
  const territoryPromises = rowArray.map(row => {
    const idElement = row.querySelector('.muted small')
    const id = idElement?.textContent
    const nameElement = row.querySelector('.territory b')
    const name = nameElement?.textContent
    // const [, description] = row
    //   ? row
    //       .querySelector('.territory')
    //       ?.textContent?.split('Assigned (no border)')
    //   : []
    const addressesElement = row.querySelector('.territory + .center .badge')
    const addresses = addressesElement
      ? parseInt(addressesElement.textContent ?? '', 10)
      : 0
    const statusElement = row.querySelector('td:nth-child(6) .badge')
    const status = statusElement?.textContent
    const signedOut = status === 'Signed-out'
    const detailsElement = row.querySelector('td:nth-child(7)')
    const person = signedOut
      ? detailsElement?.querySelector('.person')?.textContent
      : null
    const detailsElementMutedContent =
      detailsElement?.querySelector('.muted')?.textContent ?? ''

    const dateString = signedOut
      ? detailsElementMutedContent
      : // : monthRegex.test(detailsElementMutedContent)
        // ? detailsElementMutedContent.match(monthRegex)[0]
        null

    const dateObject = getDateObjectFromString(dateString ?? '')
    const date = dateObject
      ? `${dateObject.year}-${dateObject.month ?? ''}-${dateObject.day}`
      : null
    const details = signedOut
      ? `Signed-out by ${person ?? ''} on ${dateString ?? ''}`
      : detailsElementMutedContent
    const mobileLinkElement = row.querySelector('.dropdown-menu .cmd-open')
    const link = mobileLinkElement?.getAttribute('rel')
    const printElement = row.querySelector('.dropdown-menu .cmd-print')
    const print = printElement?.getAttribute('rel')

    const nameSplit = name?.split(' ') ?? []
    const letterWriting = name?.includes('LW')
    const validCampaign = name?.includes('VC-')
    const survey = name?.includes('S-')
    const number = survey
      ? name?.replace('S-', '')
      : validCampaign
        ? name?.replace('VC-', '')
        : letterWriting
          ? nameSplit.slice(1).join(' ')
          : nameSplit[nameSplit.length - 1]
    const city = validCampaign
      ? 'VC'
      : survey
        ? 'S'
        : name?.replace(` ${number ?? ''}`, '')
    // const cityId = getId(city)
    return {
      id,
      name,
      // description,
      addresses,
      status,
      out: signedOut,
      person,
      dateString,
      date,
      dateObject,
      details,
      url: link === undefined ? null : link?.includes('print-mk') ? null : link,
      print: `${
        print ?? ''
      }&address_only=0&m=1&o=1&l=1&d=1&c_n=1&c_t=1&c_l=1&c_nt=1&g=0&cl=1&clm=20&clss=1&st=1,2,3`,
      city,
      // cityId,
      number,
    }
  })
  const territories: Territory[] = territoryPromises
  // if (byCity) return groupByCity(territories)
  return territories
}

interface AddressesResponse {
  data: {
    html: {
      addresses: string
    }
  }
}

export async function fetchAddresses({
  query,
  cookie,
}: {
  query?: string
  cookie: string
}) {
  const url = `https://www.mcmxiv.com/alba/ts?mod=addresses&cmd=search&acids=2862&exp=false&npp=25&cp=1&tid=0&lid=0&display=1%2C2%2C3%2C4%2C5%2C6&onlyun=false&q=${
    query ?? ''
  }&sort=id&order=desc&lat=&lng=`

  const addressesResponse = await fetcher<AddressesResponse>(url, {
    method: 'GET',
    headers: {
      Cookie: cookie,
    },
  }).catch(err => {
    console.log(err)
  })
  if (!addressesResponse) return null
  const {
    data: {
      html: { addresses: html },
    },
  } = addressesResponse
  const dom = new JSDOM(
    `<!DOCTYPE html><table><tbody>${html}</tbody><table></html>`
  )
  const rows = dom.window.document.querySelectorAll('tr')
  const rowArray = Array.from(rows)
  const addresses: SimpleAddress[] = rowArray.map(row => {
    const idElement = row.querySelector('.muted small')
    const id = idElement?.textContent
    const personElement = row.querySelector('.person')
    const nameElement = personElement?.querySelector('b')
    const name = nameElement?.textContent
    nameElement?.remove()
    personElement?.querySelector('.badge')?.remove()
    personElement?.querySelector('div')?.remove()
    const address = personElement?.textContent?.replace(name ?? '', '')
    return {
      id,
      name,
      address,
    }
  })

  return addresses
}

import type { Address } from '@/lib/alba/types'
import { format } from 'date-fns'

const dateRegex = /[0-9]{1,2}[/,.,-][0-9]{1,2}[/,.-][0-9]{2,4}/g

interface TerritoryResponse {
  data: { html: string }
}

interface AddressList {
  dates?: string[]
  name?: string | undefined
  notes?: string
  addressesCount?: number
  addressesLeft?: number
  valid?: number
  new?: number
  doNotCall?: number
  addresses?: Address[]
  error?: string
}

export const getAddressList = async (
  addressListId: string
): Promise<AddressList> => {
  const url = `https://www.mcmxiv.com/alba/mobile/ts?territory=${addressListId}`

  const territory = await fetcher<TerritoryResponse>(url)

  const { data } = territory

  if (!data)
    return {
      error: 'territory does not exist',
    }

  const { html } = data

  const dom = new JSDOM(
    `<!DOCTYPE html><table><tbody>${html}</tbody><table></html>`
  )

  const territoryElement = dom.window.document.querySelector('#territory')
  if (typeof territoryElement === null)
    return {
      error: 'territory does not exist',
    }
  const name = territoryElement?.textContent?.trim()

  const addresses: Array<Address> = []
  const addressElements = dom.window.document.querySelectorAll(
    '#addresses tr:not(.alls)'
  )

  Array.prototype.forEach.call(addressElements, (addressElement: Element) => {
    const labels = addressElement.querySelectorAll('.label')
    const rounds = Array.prototype.reduce.call(
      labels,
      (count: unknown, label: Element) =>
        label.textContent?.includes('Contact')
          ? count
          : typeof count === 'number'
            ? count + 1
            : 0,
      0
    )
    const check = addressElement.querySelectorAll('.label-success').length > 0

    const status = addressElement?.querySelector('.badge')?.textContent ?? null
    const who = addressElement?.querySelector('.who')?.textContent ?? null
    const addressText =
      addressElement
        ?.querySelector('.where')
        ?.childNodes[0]?.nodeValue?.trim() ?? ''
    const addressSplit = addressText.split(', ')
    const suite = addressSplit?.length === 3 ? addressSplit[0] : null
    const streetAddress =
      addressSplit?.length === 3
        ? addressSplit[1]
        : addressSplit?.length > 0
          ? addressSplit[0]
          : null
    const city = addressSplit?.length === 3 ? addressSplit[2] : addressSplit[1]
    const address = {
      streetAddress,
      suite,
      city,
    }

    const notes =
      addressElement
        ?.querySelector('.where .muted')
        ?.textContent?.replace(/“|”/g, '')
        ?.trim() ?? ''
    const visits = Array.prototype.filter
      .call(labels, (label: Element) => !label.textContent?.includes('Contact'))
      .map((label: Element) => ({
        check: label.className.includes('label-success'),
        date: label.textContent?.trim(),
      }))
    const uniqueVisits = Array.from(new Set(visits.map(v => v.date))).map(
      date => {
        return visits.find(v => v.date === date)
      }
    )

    const phoneElement = addressElement.querySelector('.cmd-call')
    const phone = phoneElement
      ? phoneElement.textContent?.replace('Call ', '').trim()
      : null
    const phoneLink = phoneElement ? phoneElement.getAttribute('rel') : null

    const directionsElement = addressElement.querySelector('.cmd-directions')
    const latLng = directionsElement?.getAttribute('rel')
      ? (directionsElement.getAttribute('rel')?.split(' ') ?? [null, null])
      : [null, null]
    const [lat, lng] = latLng

    addresses.push({
      id: addressElement.id,
      rounds,
      check,
      status,
      name: who,
      addressText,
      address,
      notes,
      visits: uniqueVisits,
      phone,
      phoneLink,
      lat,
      lng,
    })
  })
  const addressesLeft = addresses.filter(
    a => !(a.check || a.visits.length > 2)
  ).length
  const notesElement = dom.window.document.querySelector('#territory_notes')
  const notes = notesElement?.textContent?.trim() ?? ''
  const fullNotes = addresses.reduce(
    (prev, curr) => prev + (curr.notes || ''),
    notes
  )
  const dates = [...new Set(fullNotes.match(dateRegex))]
  return {
    dates,
    name,
    notes,
    addressesCount: addresses.length,
    addressesLeft,
    valid: addresses.filter(a => a.status === 'Valid').length,
    new: addresses.filter(a => a.status === 'New').length,
    doNotCall: addresses.filter(a => a.status === 'Do Not Call').length,
    addresses,
  }
}

type Props = {
  userId?: number
  date?: string
  cmd: string
  territory: string
  cookie: string
}

export async function updateAlba(props: Props) {
  const { userId, date, cmd, territory, cookie } = props
  const url = `https://www.mcmxiv.com/alba/ts?mod=assigned&cmd=${cmd}&id=${territory}&date=${
    date ?? format(new Date(), 'yyyy-MM-dd')
  }&user=${userId ?? ''}${cmd === 'completed' ? '&ac=false' : ''}`
  const response = await fetcher(url, {
    method: 'GET',
    // cors: 'no-cors',
    headers: {
      Cookie: cookie,
    },
  })
  return response
}

export async function fetchAccount({ cookie }: { cookie: string }) {
  const url = 'https://www.mcmxiv.com/alba/ts?mod=account&cmd=search'
  const response = await fetcher<{
    data: {
      locations: Record<
        string,
        {
          na: string
        }
      >
    }
  }>(url, {
    method: 'GET',
    headers: {
      Cookie: cookie,
    },
  })
  const { data } = response
  if (!data) return null
  const { locations } = data
  const locationsEntries = Object.entries(locations)
  const account = locationsEntries[0]
  if (!account) return null
  const [accountId, accountInfo] = account
  return {
    id: accountId,
    name: accountInfo.na,
  }
}

export async function fetchUsers({ cookie }: { cookie: string }) {
  const url =
    'https://www.mcmxiv.com/alba/ts?mod=users&cmd=usersSearch&q=&sort=user_name&order=asc'
  const response = await fetcher<{
    data: {
      html: {
        users: string
      }
    }
  }>(url, {
    method: 'GET',
    headers: {
      Cookie: cookie,
    },
  })
  const { data } = response
  if (!data) return null
  const {
    html: { users },
  } = data
  const dom = new JSDOM(
    `<!DOCTYPE html><table><tbody>${users}</tbody><table></html>`
  )
  const rows = dom.window.document.querySelectorAll('tr')
  const rowArray = Array.from(rows)
  return rowArray.map(row => {
    const idElement = row.querySelector('.muted small')
    const id = idElement?.textContent
    const nameElement = row.querySelector('td:nth-child(3)')
    const name = nameElement?.textContent
    return {
      id,
      name,
    }
  })
}
