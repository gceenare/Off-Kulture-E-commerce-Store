import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Truck, 
  Search, 
  MapPin, 
  Package, 
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
// Using simplified order structure
import { toast } from 'sonner@2.0.3';

interface CourierPartner {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  serviceAreas: string[];
  rates: {
    standard: number;
    express: number;
    overnight: number;
  };
  isActive: boolean;
  rating: number;
  trackingUrl: string;
}

interface ShippingZone {
  id: string;
  name: string;
  areas: string[];
  standardRate: number;
  expressRate: number;
  freeShippingThreshold: number;
  estimatedDays: string;
}

interface ShippingManagementProps {
  orders: any[];
}

export function ShippingManagement({ orders }: ShippingManagementProps) {
  const [courierPartners, setCourierPartners] = useState<CourierPartner[]>([]);

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);

  const [activeTab, setActiveTab] = useState<'orders' | 'partners' | 'zones'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter orders for shipping
  const shippingOrders = orders.filter(order => 
    ['Processing', 'Shipped'].includes(order.status)
  );

  const filteredOrders = shippingOrders.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAssignCourier = (orderId: string, courierId: string) => {
    const courier = courierPartners.find(c => c.id === courierId);
    if (courier) {
      toast.success(`Order ${orderId} assigned to ${courier.name}`);
    }
  };

  const handleGenerateLabel = (orderId: string) => {
    toast.success(`Shipping label generated for order ${orderId}`);
  };

  const handleTrackShipment = (trackingNumber: string, courierName: string) => {
    toast.info(`Opening tracking for ${trackingNumber} with ${courierName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Shipping & Delivery Management</h1>
          <p className="text-muted-foreground">Manage courier partners, shipping zones, and track deliveries</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          onClick={() => setActiveTab('orders')}
        >
          <Package className="h-4 w-4 mr-2" />
          Shipping Orders
        </Button>
        <Button 
          variant={activeTab === 'partners' ? 'default' : 'outline'}
          onClick={() => setActiveTab('partners')}
        >
          <Truck className="h-4 w-4 mr-2" />
          Courier Partners
        </Button>
        <Button 
          variant={activeTab === 'zones' ? 'default' : 'outline'}
          onClick={() => setActiveTab('zones')}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Shipping Zones
        </Button>
      </div>

      {/* Shipping Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Pending Shipment</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'Processing').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">In Transit</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'Shipped').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Delivered Today</span>
                </div>
                <div className="text-2xl font-bold text-green-600">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Active Deliveries</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'Shipped').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search orders by ID or customer name..."
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
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Ready for Shipping ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Tracking</TableHead>
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
                      <TableCell>
                        <div className="text-sm">
                          {order.shippingAddress.split(',').slice(0, 2).join(',')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'Processing' ? 'outline' :
                            order.status === 'Shipped' ? 'default' :
                            'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.courier ? (
                          <span className="text-sm">{order.courier}</span>
                        ) : (
                          <Select onValueChange={(value) => handleAssignCourier(order.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {courierPartners.filter(c => c.isActive).map(courier => (
                                <SelectItem key={courier.id} value={courier.id}>
                                  {courier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.trackingNumber ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTrackShipment(order.trackingNumber!, order.courier!)}
                          >
                            {order.trackingNumber}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleGenerateLabel(order.id)}
                          >
                            <Package className="h-4 w-4" />
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

      {/* Courier Partners Tab */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Courier Partners ({courierPartners.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {courierPartners.map((partner) => (
                  <Card key={partner.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{partner.name}</h3>
                            <Badge variant={partner.isActive ? 'default' : 'outline'}>
                              {partner.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">★ {partner.rating}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Contact Information</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3" />
                                  {partner.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  {partner.phone}
                                </div>
                                <p>Contact: {partner.contactName}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Service Areas</h4>
                              <div className="flex flex-wrap gap-1">
                                {partner.serviceAreas.map((area, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Rates</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Standard:</span>
                                  <span>R{partner.rates.standard}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Express:</span>
                                  <span>R{partner.rates.express}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Overnight:</span>
                                  <span>R{partner.rates.overnight}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

      {/* Shipping Zones Tab */}
      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Zone
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Zones ({shippingZones.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Areas Covered</TableHead>
                    <TableHead>Standard Rate</TableHead>
                    <TableHead>Express Rate</TableHead>
                    <TableHead>Free Shipping</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippingZones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {zone.areas.slice(0, 3).map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {zone.areas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{zone.areas.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>R{zone.standardRate}</TableCell>
                      <TableCell>R{zone.expressRate}</TableCell>
                      <TableCell>R{zone.freeShippingThreshold}+</TableCell>
                      <TableCell>{zone.estimatedDays} days</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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
    </div>
  );
}