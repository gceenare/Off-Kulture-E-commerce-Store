import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ShoppingBag, User, Search, Menu, LogOut, Heart, Star, Plus, Minus, Trash2, Phone, Mail, MapPin, CreditCard, Truck, Shield, Clock, ChevronLeft, ChevronRight, Eye, EyeOff, Package, TrendingUp, AlertTriangle, Edit, Save, X, BarChart3, Filter, SortAsc, SortDesc, Grid, List, Share2, ArrowUpDown, RefreshCw, Camera, Sparkles, Target, Gift, Award, Bell } from 'lucide-react';

import offKultureLogo from './assets/1a23457adff6a2bd33e6862f1377f368003170a1.png';

// Import API services and hooks
import {
  ProductService,
  CartService,
  OrderService,
  WishlistService,
  AdminService,
  ApiError
} from './services';
import { useApi } from './hooks/useApi';
import { useApiContext } from './contexts/ApiContext';

// Import types
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
  const { state: authState, login, logout, register, clearError } = useApiContext();
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

  const productsApi = useApi(ProductService.getProducts, { immediate: false });
  const cartApi = useApi(CartService.getCart, { immediate: false });
  const wishlistApi = useApi(WishlistService.getWishlist, { immediate: false });
  const ordersApi = useApi(OrderService.getUserOrders, { immediate: false });

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      void loadUserData();
      setCurrentPage(authState.isAdmin ? 'admin' : 'home');
    } else {
      setCurrentPage('login');
    }
  }, [authState.isAuthenticated, authState.user]);

  const loadUserData = async () => {
    try {
      const [productsResponse, cartResponse, wishlistResponse, ordersResponse] = await Promise.all([
        productsApi.execute(),
        cartApi.execute(),
        wishlistApi.execute(),
        ordersApi.execute(),
      ]);
      if (productsResponse) setProducts(productsResponse.products);
      if (cartResponse) setCartItems(cartResponse.items);
      if (wishlistResponse) setWishlistItems(wishlistResponse.items);
      if (ordersResponse) setOrders(ordersResponse.orders);

      if (authState.isAdmin) await loadAdminData();
    } catch (error) {
      console.error('Failed to load user data:', error);
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const loadAdminData = async () => {
    try {
      const dashboardStats = await AdminService.getDashboardStats();
      const alerts = [];
      if (dashboardStats.lowStockProducts > 0) alerts.push(`${dashboardStats.lowStockProducts} products are running low on stock`);
      if (dashboardStats.outOfStockProducts > 0) alerts.push(`${dashboardStats.outOfStockProducts} products are out of stock`);
      if (dashboardStats.pendingOrders > 0) alerts.push(`${dashboardStats.pendingOrders} orders are pending`);
      setNotifications(alerts);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'home' || page === 'mens' || page === 'womens' || page === 'baby' || page === 'accessories') {
      setSelectedProduct(null);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 8));
  };

  const searchProducts = async (query: string, filters: SearchFilters = {}) => {
    setIsSearching(true);
    try {
      const response = await ProductService.searchProducts(query, { filters, limit: 50 });
      setProducts(response.products);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const addToCart = async (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
    try {
      const response = await CartService.addToCart({ productId: product.id, quantity, selectedSize, selectedColor });
      setCartItems(response.items);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await CartService.updateCartItem(itemId, { quantity });
      setCartItems(response.items);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await CartService.removeFromCart(itemId);
      setCartItems(response.items);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const addToWishlist = async (product: Product) => {
    try {
      const response = await WishlistService.addToWishlist(product.id);
      setWishlistItems(response.items);
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const isInWishlist = (productId: string) => wishlistItems.some(item => item.id === productId);

  const handleCheckout = async (orderData: any) => {
    try {
      const newOrder = await OrderService.createOrder({
        items: cartItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
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
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    if (!authState.user) {
      toast.error('Please login to add a review');
      return;
    }
    try {
      const newReview = await ProductService.addProductReview(productId, {
        rating,
        comment,
        userId: authState.user.id,
        userName: authState.user.name,
        productId: productId,
      });
      setReviews(prev => [...prev, newReview]);
      toast.success('Review added successfully!');
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const renderCurrentPage = () => {
    return <div></div>
  }

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-lg overflow-hidden bg-white shadow-lg">
            <img src={offKultureLogo} alt="OffKulture Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-muted-foreground">Loading OffKulture...</p>
        </div>
      </div>
    );
  }

  if (authState.error && clearError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader><CardTitle className="text-red-600">Error</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{authState.error.message}</p>
            <Button onClick={clearError} className="w-full">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
        {renderCurrentPage()}
      </div>
    </>
  );
}
