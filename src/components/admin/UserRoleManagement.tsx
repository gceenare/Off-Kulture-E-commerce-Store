import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Key,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import { AdminUser } from './AdminDashboard';
import { toast } from 'sonner@2.0.3';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface UserRoleManagementProps {
  currentUser: AdminUser;
}

export function UserRoleManagement({ currentUser }: UserRoleManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>([
    // Initialize with just the current user
    currentUser
  ]);

  const [permissions] = useState<Permission[]>([
    // Dashboard
    { id: 'dashboard.read', name: 'View Dashboard', description: 'Access to main dashboard', category: 'Dashboard' },
    
    // Products
    { id: 'products.read', name: 'View Products', description: 'View product listings', category: 'Products' },
    { id: 'products.create', name: 'Create Products', description: 'Add new products', category: 'Products' },
    { id: 'products.update', name: 'Edit Products', description: 'Modify existing products', category: 'Products' },
    { id: 'products.delete', name: 'Delete Products', description: 'Remove products', category: 'Products' },
    { id: 'inventory.manage', name: 'Manage Inventory', description: 'Update stock levels', category: 'Products' },
    
    // Orders
    { id: 'orders.read', name: 'View Orders', description: 'View order listings', category: 'Orders' },
    { id: 'orders.update', name: 'Update Orders', description: 'Modify order status', category: 'Orders' },
    { id: 'orders.refund', name: 'Process Refunds', description: 'Handle refunds', category: 'Orders' },
    
    // Customers
    { id: 'customers.read', name: 'View Customers', description: 'View customer data', category: 'Customers' },
    { id: 'customers.update', name: 'Edit Customers', description: 'Modify customer info', category: 'Customers' },
    
    // Categories
    { id: 'categories.manage', name: 'Manage Categories', description: 'Create and edit categories', category: 'Categories' },
    
    // Payments
    { id: 'payments.read', name: 'View Payments', description: 'View payment data', category: 'Payments' },
    { id: 'payments.refund', name: 'Process Refunds', description: 'Handle payment refunds', category: 'Payments' },
    
    // Reports
    { id: 'reports.read', name: 'View Reports', description: 'Access analytics and reports', category: 'Reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Download report data', category: 'Reports' },
    
    // Settings
    { id: 'settings.read', name: 'View Settings', description: 'View system settings', category: 'Settings' },
    { id: 'settings.update', name: 'Edit Settings', description: 'Modify system settings', category: 'Settings' },
    
    // Users
    { id: 'users.read', name: 'View Users', description: 'View user accounts', category: 'Users' },
    { id: 'users.create', name: 'Create Users', description: 'Add new users', category: 'Users' },
    { id: 'users.update', name: 'Edit Users', description: 'Modify user accounts', category: 'Users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'Users' }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'staff',
      name: 'Staff',
      description: 'General staff with order and customer management',
      permissions: [
        'dashboard.read', 'orders.read', 'orders.update', 'orders.refund',
        'products.read', 'customers.read', 'customers.update', 'payments.read'
      ],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Marketing team with analytics and customer data access',
      permissions: [
        'dashboard.read', 'products.read', 'customers.read', 
        'categories.manage', 'reports.read', 'reports.export'
      ],
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'stock-manager',
      name: 'Stock Manager',
      description: 'Inventory management and product updates',
      permissions: [
        'dashboard.read', 'products.read', 'products.update', 
        'inventory.manage', 'reports.read'
      ],
      color: 'bg-purple-100 text-purple-800'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    role: 'Staff',
    permissions: []
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const role = roles.find(r => r.name === newUser.role);
    const user: AdminUser = {
      id: `user_${Date.now()}`,
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role! as AdminUser['role'],
      permissions: role?.permissions || []
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', role: 'Staff', permissions: [] });
    setIsUserDialogOpen(false);
    toast.success('User added successfully!');
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setNewUser(user);
    setIsUserDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const role = roles.find(r => r.name === newUser.role);
    setUsers(prev => prev.map(u => 
      u.id === editingUser.id 
        ? { ...newUser as AdminUser, id: editingUser.id, permissions: role?.permissions || [] }
        : u
    ));
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Staff', permissions: [] });
    setIsUserDialogOpen(false);
    toast.success('User updated successfully!');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast.error('Cannot delete your own account');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('User deleted successfully!');
  };

  const getRoleColor = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    return role?.color || 'bg-gray-100 text-gray-800';
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">User & Role Management</h1>
          <p className="text-muted-foreground">Manage team access, roles, and permissions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}
        >
          <Users className="h-4 w-4 mr-2" />
          Users
        </Button>
        <Button 
          variant={activeTab === 'roles' ? 'default' : 'outline'}
          onClick={() => setActiveTab('roles')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Roles
        </Button>
        <Button 
          variant={activeTab === 'permissions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('permissions')}
        >
          <Key className="h-4 w-4 mr-2" />
          Permissions
        </Button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingUser(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                  <DialogDescription>
                    {editingUser ? 'Update the user account details.' : 'Create a new user account with assigned role.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Full Name *</label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@offkulture.co.za"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Role *</label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as AdminUser['role'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.filter(role => role.name !== 'Super Admin' || currentUser.role === 'Super Admin').map(role => (
                          <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                      {editingUser ? 'Update User' : 'Add User'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {user.permissions.includes('all') 
                            ? 'All permissions' 
                            : `${user.permissions.length} permissions`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                            disabled={user.id === currentUser.id && user.role === 'Super Admin'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Roles ({roles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={role.color}>
                              {role.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {users.filter(u => u.role === role.name).length} users
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.includes('all') ? (
                              <Badge variant="outline" className="text-xs">All Permissions</Badge>
                            ) : (
                              role.permissions.slice(0, 5).map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permissions.find(p => p.id === permission)?.name || permission}
                                </Badge>
                              ))
                            )}
                            {role.permissions.length > 5 && !role.permissions.includes('all') && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {category}
                    </h3>
                    <div className="grid gap-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{permission.name}</p>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            {permission.id}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}