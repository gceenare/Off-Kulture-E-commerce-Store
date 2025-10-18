import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Truck, Clock, MapPin, Shield, Package } from 'lucide-react';

interface ShippingProps {
  onBack: () => void;
}

export function Shipping({ onBack }: ShippingProps) {
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
            <Truck className="h-8 w-8" />
            Shipping Information
          </h1>
          <p className="text-muted-foreground">Everything you need to know about our delivery options and policies</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">South Africa</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Major Cities (CPT, JHB, DBN, PE)</span>
                      <span className="font-medium">R80</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Urban Areas</span>
                      <span className="font-medium">R120</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rural Areas</span>
                      <span className="font-medium">R150</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>Free Shipping</span>
                      <span className="font-medium">Orders over R800</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Regional (SADC)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Botswana, Lesotho, Swaziland</span>
                      <span className="font-medium">R250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Namibia, Zimbabwe</span>
                      <span className="font-medium">R350</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other SADC Countries</span>
                      <span className="font-medium">R450</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Delivery Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Standard Delivery</h3>
                  <p className="text-sm text-muted-foreground mb-2">3-5 business days</p>
                  <p className="text-xs">Major cities and urban areas</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Express Delivery</h3>
                  <p className="text-sm text-muted-foreground mb-2">1-2 business days</p>
                  <p className="text-xs">Available in Cape Town, Johannesburg, Durban (+R50)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Secure Delivery</h3>
                  <p className="text-sm text-muted-foreground mb-2">3-7 business days</p>
                  <p className="text-xs">Rural areas and remote locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Partners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Courier Services</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• The Courier Guy</li>
                    <li>• FastWay Couriers</li>
                    <li>• RAM Hand-to-Hand Couriers</li>
                    <li>• Dawn Wing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Postal Services</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• South African Post Office</li>
                    <li>• PostNet</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Processing Time</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Orders are processed within 1-2 business days. Orders placed after 2PM on Friday 
                    will be processed on the following Monday.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Order Tracking</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    You'll receive a tracking number via email and SMS once your order ships. 
                    Track your package through our tracking page or directly with the courier.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Delivery Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valid physical address required (no PO Boxes for courier)</li>
                    <li>• Someone must be available to sign for delivery</li>
                    <li>• Valid contact number essential</li>
                    <li>• ID may be required for high-value items</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Failed Deliveries</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 3 delivery attempts will be made</li>
                    <li>• Package returned to depot after failed attempts</li>
                    <li>• Collection or redelivery fees may apply</li>
                    <li>• Contact us within 7 days to arrange collection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Need Help with Your Delivery?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our customer service team for assistance with shipping questions, 
                tracking issues, or special delivery requirements.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span><strong>Email:</strong> shipping@offkulture.co.za</span>
                <span><strong>Phone:</strong> +27 21 123 4567</span>
                <span><strong>WhatsApp:</strong> +27 82 456 7890</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}