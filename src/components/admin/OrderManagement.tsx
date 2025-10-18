import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Truck, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react';
import { AdminOrder } from './AdminDashboard';
import { toast } from 'sonner@2.0.3';

interface OrderManagementProps {
  orders: any[];
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export function OrderManagement({ orders, onUpdateStatus }: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || (order.paymentStatus && order.paymentStatus === filterPayment);
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    onUpdateStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleGenerateInvoice = (order: AdminOrder) => {
    // Mock invoice generation
    toast.success(`Invoice generated for order ${order.id}`);
  };

  const handleAddTrackingNumber = (orderId: string, trackingNumber: string, courier: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, trackingNumber, courier }
        : order
    ));
    toast.success('Tracking information added successfully!');
  };

  const getStatusIcon = (status: AdminOrder['status']) => {
    switch (status) {
      case 'Pending': return Clock;
      case 'Processing': return Package;
      case 'Shipped': return Truck;
      case 'Delivered': return CheckCircle;
      case 'Cancelled': return XCircle;
      case 'Refunded': return RefreshCw;
      default: return Clock;
    }
  };

  const getStatusColor = (status: AdminOrder['status']) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      case 'Shipped': return 'text-purple-600 bg-purple-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      case 'Refunded': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const orderStatuses: AdminOrder['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders, update status, and generate invoices</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {orderStatuses.map((status) => {
          const count = orders.filter(order => order.status === status).length;
          const StatusIcon = getStatusIcon(status);
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{status}</span>
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value as AdminOrder['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.paymentStatus === 'Completed' ? 'default' :
                        order.paymentStatus === 'Pending' ? 'outline' :
                        'destructive'
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">R{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleGenerateInvoice(order)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              View complete order information, items, and shipping details.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{selectedOrder.orderDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-medium">{selectedOrder.shippingAddress}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} 
                            {item.size && ` • Size: ${item.size}`}
                            {item.color && ` • Color: ${item.color}`}
                          </p>
                        </div>
                        <p className="font-medium">R{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>R{selectedOrder.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (15%):</span>
                      <span>R{selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total:</span>
                      <span>R{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status & Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status & Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <Badge 
                        variant={
                          selectedOrder.paymentStatus === 'Completed' ? 'default' :
                          selectedOrder.paymentStatus === 'Pending' ? 'outline' :
                          'destructive'
                        }
                      >
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedOrder.trackingNumber ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-mono">{selectedOrder.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Courier</p>
                        <p className="font-medium">{selectedOrder.courier}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Add tracking information:</p>
                      <div className="flex gap-2">
                        <Input placeholder="Tracking number" className="flex-1" />
                        <Input placeholder="Courier" className="flex-1" />
                        <Button size="sm">Add</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleGenerateInvoice(selectedOrder)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button onClick={() => setIsOrderDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}