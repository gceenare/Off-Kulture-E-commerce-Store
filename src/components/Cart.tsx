import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onRemoveItem: (id: string, selectedSize?: string, selectedColor?: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 99.99; // Free shipping over R500
  const tax = subtotal * 0.15; // 15% VAT in South Africa
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={() => window.history.back()}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {item.selectedColor && (
                            <Badge variant="outline" className="text-xs">
                              {item.selectedColor}
                            </Badge>
                          )}
                          {item.selectedSize && (
                            <Badge variant="outline" className="text-xs">
                              {item.selectedSize}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">R{item.price.toFixed(2)}</span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="flex justify-between">
                <span>VAT (15%)</span>
                <span>R{tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-muted-foreground">
                  Add R{(500 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}

              <Button onClick={onCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Free shipping on orders over R500</p>
                <p>• 30-day return policy</p>
                <p>• Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}