import { Link } from 'react-router-dom'
import { EmptyState } from '../components/primitives'

export function NotFoundScreen() {
  return (
    <div className="mt-8">
      <EmptyState
        title="Página no encontrada"
        description="La ruta que buscas no existe."
        action={<Link to="/" className="btn btn--primary">Ir al tablero</Link>}
      />
    </div>
  )
}
