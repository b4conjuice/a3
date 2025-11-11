import { Outlet } from 'react-router'

import LayoutComponent from '@/components/layout'

export default function Layout() {
  return (
    <LayoutComponent>
      <Outlet />
    </LayoutComponent>
  )
}
