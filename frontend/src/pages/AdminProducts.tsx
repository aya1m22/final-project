import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Image as ImageIcon,
  X,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (p: any = null) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag, active: true },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background-elevated border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="text-xl font-serif font-bold text-foreground">
            FASHION<span className="text-accent">AI</span> ADMIN
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-foreground-muted hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <nav className="p-6">
          <div className="mb-6">
            <div className="text-xs font-medium text-foreground-muted uppercase tracking-widest mb-3">Main</div>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${item.active ? 'bg-accent text-white' : 'text-foreground-secondary hover:bg-background-elevated hover:text-foreground'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-background-elevated border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-foreground-muted">Dashboard / Products</div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Products</h1>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-foreground-secondary">Manage your catalog and inventory</p>
            </div>
            <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background-elevated border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary">Filter</button>
              <button className="btn-secondary">Export</button>
            </div>
          </div>

          {/* Products table */}
          <div className="bg-background-elevated border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Price</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-foreground-muted">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-foreground-muted">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-background">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/100/130`}
                              alt=""
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium text-foreground">{p.name}</div>
                              <div className="text-sm text-foreground-muted">{p.brand || 'No Brand'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-foreground/10 text-foreground">
                            {p.category || 'General'}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-foreground">${p.price}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-border rounded-full overflow-hidden">
                              <div className="w-3/5 h-full bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-foreground-muted">42</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                            Active
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openModal(p)} className="p-2 text-foreground-muted hover:text-accent transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-foreground-muted hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-background-elevated border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-serif font-bold text-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-foreground-muted hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    defaultValue={editingProduct?.name}
                    placeholder="e.g. Silk Wrap Dress"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select
                      defaultValue={editingProduct?.category}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option>Women</option>
                      <option>Men</option>
                      <option>Accessories</option>
                      <option>Shoes</option>
                      <option>Bags</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Images</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <ImageIcon size={32} className="mx-auto mb-4 text-foreground-muted" />
                    <div className="text-sm text-foreground-muted">
                      Drag and drop images or <button className="text-accent hover:text-accent/80 font-medium">browse</button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}