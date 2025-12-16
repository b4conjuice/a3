import { useState } from 'react'
import { useSearchParams, useNavigate, NavLink as Link } from 'react-router'
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
// import { useDebounce } from '@uidotdev/usehooks'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Main } from '@/components/ui'
import LoadingIcon from '@/components/ui/loading-icon'
import { api } from '@/trpc/react'
// import Modal from '@/components/modal'
// import Button from '@/components/ui/button'
// import users from '@/config/users'
import TerritoryListItem from '@/components/territory-list-item'
import Layout from '@/components/layout'

export default function AssignmentsPage() {
  const [cookie] = useLocalStorage('a3-cookie', '')
  // const [searchParams] = useSearchParams()
  // const q = searchParams.get('q')
  // const [search, setSearch] = useState(q ?? '')

  // const debouncedSearchTerm = useDebounce(search, 1000)
  // const searchQuery = search ? { search: debouncedSearchTerm } : null
  // const { data: territories, isLoading } =
  //   api.alba.getTerritories.useQuery(searchQuery)
  // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [user, setUser] = useState('')
  const assignmentQuery = {
    name: user ?? '',
    // limit: 25,
    limit: 200,
    out: true,
  }
  const { data: assignments } = api.assignments.search.useQuery(assignmentQuery)
  const { data: allTerritories } = api.alba.getTerritories.useQuery({
    cookie,
  })
  // const utils = api.useUtils()
  // const { mutate: deleteAssignment, isPending: isDeleting } =
  //   api.assignments.delete.useMutation({
  //     onSuccess: () => {
  //       void utils.assignments.getAll.invalidate()
  //     },
  //   })
  return (
    <>
      <Layout>
        {/* <div className='flex'>
            <input
              type='text'
              className='bg-cb-blue w-full'
              placeholder='search'
              value={search}
              onChange={async e => {
                const { value } = e.target
                setSearch(value)
                await navigate(`/assignments${value ? '?q=' + value : ''}`)
              }}
              list='datalist-assignedQueries'
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
          <div>
            <select
              className='bg-cb-blue w-full border'
              name='name'
              value={user}
              onChange={e => {
                setUser(e.target.value)
              }}
            >
              <option value=''>Select brother</option>
              {users.map(user => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div> */}
        {assignments && assignments.length > 0 ? (
          <ul className='divide-cb-dusty-blue divide-y'>
            {assignments.map(assignment => {
              const { territoryId } = assignment
              const territory = allTerritories?.find(t => t.id === territoryId)
              if (!territory) return null
              return (
                <TerritoryListItem key={assignment.id} territory={territory} />
              )
            })}
          </ul>
        ) : (
          <LoadingIcon className='animate-spin-slow h-16 w-16 text-blue-700 dark:text-blue-200' />
        )}
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
