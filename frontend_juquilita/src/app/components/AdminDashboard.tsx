import { useState } from 'react';
import { Package, TrendingUp, Users, LogOut, User, RefreshCcw } from 'lucide-react';
import { InventarioManager } from './InventarioManager';
import { ReportesVentas } from './ReportesVentas';
import { AdminCajeros } from './AdminCajeros';
import { RegistroVentas } from './RegistroVentas';
import { ClientesManager } from './ClientesManager';
import { Devoluciones } from './Devoluciones';

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
}

export function AdminDashboard({ username, onLogout }: AdminDashboardProps) {
 const [activeSection, setActiveSection] = useState<
  | 'inventario'
  | 'reportes'
  | 'cajeros'
  | 'ventas'
  | 'clientes'
  | 'devoluciones'
>('inventario');

  const [profileImage, setProfileImage] = useState<string | null>(null);
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> )  =>
   {   const file = e.target.files?.[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('foto', file);
  formData.append('username', username);
  fetch('http://localhost/juquilita_api/subir_foto.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        setProfileImage(
          `http://localhost/juquilita_api/${data.ruta}`
        );
        alert('Foto subida correctamente');
      } else {
        alert('Error al subir foto');
      }
    })
};

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: '#FF8C42' }}>Juquilita</h1>
          <p className="text-sm text-gray-600">Panel de Administrador</p>
        </div>

        {/* Foto de perfil */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{ borderColor: '#FF8C42', backgroundColor: '#FFF8F0' }}
            >
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="w-full h-full object-cover"/>
              ) : (
                <User className="w-16 h-16" style={{ color: '#FF8C42' }} />
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              style={{ backgroundColor: '#FF8C42' }}
            >
             <input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e)}
  className="hidden"
/>
              <span className="text-white text-xl">+</span>
            </label>
          </div>
          <p className="text-center font-medium">{username}</p>
          <p className="text-center text-sm text-gray-600">Administrador</p>
        </div>

        {/* Menu */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveSection('inventario')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'inventario' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'inventario' ? { backgroundColor: '#FF8C42', color: 'white' } : {}}
          >
            <Package className="w-5 h-5" />
            Inventario
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
      ? { backgroundColor: '#FF8C42', color: 'white' }
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
      ? { backgroundColor: '#FF8C42', color: 'white' }
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
      ? { backgroundColor: '#FF8C42', color: 'white' }
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
            style={activeSection === 'reportes' ? { backgroundColor: '#FF8C42', color: 'white' } : {}}
          >
            <TrendingUp className="w-5 h-5" />
            Reportes de Ventas
          </button>

          <button
            onClick={() => setActiveSection('cajeros')}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeSection === 'cajeros' ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={activeSection === 'cajeros' ? { backgroundColor: '#FF8C42', color: 'white' } : {}}
          >
            <Users className="w-5 h-5" />
            Administrar Cajeros
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all hover:bg-red-50"
          style={{ borderColor: '#FF8C42', color: '#FF8C42' }}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        {activeSection === 'inventario' && <InventarioManager />}
        {activeSection === 'reportes' && <ReportesVentas />}
        {activeSection === 'cajeros' && <AdminCajeros />}
        {activeSection === 'ventas' && (<RegistroVentas username={username} />)}
        {activeSection === 'clientes' && (<ClientesManager />)}
        {activeSection === 'devoluciones' && (<Devoluciones />)}
      </div>
    </div>
  );
}
