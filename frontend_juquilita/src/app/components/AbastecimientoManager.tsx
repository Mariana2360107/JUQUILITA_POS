import { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Package,
  ClipboardList,
  History,
  CheckCircle,
  AlertCircle,
  X,
  Boxes,
} from 'lucide-react';

//Interfaces de datos
interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  stock: number;
  activo: boolean;
}

interface ProductoAbastecimiento {
  producto: Producto;
  cantidad: number;
}

interface RegistroAbastecimiento {
  id: number;
  fecha: string;
  productos: {
    nombre: string;
    codigo: string;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
  }[];
}

// 2. DATOS DE DEMOSTRACIÓN
// TODO API: sustituir estos datos por la respuesta de
// obtener_productos.php cuando conectemos el backend.
const productosIniciales: Producto[] = [
  {
    id: 1,
    codigo: '750100000001',
    nombre: 'Arroz 1 kg',
    categoria: 'Abarrotes',
    stock: 15,
    activo: true,
  },
  {
    id: 2,
    codigo: '750100000002',
    nombre: 'Azúcar 1 kg',
    categoria: 'Abarrotes',
    stock: 8,
    activo: true,
  },
  {
    id: 3,
    codigo: '750100000003',
    nombre: 'Aceite vegetal 1 L',
    categoria: 'Abarrotes',
    stock: 0,
    activo: false,
  },
  {
    id: 4,
    codigo: '750100000004',
    nombre: 'Leche 1 L',
    categoria: 'Lácteos',
    stock: 12,
    activo: true,
  },
  {
    id: 5,
    codigo: '750100000005',
    nombre: 'Galletas',
    categoria: 'Dulces',
    stock: 0,
    activo: false,
  },
  {
    id: 6,
    codigo: '750100000006',
    nombre: 'Refresco 600 ml',
    categoria: 'Bebidas',
    stock: 20,
    activo: true,
  },
];

