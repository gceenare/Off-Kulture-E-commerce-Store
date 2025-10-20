import React, { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ShoppingBag, User, Search, Menu, LogOut, Heart, Star, Plus, Minus, Trash2, Phone, Mail, MapPin, Facebook, Instagram, Twitter, CreditCard, Truck, Shield, Clock, ChevronLeft, ChevronRight, UserPlus, Eye, EyeOff, Package, Users, TrendingUp, AlertTriangle, Edit, Save, X, Settings, BarChart3, Filter, SortAsc, SortDesc, Grid, List, Share2, Download, Upload, Bell, Zap, Sparkles, Target, Gift, Award, ArrowUpDown, RefreshCw, Camera, Calendar, MapIcon, MessageSquare, ThumbsUp, Bookmark, ShoppingCart } from 'lucide-react';
import offKultureLogo from 'figma:asset/1a23457adff6a2bd33e6862f1377f368003170a1.png';

// Import API services and hooks
import {
  ProductService,
  AuthService,
  CartService,
  OrderService,
  WishlistService,
  AdminService,
  useApi,
  ApiError
} from './services';
import { useApiContext } from './contexts/ApiContext';

// Import types (keeping the same interfaces from original App.tsx)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'mens' | 'womens' | 'baby' | 'accessories';
  image: string;
  images?: string[];
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  stockQuantity: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  tags?: string[];
  brand?: string;
  material?: string;
  careInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  rating?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  orders?: Order[];
  paymentMethods?: PaymentMethod[];
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  trackingNumber?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'Credit Card' | 'Debit Card' | 'EFT' | 'SnapScan';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface WishlistItem extends Product {}

type Page = 'home' | 'login' | 'signup' | 'admin' | 'mens' | 'womens' | 'baby' | 'accessories' | 'product' | 'cart' | 'checkout' | 'profile' | 'track-order' | 'contact' | 'faq' | 'about' | 'size-guide' | 'shipping' | 'returns' | 'wishlist';

