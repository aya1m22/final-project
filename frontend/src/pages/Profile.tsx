import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, MapPin, Camera, Save, Key, LogOut, Plus } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    phone: '+961 70 123 456',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Settings</div>
          <h1 className="text-4xl font-bold text-foreground">
            My <span className="text-primary">Profile</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    className="w-20 h-20 rounded-full border-2 border-border"
                    alt="Profile avatar"
                  />
                  <button className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="text-center mt-4">
                  <div className="font-semibold text-foreground">{formData.name}</div>
                  <div className="text-sm text-muted-foreground">{formData.email}</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'info', label: 'Personal Info', icon: <User size={18} /> },
                  { id: 'address', label: 'Address Book', icon: <MapPin size={18} /> },
                  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
                ].map(item => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-border my-4" />

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'info' && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Personal Information</h2>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <input
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-muted-foreground cursor-not-allowed"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-foreground">My Addresses</h2>
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    <Plus size={16} />
                    Add New
                  </button>
                </div>

                {/* Default Address */}
                <div className="bg-card rounded-lg p-6 border border-primary relative">
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Default Shipping
                  </div>
                  <div className="font-semibold text-foreground mb-2">Home</div>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    Jane Doe<br />
                    Hamra Street, Building 45, Floor 5<br />
                    Beirut, 1103<br />
                    Lebanon
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                    <button className="text-destructive hover:underline text-sm font-medium">Remove</button>
                  </div>
                </div>

                {/* Office Address */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="font-semibold text-foreground mb-2">Office</div>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    Jane Doe<br />
                    BDD 1294, Ground Floor<br />
                    Beirut, 1107<br />
                    Lebanon
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                    <button className="text-primary hover:underline text-sm font-medium">Set as Default</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Security Settings</h2>

                  {/* 2FA Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                    <p className="text-muted-foreground text-sm mb-4">Add an extra layer of security to your account.</p>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="border-t border-border" />

                  {/* Change Password */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
                    <form className="max-w-md space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          type="password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          type="password"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
