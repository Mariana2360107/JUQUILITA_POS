import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Cliente {
  id: number;
  nombre: string;
  tipo: string;
  descuento: number;
  telefono: string;
  correo: string;
}

export function ClientesManager() {

  const [clientes, setClientes] = useState<Cliente[]>([]);
const [showModal, setShowModal] = useState(false);
const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

const [formData, setFormData] = useState({
  nombre: '',
  tipo: 'GENERAL',
  descuento: '',
  telefono: '',
  correo: ''
});

  useEffect(() => {
    fetch('http://localhost/juquilita_api/obtener_clientes.php')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setClientes(data);
      })
      .catch(error => {
        console.error(error);
      });

  }, []);
 
const handleSubmit = (e: React.FormEvent) => {

  e.preventDefault();

  const form = new FormData();
  if (editingCliente) {
  form.append('id', editingCliente.id.toString());
}

  form.append('nombre', formData.nombre);
  form.append('tipo', formData.tipo);
  form.append('descuento', formData.descuento);
  form.append('telefono', formData.telefono);
  form.append('correo', formData.correo);

  fetch(
  editingCliente
    ? 'http://localhost/juquilita_api/editar_cliente.php'
    : 'http://localhost/juquilita_api/crear_cliente.php',
 {

    method: 'POST',
    body: form

  })
  .then(response => response.json())
  .then(data => {

    console.log(data);

    if (data.success) {

      alert('Cliente agregado');

      setShowModal(false);
      setEditingCliente(null);

      setFormData({
        nombre: '',
        tipo: 'GENERAL',
        descuento: '',
        telefono: '',
        correo: ''
      });

      fetch('http://localhost/juquilita_api/obtener_clientes.php')
        .then(response => response.json())
        .then(clientesActualizados => {

          setClientes(clientesActualizados);

        });

    } else {

      alert('Error al agregar cliente');

    }

  })
  .catch(error => {
    console.error(error);
  });

};

const handleDelete = (id: number) => {

  const confirmar = confirm(
    '¿Eliminar este cliente?'
  );

  if (!confirmar) return;

  const form = new FormData();

  form.append('id', id.toString());

  fetch(
    'http://localhost/juquilita_api/eliminar_cliente.php',
    {
      method: 'POST',
      body: form
    }
  )
  .then(response => response.json())
  .then(data => {

    console.log(data);

    if (data.success) {

      alert('Cliente eliminado');

      fetch('http://localhost/juquilita_api/obtener_clientes.php')
        .then(response => response.json())
        .then(clientesActualizados => {

          setClientes(clientesActualizados);

        });

    } else {

      alert('Error al eliminar');

    }

  })
  .catch(error => {
    console.error(error);
  });

};

  return (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl" style={{ color: '#FF8C42' }}>
        Clientes
      </h2>

      <button
        onClick={() => {
          setEditingCliente(null);

          setFormData({
            nombre: '',
            tipo: 'GENERAL',
            descuento: '',
            telefono: '',
            correo: ''
          });

          setShowModal(true);
        }}
        className="px-6 py-3 rounded-lg text-white flex items-center gap-2 shadow-lg transition-all hover:opacity-90"
        style={{ backgroundColor: '#FF8C42' }}
      >
        <Plus className="w-5 h-5" />
        Agregar Cliente
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead style={{ backgroundColor: '#FF8C42' }}>
          <tr>
            <th className="px-6 py-4 text-left text-white">Nombre</th>
            <th className="px-6 py-4 text-left text-white">Tipo</th>
            <th className="px-6 py-4 text-left text-white">Descuento</th>
            <th className="px-6 py-4 text-left text-white">Teléfono</th>
            <th className="px-6 py-4 text-left text-white">Correo</th>
            <th className="px-6 py-4 text-left text-white">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente, index) => (
            <tr
              key={cliente.id}
              style={index % 2 !== 0 ? { backgroundColor: '#FFF8F0' } : {}}
            >
              <td className="px-6 py-4">{cliente.nombre}</td>
              <td className="px-6 py-4">{cliente.tipo}</td>
              <td className="px-6 py-4">{cliente.descuento}%</td>
              <td className="px-6 py-4">{cliente.telefono}</td>
              <td className="px-6 py-4">{cliente.correo}</td>

              <td className="px-6 py-4">
                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setEditingCliente(cliente);

                      setFormData({
                        nombre: cliente.nombre,
                        tipo: cliente.tipo,
                        descuento: cliente.descuento.toString(),
                        telefono: cliente.telefono,
                        correo: cliente.correo
                      });

                      setShowModal(true);
                    }}
                    className="p-2 rounded-lg transition-all hover:opacity-80"
                    style={{ backgroundColor: '#FFD166' }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="p-2 bg-red-500 text-white rounded-lg transition-all hover:opacity-80"
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

    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">

          <h3 className="text-2xl mb-6" style={{ color: '#FF8C42' }}>
            {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm mb-2">Nombre</label>

              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre: e.target.value
                  })
                }
                className="w-full px-4 py-2 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Tipo Cliente</label>

              <input
                type="text"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo: e.target.value
                  })
                }
                className="w-full px-4 py-2 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Descuento</label>

              <input
                type="number"
                step="0.01"
                value={formData.descuento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descuento: e.target.value
                  })
                }
                className="w-full px-4 py-2 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Teléfono</label>

              <input
                type="text"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telefono: e.target.value
                  })
                }
                className="w-full px-4 py-2 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Correo</label>

              <input
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correo: e.target.value
                  })
                }
                className="w-full px-4 py-2 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              />
            </div>

            <div className="flex gap-3 pt-4">

              <button
                type="submit"
                className="flex-1 py-3 rounded-lg text-white"
                style={{ backgroundColor: '#FF8C42' }}
              >
                {editingCliente ? 'Actualizar' : 'Guardar'}
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
  </div>
);
}