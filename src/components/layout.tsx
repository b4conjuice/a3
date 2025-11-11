import { Outlet } from 'react-router'

import { Main } from '@/components/ui'

export default function Layout() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex grow flex-col space-y-4'>
        <Outlet />
      </div>
    </Main>
  )
}
