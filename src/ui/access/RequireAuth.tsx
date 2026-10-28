import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Spinner } from '../components/primitives'

/** Gate for the CRM routes. Unauthenticated users are sent to /admin to sign in. */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
