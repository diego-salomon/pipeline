import { Link } from 'react-router-dom'
import { EmptyState } from '../components/primitives'

export function NotFoundScreen() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <EmptyState
        title="Página no encontrada"
        description="La ruta que buscas no existe."
        action={<Link to="/" className="btn btn--primary">Ir al tablero</Link>}
      />
    </div>
  )
}
