import { useEffect, useState } from 'react';
import { Search, RefreshCcw, CheckCircle } from 'lucide-react';

interface Devolucion {
  id: number;
  ventaId: number;
  fecha: string;
  producto: string;
  cantidad: number;
  motivo: string;
  tipo: 'devolucion' | 'cambio';
}

export function Devoluciones() {
  const [ventaId, setVentaId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    motivo: '',
    tipo: 'devolucion' as 'devolucion' | 'cambio'
  });

  const [productos, setProductos] = useState<any[]>([]);
 const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
 useEffect(() => {
  fetch('http://localhost/juquilita_api/obtener_devoluciones.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setDevoluciones(data);
    })
    .catch(error => {
      console.error(error);
    });
}, []);

useEffect(() => {
  fetch('http://localhost/juquilita_api/obtener_productos.php')
    .then(response => response.json())
    .then(data => {
      setProductos(data);
    })
    .catch(error => {
      console.error(error);
    });
}, []);

  const buscarVenta = () => {
    if (!ventaId) {
      alert('Ingrese un ID de venta');
      return;
    }
    // TODO: Buscar venta en MySQL
    // SELECT v.*, dv.producto_id, dv.cantidad, p.nombre
    // FROM ventas v
    // JOIN detalle_venta dv ON v.id = dv.venta_id
    // JOIN productos p ON dv.producto_id = p.id
    // WHERE v.id = ?
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  fetch(
    'http://localhost/juquilita_api/registrar_devolucion.php',
    { method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_ventas: parseInt(ventaId),
        id_productos: parseInt(formData.producto),
        cantidad: parseInt(formData.cantidad),
        motivo: formData.motivo,
        tipo: formData.tipo
      })
    }
  )
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      alert('Devolución registrada');
      setShowForm(false);
      setVentaId('');
      setFormData({
        producto: '',
        cantidad: '',
        motivo: '',
        tipo: 'devolucion'
      });
      fetch('http://localhost/juquilita_api/obtener_devoluciones.php')
        .then(response => response.json())
        .then(devolucionesActualizadas => {
          setDevoluciones(devolucionesActualizadas);
        });
    } else {
      alert('Error al registrar devolución');
    }
  })
  .catch(error => {
    console.error(error);
  });
  };

  return (
    <div>
      <h2 className="text-3xl mb-6" style={{ color: '#FF8C42' }}>Devoluciones y Cambios</h2>

      {/* Buscar venta */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl mb-4" style={{ color: '#FFD166' }}>Buscar Venta</h3>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="Ingrese el ID de la venta..."
              value={ventaId}
              onChange={(e) => setVentaId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2"
              style={{ borderColor: '#FFE0B2' }}
            />
          </div>
          <button
            onClick={buscarVenta}
            className="px-8 py-3 rounded-lg text-white"
            style={{ backgroundColor: '#FF8C42' }}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Formulario de devolución/cambio */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl mb-4" style={{ color: '#FFD166' }}>
            Registrar Devolución/Cambio
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Tipo</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    value="devolucion"
                    checked={formData.tipo === 'devolucion'}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'devolucion' })}
                    className="w-4 h-4"
                  />
                  <span>Devolución</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    value="cambio"
                    checked={formData.tipo === 'cambio'}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'cambio' })}
                    className="w-4 h-4"
                  />
                  <span>Cambio</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Producto</label>
              <select
  value={formData.producto}
  onChange={(e) =>
    setFormData({
      ...formData,
      producto: e.target.value
    })
  }
  className="w-full px-4 py-3 rounded-lg border-2"
  style={{ borderColor: '#FFE0B2' }}
  required
>
  <option value="">
    Seleccione un producto
  </option>

  {productos.map(producto => (
    <option
      key={producto.id}
      value={producto.id}
    >
      {producto.nombre}
    </option>
  ))}
</select>
            </div>

            <div>
              <label className="block text-sm mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Motivo</label>
              <textarea
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
                rows={3}
                placeholder="Describa el motivo de la devolución o cambio"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#FF8C42' }}
              >
                <CheckCircle className="w-5 h-5" />
                Registrar {formData.tipo === 'devolucion' ? 'Devolución' : 'Cambio'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setVentaId('');
                }}
                className="flex-1 py-3 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#FFD166' }}>
          <h3 className="text-xl text-gray-800">Historial Reciente</h3>
        </div>

        <table className="w-full">
          <thead style={{ backgroundColor: '#FFF8F0' }}>
            <tr>
              <th className="px-6 py-4 text-left">ID Venta</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Producto</th>
              <th className="px-6 py-4 text-left">Cantidad</th>
              <th className="px-6 py-4 text-left">Tipo</th>
              <th className="px-6 py-4 text-left">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {devoluciones.map((dev, index) => (
              <tr
                key={dev.id}
                style={index % 2 === 0 ? {} : { backgroundColor: '#FFFBF5' }}
              >
                <td className="px-6 py-4">#{dev.ventaId}</td>
                <td className="px-6 py-4">{dev.fecha}</td>
                <td className="px-6 py-4">{dev.producto}</td>
                <td className="px-6 py-4">{dev.cantidad}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      dev.tipo === 'devolucion'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {dev.tipo === 'devolucion' ? 'Devolución' : 'Cambio'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{dev.motivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
