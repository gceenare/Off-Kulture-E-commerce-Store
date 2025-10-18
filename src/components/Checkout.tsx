import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { CartItem, User } from '../App';
import { toast } from 'sonner@2.0.3';

interface CheckoutProps {
  items: CartItem[];
  totalPrice: number;
  user: User | null;
  onOrderComplete: () => void;
}

export function Checkout({ items, totalPrice, user, onOrderComplete }: CheckoutProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    sameAsShipping: true
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 99.99;
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax + (paymentMethod === 'cod' ? 50 : 0); // Add COD fee

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate shipping data
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];
    const isValid = requiredFields.every(field => shippingData[field as keyof typeof shippingData]);
    
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate payment data based on method
    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.nameOnCard) {
        toast.error('Please fill in all payment fields');
        return;
      }
    }
    // Other payment methods (EFT, PayFast, etc.) would be validated here
    
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success('Order placed successfully! You will receive a confirmation email shortly.');
      onOrderComplete();
      setIsProcessing(false);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
          <Button onClick={() => window.history.back()}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center ${step === 'shipping' ? 'text-primary' : step === 'payment' || step === 'review' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'shipping' ? 'bg-primary text-primary-foreground' : step === 'payment' || step === 'review' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Delivery</span>
            </div>
            <div className="flex-1 h-px bg-border"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-primary' : step === 'review' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'bg-primary text-primary-foreground' : step === 'review' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className="flex-1 h-px bg-border"></div>
            <div className={`flex items-center ${step === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingData.lastName}
                          onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Province *</Label>
                        <Select value={shippingData.province} onValueChange={(value) => setShippingData({...shippingData, province: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="western-cape">Western Cape</SelectItem>
                            <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                            <SelectItem value="northern-cape">Northern Cape</SelectItem>
                            <SelectItem value="free-state">Free State</SelectItem>
                            <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                            <SelectItem value="north-west">North West</SelectItem>
                            <SelectItem value="gauteng">Gauteng</SelectItem>
                            <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="limpopo">Limpopo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={shippingData.postalCode}
                          onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    {/* Payment Method Selection */}
                    <div>
                      <Label>Payment Method *</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="eft">EFT Bank Transfer</SelectItem>
                          <SelectItem value="payfast">PayFast</SelectItem>
                          <SelectItem value="snapscan">SnapScan</SelectItem>
                          <SelectItem value="zapper">Zapper</SelectItem>
                          <SelectItem value="cod">Cash on Delivery (+R50)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Card Payment Fields */}
                    {paymentMethod === 'card' && (
                      <>
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData({...paymentData, cardNumber: formatCardNumber(e.target.value)})}
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentData.expiryDate}
                              onChange={(e) => setPaymentData({...paymentData, expiryDate: formatExpiryDate(e.target.value)})}
                              maxLength={5}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentData.cvv}
                              onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '')})}
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="nameOnCard">Name on Card *</Label>
                          <Input
                            id="nameOnCard"
                            placeholder="John Doe"
                            value={paymentData.nameOnCard}
                            onChange={(e) => setPaymentData({...paymentData, nameOnCard: e.target.value})}
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sameAsShipping"
                            checked={paymentData.sameAsShipping}
                            onCheckedChange={(checked) => setPaymentData({...paymentData, sameAsShipping: checked as boolean})}
                          />
                          <Label htmlFor="sameAsShipping">Billing address same as delivery address</Label>
                        </div>
                      </>
                    )}

                    {/* EFT Payment Info */}
                    {paymentMethod === 'eft' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Bank:</strong> Standard Bank</p>
                          <p><strong>Account Name:</strong> OffKulture (Pty) Ltd</p>
                          <p><strong>Account Number:</strong> 123456789</p>
                          <p><strong>Branch Code:</strong> 051001</p>
                          <p><strong>Reference:</strong> Your order number will be provided</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Please use your order number as reference when making payment
                        </p>
                      </div>
                    )}

                    {/* PayFast Payment Info */}
                    {paymentMethod === 'payfast' && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">PayFast Secure Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          You will be redirected to PayFast to complete your payment securely.
                          PayFast accepts all major credit cards, bank transfers, and more.
                        </p>
                      </div>
                    )}

                    {/* Mobile Payment Options */}
                    {(paymentMethod === 'snapscan' || paymentMethod === 'zapper') && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">
                          {paymentMethod === 'snapscan' ? 'SnapScan' : 'Zapper'} Payment
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          You will receive a QR code to scan with your {paymentMethod === 'snapscan' ? 'SnapScan' : 'Zapper'} app
                          to complete the payment.
                        </p>
                      </div>
                    )}

                    {/* Cash on Delivery */}
                    {paymentMethod === 'cod' && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Cash on Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay with cash when your order is delivered. Additional R50 COD fee applies.
                          Available only in major cities.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                        Back to Delivery
                      </Button>
                      <Button type="submit" className="flex-1">
                        Review Order
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Summary */}
                  <div>
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>{shippingData.firstName} {shippingData.lastName}</p>
                      <p>{shippingData.address}</p>
                      <p>{shippingData.city}, {shippingData.province} {shippingData.postalCode}</p>
                      <p>{shippingData.email}</p>
                      <p>{shippingData.phone}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Summary */}
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="text-sm text-muted-foreground">
                      {paymentMethod === 'card' && `Card ending in ${paymentData.cardNumber.slice(-4)}`}
                      {paymentMethod === 'eft' && 'EFT Bank Transfer'}
                      {paymentMethod === 'payfast' && 'PayFast'}
                      {paymentMethod === 'snapscan' && 'SnapScan'}
                      {paymentMethod === 'zapper' && 'Zapper'}
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                {item.selectedSize && item.selectedColor && ' • '}
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                              </p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep('payment')} className="flex-1">
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex-1">
                      {isProcessing ? 'Processing...' : `Place Order - R${total.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          Qty: {item.quantity}
                          {item.selectedSize && ` • ${item.selectedSize}`}
                          {item.selectedColor && ` • ${item.selectedColor}`}
                        </p>
                      </div>
                      <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between">
                      <span>COD Fee</span>
                      <span>R50.00</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>VAT (15%)</span>
                    <span>R{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    🎉 You qualify for free shipping!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}