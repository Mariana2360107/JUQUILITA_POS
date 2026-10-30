import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  codigo: string;
  stock: number;
}

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface RegistroVentasProps {
  username: string;
}

export function RegistroVentas({ username }: RegistroVentasProps) {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const [cantidad, setCantidad] = useState(1);
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

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;

    const itemExistente = carrito.find(item => item.producto.id === productoSeleccionado.id);

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.producto.id === productoSeleccionado.id
          ? { ...item, cantidad: item.cantidad + cantidad, subtotal: (item.cantidad + cantidad) * item.producto.precio }
          : item
      ));
    } else {
      setCarrito([
        ...carrito,
        {
          producto: productoSeleccionado,
          cantidad,
          subtotal: productoSeleccionado.precio * cantidad
        }
      ]);
    }

    setProductoSeleccionado(null);
    setCantidad(1);
    setBusqueda('');
  };

  const eliminarDelCarrito = (productoId: number) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  const finalizarVenta = () => {
    if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;}
  fetch('http://localhost/juquilita_api/registrar_venta.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'},
    body: JSON.stringify({
      carrito,
      total,
      cajero: username})  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      alert(`Venta registrada correctamente\nTotal: $${total.toFixed(2)}`);
      setCarrito([]);
      fetch('http://localhost/juquilita_api/obtener_productos.php')
        .then(response => response.json())
        .then(productosActualizados => {
          setProductos(productosActualizados);
        });
    } else {
      alert('Error al registrar venta'); } })
  .catch(error => {
    console.error(error);  });};
    

  return (
  <div>
    <h2
      className="text-3xl mb-6"
      style={{ color: '#FF8C42' }}
    >
      Registrar Venta
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Productos */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h3
          className="text-xl mb-4"
          style={{ color: '#FFD166' }}
        >
          Agregar Productos
        </h3>

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar producto por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2"
            style={{ borderColor: '#FFE0B2' }}
          />
        </div>

        {/* Resultados búsqueda */}
        {busqueda && (
          <div
            className="mb-4 max-h-64 overflow-y-auto border-2 rounded-lg"
            style={{ borderColor: '#FFE0B2' }}
          >
            {productosFiltrados.map((producto) => (
              <button
                key={producto.id}
                type="button"
                onClick={() => {
                  setProductoSeleccionado(producto);
                  setBusqueda('');
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {producto.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {producto.codigo}
                    </p>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: '#FF8C42' }}
                  >
                    ${producto.precio.toFixed(2)}
                  </p>
                </div>
              </button>
            ))}
          </div>
     )}

        {/* Producto seleccionado */}
        {productoSeleccionado && (
          <div
            className="p-4 rounded-lg border-2 mb-4"
            style={{
              borderColor: '#FFD166',
              backgroundColor: '#FFFBF5'     }}
          >
            <h4 className="font-medium mb-3">
              Producto seleccionado:
              {' '}
              {productoSeleccionado.nombre}
            </h4>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => {
                    const valor = Number(e.target.value);
                    if (valor >= 1) {
                      setCantidad(valor);        }      }}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                />
              </div>
              <button
                type="button"
                onClick={agregarAlCarrito}
                className="px-6 py-2 rounded-lg text-white flex items-center gap-2"
                style={{ backgroundColor: '#FF8C42' }}
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>
   )}

        {/* Carrito */}
        <div className="mt-6">
          <h4
            className="text-lg mb-3"
            style={{ color: '#FF8C42' }}
          >
            Carrito de Compra
          </h4>
          {carrito.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              El carrito está vacío
            </p>
          ) : (
            <div className="space-y-2">
              {carrito.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: '#FFF8F0' }}
                >

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.producto.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.cantidad}
                      {' x $'}
                      {item.producto.precio.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className="font-medium"
                      style={{ color: '#FF8C42' }}
                    >
                      ${item.subtotal.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        eliminarDelCarrito(item.producto.id) }
                      className="p-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-8">
        <h3
          className="text-xl mb-4"
          style={{ color: '#FFD166' }}
        >
          Resumen de Venta
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Subtotal:
            </span>
            <span className="font-medium">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">

            <span className="text-gray-600">
              IVA (16%):
            </span>
            <span className="font-medium">
              ${(total * 0.16).toFixed(2)}
            </span>
          </div>
          <div
            className="h-px"
            style={{ backgroundColor: '#FFE0B2' }}
          ></div>

          <div className="flex justify-between text-xl">
            <span className="font-medium">
              Total:
            </span>
            <span
              className="font-bold"
              style={{ color: '#FF8C42' }}
            >
              ${(total * 1.16).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={finalizarVenta}
          disabled={carrito.length === 0}
          className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ backgroundColor: '#FF8C42' }}
        >
          <ShoppingCart className="w-5 h-5" />
          Finalizar Venta
        </button>

        <div
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: '#FFF8F0' }}
        >

          <p className="text-sm text-gray-600">
            <strong>Cajero:</strong>
            {' '}
            {username}
          </p>

          <p className="text-sm text-gray-600">

            <strong>Fecha:</strong>
            {' '}
            {new Date().toLocaleDateString()}
          </p>

        </div>
      </div>
    </div>
  </div>
 );
}