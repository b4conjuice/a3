import { NavLink as Link } from 'react-router'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { useLocalStorage } from '@uidotdev/usehooks'

import Layout from '@/components/layout'
import LoadingIcon from '@/components/ui/loading-icon'
import { api } from '@/trpc/react'

export default function UsersPage() {
  const [cookie] = useLocalStorage('a3-cookie', '')
  const { data: users, isLoading } = api.alba.getUsers.useQuery({
    cookie,
  })
  return (
    <>
      <Layout>
        {isLoading ? (
          <LoadingIcon className='animate-spin-slow h-16 w-16 text-blue-700 dark:text-blue-200' />
        ) : users?.length && users.length > 0 ? (
          <ul className='divide-cb-dusty-blue divide-y'>
            {users.map(user => (
              <li key={user.id} className='py-4 first:pt-0'>
                {user.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>no results</p>
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
