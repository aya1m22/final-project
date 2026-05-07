import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Fetch stats from API
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', up: true, icon: DollarSign, color: 'accent' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), change: '+8.2%', up: true, icon: Package, color: 'foreground' },
    { label: 'Active Users', value: stats.totalUsers.toString(), change: '+24.1%', up: true, icon: Users, color: 'foreground' },
    { label: 'Conv. Rate', value: '3.2%', change: '-1.4%', up: false, icon: TrendingUp, color: 'foreground' },
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

          <div>
            <div className="text-xs font-medium text-foreground-muted uppercase tracking-widest mb-3">Insights</div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-background-elevated hover:text-foreground cursor-pointer mb-1">
              <TrendingUp size={18} />
              Analytics
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-background-elevated hover:text-foreground cursor-pointer">
              <Settings size={18} />
              Settings
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-background-elevated border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-foreground-muted">Dashboard / Overview</div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Overview</h1>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-background-elevated border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.color === 'accent' ? 'bg-accent/10 text-accent' : 'bg-foreground/10 text-foreground'}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-background-elevated border border-border rounded-lg">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-serif text-lg font-bold text-foreground">Recent Orders</h3>
                <button className="text-sm text-accent hover:text-accent/80 font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Order ID</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Customer</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Total</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: '1024', user: 'Alex Smith', status: 'shipped', total: '$124.00' },
                      { id: '1023', user: 'Maria Garcia', status: 'pending', total: '$89.50' },
                      { id: '1022', user: 'James Wilson', status: 'delivered', total: '$210.00' },
                      { id: '1021', user: 'Sarah Connor', status: 'cancelled', total: '$45.00' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="p-4 font-medium text-foreground">#{row.id}</td>
                        <td className="p-4 text-foreground-secondary">{row.user}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            row.status === 'shipped' ? 'bg-accent/10 text-accent' :
                            row.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                            row.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-foreground">{row.total}</td>
                        <td className="p-4">
                          <button className="text-accent hover:text-accent/80 font-medium text-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-background-elevated border border-border rounded-lg">
              <div className="p-6 border-b border-border">
                <h3 className="font-serif text-lg font-bold text-foreground">Top Products</h3>
              </div>
              <div className="p-6">
                {[
                  { name: 'Silk Wrap Dress', sales: 142, img: 'https://picsum.photos/seed/1/100/130' },
                  { name: 'Tailored Blazer', sales: 98, img: 'https://picsum.photos/seed/2/100/130' },
                  { name: 'Linen Trousers', sales: 84, img: 'https://picsum.photos/seed/3/100/130' },
                  { name: 'Leather Bag', sales: 76, img: 'https://picsum.photos/seed/4/100/130' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 last:pb-0">
                    <img src={item.img} alt="" className="w-10 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{item.name}</div>
                      <div className="text-xs text-foreground-muted">{item.sales} sales</div>
                    </div>
                    <div className="font-bold text-foreground text-sm">#{i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}