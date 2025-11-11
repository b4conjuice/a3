import { useState } from 'react'
import { NavLink as Link } from 'react-router'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Title } from '@/components/ui'
import Modal from '@/components/modal'
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
]

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [cookie, setCookie] = useLocalStorage('a3-cookie', '')
  const { data: account } = api.alba.getAccount.useQuery({
    cookie,
  })
  const isLoggedIn = !!account
  return (
    <>
      <div className='flex justify-between'>
        <Title>a3</Title>
        <button
          type='button'
          className='text-cb-yellow hover:text-cb-yellow/75'
          onClick={() => {
            setIsLoginModalOpen(true)
          }}
        >
          {isLoggedIn ? account?.name : 'login'}
        </button>
      </div>
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
      <Modal
        isOpen={isLoginModalOpen}
        setIsOpen={setIsLoginModalOpen}
        title='login'
      >
        <p>open dev tools. in console tab, paste:</p>
        <p>
          <code>console.log(document.cookie)</code>
        </p>
        <p>press enter, copy cookie text, and paste below</p>
        <textarea
          value={cookie}
          onChange={e => {
            setCookie(e.target.value)
          }}
          className='border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue h-full w-full grow focus:ring-0'
        />
        {!cookie ? (
          <p>enter cookie above</p>
        ) : cookie && !isLoggedIn ? (
          <p>
            cookie is <span className='text-red-500'>invalid</span>
          </p>
        ) : (
          <p>
            cookie is <span className='text-green-500'>valid</span>
          </p>
        )}
      </Modal>
    </>
  )
}
