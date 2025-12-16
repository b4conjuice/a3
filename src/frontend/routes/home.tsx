import { NavLink as Link } from 'react-router'
import { useLocalStorage } from '@uidotdev/usehooks'

import { api } from '@/trpc/react'
import classNames from 'classnames'

const nav = [
  {
    url: '/assigned',
    text: 'assigned',
  },
  {
    url: '/users',
    text: 'users',
  },
  {
    url: '/assignments',
    text: 'assignments',
  },
]

export default function HomePage() {
  const [cookie] = useLocalStorage('a3-cookie', '')
  const { data: account } = api.alba.getAccount.useQuery({
    cookie,
  })
  const isLoggedIn = !!account
  return (
    <>
      {isLoggedIn ? <p>welcome!</p> : <p>login to access links below</p>}
      <ul
        className={classNames(
          'divide-cb-dusty-blue divide-y',
          !isLoggedIn && 'pointer-events-none opacity-50'
        )}
      >
        {nav.map(({ url, text }) => (
          <li key={url} className='group flex items-center space-x-2'>
            <Link
              to={url}
              className='text-cb-pink hover:text-cb-pink/75 grow py-4 group-first:pt-0 group-last:pb-0'
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
