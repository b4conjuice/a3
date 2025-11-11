import { useState } from 'react'
import { NavLink as Link, useLocation } from 'react-router'
import { useLocalStorage } from '@uidotdev/usehooks'

import { Title } from '@/components/ui'
import Modal from '@/components/modal'
import { api } from '@/trpc/react'

const title = 'a3'

export default function Header() {
  const location = useLocation()
  const pathname = location.pathname

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [cookie, setCookie] = useLocalStorage('a3-cookie', '')
  const { data: account } = api.alba.getAccount.useQuery({
    cookie,
  })
  const isLoggedIn = !!account
  return (
    <>
      <header className='flex justify-between px-4 pt-4'>
        {pathname === '' ? (
          <Title>{title}</Title>
        ) : (
          <Link to='/' className='hover:text-cb-pink'>
            <Title>{title}</Title>
          </Link>
        )}
        <button
          type='button'
          className='text-cb-yellow hover:text-cb-yellow/75'
          onClick={() => {
            setIsLoginModalOpen(true)
          }}
        >
          {isLoggedIn ? account?.name : 'login'}
        </button>
      </header>
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
