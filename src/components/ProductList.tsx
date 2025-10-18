import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Product } from '../App';

interface ProductListProps {
  category: 'all' | 'mens' | 'womens' | 'baby' | 'accessories';
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export function ProductList({ category, products: propProducts, onProductClick, onAddToWishlist, isInWishlist }: ProductListProps) {
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Use products from props or fallback to default products if empty
  const defaultProducts: Product[] = [
    // Men's Collection - 8 items
    {
      id: 'M001',
      name: 'Heritage Cotton Casual Shirt',
      price: 449.99,
      category: 'mens',
      image: 'https://images.unsplash.com/photo-1603252109612-24fa03d145c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTY1MTA2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Premium cotton casual shirt inspired by Cape Town style. Perfect for braai days and weekend outings.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Khaki', 'Navy', 'White', 'Charcoal'],
      inStock: true,
      stockQuantity: 25,
      sku: 'M001-HST'
    },
    {
      id: 'M002',
      name: 'Executive Business Suit',
      price: 2899.99,
      category: 'mens',
      image: 'https://images.unsplash.com/photo-1675383094408-5ba5f3e185f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmb3JtYWwlMjBzdWl0fGVufDF8fHx8MTc1NjYwNjcxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Tailored business suit for the modern South African professional. Made from premium wool blend.',
      sizes: ['36', '38', '40', '42', '44', '46'],
      colors: ['Charcoal', 'Navy', 'Black'],
      inStock: true,
      stockQuantity: 15,
      sku: 'M002-EBS'
    },
    {
      id: 'M003',
      name: 'Safari Cargo Pants',
      price: 599.99,
      category: 'mens',
      image: 'https://images.unsplash.com/photo-1690908719438-330c0045d408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXJnbyUyMHBhbnRzfGVufDF8fHx8MTc1NjYwNjcxNnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Durable cargo pants perfect for outdoor adventures and game drives. Built for the African landscape.',
      sizes: ['30', '32', '34', '36', '38', '40'],
      colors: ['Khaki', 'Olive', 'Sand'],
      inStock: true
    },
    {
      id: 'M004',
      name: 'Urban Street Sneakers',
      price: 1299.99,
      category: 'mens',
      image: 'https://images.unsplash.com/photo-1608666634759-4376010f863d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBzbmVha2Vyc3xlbnwxfHx8fDE3NTY2MDY3MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Premium street sneakers designed for Johannesburg\'s urban lifestyle. Comfort meets style.',
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Black', 'Grey'],
      inStock: true
    },
    {
      id: 'M005',
      name: 'Classic Polo Shirt',
      price: 399.99,
      category: 'mens',
      image: 'https://images.unsplash.com/photo-1706007647543-460bfa7db776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBwb2xvJTIwc2hpcnR8ZW58MXx8fHwxNzU2NjA2NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Timeless polo shirt perfect for golf days in Stellenbosch. Premium cotton pique fabric.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy', 'White', 'Forest Green', 'Burgundy'],
      inStock: true
    },
    {
      id: 'M006',
      name: 'Biker Leather Jacket',
      price: 2299.99,
      category: 'mens',
      image: 'https://images.unsplash.com/photo-1700993443948-0691df37d507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBsZWF0aGVyJTIwamFja2V0fGVufDF8fHx8MTc1NjYwNjcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Genuine leather biker jacket crafted for durability and style. Perfect for Cape Town winters.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Brown'],
      inStock: true
    },

    // Women's Collection - 8 items
    {
      id: 'W001',
      name: 'Elegant Summer Dress',
      price: 799.99,
      category: 'womens',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzfGVufDF8fHx8MTc1NjU1Njc0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Flowing summer dress perfect for Durban\'s coastal lifestyle. Light and breathable fabric.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Coral', 'Sky Blue', 'White', 'Lavender'],
      inStock: true
    },
    {
      id: 'W002',
      name: 'Professional Blouse',
      price: 549.99,
      category: 'womens',
      image: 'https://images.unsplash.com/photo-1716394619043-e9ef0d827347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJsb3VzZXxlbnwxfHx8fDE3NTY2MDY3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Sophisticated blouse ideal for Sandton business district meetings. Crisp and elegant design.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Cream', 'Light Blue', 'Blush Pink'],
      inStock: true
    },
    {
      id: 'W003',
      name: 'Midi Pleated Skirt',
      price: 449.99,
      category: 'womens',
      image: 'https://images.unsplash.com/photo-1637227336887-a1b67bdb30fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0fGVufDF8fHx8MTc1NjYwNjcyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Versatile midi skirt that transitions from day to night. Perfect for Pretoria\'s professional scene.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Olive', 'Burgundy'],
      inStock: true
    },
    {
      id: 'W004',
      name: 'Chic Blazer Jacket',
      price: 999.99,
      category: 'womens',
      image: 'https://images.unsplash.com/photo-1602370463198-086436840055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGphY2tldHxlbnwxfHx8fDE3NTY2MDY3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Tailored blazer jacket for the modern South African businesswoman. Premium quality construction.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Charcoal', 'Camel'],
      inStock: true
    },
    {
      id: 'W005',
      name: 'Premium Skinny Jeans',
      price: 649.99,
      category: 'womens',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zfGVufDF8fHx8MTc1NjYwNjcyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'High-quality skinny jeans with perfect fit and stretch. Essential for every wardrobe.',
      sizes: ['24', '26', '28', '30', '32', '34'],
      colors: ['Dark Blue', 'Black', 'Light Blue', 'White'],
      inStock: true
    },
    {
      id: 'W006',
      name: 'Ankle Boots',
      price: 899.99,
      category: 'womens',
      image: 'https://images.unsplash.com/photo-1732708862072-d2f9e578e531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJvb3RzfGVufDF8fHx8MTc1NjYwNjcyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Stylish ankle boots perfect for Cape Town\'s changing weather. Comfortable and fashionable.',
      sizes: ['5', '6', '7', '8', '9', '10'],
      colors: ['Black', 'Brown', 'Tan'],
      inStock: true
    },

    // Baby Collection - 6 items
    {
      id: 'B001',
      name: 'African Print Baby Set',
      price: 299.99,
      category: 'baby',
      image: 'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU2NjA2NzI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Beautiful African-inspired baby clothing set. Celebrating our heritage with style.',
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
      colors: ['Traditional Print', 'Blue Print', 'Pink Print'],
      inStock: true
    },
    {
      id: 'B002',
      name: 'Organic Cotton Onesie',
      price: 199.99,
      category: 'baby',
      image: 'https://images.unsplash.com/photo-1622290319146-7b63df48a635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwb25lc2llfGVufDF8fHx8MTc1NjU5NDUyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: '100% organic cotton onesie for sensitive baby skin. Made with love in South Africa.',
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
      colors: ['White', 'Pink', 'Blue', 'Yellow', 'Mint Green'],
      inStock: true
    },
    {
      id: 'B003',
      name: 'Cozy Sleep Set',
      price: 349.99,
      category: 'baby',
      image: 'https://images.unsplash.com/photo-1597178938674-c4660b8843c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwcGFqYW1hc3xlbnwxfHx8fDE3NTY2MDY3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Soft pajama set to keep your little one comfortable through Johannesburg nights.',
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
      colors: ['Pink Stripes', 'Blue Stripes', 'Yellow Stars', 'White Dots'],
      inStock: true
    },
    {
      id: 'B004',
      name: 'Special Occasion Dress',
      price: 399.99,
      category: 'baby',
      image: 'https://images.unsplash.com/photo-1664918688104-4eb8956f97a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwZHJlc3N8ZW58MXx8fHwxNzU2NjA2NzI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Adorable dress for special occasions and family gatherings. Perfect for photo sessions.',
      sizes: ['3-6M', '6-12M', '12-18M', '18-24M'],
      colors: ['White', 'Pink', 'Lavender', 'Peach'],
      inStock: true
    },
    {
      id: 'B005',
      name: 'First Steps Shoes',
      price: 249.99,
      category: 'baby',
      image: 'https://images.unsplash.com/photo-1513091250092-b06c2b7981bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwc2hvZXN8ZW58MXx8fHwxNzU2NjA2NzI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Soft-soled shoes perfect for baby\'s first steps. Designed for comfort and development.',
      sizes: ['0-6M', '6-12M', '12-18M'],
      colors: ['Pink', 'Blue', 'White', 'Cream'],
      inStock: true
    },
    {
      id: 'B006',
      name: 'Summer Romper',
      price: 269.99,
      category: 'baby',
      image: 'https://images.unsplash.com/photo-1549137942-36b74e670f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwcm9tcGVyfGVufDF8fHx8MTc1NjYwNjcyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Light and airy romper perfect for Durban\'s warm summers. Easy diaper changes.',
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
      colors: ['Coral', 'Mint', 'Yellow', 'White', 'Light Pink'],
      inStock: true
    },

    // Accessories Collection - 6 items
    {
      id: 'A001',
      name: 'Designer Handbag',
      price: 1299.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1751522937993-46b83342398b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kYmFnJTIwcHVyc2V8ZW58MXx8fHwxNzU2NjA2NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Luxury handbag crafted from premium materials. Perfect for Sandton shopping sprees.',
      colors: ['Black', 'Brown', 'Tan', 'Navy'],
      inStock: true
    },
    {
      id: 'A002',
      name: 'Premium Sunglasses',
      price: 899.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzfGVufDF8fHx8MTc1NjYwNjcyOXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'High-quality sunglasses with UV protection. Essential for South African sunshine.',
      colors: ['Black', 'Tortoise Shell', 'Gold Frame', 'Silver Frame'],
      inStock: true
    },
    {
      id: 'A003',
      name: 'Luxury Watch',
      price: 2599.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaHxlbnwxfHx8fDE3NTY2MDY3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Sophisticated timepiece for the discerning professional. Swiss movement, South African style.',
      colors: ['Silver', 'Gold', 'Rose Gold', 'Black'],
      inStock: true
    },
    {
      id: 'A004',
      name: 'Gold Statement Necklace',
      price: 1599.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1602527418517-f33773c47f8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzU2NjA2NzMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Elegant statement necklace inspired by African gold mining heritage. Stunning focal piece.',
      colors: ['Gold', 'Silver', 'Rose Gold'],
      inStock: true
    },
    {
      id: 'A005',
      name: 'Silk Scarf Collection',
      price: 549.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1457545195570-67f207084966?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FyZnxlbnwxfHx8fDE3NTY2MDY3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Luxurious silk scarf featuring South African-inspired patterns. Versatile and elegant.',
      colors: ['African Sunset', 'Ocean Blue', 'Forest Green', 'Desert Sand'],
      inStock: true
    },
    {
      id: 'A006',
      name: 'Leather Belt',
      price: 399.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWx0fGVufDF8fHx8MTc1NjYwNjczMHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Premium leather belt handcrafted by local artisans. Classic design with modern appeal.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Brown', 'Tan', 'Cognac'],
      inStock: true
    }
  ];

  // Add stock quantities to default products if they don't have them
  const productsWithStock = defaultProducts.map(product => ({
    ...product,
    stockQuantity: product.stockQuantity || 20,
    sku: product.sku || `${product.id}-SKU`
  }));

  // Use passed products or default products
  const products = (propProducts && propProducts.length > 0) ? propProducts : productsWithStock;

  const filteredProducts = products.filter(product => {
    if (category === 'all') return true;
    return product.category === category;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getCategoryTitle = () => {
    switch (category) {
      case 'mens':
        return "Men's Collection";
      case 'womens':
        return "Women's Collection";
      case 'baby':
        return "Baby's Collection";
      case 'accessories':
        return 'Accessories';
      default:
        return 'All Products';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{getCategoryTitle()}</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{sortedProducts.length} products</Badge>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
            onAddToWishlist={() => onAddToWishlist(product)}
            isInWishlist={isInWishlist(product.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}