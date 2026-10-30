import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

interface Venta {
  id: number;
  fecha: string;
  hora: string;
  total: number;
  items: number;
}

export function VentasDia() {
 const [ventas, setVentas] = useState<Venta[]>([]);
  useEffect(() => {

  fetch('http://localhost/juquilita_api/obtener_ventas_dia.php')
    .then(response => response.json())
    .then(data => {

      console.log(data);

      setVentas(data);

    })
    .catch(error => {
      console.error(error);
    });

}, []);

  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const totalTransacciones = ventas.length;
  const promedioVenta = totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;

  return (
    <div>
      <h2 className="text-3xl mb-6" style={{ color: '#FF8C42' }}>Ventas del Día</h2>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Total del Día</h4>
            <DollarSign className="w-5 h-5" style={{ color: '#FF8C42' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FF8C42' }}>
            ${totalVentas.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Transacciones</h4>
            <ShoppingBag className="w-5 h-5" style={{ color: '#FFD166' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FFD166' }}>
            {totalTransacciones}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Ticket Promedio</h4>
            <TrendingUp className="w-5 h-5" style={{ color: '#FFAB40' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FFAB40' }}>
            ${promedioVenta.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#FFD166' }}>
          <h3 className="text-xl text-gray-800">Detalle de Ventas</h3>
          <p className="text-sm text-gray-700">Fecha: {new Date().toLocaleDateString('es-MX')}</p>
        </div>

        <table className="w-full">
          <thead style={{ backgroundColor: '#FFF8F0' }}>
            <tr>
              <th className="px-6 py-4 text-left">ID Venta</th>
              <th className="px-6 py-4 text-left">Hora</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay ventas registradas hoy
                </td>
              </tr>
            ) : (
              ventas.map((venta, index) => (
                <tr
                  key={venta.id}
                  className={index % 2 === 0 ? '' : ''}
                  style={index % 2 === 0 ? {} : { backgroundColor: '#FFFBF5' }}
                >
                  <td className="px-6 py-4">#{venta.id}</td>
                  <td className="px-6 py-4">{venta.hora}</td>
                  <td className="px-6 py-4">{venta.items} productos</td>
                  <td className="px-6 py-4">
                    <span className="font-medium" style={{ color: '#FF8C42' }}>
                      ${venta.total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t" style={{ backgroundColor: '#FFF8F0' }}>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total General:</span>
            <span className="text-2xl font-bold" style={{ color: '#FF8C42' }}>
              ${totalVentas.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