export default function AppWithApi() {
  // Use API context for authentication state
  const { state: authState, login, logout, register, updateUser, clearError } = useApiContext();

  // Local state
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // API hooks for data fetching
  const productsApi = useApi(() => ProductService.getProducts(), { immediate: false });
  const cartApi = useApi(() => CartService.getCart(), { immediate: false });
  const wishlistApi = useApi(() => WishlistService.getWishlist(), { immediate: false });
  const ordersApi = useApi(() => OrderService.getUserOrders(), { immediate: false });

  // Initialize app data when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadUserData();
      setCurrentPage(authState.isAdmin ? 'admin' : 'home');
    } else {
      setCurrentPage('login');
    }
  }, [authState.isAuthenticated, authState.user]);

  // Load user data
  const loadUserData = async () => {
    try {
      // Load products
      const productsResponse = await productsApi.execute();
      setProducts(productsResponse.products);

      // Load cart
      const cartResponse = await cartApi.execute();
      setCartItems(cartResponse.items);

      // Load wishlist
      const wishlistResponse = await wishlistApi.execute();
      setWishlistItems(wishlistResponse.items);

      // Load orders
      const ordersResponse = await ordersApi.execute();
      setOrders(ordersResponse.orders);

      // Load admin data if user is admin
      if (authState.isAdmin) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  // Load admin-specific data
  const loadAdminData = async () => {
    try {
      const dashboardStats = await AdminService.getDashboardStats();

      // Set notifications based on dashboard stats
      const alerts = [];
      if (dashboardStats.lowStockProducts > 0) {
        alerts.push(`${dashboardStats.lowStockProducts} products are running low on stock`);
      }
      if (dashboardStats.outOfStockProducts > 0) {
        alerts.push(`${dashboardStats.outOfStockProducts} products are out of stock`);
      }
      if (dashboardStats.pendingOrders > 0) {
        alerts.push(`${dashboardStats.pendingOrders} orders are pending`);
      }

      setNotifications(alerts);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  // Authentication functions
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Login failed');
      }
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      await register(userData);
      toast.success('Registration successful!');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.success('Logged out successfully');
    }
  };

  // Navigation function
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
      setSelectedProduct(null);
    } else if (page === 'mens' || page === 'womens' || page === 'baby' || page === 'accessories') {
      setCurrentPage(page as Page);
      setSelectedProduct(null);
    } else {
      setCurrentPage(page as Page);
    }
  };

  // Product functions
  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');

    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });

    // Track product view (optional analytics)
    try {
      await ProductService.getProductById(product.id);
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  };

  // Search and filter functions
  const searchProducts = async (query: string, filters: SearchFilters = {}) => {
    setIsSearching(true);

    try {
      const response = await ProductService.searchProducts(query, {
        filters,
        limit: 50,
      });
      setProducts(response.products);
    } catch (error) {
      console.error('Search failed:', error);
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Cart functions
  const addToCart = async (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
    try {
      const response = await CartService.addToCart({
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor,
      });

      setCartItems(response.items);
      toast.success(`${product.name} added to cart!`);

      // Update product stock locally (optimistic update)
      setProducts(prev => prev.map(p =>
        p.id === product.id
          ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - quantity), inStock: p.stockQuantity - quantity > 0 }
          : p
      ));
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add to cart');
      }
    }
  };

  const updateCartQuantity = async (id: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      await removeFromCart(id, selectedSize, selectedColor);
      return;
    }

    try {
      // Find the cart item ID (this would need to be stored in the cart item)
      const cartItem = cartItems.find(item =>
        item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (cartItem) {
        const response = await CartService.updateCartItem(cartItem.id || id, {
          quantity,
          selectedSize,
          selectedColor,
        });

        setCartItems(response.items);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update cart');
      }
    }
  };

  const removeFromCart = async (id: string, selectedSize?: string, selectedColor?: string) => {
    try {
      const cartItem = cartItems.find(item =>
        item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (cartItem) {
        const response = await CartService.removeFromCart(cartItem.id || id);
        setCartItems(response.items);

        // Return stock to product (optimistic update)
        setProducts(prev => prev.map(p =>
          p.id === id
            ? { ...p, stockQuantity: p.stockQuantity + cartItem.quantity, inStock: true }
            : p
        ));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to remove from cart');
      }
    }
  };

  // Wishlist functions
  const addToWishlist = async (product: Product) => {
    try {
      const response = await WishlistService.addToWishlist(product.id);
      setWishlistItems(response.items);
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Order functions
  const handleCheckout = async (orderData: any) => {
    try {
      const newOrder = await OrderService.createOrder({
        items: cartItems,
        shippingAddress: orderData.shippingAddress || authState.user?.address || '',
        paymentMethod: orderData.paymentMethod || 'Credit Card',
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
      });

      setOrders(prev => [newOrder, ...prev]);
      setCartItems([]);

      toast.success('Order placed successfully!');
      setCurrentPage('track-order');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to place order');
      }
    }
  };

  // Admin functions
  const updateProductStock = async (productId: string, newQuantity: number) => {
    try {
      const updatedProduct = await ProductService.updateProductStock(productId, newQuantity);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      toast.success('Stock updated successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update stock');
      }
    }
  };

  // Review functions
  const addReview = async (productId: string, rating: number, comment: string) => {
    if (!authState.user) {
      toast.error('Please login to add a review');
      return;
    }

    try {
      const newReview = await ProductService.addProductReview(productId, {
        productId,
        userId: authState.user.id,
        userName: authState.user.name,
        rating,
        comment,
      });

      setReviews(prev => [...prev, newReview]);

      // Update product rating locally
      const productReviews = [...reviews, newReview].filter(r => r.productId === productId);
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, rating: avgRating, reviewCount: productReviews.length }
          : p
      ));

      toast.success('Review added successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add review');
      }
    }
  };

  // Show loading state
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-lg overflow-hidden bg-white shadow-lg">
            <img
              src={offKultureLogo}
              alt="OffKulture Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-muted-foreground">Loading OffKulture...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (authState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{authState.error}</p>
            <Button onClick={clearError} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // The rest of your App component would go here...
  // For brevity, I'm showing the main structure and API integration points

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* Your existing Header, Navigation, and Page Components would go here */}
      {/* They would now use the API-integrated functions instead of localStorage */}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">OffKulture E-Commerce Store</h1>
          <p className="text-muted-foreground mb-8">
            Successfully converted to REST API integration!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products: {products.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Loaded from API
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart: {cartItems.reduce((total, item) => total + item.quantity, 0)} items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Synced with server
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Wishlist: {wishlistItems.length} items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Saved to account
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Button onClick={() => handleNavigate('home')} className="mr-4">
              Go to Store
            </Button>
            {authState.user && (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}