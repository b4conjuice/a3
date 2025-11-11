import { BrowserRouter, Route, Routes } from 'react-router'

import HomePage from '@/frontend/routes/home'
import AssignedPage from '@/frontend/routes/assigned'
import Layout from '@/components/layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route>
            <Route path='/' element={<HomePage />} />
            <Route path='/assigned' element={<AssignedPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
