import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Mail,
  ShieldCheck,
  Ban,
  LayoutDashboard,
  ShoppingBag,
  Package,
  MoreVertical,
  X,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users, active: true },
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
              <div className="text-sm text-foreground-muted">Dashboard / Users</div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Community</h1>
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
              <p className="text-foreground-secondary">Manage user roles, permissions, and status</p>
            </div>
            <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
              <UserPlus size={16} />
              Invite Member
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background-elevated border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Users table */}
          <div className="bg-background-elevated border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">User</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Joined</th>
                    <th className="text-right p-4 text-sm font-medium text-foreground-muted uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-foreground-muted">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-foreground-muted">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-background">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {u.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{u.email}</div>
                              <div className="text-sm text-foreground-muted">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' ? 'bg-accent/10 text-accent' :
                            u.role === 'vendor' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-foreground/10 text-foreground'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            u.status === 'active' ? 'bg-green-500/10 text-green-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-foreground-muted">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-foreground-muted hover:text-accent transition-colors">
                              <Mail size={16} />
                            </button>
                            <button className="p-2 text-foreground-muted hover:text-red-500 transition-colors">
                              <Ban size={16} />
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
    </div>
  );
}
