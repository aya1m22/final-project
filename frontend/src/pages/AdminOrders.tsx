import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  ShoppingBag,
  Users,
  X,
  FileText,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id?.toString().includes(searchTerm) ||
                         o.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: Package, active: true },
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
              <div className="text-sm text-foreground-muted">Dashboard / Orders</div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Orders Management</h1>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background-elevated border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders table */}
          <div className="bg-background-elevated border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Order</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-foreground-muted">
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-foreground-muted">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-b-0 hover:bg-background">
                        <td className="p-4 font-medium text-foreground">#{o.id}</td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{o.shippingAddress?.name || 'Customer'}</div>
                          <div className="text-sm text-foreground-muted">{o.userId === 'guest' ? 'Guest' : 'Member'}</div>
                        </td>
                        <td className="p-4 text-sm text-foreground-muted">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium text-foreground">${o.totalAmount || o.total}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            o.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                            o.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                            o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            o.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                            'bg-accent/10 text-accent'
                          }`}>
                            {o.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedOrder(o)} className="p-2 text-foreground-muted hover:text-accent transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-foreground-muted hover:text-blue-500 transition-colors">
                              <Truck size={16} />
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-background-elevated border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-serif font-bold text-foreground">
                Order Details #{selectedOrder.id}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-foreground-muted hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Shipping Information</h3>
                <div className="text-sm text-foreground-secondary space-y-1">
                  <div className="font-medium text-foreground">{selectedOrder.shippingAddress?.name}</div>
                  <div>{selectedOrder.shippingAddress?.line1}</div>
                  <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</div>
                  <div>{selectedOrder.shippingAddress?.country}</div>
                  <div>Phone: {selectedOrder.shippingAddress?.phone}</div>
                </div>

                <h3 className="text-lg font-medium text-foreground mb-4 mt-8">Order Status</h3>
                <div className="flex gap-3">
                  <button className="btn-secondary flex items-center gap-2">
                    <CheckCircle size={16} />
                    Mark Delivered
                  </button>
                  <button className="btn-secondary flex items-center gap-2 text-red-500 hover:text-red-600">
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Items Summary</h3>
                <div className="space-y-3 mb-4">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span>{item.qty}x Product #{item.productId}</span>
                      <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span>${selectedOrder.totalAmount || selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
