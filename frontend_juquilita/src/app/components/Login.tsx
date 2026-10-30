import { useState } from 'react';
import { LogIn, User, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'cajero', username: string) => void;}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'cajero' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
try {const formData = new FormData();

  formData.append('usuario', username);
  formData.append('password', password);
  formData.append(
    'rol',
    selectedRole === 'admin'
      ? 'ADMINISTRADOR'
      : 'CAJERO');

  // Ejemplo en tu Login.tsx despues de configurar el proxy en vite.config.ts
const response = await fetch('/api/login.php', {
  method: 'POST',
  body: formData,
});

  const data = await response.json();
  if (data.success) {
    onLogin(
  selectedRole!,
  data.nombre);
  } else {
    setError(data.message);}
} catch (error) {
  setError('Error de conexión con el servidor');} };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] to-[#FFE0B2] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-2" style={{ color: '#FF8C42' }}>Juquilita</h1>
            <p className="text-gray-600">Sistema de Punto de Ventas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl mb-6 text-center text-gray-800">Seleccione su rol</h2>

            <div className="space-y-4">
              <button
                onClick={() => setSelectedRole('admin')}
                className="w-full p-6 rounded-xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: '#FF8C42',
                  backgroundColor: '#FFF8F0'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#FF8C42' }}>
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl mb-1" style={{ color: '#FF8C42' }}>Administrador</h3>
                    <p className="text-sm text-gray-600">Acceso completo al sistema</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('cajero')}
                className="w-full p-6 rounded-xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: '#FFD166',
                  backgroundColor: '#FFFBF5'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#FFD166' }}>
                    <User className="w-8 h-8 text-gray-800" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl mb-1" style={{ color: '#FF8C42' }}>Cajero</h3>
                    <p className="text-sm text-gray-600">Registro de ventas</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] to-[#FFE0B2] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ color: '#FF8C42' }}>Juquilita</h1>
          <p className="text-gray-600">Iniciar sesión como {selectedRole === 'admin' ? 'Administrador' : 'Cajero'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#FFE0B2',
                  backgroundColor: '#FFFBF5'
                }}
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#FFE0B2',
                  backgroundColor: '#FFFBF5'
                }}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: '#FF8C42' }}
            >
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole(null);
                setUsername('');
                setPassword('');
                setError('');
              }}
              className="w-full py-3 rounded-lg border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: '#FFE0B2' }}
            >
              Cambiar Rol
            </button>
          </form>

          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
            <p className="text-xs text-gray-600 text-center">
              Sistema POS Juquilita © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
