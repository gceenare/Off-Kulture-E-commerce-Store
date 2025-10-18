import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { ShippingManagement } from './ShippingManagement';
import { UserRoleManagement } from './UserRoleManagement';
import { AdminSettings } from './AdminSettings';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
// Logo will be text-based for now

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Staff' | 'Marketing' | 'Stock Manager';
  permissions: string[];
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  collection: string;
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  images: string[];
  sku: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  courier?: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paymentMethod: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  orderHistory: string[];
  isActive: boolean;
  notes?: string;
}

type AdminPage = 'products' | 'orders' | 'shipping' | 'users' | 'settings';

interface AdminDashboardProps {
  onLogout: () => void;
  products: any[];
  orders: any[];
  onUpdateProductStock: (productId: string, newQuantity: number) => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (product: any) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: string) => void;
}

export function AdminDashboard({ onLogout, products, orders, onUpdateProductStock, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateOrderStatus }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('products');
  const [adminUser] = useState<AdminUser>({
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@offkulture.co.za',
    role: 'Super Admin',
    permissions: ['all']
  });

  // State is now managed in App.tsx and passed as props

  const handleLogout = () => {
    toast.success('Logged out successfully');
    onLogout();
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, newStatus);
    }
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'products':
        return (
          <ProductManagement 
            products={products} 
            onUpdateStock={onUpdateProductStock}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      case 'orders':
        return <OrderManagement orders={orders} onUpdateStatus={updateOrderStatus} />;
      case 'shipping':
        return <ShippingManagement orders={orders} />;
      case 'users':
        return <UserRoleManagement currentUser={adminUser} />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <ProductManagement 
            products={products} 
            onUpdateStock={onUpdateProductStock}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        userRole={adminUser.role}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 flex items-center">
                <span className="text-lg font-bold">
                  <span className="text-green-600">Off</span>Kulture
                </span>
              </div>
              <div>
                <h1 className="text-lg font-medium">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">OffKulture E-commerce Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{adminUser.name}</p>
                <p className="text-xs text-muted-foreground">{adminUser.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}