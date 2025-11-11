import { useSearchParams, useNavigate, NavLink as Link } from 'react-router'
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useDebounce, useLocalStorage } from '@uidotdev/usehooks'

import Layout from '@/components/layout'
import LoadingIcon from '@/components/ui/loading-icon'
import TerritoryListItem from '@/components/territory-list-item'
import { api } from '@/trpc/react'
import { useState } from 'react'

export default function AssignedPage() {
  const [cookie] = useLocalStorage('a3-cookie', '')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')
  const [search, setSearch] = useState(q ?? '')

  const debouncedSearchTerm = useDebounce(search, 1000)
  const { data: territories, isLoading } = api.alba.getTerritories.useQuery({
    cookie,
    search: debouncedSearchTerm,
  })
  return (
    <>
      <Layout>
        <div className='flex'>
          <input
            type='text'
            className='bg-cb-blue w-full'
            placeholder='search'
            value={search}
            onChange={async e => {
              const { value } = e.target
              setSearch(value)
              await navigate(`/assigned${value ? '?q=' + value : ''}`)
            }}
            // list='datalist-assignedQueries' // TODO: add back
          />
          {search !== '' && (
            <button
              type='button'
              disabled={search === ''}
              onClick={() => setSearch('')}
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          )}
        </div>
        {isLoading ? (
          <LoadingIcon className='animate-spin-slow h-16 w-16 text-blue-700 dark:text-blue-200' />
        ) : territories?.length && territories.length > 0 ? (
          <ul className='divide-cb-dusty-blue divide-y'>
            {territories.map(territory => (
              <TerritoryListItem key={territory.id} territory={territory} />
            ))}
          </ul>
        ) : (
          <p>no results</p>
        )}

        {/* <datalist id='datalist-assignedQueries'> // TODO: store assignedQueries in localStorage
          {Object.entries(assignedQueries).map(([assignedQuery, name]) => (
            <option key={assignedQuery} value={assignedQuery}>
              {name}
            </option>
          ))}
        </datalist> */}
      </Layout>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-4'>
        <div className='flex space-x-4'>
          <Link to='/' className='text-cb-yellow hover:text-cb-yellow/75'>
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