// 3. COMPONENTE PRINCIPAL
export function AbastecimientoManager() {

  const [productos, setProductos] = useState<Producto[]>(
    productosIniciales
  );
  const [listaAbastecimiento, setListaAbastecimiento] = useState<
    ProductoAbastecimiento[]
  >([]);
  const [historial, setHistorial] = useState<
    RegistroAbastecimiento[]
  >([]);
  const [busqueda, setBusqueda] = useState('');
  const [pestana, setPestana] = useState<
    'registro' | 'historial'
  >('registro');

  const [mensaje, setMensaje] = useState('');

  // 4. BÚSQUEDA DE PRODUCTOS
  const productosFiltrados = productos.filter((producto) => {
    const termino = busqueda.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
  });

  // 5. AGREGAR PRODUCTOS AL ABASTECIMIENTO
  const agregarProducto = (producto: Producto) => {
    const existe = listaAbastecimiento.find(
      (item) => item.producto.id === producto.id
    );
    if (existe) {
      setListaAbastecimiento((anterior) =>
        anterior.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item));
    } else {
      setListaAbastecimiento((anterior) => [
        ...anterior,
        { producto, cantidad: 1 },]);
    }setMensaje('');};

  // 6. MODIFICAR CANTIDADES
  const modificarCantidad = (
    idProducto: number,
    cambio: number
  ) => {

    setListaAbastecimiento((anterior) =>
      anterior.map((item) =>
        item.producto.id === idProducto
          ? {   ...item,
              cantidad: Math.max(1, item.cantidad + cambio),
            }
          : item
      )
    );
  };

  const cambiarCantidad = (
    idProducto: number,
    cantidad: number
  ) => {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return;
    }
    setListaAbastecimiento((anterior) =>
      anterior.map((item) =>
        item.producto.id === idProducto
          ? { ...item, cantidad }
          : item
      )
    );
  };

  // 7. ELIMINAR PRODUCTOS DE LA LISTA
  const eliminarProducto = (idProducto: number) => {
    setListaAbastecimiento((anterior) =>
      anterior.filter(
        (item) => item.producto.id !== idProducto
      )
    );
  };

  // 8. CONFIRMAR ABASTECIMIENTO
  const confirmarAbastecimiento = () => {
    if (listaAbastecimiento.length === 0) {
      setMensaje('Agrega al menos un producto para continuar.');
      return;
    }
    // TODO API:
    // 1. Enviar los productos y cantidades al endpoint PHP.
    // 2. Registrar una compra en la tabla compras.
    // 3. Registrar los detalles en detalle_compras.
    // 4. Incrementar el stock de cada producto.
    // 5. Utilizar una transacción SQL para evitar registros parciales.
    // 6. No modificar la columna activo.

    const nuevoRegistro: RegistroAbastecimiento = {
      id: Date.now(),
      fecha: new Date().toLocaleString('es-MX'),
      productos: listaAbastecimiento.map((item) => ({
        nombre: item.producto.nombre,
        codigo: item.producto.codigo,
        cantidad: item.cantidad,
        stockAnterior: item.producto.stock,
        stockNuevo: item.producto.stock + item.cantidad,
      })),
    };

    // Simulación local del incremento de existencias.
    setProductos((anterior) =>
      anterior.map((producto) => {
        const item = listaAbastecimiento.find(
          (elemento) => elemento.producto.id === producto.id
        );
        if (!item) return producto;
        return {
          ...producto,
          stock: producto.stock + item.cantidad,
          // El estado del producto no cambia.
          activo: producto.activo,
        };
      })
    );

    setHistorial((anterior) => [
      nuevoRegistro,
      ...anterior,
    ]);
    setListaAbastecimiento([]);
    setMensaje('¡Abastecimiento registrado correctamente!');
  };

  // 9. RESUMEN
  const totalUnidades = listaAbastecimiento.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  // 10. INTERFAZ
  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div>
        <h2 className="text-3xl mb-6" style={{ color: '#df7839' }}>Abastecimiento</h2>
      </div>

      {/* PESTAÑAS */}
      <div className="flex gap-3 border-b border-gray-200">
        <button
          onClick={() => {
            setPestana('registro');
            setMensaje('');}}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
            pestana === 'registro'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500 hover:text-orange-500'}`}>
          <ClipboardList size={19} />
          Registrar abastecimiento
        </button>

        <button
          onClick={() => {
            setPestana('historial');
            setMensaje(''); }}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
            pestana === 'historial'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500 hover:text-orange-500' }`} >
          <History size={19} />
          Historial
        </button>
      </div>

      {/* MENSAJES */}
      {mensaje && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
          <div className="flex items-center gap-2">
            <AlertCircle size={19} />
            <span>{mensaje}</span>
          </div>
          <button onClick={() => setMensaje('')}>
            <X size={18} />
          </button>
        </div>
      )}

  
      {/* PESTAÑA: REGISTRO */}
      {pestana === 'registro' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* CATÁLOGO DE PRODUCTOS */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-orange-500" size={22} />
              <h3 className="font-bold text-gray-800 text-lg">
                Productos disponibles para abastecer
              </h3>
            </div>

            {/* BÚSQUEDA */}
            <div className="relative mb-5">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={19}
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, código o categoría..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="space-y-3">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-800">
                        {producto.nombre}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          producto.activo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'  }`}
                      >
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Código: {producto.codigo}
                    </p>
                    <p className="text-sm text-gray-500">
                      Categoría: {producto.categoria}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Stock actual: {producto.stock} unidades
                    </p>
                  </div>

                  <button
                    onClick={() => agregarProducto(producto)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#b08b05' }} >
                    <Plus size={18} />
                    Agregar
                  </button>
                </div>
              ))}

              {productosFiltrados.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  No se encontraron productos.
                </div>        )}
            </div>
          </div>

          {/* RESUMEN DEL ABASTECIMIENTO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <Boxes className="text-orange-500" size={22} />
              <h3 className="font-bold text-gray-800 text-lg">
                Resumen
              </h3>
            </div>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Productos diferentes</span>
              <span className="font-semibold text-gray-800">
                {listaAbastecimiento.length}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 mb-5">
              <span>Total de unidades</span>
              <span className="font-semibold text-gray-800">
                {totalUnidades}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
              {listaAbastecimiento.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package
                    size={35}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p className="text-sm">
                    Aún no agregas productos.
                  </p>
                </div>
              ) : (

                listaAbastecimiento.map((item) => (
                  <div
                    key={item.producto.id}
                    className="border-b border-gray-100 pb-4"
                  >
                    <div className="flex justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">
                          {item.producto.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {item.producto.stock} →{' '}
                          <span className="text-green-600 font-semibold">
                            {item.producto.stock + item.cantidad}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          eliminarProducto(item.producto.id)
                        }
                        className="text-red-400 hover:text-red-600"
                        title="Eliminar producto"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        Cantidad recibida
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            modificarCantidad(item.producto.id, -1)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200" >
                          <Minus size={15} />
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            cambiarCantidad(
                              item.producto.id,
                              Number(e.target.value))}
                          className="w-14 text-center border border-gray-200 rounded py-1 text-sm" />
                        <button
                          onClick={() =>
                            modificarCantidad(item.producto.id, 1)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                        > <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={confirmarAbastecimiento}
              disabled={listaAbastecimiento.length === 0}
              className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: '#b08b05' }}
            >
              <CheckCircle size={19} />
              Confirmar abastecimiento
            </button>
          </div>
        </div>

      )}

      {/* PESTAÑA: HISTORIAL */}
      {pestana === 'historial' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-5">
            <History className="text-orange-500" size={22} />
            <h3 className="font-bold text-gray-800 text-lg">
              Historial de abastecimientos
            </h3>
          </div>

          {historial.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ClipboardList
                size={45}
                className="mx-auto mb-3 opacity-50"
              />
              <p className="font-medium">
                No hay abastecimientos registrados.
              </p>
              <p className="text-sm mt-1">
                Los registros aparecerán aquí después de confirmar una operación.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {historial.map((registro) => (
                <div
                  key={registro.id}
                  className="border border-gray-100 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Abastecimiento #{registro.id}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {registro.fecha}
                      </p>

                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit">
                      Registrado
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="p-3">Producto</th>
                          <th className="p-3">Código</th>
                          <th className="p-3">Cantidad</th>
                          <th className="p-3">Stock anterior</th>
                          <th className="p-3">Stock nuevo</th>
                        </tr>
                      </thead>

                      <tbody>
                        {registro.productos.map((producto, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-100"
                          ><td className="p-3 font-medium text-gray-800">
                              {producto.nombre}
                            </td>
                            <td className="p-3 text-gray-500">
                              {producto.codigo}
                            </td>
                            <td className="p-3 text-gray-700">
                              {producto.cantidad}
                            </td>
                            <td className="p-3 text-gray-700">
                              {producto.stockAnterior}
                            </td>
                            <td className="p-3 text-green-600 font-semibold">
                              {producto.stockNuevo}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
