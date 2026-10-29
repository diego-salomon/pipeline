import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './ui/components/Layout'
import { RequireAuth } from './ui/access/RequireAuth'
import { BoardScreen } from './ui/screens/BoardScreen'
import { NewLeadScreen } from './ui/screens/NewLeadScreen'
import { LeadDetailScreen } from './ui/screens/LeadDetailScreen'
import { AdminScreen } from './ui/screens/AdminScreen'
import { BusinessScreen } from './ui/screens/BusinessScreen'
import { NotFoundScreen } from './ui/screens/NotFoundScreen'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public — no gate.
      { path: '/empresa', element: <BusinessScreen /> },
      // Account / sign-in surface.
      { path: '/admin', element: <AdminScreen /> },
      // Gated CRM routes.
      {
        element: <RequireAuth />,
        children: [
          { index: true, element: <BoardScreen /> },
          { path: 'leads/new', element: <NewLeadScreen /> },
          { path: 'leads/:id', element: <LeadDetailScreen /> },
        ],
      },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, '') })

export function App() {
  return <RouterProvider router={router} />
}
