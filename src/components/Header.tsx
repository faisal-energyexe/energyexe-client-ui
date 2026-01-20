import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '../contexts/auth-context'
import { Button } from './ui/button'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
      <h1 className="text-xl font-semibold">
        <Link to="/">EnergyExe</Link>
      </h1>
      {isAuthenticated && user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {user.first_name || user.username}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-gray-700"
          >
            <LogOut size={18} />
          </Button>
        </div>
      )}
    </header>
  )
}
