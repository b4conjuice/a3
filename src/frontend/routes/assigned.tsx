import { useLocalStorage } from '@uidotdev/usehooks'

import { api } from '@/trpc/react'

export default function AssignedPage() {
  const [cookie] = useLocalStorage('a3-cookie', '')
  const { data: territories, isLoading } = api.alba.getTerritories.useQuery({
    cookie,
  })
  console.log({ territories })
  return (
    <>
      <h1>assigned</h1>
    </>
  )
}
