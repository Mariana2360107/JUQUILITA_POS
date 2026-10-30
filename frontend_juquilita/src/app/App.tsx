import { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { CajeroDashboard } from './components/CajeroDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'cajero' | null>(null);
  const [username, setUsername] = useState('');

  const handleLogin = (role: 'admin' | 'cajero', user: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername('');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard username={username} onLogout={handleLogout} />;
  }

  if (userRole === 'cajero') {
    return <CajeroDashboard username={username} onLogout={handleLogout} />;
  }

  return null;
}