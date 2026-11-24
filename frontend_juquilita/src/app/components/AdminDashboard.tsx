import { useState } from 'react';
import { Package, TrendingUp, Users, LogOut, User, RefreshCcw, ArrowRightLeft, ClipboardList } from 'lucide-react';
import { InventarioManager } from './InventarioManager';
import { AbastecimientoManager } from './AbastecimientoManager';
import { ReportesVentas } from './ReportesVentas';
import { AdminCajeros } from './AdminCajeros';
import { RegistroVentas } from './RegistroVentas';
import { ClientesManager } from './ClientesManager';
import { Devoluciones } from './Devoluciones';

interface AdminDashboardProps {
  username: string;
  initialProfileImage: string | null;
  onLogout: () => void;
}


const profileOptions = Array.from({ length: 5 }, (_, index) => `/img/perfil${index + 1}.jpg`);

export function AdminDashboard({ username, initialProfileImage, onLogout }: AdminDashboardProps) {
 const [activeSection, setActiveSection] = useState<
  | 'inventario'
  | 'abastecimiento'
  | 'reportes'
  | 'cajeros'
  | 'ventas'
  | 'clientes'
  | 'devoluciones'
>('inventario');

  const [profileImage, setProfileImage] = useState<string | null>(
    initialProfileImage ? `/${initialProfileImage}` : null
  );
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

  const handleProfileChange = async (imageUrl: string) => {
    const foto = imageUrl.split('/').pop();
    const formData = new FormData();
    formData.append('foto', foto ?? '');
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
          <h1 className="text-3xl mb-2" style={{ color: '#4f2c17' }}>Juquilita</h1>
          <p className="text-sm text-gray-600">Panel de Administrador</p>
        </div>

        {/* Foto de perfil */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{ borderColor: '#b08b05', backgroundColor: '#FFF8F0' }}
            >
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="w-full h-full object-cover"/>
              ) : (
                <User className="w-16 h-16" style={{ color: '#b08b05' }} />
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsProfileSelectorOpen(true)}
              aria-label="Cambiar foto de perfil"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              style={{ backgroundColor: '#b08b05' }}
            >
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-center font-medium">{username}</p>
          <p className="text-center text-sm text-gray-600">Administrador</p>
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
                  <button key={imageUrl} type="button" onClick={() => handleProfileChange(imageUrl)} className="overflow-hidden rounded-xl border-2 border-transparent hover:border-[#b08b05]">
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
            onClick={() => setActiveSection('inventario')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'inventario' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'inventario' ? { backgroundColor: '#b08b05', color: 'white' } : {}}
          >
            <Package className="w-5 h-5" />
            Inventario
          </button>

          <button
  onClick={() => setActiveSection('abastecimiento')}
  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
    activeSection === 'abastecimiento'
      ? 'shadow-md'
      : 'hover:bg-gray-50'
  }`}
  style={
    activeSection === 'abastecimiento'
      ? { backgroundColor: '#b08b05', color: 'white' }
      : {}
  }
>
  <ClipboardList className="w-5 h-5" />
  Abastecimiento
</button>

<button
  onClick={() => setActiveSection('ventas')}
  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
    activeSection === 'ventas'
      ? 'shadow-md'
      : 'hover:bg-gray-50'
  }`}
  style={
    activeSection === 'ventas'
      ? { backgroundColor: '#b08b05', color: 'white' }
      : {}
  }
>
  <TrendingUp className="w-5 h-5" />
  Registrar Ventas
</button>

<button
  onClick={() => setActiveSection('clientes')}
  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
    activeSection === 'clientes'
      ? 'shadow-md'
      : 'hover:bg-gray-50'
  }`}
  style={
    activeSection === 'clientes'
      ? { backgroundColor: '#b08b05', color: 'white' }
      : {}
  }
>
  <Users className="w-5 h-5" />
  Clientes
</button>

<button
  onClick={() => setActiveSection('devoluciones')}
  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
    activeSection === 'devoluciones'
      ? 'shadow-md'
      : 'hover:bg-gray-50'
  }`}
  style={
    activeSection === 'devoluciones'
      ? { backgroundColor: '#b08b05', color: 'white' }
      : {}
  }
>
  <RefreshCcw className="w-5 h-5" />
  Devoluciones
</button>

          <button
            onClick={() => setActiveSection('reportes')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'reportes' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'reportes' ? { backgroundColor: '#b08b05', color: 'white' } : {}}
          >
            <TrendingUp className="w-5 h-5" />
            Reportes de Ventas
          </button>

          <button
            onClick={() => setActiveSection('cajeros')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'cajeros' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'cajeros' ? { backgroundColor: '#b08b05', color: 'white' } : {}}
          >
            <Users className="w-5 h-5" />
            Administrar Cajeros
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all hover:bg-red-50"
          style={{ borderColor: '#b08b05', color: '#b08b05' }}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        {activeSection === 'inventario' && <InventarioManager />}
        {activeSection === 'abastecimiento' && <AbastecimientoManager />}
        {activeSection === 'reportes' && <ReportesVentas />}
        {activeSection === 'cajeros' && <AdminCajeros />}
        {activeSection === 'ventas' && (<RegistroVentas username={username} />)}
        {activeSection === 'clientes' && (<ClientesManager />)}
        {activeSection === 'devoluciones' && (<Devoluciones />)}
      </div>
    </div>
  );
}
