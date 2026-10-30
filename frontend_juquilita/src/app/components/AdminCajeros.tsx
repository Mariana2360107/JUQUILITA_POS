import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key } from 'lucide-react';

interface Cajero {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  telefono: string;
  turno: string;
  fechaCreacion: string;
  activo: boolean;
}

export function AdminCajeros() {
  const [cajeros, setCajeros] = useState<Cajero[]>([]);
  useEffect(() => {
  fetch('http://localhost/juquilita_api/obtener_cajeros.php')
    .then(response => response.json())
    .then(data => {
      setCajeros(data);
    })
    .catch(error => {
      console.error('Error al obtener cajeros:', error);
    });
}, []);

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedCajero, setSelectedCajero] = useState<Cajero | null>(null);
  const [formData, setFormData] = useState({
  username: '',
  nombre: '',
  apellido: '',
  telefono: '',
  turno: 'MATUTINO',
  password: ''
});

  const handleAdd = () => {
    setSelectedCajero(null);
    setFormData({ username: '', nombre: '', apellido: '', telefono: '', turno: 'MATUTINO', password: ''});
    setShowModal(true);
  };

const handleEdit = (cajero: Cajero) => {
  setSelectedCajero(cajero);
  setFormData({
    username: cajero.username,
    nombre: cajero.nombre,
    apellido: cajero.apellido,
    telefono: cajero.telefono,
    turno: cajero.turno,
    password: ''
  });
  setShowModal(true);
};

  const handleDelete = (id: number) => {
  if (confirm('¿Está seguro de eliminar este cajero?')) {
    const form = new FormData();
    form.append('id', id.toString());
    fetch('http://localhost/juquilita_api/eliminar_cajero.php', {
      method: 'POST',
      body: form
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        fetch('http://localhost/juquilita_api/obtener_cajeros.php')
          .then(response => response.json())
          .then(data => {
            setCajeros(data);
          });

      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
};

 const handleChangePassword = (cajero: Cajero) => {
  const nuevaPassword = prompt(
    `Nueva contraseña para ${cajero.nombre}`
  );
  if (!nuevaPassword) return;
  const form = new FormData();
  form.append('id', cajero.id.toString());
  form.append('password', nuevaPassword);
  fetch('http://localhost/juquilita_api/cambiar_password.php', {
    method: 'POST',
    body: form
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
    alert('Contraseña actualizada correctamente');
    } else {
      alert(data.message); }})
  .catch(error => {
    console.error(error);  });
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   if (selectedCajero) {
  const form = new FormData();

  form.append('id', selectedCajero.id.toString());
  form.append('usuario', formData.username);
  form.append('nombre', formData.nombre);
  form.append('apellido', formData.apellido);
  form.append('telefono', formData.telefono);
  form.append('turno', formData.turno);

  fetch('http://localhost/juquilita_api/actualizar_cajero.php', {
    method: 'POST',
    body: form
  })
  .then(response => response.json())
  .then(data => {

    if (data.success) {

      fetch('http://localhost/juquilita_api/obtener_cajeros.php')
        .then(response => response.json())
        .then(data => {
          setCajeros(data);
        });

      setShowModal(false);

    } else {
      alert(data.message);
    }

  })
  .catch(error => {
    console.error(error);
  });


    } else {
      const form = new FormData();

form.append('usuario', formData.username);
form.append('nombre', formData.nombre);
form.append('apellido', formData.apellido);
form.append('telefono', formData.telefono);
form.append('turno', formData.turno);
form.append('password', formData.password);

fetch('http://localhost/juquilita_api/crear_cajero.php', {
  method: 'POST',
  body: form
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    fetch('http://localhost/juquilita_api/obtener_cajeros.php')
      .then(response => response.json())
      .then(data => {
        setCajeros(data);
      });
    setShowModal(false);
  } else {
    alert(data.message);
  }

})
.catch(error => {
  console.error(error);
});
    }
    setShowModal(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Actualizar password en MySQL
    // UPDATE usuarios SET password = ? WHERE id = ?
    // Usar bcrypt para hashear password
    alert(`Contraseña actualizada para ${selectedCajero?.nombre}`);
    setShowPasswordModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl" style={{ color: '#FF8C42' }}>Administrar Cajeros</h2>
        <button
          onClick={handleAdd}
          className="px-6 py-3 rounded-lg text-white flex items-center gap-2 shadow-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF8C42' }}
        >
          <Plus className="w-5 h-5" />
          Agregar Cajero
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FF8C42' }}>
            <tr>
              <th className="px-6 py-4 text-left text-white">Usuario</th>
              <th className="px-6 py-4 text-left text-white">Nombre</th>
              <th className="px-6 py-4 text-left text-white">Fecha Creación</th>
              <th className="px-6 py-4 text-left text-white">Estado</th>
              <th className="px-6 py-4 text-left text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cajeros.map((cajero, index) => (
              <tr
                key={cajero.id}
                style={index % 2 === 0 ? {} : { backgroundColor: '#FFF8F0' }}
              >
                <td className="px-6 py-4">{cajero.username}</td>
                <td className="px-6 py-4">{cajero.nombre}</td>
                <td className="px-6 py-4">{cajero.fechaCreacion}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      cajero.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cajero.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cajero)}
                      className="p-2 rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: '#FFD166' }}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleChangePassword(cajero)}
                      className="p-2 rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: '#FFAB40' }}
                      title="Cambiar contraseña"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cajero.id)}
                      className="p-2 bg-red-500 text-white rounded-lg transition-all hover:opacity-80"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl mb-6" style={{ color: '#FF8C42' }}>
              {selectedCajero ? 'Editar Cajero' : 'Nuevo Cajero'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                 />
              </div>

              <div>
                <label className="block text-sm mb-2">Turno</label>
                 <select
                  value={formData.turno}
                  onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                >
                  <option value="MATUTINO">Matutino</option>
                  <option value="VESPERTINO">Vespertino</option>
                </select>
              </div>

              {!selectedCajero && (
                <div>
                  <label className="block text-sm mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ borderColor: '#FFE0B2' }}
                    required={!selectedCajero}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white"
                  style={{ backgroundColor: '#FF8C42' }}
                >
                  {selectedCajero ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl mb-6" style={{ color: '#FF8C42' }}>
              Cambiar Contraseña
            </h3>
            <p className="mb-4 text-gray-600">Usuario: {selectedCajero?.nombre}</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white"
                  style={{ backgroundColor: '#FF8C42' }}
                >
                  Cambiar Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
