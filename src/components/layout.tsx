import { Main } from '@/components/ui'
import Header from '@/components/header'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <Main className='flex flex-col p-4'>
        <div className='flex grow flex-col space-y-4'>{children}</div>
      </Main>
    </>
  )
}
