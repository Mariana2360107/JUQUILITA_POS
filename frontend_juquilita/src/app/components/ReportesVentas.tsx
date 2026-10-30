import { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ReportesVentas() {
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-01-31');
  const [ventasPorDia, setVentasPorDia] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ventasHoy: 0,
    promedioVenta: 0,
    productosVendidos: 0
    });

    const consultarReportes = () => {

  fetch(
    `http://localhost/juquilita_api/obtener_reportes.php?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  )
    .then(response => response.json())
    .then(data => {

      console.log(data);

      if (data.success) {

        setVentasPorDia(data.ventasPorDia);

        setEstadisticas(data.estadisticas);

      }

    })
    .catch(error => {

      console.error(error);

    });

};

useEffect(() => {

  consultarReportes();

}, []);

  const handleExportar = () => {
  window.open(
    `http://localhost/juquilita_api/exportar_reporte.php?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    '_blank'
  );

};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl" style={{ color: '#FF8C42' }}>Reportes de Ventas</h2>
        <button
          onClick={handleExportar}
          className="px-6 py-3 rounded-lg text-white flex items-center gap-2 shadow-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF8C42' }}
        >
          <Download className="w-5 h-5" />
          Exportar Reporte
        </button>
      </div>

      {/* Filtros de fecha */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl mb-4" style={{ color: '#FF8C42' }}>Período de Consulta</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-2">Fecha Inicio</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-2">Fecha Fin</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2"
                style={{ borderColor: '#FFE0B2' }}
              />
            </div>
          </div>

           <button
                onClick={consultarReportes}
                className="px-8 py-3 rounded-lg text-white"
                style={{ backgroundColor: '#FF8C42' }}
                >
                 Consultar
            </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Total Ventas</h4>
            <TrendingUp className="w-5 h-5" style={{ color: '#FF8C42' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FF8C42' }}>
            ${estadisticas.totalVentas.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Ventas Hoy</h4>
            <TrendingUp className="w-5 h-5" style={{ color: '#FFD166' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FFD166' }}>
            ${estadisticas.ventasHoy.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Promedio/Día</h4>
            <TrendingUp className="w-5 h-5" style={{ color: '#FFAB40' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FFAB40' }}>
            ${estadisticas.promedioVenta.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-600">Productos Vendidos</h4>
            <TrendingUp className="w-5 h-5" style={{ color: '#FF6F00' }} />
          </div>
          <p className="text-3xl" style={{ color: '#FF6F00' }}>
            {estadisticas.productosVendidos}
          </p>
        </div>
      </div>

      {/* Gráfica */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl mb-6" style={{ color: '#FF8C42' }}>Ventas por Día</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={ventasPorDia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#FF8C42" name="Ventas ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
