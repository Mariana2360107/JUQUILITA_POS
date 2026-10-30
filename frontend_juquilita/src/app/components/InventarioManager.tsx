import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  codigo: string;}

export function InventarioManager() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    codigo: '' });

  useEffect(() => { fetch('http://localhost/juquilita_api/obtener_productos.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setProductos(data); })
    .catch(error => {
      console.error('Error:', error); }); }, []);

  const filteredProducts = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) );

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', categoria: '', precio: '', stock: '', codigo: '' });
    setShowModal(true); };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      codigo: producto.codigo
   });   setShowModal(true); };

  const handleDelete = (id: number) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    const form = new FormData();
    form.append('id', id.toString());
    fetch('http://localhost/juquilita_api/eliminar_producto.php', {
      method: 'POST',
      body: form   })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        fetch('http://localhost/juquilita_api/obtener_productos.php')
          .then(response => response.json())
          .then(productosActualizados => {
            setProductos(productosActualizados);      });
      } else {
        alert(data.message);      }   })
    .catch(error => {
      console.error(error);    });  }  };

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
    if (editingProduct) {
    const form = new FormData();

form.append('id', editingProduct.id.toString());
form.append('codigo', formData.codigo);
form.append('nombre', formData.nombre);
form.append('categoria', formData.categoria);
form.append('precio', formData.precio);
form.append('stock', formData.stock);

fetch('http://localhost/juquilita_api/actualizar_producto.php', {
  method: 'POST',
  body: form
})
.then(response => response.json())
.then(data => {

  console.log(data);

  if (data.success) {

    fetch('http://localhost/juquilita_api/obtener_productos.php')
      .then(response => response.json())
      .then(productosActualizados => {

        setProductos(productosActualizados);

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

    form.append('codigo', formData.codigo);
    form.append('nombre', formData.nombre);
    form.append('categoria', formData.categoria);
    form.append('precio', formData.precio);
    form.append('stock', formData.stock);

    fetch('http://localhost/juquilita_api/crear_producto.php', {
      method: 'POST',
      body: form
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {

        fetch('http://localhost/juquilita_api/obtener_productos.php')
          .then(response => response.json())
          .then(productosActualizados => {
            setProductos(productosActualizados);
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
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl" style={{ color: '#FF8C42' }}>Inventario</h2>
        <button
          onClick={handleAdd}
          className="px-6 py-3 rounded-lg text-white flex items-center gap-2 shadow-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF8C42' }}
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2"
            style={{ borderColor: '#FFE0B2', backgroundColor: 'white' }}
          />
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FF8C42' }}>
            <tr>
              <th className="px-6 py-4 text-left text-white">Código</th>
              <th className="px-6 py-4 text-left text-white">Nombre</th>
              <th className="px-6 py-4 text-left text-white">Categoría</th>
              <th className="px-6 py-4 text-left text-white">Precio</th>
              <th className="px-6 py-4 text-left text-white">Stock</th>
              <th className="px-6 py-4 text-left text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((producto, index) => (
              <tr
                key={producto.id}
                className={index % 2 === 0 ? '' : ''}
                style={index % 2 === 0 ? {} : { backgroundColor: '#FFF8F0' }}
              >
                <td className="px-6 py-4">{producto.codigo}</td>
                <td className="px-6 py-4">{producto.nombre}</td>
                <td className="px-6 py-4">{producto.categoria}</td>
                <td className="px-6 py-4">${producto.precio.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      producto.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {producto.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(producto)}
                      className="p-2 rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: '#FFD166' }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl mb-6" style={{ color: '#FF8C42' }}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
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
                <label className="block text-sm mb-2">Categoría</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#FFE0B2' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                  {editingProduct ? 'Actualizar' : 'Agregar'}
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
