import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { 
  Eye, 
  Search, 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { AdminCustomer, AdminOrder } from './AdminDashboard';
import { toast } from 'sonner@2.0.3';

interface CustomerManagementProps {
  customers: AdminCustomer[];
  setCustomers: React.Dispatch<React.SetStateAction<AdminCustomer[]>>;
  orders: AdminOrder[];
}

export function CustomerManagement({ customers, setCustomers, orders }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    return matchesSearch;
  });

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => 
      customers.find(customer => 
        customer.email === order.customerEmail && customer.id === customerId
      )
    );
  };

  const getCustomerLifetimeValue = (customerId: string) => {
    const customerOrders = getCustomerOrders(customerId);
    return customerOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, notes: customerNotes }
          : customer
      ));
      toast.success('Customer notes saved successfully!');
    }
  };

  const handleRefund = (orderId: string, amount: number) => {
    // Mock refund processing
    toast.success(`Refund of R${amount.toLocaleString()} processed for order ${orderId}`);
  };

  // Customer statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive).length;
  const newCustomersThisMonth = customers.filter(customer => {
    const regDate = new Date(customer.registrationDate);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return regDate >= lastMonth;
  }).length;
  const averageOrderValue = customers.length > 0 
    ? customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / totalCustomers 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer profiles, view order history, and handle support requests</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Customers</span>
            </div>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">New This Month</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{newCustomersThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active Customers</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{activeCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Avg Order Value</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">R{averageOrderValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.registrationDate}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell className="font-medium">R{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={customer.isActive ? 'default' : 'outline'}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerNotes(customer.notes || '');
                        setIsCustomerDetailOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isCustomerDetailOpen} onOpenChange={setIsCustomerDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              View customer information, order history, and manage customer notes.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {selectedCustomer.registrationDate}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-medium">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent:</span>
                      <span className="font-medium">R{selectedCustomer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order:</span>
                      <span className="font-medium">
                        R{selectedCustomer.totalOrders > 0 
                          ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString() 
                          : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Order:</span>
                      <span className="font-medium">{selectedCustomer.lastOrderDate || 'None'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCustomerOrders(selectedCustomer.id).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R{order.total.toLocaleString()}</p>
                          <Badge 
                            variant={
                              order.status === 'Delivered' ? 'default' :
                              order.status === 'Cancelled' ? 'destructive' :
                              'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {getCustomerOrders(selectedCustomer.id).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No orders found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Add notes about this customer..."
                    rows={4}
                  />
                  <Button onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button onClick={() => setIsCustomerDetailOpen(false)}>
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