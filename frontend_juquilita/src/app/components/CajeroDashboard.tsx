import { useState } from 'react';
import { ShoppingCart, DollarSign, RefreshCcw, LogOut, User } from 'lucide-react';
import { RegistroVentas } from './RegistroVentas';
import { VentasDia } from './VentasDia';
import { Devoluciones } from './Devoluciones';
import { ClientesManager } from './ClientesManager';

interface CajeroDashboardProps {
  username: string;
  onLogout: () => void;
}

export function CajeroDashboard({ username, onLogout }: CajeroDashboardProps) {
  const [activeSection, setActiveSection] = useState<
  'ventas' | 'ventasdia' | 'devoluciones' | 'clientes'
>('ventas');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // TODO: Subir a servidor y guardar en MySQL
        // UPDATE usuarios SET foto_perfil = ? WHERE username = ?
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: '#FF8C42' }}>Juquilita</h1>
          <p className="text-sm text-gray-600">Panel de Cajero</p>
        </div>

        {/* Foto de perfil */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{ borderColor: '#FFD166', backgroundColor: '#FFF8F0' }}
            >
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16" style={{ color: '#FFD166' }} />
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              style={{ backgroundColor: '#FFD166' }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-gray-800 text-xl">+</span>
            </label>
          </div>
          <p className="text-center font-medium">{username}</p>
          <p className="text-center text-sm text-gray-600">Cajero</p>
        </div>

        {/* Menu */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveSection('ventas')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'ventas' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'ventas' ? { backgroundColor: '#FFD166', color: '#1a1a1a' } : {}}
          >
            <ShoppingCart className="w-5 h-5" />
            Registrar Ventas
          </button>

          <button
            onClick={() => setActiveSection('ventasdia')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'ventasdia' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'ventasdia' ? { backgroundColor: '#FFD166', color: '#1a1a1a' } : {}}
          >
            <DollarSign className="w-5 h-5" />
            Ventas del Día
          </button>

          <button
            onClick={() => setActiveSection('devoluciones')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'devoluciones' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'devoluciones' ? { backgroundColor: '#FFD166', color: '#1a1a1a' } : {}}
          >
            <RefreshCcw className="w-5 h-5" />
            Devoluciones/Cambios
          </button>
          <button
  onClick={() => setActiveSection('clientes')}
  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
    activeSection === 'clientes' ? 'shadow-md' : 'hover:bg-gray-50'
  }`}
  style={
    activeSection === 'clientes'
      ? { backgroundColor: '#FFD166', color: '#1a1a1a' }
      : {}
  }
>
  <User className="w-5 h-5" />
  Clientes
</button>



        </nav>

        <button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all hover:bg-red-50"
          style={{ borderColor: '#FFD166', color: '#FF8C42' }}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        {activeSection === 'ventas' && <RegistroVentas username={username} />}
        {activeSection === 'ventasdia' && <VentasDia />}
        {activeSection === 'devoluciones' && <Devoluciones />}
        {activeSection === 'clientes' && <ClientesManager />}
      </div>
    </div>
  );
}
