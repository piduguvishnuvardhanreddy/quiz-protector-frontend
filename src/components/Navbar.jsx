import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  // Determine logo link based on user role
  const logoLink = user 
    ? (user.role === 'admin' ? '/admin' : '/dashboard')
    : '/';
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container flex h-14 items-center justify-between">
        <Link to={logoLink} className="font-semibold text-brand-700">QuizProctor</Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">{user.name} · {user.role}</span>
              <button onClick={logout} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register/student" className="btn btn-secondary">Register</Link>
              <Link to="/login/admin" className="btn btn-secondary">Admin Login</Link>
              <Link to="/login/student" className="btn btn-primary">Student Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
