import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onBack: () => void;
}

export function ProductDetail({ product, onAddToCart, onAddToWishlist, isInWishlist, onBack }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items available`);
      return;
    }

    onAddToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleWishlist = () => {
    onAddToWishlist(product);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Product link copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge variant="outline" className="mb-2 capitalize">
                  {product.category === 'mens' && "Men's"}
                  {product.category === 'womens' && "Women's"}
                  {product.category === 'baby' && "Baby's"}
                  {product.category === 'accessories' && 'Accessories'}
                </Badge>
                <h1 className="text-3xl font-bold">{product.name}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleWishlist}>
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            <p className="text-lg font-semibold mb-4">R{product.price.toFixed(2)}</p>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          {/* Product Options */}
          <div className="space-y-4">
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{
                              backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                             color.toLowerCase().includes('white') ? '#fff' :
                                             color.toLowerCase().includes('navy') ? '#001f3f' :
                                             color.toLowerCase().includes('gray') ? '#808080' :
                                             color.toLowerCase().includes('blue') ? '#0074D9' :
                                             color.toLowerCase().includes('pink') ? '#FF69B4' :
                                             color.toLowerCase().includes('brown') ? '#8B4513' :
                                             color.toLowerCase().includes('tan') ? '#D2B48C' :
                                             color.toLowerCase().includes('burgundy') ? '#800020' :
                                             color.toLowerCase().includes('cream') ? '#F5F5DC' :
                                             color.toLowerCase().includes('yellow') ? '#FFDC00' :
                                             color.toLowerCase().includes('green') ? '#2ECC40' :
                                             color.toLowerCase().includes('beige') ? '#F5F5DC' :
                                             color.toLowerCase().includes('charcoal') ? '#36454F' :
                                             color.toLowerCase().includes('gold') ? '#FFD700' :
                                             color.toLowerCase().includes('silver') ? '#C0C0C0' :
                                             color.toLowerCase().includes('tortoise') ? '#8B4513' :
                                             '#ccc'
                            }}
                          />
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(10, product.stockQuantity || 10) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Add to Cart */}
          <div className="space-y-4">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full"
              size="lg"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {product.inStock && (
              <p className="text-sm text-green-600">✓ In stock and ready to ship</p>
            )}
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-medium">Features & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Quality guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                <span>Easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}