import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AdminProduct, AdminOrder, AdminCustomer } from './AdminDashboard';

interface DashboardOverviewProps {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
}

export function DashboardOverview({ products, orders, customers }: DashboardOverviewProps) {
  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
  const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(customer => {
    const regDate = new Date(customer.registrationDate);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return regDate >= lastWeek;
  }).length;
  const returningCustomers = customers.filter(customer => customer.totalOrders > 1).length;
  const lowStockProducts = products.filter(product => 
    product.stockQuantity <= product.lowStockThreshold
  );

  // Calculate actual sales data or show empty state
  const salesData = {
    daily: { revenue: 0, change: 0, trend: 'up' },
    weekly: { revenue: 0, change: 0, trend: 'up' },
    monthly: { revenue: totalRevenue, change: 0, trend: 'up' }
  };

  const recentOrders = orders.slice(0, 5);
  const topProducts = products
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{salesData.daily.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {salesData.daily.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={salesData.daily.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(salesData.daily.change)}%
              </span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{salesData.weekly.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {salesData.weekly.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={salesData.weekly.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(salesData.weekly.change)}%
              </span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{salesData.monthly.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {salesData.monthly.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={salesData.monthly.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(salesData.monthly.change)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cancelledOrders}</div>
            <p className="text-xs text-muted-foreground">Cancelled orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{newCustomers}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returning Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{returningCustomers}</div>
            <p className="text-xs text-muted-foreground">Multiple orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground">All products are well stocked!</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      {product.stockQuantity} left
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Threshold: {product.lowStockThreshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No recent orders</p>
                  <p className="text-sm">Orders will appear here as they are placed</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R{order.total.toLocaleString()}</p>
                      <Badge 
                        variant={
                          order.status === 'Pending' ? 'outline' :
                          order.status === 'Processing' ? 'secondary' :
                          order.status === 'Delivered' ? 'default' :
                          'destructive'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No products available</p>
                  <p className="text-sm">Add products to see inventory status</p>
                </div>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.stockQuantity} units</p>
                      <Badge 
                        variant={
                          product.stockQuantity <= product.lowStockThreshold ? 'destructive' :
                          product.stockQuantity <= product.lowStockThreshold * 2 ? 'outline' :
                          'default'
                        }
                      >
                        {product.stockQuantity <= product.lowStockThreshold ? 'Low Stock' :
                         product.stockQuantity <= product.lowStockThreshold * 2 ? 'Medium' :
                         'In Stock'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}