import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TrackOrderProps {
  onBack: () => void;
}

export function TrackOrder({ onBack }: TrackOrderProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber && !orderEmail) {
      toast.error('Please enter either a tracking number or order email');
      return;
    }

    setIsLoading(true);
    
    // Mock tracking data - in a real app, this would call your backend
    setTimeout(() => {
      if (trackingNumber.toLowerCase().includes('ord') || orderEmail) {
        setTrackingResult({
          orderNumber: trackingNumber || 'ORD-2024-0001',
          status: 'In Transit',
          estimatedDelivery: '2024-01-15',
          courier: 'The Courier Guy',
          trackingNumber: 'TCG123456789',
          updates: [
            {
              date: '2024-01-12',
              time: '09:30',
              status: 'Order Processed',
              location: 'OffKulture Warehouse, Cape Town',
              icon: Package
            },
            {
              date: '2024-01-12',
              time: '15:45',
              status: 'Dispatched',
              location: 'Cape Town Distribution Center',
              icon: Truck
            },
            {
              date: '2024-01-13',
              time: '08:20',
              status: 'In Transit',
              location: 'Johannesburg Hub',
              icon: MapPin
            },
            {
              date: '2024-01-14',
              time: '14:15',
              status: 'Out for Delivery',
              location: 'Johannesburg Local Depot',
              icon: Clock
            }
          ]
        });
      } else {
        setTrackingResult(null);
        toast.error('Order not found. Please check your tracking number or email.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in transit':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'dispatched':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-primary hover:underline mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Track Your Order
          </h1>
          <p className="text-muted-foreground">Enter your order details to track your package</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tracking" className="block mb-2">Order Number or Tracking Number</label>
                  <Input
                    id="tracking"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="ORD-2024-0001 or TCG123456789"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2">Email Address (Optional)</label>
                  <Input
                    id="email"
                    type="email"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Searching...' : 'Track Order'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {trackingResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-medium">{trackingResult.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Courier:</span>
                      <span className="font-medium">{trackingResult.courier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking Number:</span>
                      <span className="font-medium">{trackingResult.trackingNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(trackingResult.status)}>
                        {trackingResult.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Delivery:</span>
                      <span className="font-medium">{trackingResult.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.updates.map((update: any, index: number) => {
                    const Icon = update.icon;
                    const isLatest = index === trackingResult.updates.length - 1;
                    return (
                      <div key={index} className={`flex gap-4 pb-4 ${index < trackingResult.updates.length - 1 ? 'border-b' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLatest ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h3 className={`font-medium ${isLatest ? 'text-primary' : ''}`}>
                              {update.status}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {update.date} at {update.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Delivery Instructions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Someone will need to be available to sign for the package</li>
                  <li>• Valid ID may be required for verification</li>
                  <li>• If you're not available, the courier will leave a collection notice</li>
                  <li>• Contact the courier directly for delivery time estimates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Contact Our Customer Service</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Email:</strong> orders@offkulture.co.za</p>
                  <p><strong>Phone:</strong> +27 21 123 4567</p>
                  <p><strong>WhatsApp:</strong> +27 82 456 7890</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-6PM SAST</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Courier Contact Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>The Courier Guy:</strong> 0861 COURIER</p>
                  <p><strong>FastWay:</strong> 0861 FASTWAY</p>
                  <p><strong>RAM:</strong> 011 608 0000</p>
                  <p><strong>Dawn Wing:</strong> 0860 11 12 13</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}