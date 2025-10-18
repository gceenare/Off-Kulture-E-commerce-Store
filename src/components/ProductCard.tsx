import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
}

export function ProductCard({ product, onClick, onAddToWishlist, isInWishlist }: ProductCardProps) {
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist();
      if (isInWishlist) {
        toast.success(`${product.name} removed from wishlist`);
      } else {
        toast.success(`${product.name} added to wishlist`);
      }
    }
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div onClick={onClick}>
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {onAddToWishlist && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-2 h-auto bg-white/80 hover:bg-white/90 backdrop-blur-sm"
              onClick={handleWishlistClick}
            >
              <Heart 
                className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium leading-tight line-clamp-2">{product.name}</h3>
              {!product.inStock && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-semibold">
                R{product.price.toFixed(2)}
              </span>
              
              <Badge variant="outline" className="text-xs capitalize">
                {product.category === 'mens' && "Men's"}
                {product.category === 'womens' && "Women's"}
                {product.category === 'baby' && "Baby's"}
                {product.category === 'accessories' && 'Accessories'}
              </Badge>
            </div>
            
            {product.stockQuantity !== undefined && (
              <div className=\"flex items-center justify-between text-xs text-muted-foreground pt-1\">
                <span>
                  {product.stockQuantity > 10 ? `${product.stockQuantity} in stock` : 
                   product.stockQuantity > 0 ? `Only ${product.stockQuantity} left` : 
                   'Out of stock'}
                </span>
                {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Low Stock
                  </Badge>
                )}
              </div>
            )}
            
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 pt-1">
                <span className="text-xs text-muted-foreground">Colors:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-border"
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
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}