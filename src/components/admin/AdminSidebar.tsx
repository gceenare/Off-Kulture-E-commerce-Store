import React from 'react';
import { cn } from '../ui/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderOpen, 
  CreditCard, 
  Truck, 
  BarChart3, 
  Shield, 
  Settings,
  Badge
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole: 'Super Admin' | 'Staff' | 'Marketing' | 'Stock Manager';
}

export function AdminSidebar({ currentPage, onPageChange, userRole }: AdminSidebarProps) {
  const menuItems = [
    { 
      id: 'products', 
      label: 'Products & Stock', 
      icon: Package, 
      roles: ['Super Admin', 'Staff', 'Stock Manager']
    },
    { 
      id: 'orders', 
      label: 'Order Management', 
      icon: ShoppingCart, 
      roles: ['Super Admin', 'Staff']
    },
    { 
      id: 'shipping', 
      label: 'Shipping', 
      icon: Truck, 
      roles: ['Super Admin', 'Staff'] 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Shield, 
      roles: ['Super Admin'] 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      roles: ['Super Admin', 'Staff'] 
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-medium text-sidebar-foreground">Admin Panel</h2>
        <p className="text-sm text-sidebar-foreground/60">OffKulture Management</p>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          <p>Role: <span className="font-medium">{userRole}</span></p>
          <p className="mt-1">© 2024 OffKulture</p>
        </div>
      </div>
    </div>
  );
}