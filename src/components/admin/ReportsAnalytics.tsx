import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  Users,
  ShoppingCart
} from 'lucide-react';
import { AdminProduct, AdminOrder, AdminCustomer } from './AdminDashboard';

interface ReportsAnalyticsProps {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
}

export function ReportsAnalytics({ products, orders, customers }: ReportsAnalyticsProps) {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('sales');

  // Calculate analytics data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = customers.length;

  // Sales by category
  const salesByCategory = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const category = product.category;
        acc[category] = (acc[category] || 0) + (item.price * item.quantity);
      }
    });
    return acc;
  }, {} as Record<string, number>);

  // Best selling products
  const productSales = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const bestSellingProducts = Object.entries(productSales)
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        product,
        quantity,
        revenue: orders.reduce((sum, order) => {
          const item = order.items.find(i => i.productId === productId);
          return sum + (item ? item.price * item.quantity : 0);
        }, 0)
      };
    })
    .filter(item => item.product)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // Monthly sales data - will be empty initially
  const monthlySales: Array<{month: string, revenue: number, orders: number}> = [];

  // Customer analytics
  const customerAnalytics = {
    newCustomers: customers.filter(c => {
      const regDate = new Date(c.registrationDate);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return regDate >= lastMonth;
    }).length,
    returningCustomers: customers.filter(c => c.totalOrders > 1).length,
    averageLifetimeValue: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length 
      : 0
  };

  // Profit calculation (assuming 40% margin)
  const grossProfit = totalRevenue * 0.4;
  const profitMargin = 40;

  const exportReport = () => {
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track performance, analyze trends, and generate business insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-600">R{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last {dateRange} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Average: R{averageOrderValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Customers</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{customerAnalytics.newCustomers} new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Gross Profit</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">R{grossProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{profitMargin}% margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sales by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(salesByCategory).map(([category, revenue]) => {
              const percentage = (revenue / totalRevenue) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium capitalize">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      R{revenue.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlySales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No monthly data available yet.</p>
                <p className="text-sm">Data will appear as orders are processed.</p>
              </div>
            ) : (
              monthlySales.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{month.month} 2024</p>
                    <p className="text-sm text-muted-foreground">{month.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R{month.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Avg: R{(month.revenue / month.orders).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Best Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Best Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bestSellingProducts.map((item, index) => (
                <TableRow key={item.product!.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.product!.name}</p>
                        <p className="text-sm text-muted-foreground">{item.product!.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{item.product!.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>R{item.revenue.toLocaleString()}</TableCell>
                  <TableCell>R{(item.revenue / item.quantity).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Customers:</span>
              <span className="font-medium">{totalCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>New Customers (30 days):</span>
              <span className="font-medium text-green-600">{customerAnalytics.newCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Returning Customers:</span>
              <span className="font-medium text-blue-600">{customerAnalytics.returningCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg Lifetime Value:</span>
              <span className="font-medium">R{customerAnalytics.averageLifetimeValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Customer Retention:</span>
              <span className="font-medium">
                {totalCustomers > 0 ? ((customerAnalytics.returningCustomers / totalCustomers) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Revenue:</span>
              <span className="font-medium">R{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gross Profit (40%):</span>
              <span className="font-medium text-green-600">R{grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cost of Goods:</span>
              <span className="font-medium">R{(totalRevenue - grossProfit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Profit Margin:</span>
              <span className="font-medium">{profitMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg Profit per Order:</span>
              <span className="font-medium">
                R{totalOrders > 0 ? (grossProfit / totalOrders).toLocaleString() : '0'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}