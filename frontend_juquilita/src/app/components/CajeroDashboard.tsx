import { useState } from 'react';
import { ShoppingCart, DollarSign, RefreshCcw, LogOut, User, ArrowRightLeft } from 'lucide-react';
import { RegistroVentas } from './RegistroVentas';
import { VentasDia } from './VentasDia';
import { Devoluciones } from './Devoluciones';
import { ClientesManager } from './ClientesManager';

interface CajeroDashboardProps {
  username: string;
  initialProfileImage: string | null;
  onLogout: () => void;
}

const profileOptions = Array.from({ length: 5 }, (_, index) => `/img/perfil${index + 1}.jpg`);

export function CajeroDashboard({ username, initialProfileImage, onLogout }: CajeroDashboardProps) {
  const [activeSection, setActiveSection] = useState<
  'ventas' | 'ventasdia' | 'devoluciones' | 'clientes'
>('ventas');
  const [profileImage, setProfileImage] = useState<string | null>(
    initialProfileImage ? `/${initialProfileImage}` : null
  );
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

  const handleProfileChange = async (imageUrl: string) => {
    const formData = new FormData();
    formData.append('foto', imageUrl.split('/').pop() ?? '');
    formData.append('username', username);
    const response = await fetch('/api/subir_foto.php', { method: 'POST', body: formData });
    const data = await response.json();
    if (data.success) {
      setProfileImage(imageUrl);
      setIsProfileSelectorOpen(false);
    } else {
      alert(data.error ?? 'Error al cambiar foto');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: '#b08b05' }}>Juquilita</h1>
          <p className="text-sm text-gray-600">Panel de Cajero</p>
        </div>

        {/* Foto de perfil */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{ borderColor: '#c79950', backgroundColor: '#FFF8F0' }}
            >
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16" style={{ color: '#c79950' }} />
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsProfileSelectorOpen(true)}
              aria-label="Cambiar foto de perfil"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              style={{ backgroundColor: '#c79950' }}
            >
              <ArrowRightLeft className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          <p className="text-center font-medium">{username}</p>
          <p className="text-center text-sm text-gray-600">Cajero</p>
        </div>

        {isProfileSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Selecciona tu foto de perfil</h2>
                <button type="button" onClick={() => setIsProfileSelectorOpen(false)} className="text-2xl text-gray-500">×</button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {profileOptions.map((imageUrl) => (
                  <button key={imageUrl} type="button" onClick={() => handleProfileChange(imageUrl)} className="overflow-hidden rounded-xl border-2 border-transparent hover:border-[#c79950]">
                    <img src={imageUrl} alt="Opción de perfil" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveSection('ventas')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'ventas' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'ventas' ? { backgroundColor: '#c79950', color: '#1a1a1a' } : {}}
          >
            <ShoppingCart className="w-5 h-5" />
            Registrar Ventas
          </button>

          <button
            onClick={() => setActiveSection('ventasdia')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'ventasdia' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'ventasdia' ? { backgroundColor: '#c79950', color: '#1a1a1a' } : {}}
          >
            <DollarSign className="w-5 h-5" />
            Ventas del Día
          </button>

          <button
            onClick={() => setActiveSection('devoluciones')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'devoluciones' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'devoluciones' ? { backgroundColor: '#c79950', color: '#1a1a1a' } : {}}
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
      ? { backgroundColor: '#c79950', color: '#1a1a1a' }
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
          style={{ borderColor: '#c79950', color: '#b08b05' }}
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
