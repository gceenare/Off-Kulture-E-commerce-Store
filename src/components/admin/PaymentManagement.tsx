import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  CreditCard, 
  Search, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { AdminOrder } from './AdminDashboard';
import { toast } from 'sonner@2.0.3';

interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  method: string;
  gateway: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  processedAt: string;
  refundAmount?: number;
  refundReason?: string;
  gatewayFee: number;
  netAmount: number;
}

interface PaymentManagementProps {
  orders: AdminOrder[];
}

export function PaymentManagement({ orders }: PaymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Generate mock payment transactions from orders
  const transactions: PaymentTransaction[] = orders.map(order => ({
    id: `txn_${order.id.replace('ORD-', '')}`,
    orderId: order.id,
    amount: order.total,
    status: order.paymentStatus,
    method: order.paymentMethod,
    gateway: order.paymentMethod === 'Credit Card' ? 'PayGate' : 'PayFast',
    transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    processedAt: order.orderDate,
    gatewayFee: order.total * 0.035, // 3.5% gateway fee
    netAmount: order.total * 0.965,
    ...(order.paymentStatus === 'Refunded' && {
      refundAmount: order.total,
      refundReason: 'Customer request'
    })
  }));

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || transaction.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate payment statistics
  const totalRevenue = transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
  const totalFees = transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.gatewayFee, 0);
  const netRevenue = totalRevenue - totalFees;
  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
  const refundedAmount = transactions.filter(t => t.status === 'Refunded').reduce((sum, t) => sum + (t.refundAmount || 0), 0);
  const failedTransactions = transactions.filter(t => t.status === 'Failed').length;

  const handleProcessRefund = (transactionId: string, amount: number) => {
    // Mock refund processing
    toast.success(`Refund of R${amount.toLocaleString()} processed for transaction ${transactionId}`);
  };

  const handleRetryPayment = (transactionId: string) => {
    // Mock payment retry
    toast.success(`Payment retry initiated for transaction ${transactionId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'Pending': return Clock;
      case 'Failed': return XCircle;
      case 'Refunded': return RefreshCw;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      case 'Refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Payment & Transaction Management</h1>
          <p className="text-muted-foreground">Monitor payments, process refunds, and track transaction fees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Transactions
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Payments
          </Button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-600">R{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Net Revenue</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">R{netRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After gateway fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">R{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Refunded</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">R{refundedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total refunds</p>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Fees Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gateway Fees Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">R{totalFees.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Fees Paid</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalRevenue > 0 ? ((totalFees / totalRevenue) * 100).toFixed(2) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Average Fee Rate</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{failedTransactions}</div>
              <p className="text-sm text-muted-foreground">Failed Transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order ID, customer, or transaction ID..."
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
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="EFT">EFT</SelectItem>
                <SelectItem value="SnapScan">SnapScan</SelectItem>
                <SelectItem value="Zapper">Zapper</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const StatusIcon = getStatusIcon(transaction.status);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">{transaction.transactionId}</TableCell>
                    <TableCell className="font-mono text-sm">{transaction.orderId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.customerName}</p>
                        <p className="text-sm text-muted-foreground">{transaction.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">R{transaction.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Fee: R{transaction.gatewayFee.toFixed(2)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.gateway}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.processedAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.status === 'Completed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleProcessRefund(transaction.id, transaction.amount)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        {transaction.status === 'Failed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRetryPayment(transaction.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Credit Card', 'EFT', 'SnapScan', 'Zapper'].map(method => {
              const methodTransactions = transactions.filter(t => t.method === method && t.status === 'Completed');
              const methodRevenue = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
              const methodCount = methodTransactions.length;
              
              return (
                <div key={method} className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{method}</h3>
                  <div className="text-lg font-bold">R{methodRevenue.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">{methodCount} transactions</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}