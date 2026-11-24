import { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { CajeroDashboard } from './components/CajeroDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'cajero' | null>(null);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleLogin = (role: 'admin' | 'cajero', user: string, image: string | null) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUsername(user);
    setProfileImage(image);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername('');
    setProfileImage(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard username={username} initialProfileImage={profileImage} onLogout={handleLogout} />;
  }

  if (userRole === 'cajero') {
    return <CajeroDashboard username={username} initialProfileImage={profileImage} onLogout={handleLogout} />;
  }

  return null;
}
