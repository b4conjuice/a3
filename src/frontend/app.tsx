import { BrowserRouter, Route, Routes } from 'react-router'

import HomePage from '@/frontend/routes/home'
import AssignedPage from '@/frontend/routes/assigned'
import UsersPage from '@/frontend/routes/users'
import TerritoryPage from '@/frontend/routes/territory'
import AssignmentsPage from '@/frontend/routes/assignments'
import Layout from '@/frontend/layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route>
            <Route path='/' element={<HomePage />} />
          </Route>
        </Route>
        <Route path='/assigned' element={<AssignedPage />} />
        <Route path='/territories/:id' element={<TerritoryPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/assignments' element={<AssignmentsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
