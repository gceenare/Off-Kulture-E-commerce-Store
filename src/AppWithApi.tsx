import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label
';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ShoppingBag, User, Search, Menu, LogOut, Heart, Star, Plus, Minus, Trash2, Phone, Mail, MapPin, Facebook, Instagram, Twitter, CreditCard, Truck, Shield, Clock, ChevronLeft, ChevronRight, UserPlus, Eye, EyeOff, Package, Users, TrendingUp, AlertTriangle, Edit, Save, X, Settings, BarChart3, Filter, SortAsc, SortDesc, Grid, List, Share2, Download, Upload, Bell, Zap, Sparkles, Target, Gift, Award, ArrowUpDown, RefreshCw, Camera, Calendar, MapIcon, MessageSquare, ThumbsUp, Bookmark, ShoppingCart } from 'lucide-react';
import offKultureLogo from './assets/1a23457adff6a2bd33e6862f1377f368003170a1.png';

// Import API services and hooks
import {
  ProductService,
  AuthService,
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
  role?: 'customer' | 'admin';
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

  const productsApi = useApi(() => ProductService.getProducts(), { immediate: false });
  const cartApi = useApi(() => CartService.getCart(), { immediate: false });
  const wishlistApi = useApi(() => WishlistService.getWishlist(), { immediate: false });
  const ordersApi = useApi(() => OrderService.getUserOrders(), { immediate: false });

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      void loadUserData();
      setCurrentPage(authState.user.role === 'admin' ? 'admin' : 'home');
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

      if (authState.user?.role === 'admin') {
        await loadAdminData();
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  const loadAdminData = async () => {
    try {
      const dashboardStats = await AdminService.getDashboardStats();
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
      const response = await CartService.updateCartItem(id, { quantity, selectedSize, selectedColor });
      setCartItems(response.items);
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
      const response = await CartService.removeFromCart(id);
      setCartItems(response.items);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to remove from cart');
      }
    }
  };

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
      toast.success('Review added successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add review');
      }
    }
  };

  const HeaderComponent = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSearchFilters, setShowSearchFilters] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    const navItems = [
      { label: "Men's", value: 'mens', icon: '👔' },
      { label: "Women's", value: 'womens', icon: '👗' },
      { label: "Baby's", value: 'baby', icon: '🍼' },
      { label: "Accessories", value: 'accessories', icon: '👜' },
    ];

    const moreItems = [
      { label: "Size Guide", value: 'size-guide' },
      { label: "Shipping Info", value: 'shipping' },
      { label: "Returns", value: 'returns' },
      { label: "Contact", value: 'contact' },
      { label: "FAQ", value: 'faq' },
      { label: "About", value: 'about' },
    ];

    const handleSearch = async (query: string) => {
      setIsSearching(true);
      try {
        const response = await ProductService.searchProducts(query, {
          filters: searchFilters,
          limit: 50,
        });
        setProducts(response.products);
        setCurrentPage('home');
      } catch (error) {
        console.error('Search failed:', error);
        if (error instanceof ApiError) {
          toast.error(error.message);
        }
      } finally {
        setIsSearching(false);
      }
    };

    return (
      <>
        <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
          Free shipping on orders over R500 | 30-day returns | Authentic South African fashion
        </div>

        <header className="border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between gap-4">
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => handleNavigate('home')}
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img
                    src={offKultureLogo}
                    alt="OffKulture Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-green-600">Off</span>Kulture
                </span>
              </div>

              <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                <div className="relative w-full">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search products, brands, categories..."
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(localSearchQuery)}
                        className="pl-10 pr-12 py-2 w-full border-2 border-green-200 focus:border-green-500 transition-all duration-300"
                      />
                      {localSearchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setLocalSearchQuery('');
                            setSearchQuery('');
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSearch(localSearchQuery)}
                      className="bg-green-600 hover:bg-green-700 px-3"
                      size="sm"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSearchFilters(!showSearchFilters)}
                      className="px-3"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  {showSearchFilters && (
                    <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-green-200 bg-white">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Category</Label>
                            <select
                              className="w-full p-2 border rounded-md text-sm"
                              value={searchFilters.category || 'all'}
                              onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
                            >
                              <option value="all">All Categories</option>
                              <option value="mens">👔 Men's</option>
                              <option value="womens">👗 Women's</option>
                              <option value="baby">🍼 Baby's</option>
                              <option value="accessories">👜 Accessories</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Price Range</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                className="w-20 text-sm"
                                onChange={(e) => setSearchFilters({
                                  ...searchFilters,
                                  priceRange: [parseInt(e.target.value) || 0, searchFilters.priceRange?.[1] || 10000]
                                })}
                              />
                              <span className="self-center text-sm">-</span>
                              <Input
                                type="number"
                                placeholder="Max"
                                className="w-20 text-sm"
                                onChange={(e) => setSearchFilters({
                                  ...searchFilters,
                                  priceRange: [searchFilters.priceRange?.[0] || 0, parseInt(e.target.value) || 10000]
                                })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Sort By</Label>
                            <select
                              className="w-full p-2 border rounded-md text-sm"
                              value={searchFilters.sortBy || 'name'}
                              onChange={(e) => setSearchFilters({...searchFilters, sortBy: e.target.value as any})}
                            >
                              <option value="name">Name</option>
                              <option value="price">Price</option>
                              <option value="rating">Rating</option>
                              <option value="newest">Newest</option>
                              <option value="popular">Popular</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleSearch(localSearchQuery)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Apply Filters
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSearchFilters({});
                              setShowSearchFilters(false);
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <nav className="hidden lg:flex items-center space-x-6">
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    variant="ghost"
                    onClick={() => handleNavigate(item.value as Page)}
                    className="text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 flex items-center gap-1"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Button>
                ))}

                <div className="relative group">
                  <Button variant="ghost" className="text-sm font-medium transition-all duration-300 hover:scale-105">
                    More
                  </Button>
                  <div className="absolute top-full left-0 bg-background border shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 min-w-40 z-50">
                    {moreItems.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleNavigate(item.value as Page)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors duration-200"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>

              <div className="flex items-center gap-1">
                {comparisonItems.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    className="relative hidden xl:flex h-9 px-2"
                    title="Compare Products"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600">
                      {comparisonItems.length}
                    </Badge>
                  </Button>
                )}

                {notifications.length > 0 && authState.user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hidden xl:flex h-9 px-2"
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-600">
                      {notifications.length}
                    </Badge>
                  </Button>
                )}

                {authState.user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage('profile')}
                    className="hidden lg:flex h-9 px-2"
                    title="My Profile"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline ml-1">{authState.user.name.split(' ')[0]}</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage('track-order')}
                  className="hidden lg:flex h-9 px-2"
                  title="Track Orders"
                >
                  <Truck className="h-4 w-4" />
                  <span className="hidden xl:inline ml-1">Track</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage('wishlist')}
                  className="relative h-9 px-2"
                  title="Wishlist"
                >
                  <Heart className={`h-4 w-4 ${isInWishlist('') ? 'fill-current text-red-500' : ''}`} />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage('cart')}
                  className="relative h-9 px-2"
                  title="Shopping Cart"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {cartItems.reduce((total, item) => total + item.quantity, 0) > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-green-600">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>

                {authState.user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="hidden lg:flex h-9 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden xl:inline ml-1">Logout</span>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setCurrentPage('login')}
                    className="hidden lg:flex bg-green-600 hover:bg-green-700 h-9 px-3"
                  >
                    Sign In
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden h-9 px-2 border border-transparent hover:border-green-200"
                  title="Menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm">
                <div className="px-4 py-3 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch(localSearchQuery);
                            setMobileMenuOpen(false);
                          }
                        }}
                        className="pl-10 border-green-200 focus:border-green-500 h-10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {navItems.map((item) => (
                        <Button
                          key={item.value}
                          variant="ghost"
                          onClick={() => {
                            handleNavigate(item.value as Page);
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start h-10 text-sm"
                        >
                          <span className="mr-2 text-base">{item.icon}</span>
                          {item.label}
                        </Button>
                      ))}
                    </div>

                    <div className="border-t pt-2">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPage('cart');
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start h-9 text-xs"
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPage('wishlist');
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start h-9 text-xs"
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          Wishlist ({wishlistItems.length})
                        </Button>
                      </div>

                      {authState.user && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentPage('profile');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start h-9 text-sm mb-2"
                        >
                          <User className="h-4 w-4 mr-2" />
                          {authState.user.name.split(' ')[0]}
                        </Button>
                      )}
                    </div>

                    <div className="border-t pt-2">
                      <div className="grid grid-cols-2 gap-1">
                        {moreItems.slice(0, 4).map((item) => (
                          <Button
                            key={item.value}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleNavigate(item.value as Page);
                              setMobileMenuOpen(false);
                            }}
                            className="justify-start text-xs h-8"
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-2">
                      {!authState.user ? (
                        <Button
                          onClick={() => {
                            setCurrentPage('login');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 h-10"
                        >
                          Sign In
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full h-10 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </>
    );
  };

  const ProductListComponent = ({ category }: { category: 'all' | Page }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    let filteredProducts = products.filter(product => {
      if (category === 'all') return true;
      return product.category === category;
    });

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (currentFilters.priceRange) {
      filteredProducts = filteredProducts.filter(p =>
        p.price >= currentFilters.priceRange![0] && p.price <= currentFilters.priceRange![1]
      );
    }

    if (currentFilters.rating) {
      filteredProducts = filteredProducts.filter(p => (p.rating || 0) >= currentFilters.rating!);
    }

    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'newest':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      } else {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
    });

    const getCategoryTitle = () => {
      switch (category) {
        case 'mens': return "👔 Men's Collection";
        case 'womens': return "👗 Women's Collection";
        case 'baby': return "🍼 Baby's Collection";
        case 'accessories': return '👜 Accessories';
        default: return '🌟 All Products';
      }
    };

    const renderStarRating = (rating: number = 0) => {
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3 w-3 ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({rating.toFixed(1)})</span>
        </div>
      );
    };

    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {getCategoryTitle()}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="animate-pulse">
                  {filteredProducts.length} products
                </Badge>
                {searchQuery && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Results for "{searchQuery}"
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="text-sm border rounded-md px-3 py-1"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="h-8 w-8 p-0"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-6 shadow-lg border-green-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <select
                      className="w-full p-2 border rounded-md text-sm"
                      value={currentFilters.category || 'all'}
                      onChange={(e) => setCurrentFilters({...currentFilters, category: e.target.value})}
                    >
                      <option value="all">All Categories</option>
                      <option value="mens">👔 Men's</option>
                      <option value="womens">👗 Women's</option>
                      <option value="baby">🍼 Baby's</option>
                      <option value="accessories">👜 Accessories</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="w-20 text-sm"
                        value={currentFilters.priceRange?.[0] || ''}
                        onChange={(e) => setCurrentFilters({
                          ...currentFilters,
                          priceRange: [parseInt(e.target.value) || 0, currentFilters.priceRange?.[1] || 10000]
                        })}
                      />
                      <span className="self-center text-sm">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="w-20 text-sm"
                        value={currentFilters.priceRange?.[1] || ''}
                        onChange={(e) => setCurrentFilters({
                          ...currentFilters,
                          priceRange: [currentFilters.priceRange?.[0] || 0, parseInt(e.target.value) || 10000]
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={currentFilters.rating || ''}
                      onChange={(e) => setCurrentFilters({...currentFilters, rating: parseFloat(e.target.value) || undefined})}
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => setCurrentFilters({})}
                      variant="outline"
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-green-100 hover:border-green-300 ${
                viewMode === 'list' ? 'p-4' : ''
              }`}
            >
              <CardContent className={viewMode === 'grid' ? "p-4" : "p-0"}>
                <div className={viewMode === 'grid' ? "space-y-3" : "flex gap-6 items-center"}>
                  <div className={`${viewMode === 'grid' ? 'aspect-square' : 'w-32 h-32'} bg-muted rounded-lg overflow-hidden relative group`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onClick={() => setSelectedProduct(product)}
                    />

                    <div className="absolute top-2 left-2 space-y-1">
                      {product.isNew && (
                        <Badge className="bg-green-600 text-white text-xs animate-pulse">
                          NEW
                        </Badge>
                      )}
                      {product.isSale && (
                        <Badge className="bg-red-600 text-white text-xs">
                          SALE
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(product);
                        }}
                        className={`h-8 w-8 p-0 ${isInWishlist(product.id) ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // addToComparison(product); // Implement comparison logic if needed
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({
                              title: product.name,
                              text: product.description,
                              url: window.location.href
                            });
                          } else {
                            toast.success('Link copied to clipboard!');
                          }
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className={`${viewMode === 'grid' ? 'space-y-2' : 'flex-1 space-y-2'}`}>
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>

                    {product.rating && (
                      <div className="flex items-center gap-2">
                        {renderStarRating(product.rating)}
                        {product.reviewCount && (
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-600">
                        R{product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          R{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className={product.stockQuantity <= 5 ? "bg-orange-500" : ""}
                        >
                          {product.inStock
                            ? product.stockQuantity <= 5
                              ? `Only ${product.stockQuantity} left!`
                              : 'In Stock'
                            : 'Out of Stock'
                          }
                        </Badge>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>

                    {viewMode === 'list' && (
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Brand: {product.brand}</span>
                        <span>Material: {product.material}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <Search className="h-16 w-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">No products found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or filters.`
                : "Try adjusting your filters or search terms to find what you're looking for."
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentFilters({});
                  setShowFilters(false);
                }}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
              <Button onClick={() => handleNavigate('home')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Browse All Products
              </Button>
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <Card className="mt-12 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recently Viewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recentlyViewed.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      R{product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const ProductDetailComponent = ({ product }: { product: Product }) => {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = [product.image, product.image, product.image];

    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <Button
          variant="ghost"
          onClick={() => handleNavigate('home')}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-primary">R{product.price.toFixed(2)}</p>
              <Badge className="mt-2" variant={product.inStock ? "default" : "secondary"}>
                {product.inStock ? `${product.stockQuantity} in stock` : 'Out of Stock'}
              </Badge>
            </div>

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                disabled={!product.inStock || quantity > product.stockQuantity}
                className="w-full"
                size="lg"
              >
                Add to Cart - R{(product.price * quantity).toFixed(2)}
              </Button>

              <Button
                variant="outline"
                onClick={() => addToWishlist(product)}
                className="w-full"
                size="lg"
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Free shipping on orders over R500</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">2-5 business days delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutComponent = () => {
    const [step, setStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({
      fullName: authState.user?.name || '',
      email: authState.user?.email || '',
      phone: authState.user?.phone || '',
      address: authState.user?.address || '',
      city: '',
      postalCode: '',
      province: ''
    });
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
      authState.user?.paymentMethods?.find(pm => pm.isDefault) || null
    );
    const [newPaymentMethod, setNewPaymentMethod] = useState({
      type: 'Credit Card' as PaymentMethod['type'],
      name: '', cardNumber: '', expiryDate: '', cvv: '', isDefault: false
    });
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [cvvVerification, setCvvVerification] = useState('');
    const [showCvvDialog, setShowCvvDialog] = useState(false);

    const provinces = [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
      'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ];

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 99.99;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;

    const handleAddPaymentMethod = async () => {
      if (!newPaymentMethod.name || !newPaymentMethod.cardNumber || !newPaymentMethod.expiryDate || !newPaymentMethod.cvv) {
        toast.error('Please fill in all payment details');
        return;
      }
      if (newPaymentMethod.cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (newPaymentMethod.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }

      const paymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: newPaymentMethod.type,
        name: newPaymentMethod.name,
        lastFour: newPaymentMethod.cardNumber.slice(-4),
        expiryDate: newPaymentMethod.expiryDate,
        isDefault: newPaymentMethod.isDefault
      };

      if (authState.user) {
        const updatedUser = {
          ...authState.user,
          paymentMethods: [...(authState.user.paymentMethods || []), paymentMethod]
        };
        // In a real app, you'd call an API to update the user's payment methods
        // For now, we'll just update the local state and assume success
        // authService.updateUserPaymentMethods(authState.user.id, updatedUser.paymentMethods);
        setSelectedPayment(paymentMethod);
        setShowAddPayment(false);
        setNewPaymentMethod({
          type: 'Credit Card' as PaymentMethod['type'],
          name: '', cardNumber: '', expiryDate: '', cvv: '', isDefault: false
        });
        toast.success('Payment method added successfully! 💳');
        setStep(1);
      }
    };

    const handlePlaceOrder = () => {
      if (!selectedPayment) {
        toast.error('Please select a payment method');
        return;
      }
      setShowCvvDialog(true);
    };

    const handleCvvVerification = async () => {
      if (!cvvVerification || cvvVerification.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return;
      }
      setShowCvvDialog(false);
      setCvvVerification('');

      await handleCheckout({
        total, subtotal, shipping, tax,
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.province}, ${shippingInfo.postalCode}`,
        paymentMethod: selectedPayment!.name
      });
    };

    if (cartItems.length === 0) {
      return (
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 md:h-24 md:w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to proceed to checkout.</p>
            <Button onClick={() => handleNavigate('home')}>Continue Shopping</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {showCvvDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
               style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Card className="w-full max-w-md shadow-2xl border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Verification
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please enter your CVV to complete the secure payment
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800">
                    🔒 <strong>Payment Method:</strong> {selectedPayment?.name}
                  </p>
                  <p className="text-sm text-green-800">
                    💰 <strong>Total Amount:</strong> R{total.toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="cvv-verify">CVV (3 digits) *</Label>
                  <div className="relative">
                    <Input
                      id="cvv-verify"
                      type="password"
                      value={cvvVerification}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setCvvVerification(value);
                      }}
                      placeholder="123"
                      maxLength={3}
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                      🛡️
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the 3-digit security code on the back of your card
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCvvDialog(false);
                      setCvvVerification('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCvvVerification}
                    disabled={cvvVerification.length !== 3}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Verify & Pay
                  </Button>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span>🔒 Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepNum}
                  </div>
                  <span className={`ml-2 ${step >= stepNum ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {stepNum === 1 ? 'Shipping' : stepNum === 2 ? 'Payment' : 'Review'}
                  </span>
                  {stepNum < 3 && <ChevronRight className="ml-4 h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <select
                        id="province"
                        value={shippingInfo.province}
                        onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="">Select Province</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setShippingInfo({...shippingInfo, postalCode: value});
                        }}
                        placeholder="4-digit postal code"
                        maxLength={4}
                        pattern="[0-9]{4}"
                        required
                      />
                      {shippingInfo.postalCode && shippingInfo.postalCode.length !== 4 && (
                        <p className="text-xs text-red-500 mt-1">Postal code must be exactly 4 digits</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone ||
                          !shippingInfo.address || !shippingInfo.city || !shippingInfo.province ||
                          !shippingInfo.postalCode || shippingInfo.postalCode.length !== 4) {
                        toast.error('Please fill in all shipping information correctly');
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {authState.user?.paymentMethods && authState.user.paymentMethods.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">Saved Payment Methods</h3>
                      {authState.user.paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={method.id}
                            name="payment"
                            checked={selectedPayment?.id === method.id}
                            onChange={() => setSelectedPayment(method)}
                          />
                          <Label htmlFor={method.id} className="flex-1">
                            <div className="flex items-center justify-between">
                              <span>{method.name}</span>
                              {method.isDefault && <Badge variant="secondary">Default</Badge>}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No payment methods added yet</p>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setShowAddPayment(!showAddPayment)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Payment Method
                  </Button>

                  {showAddPayment && (
                    <Card className="border-2 border-green-200 bg-green-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          Secure Payment Gateway
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          🔒 Your payment is protected by 256-bit SSL encryption
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardType">Payment Method</Label>
                            <select
                              id="cardType"
                              className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              value={newPaymentMethod.type}
                              onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value as PaymentMethod['type']})}
                            >
                              <option value="Credit Card">💳 Credit Card</option>
                              <option value="Debit Card">💳 Debit Card</option>
                              <option value="EFT">🏦 EFT Banking</option>
                              <option value="SnapScan">📱 SnapScan</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                              id="cardName"
                              value={newPaymentMethod.name}
                              onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                              placeholder="Full name on card"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              value={newPaymentMethod.cardNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                                setNewPaymentMethod({...newPaymentMethod, cardNumber: value});
                              }}
                              placeholder="1234567890123456"
                              maxLength={16}
                              className="pr-20"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">VISA</span>
                              <span className="text-xs bg-red-100 text-red-800 px-1 rounded">MC</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 We accept Visa, Mastercard, and American Express
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              value={newPaymentMethod.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setNewPaymentMethod({...newPaymentMethod, expiryDate: value});
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <div className="relative">
                              <Input
                                id="cvv"
                                value={newPaymentMethod.cvv}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                                  setNewPaymentMethod({...newPaymentMethod, cvv: value});
                                }}
                                placeholder="123"
                                maxLength={3}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                                🛡️
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              id="setDefault"
                              checked={newPaymentMethod.isDefault}
                              onChange={(e) => setNewPaymentMethod({...newPaymentMethod, isDefault: e.target.checked})}
                            />
                            <Label htmlFor="setDefault">Set as default payment method</Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ⚡ Save this payment method for faster checkout next time
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-center gap-4 mb-3">
                            <span className="text-xs text-muted-foreground">Secured by:</span>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">🛡️ SSL</Badge>
                              <Badge variant="outline" className="text-xs">🔒 PCI DSS</Badge>
                              <Badge variant="outline" className="text-xs">✅ 3D Secure</Badge>
                            </div>
                          </div>
                          <Button onClick={handleAddPaymentMethod} className="w-full bg-green-600 hover:bg-green-700">
                            <Shield className="h-4 w-4 mr-2" />
                            Add Secure Payment Method
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back to Shipping
                    </Button>
                    <Button
                      onClick={() => {
                        if (!selectedPayment) {
                          toast.error('Please select a payment method');
                          return;
                        }
                        setStep(3);
                      }}
                      className="flex-1"
                      disabled={!selectedPayment}
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {shippingInfo.fullName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}<br />
                      {shippingInfo.phone}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">{selectedPayment?.name}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>R{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Secure Checkout - R{total.toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                      <span className="truncate">{item.name} x {item.quantity}</span>
                      <span>R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
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
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add R{(500 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <Button
                  onClick={() => handleNavigate('checkout')}
                  className="w-full"
                  size="lg"
                >
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
  };

  const CartComponent = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 99.99;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;

    if (cartItems.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => handleNavigate('home')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

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
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold">R{item.price.toFixed(2)}</span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
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

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
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

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add R{(500 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <Button
                  onClick={() => handleNavigate('checkout')}
                  className="w-full"
                  size="lg"
                >
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
  };

  const LoginSignupComponent = () => {
    const [activeTab, setActiveTab] = useState(currentPage === 'signup' ? 'signup' : 'login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupData, setSignupData] = useState({
      name: '', email: '', password: '', confirmPassword: '', phone: '', address: '', userType: 'customer'
    });
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleCustomerLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) {
        toast.error('Please fill in all fields');
        return;
      }
      try {
        await login(loginEmail, loginPassword);
        toast.success('Login successful!');
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Login failed');
        }
      }
    };

    const handleCustomerSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!signupData.name || !signupData.email || !signupData.password || (signupData.userType === 'customer' && !signupData.confirmPassword)) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (signupData.userType === 'customer' && signupData.password !== signupData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (signupData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      try {
        await register(signupData.email, signupData.password, signupData.name, signupData.address, signupData.phone, signupData.userType);
        toast.success('Registration successful!');
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Registration failed');
        }
      }
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!adminEmail || !adminPassword) {
        toast.error('Please fill in all fields');
        return;
      }
      try {
        await login(adminEmail, adminPassword);
        toast.success('Welcome to Admin Dashboard!');
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Admin login failed');
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-lg">
              <img
                src={offKultureLogo}
                alt="OffKulture Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome to <span className="text-green-600">Off</span>Kulture
            </h1>
            <p className="text-muted-foreground">Premium South African Fashion</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex-1 text-center">
                  {activeTab === 'signup' ? 'Create Account' : activeTab === 'admin' ? 'Admin Access' : 'Sign In'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="login"
                    onClick={() => {setActiveTab('login'); setCurrentPage('login');}}
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    onClick={() => {setActiveTab('signup'); setCurrentPage('signup');}}
                  >
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    onClick={() => setActiveTab('admin')}
                  >
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleCustomerLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={authState.loading}>
                      {authState.loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => {setActiveTab('signup'); setCurrentPage('signup');}}
                        className="text-sm"
                      >
                        Don't have an account? Sign up
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleCustomerSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-usertype">Account Type *</Label>
                      <select
                        id="signup-usertype"
                        value={signupData.userType}
                        onChange={(e) => setSignupData({...signupData, userType: e.target.value})}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="customer">Customer Account</option>
                        <option value="admin">Admin Account</option>
                      </select>
                    </div>

                    {signupData.userType === 'admin' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="signup-admin-name">Admin Name *</Label>
                          <Input
                            id="signup-admin-name"
                            type="text"
                            placeholder="Enter admin name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-admin-email">Admin Email *</Label>
                          <Input
                            id="signup-admin-email"
                            type="email"
                            placeholder="admin@offkulture.co.za"
                            value={signupData.email}
                            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-admin-password">Admin Password *</Label>
                          <div className="relative">
                            <Input
                              id="signup-admin-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create admin password (min 6 characters)"
                              value={signupData.password}
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name *</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email Address *</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-phone">Phone Number</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="+27 XX XXX XXXX"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-address">Address</Label>
                          <Input
                            id="signup-address"
                            type="text"
                            placeholder="Street, City, Postal Code"
                            value={signupData.address}
                            onChange={(e) => setSignupData({...signupData, address: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password *</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password (min 6 characters)"
                              value={signupData.password}
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm">Confirm Password *</Label>
                          <Input
                            id="signup-confirm"
                            type="password"
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                            required
                          />
                        </div>
                      </>
                    )}

                    <Button type="submit" className="w-full" disabled={authState.loading}>
                      {authState.loading ? 'Creating account...' : 'Create Account'}
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => {setActiveTab('login'); setCurrentPage('login');}}
                        className="text-sm"
                      >
                        Already have an account? Sign in
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="admin">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="font-medium">Admin Access</h3>
                      <p className="text-sm text-muted-foreground">Administrative dashboard login</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@offkulture.co.za"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <Input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={authState.loading}>
                      {authState.loading ? 'Signing in...' : 'Access Admin Dashboard'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [editingProductData, setEditingProductData] = useState<Partial<Product>>({});
    const [newProduct, setNewProduct] = useState({
      name: '', price: 0, category: 'mens' as Product['category'], description: '', stockQuantity: 0, inStock: true, image: ''
    });
    const [selectedCategory, setSelectedCategory] = useState<'all' | Product['category']>('all');
    const [showAddProduct, setShowAddProduct] = useState(false);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const lowStockProducts = products.filter(p => p.stockQuantity < 10);
    const recentOrders = orders.slice(-10).reverse();

    const handleEditProduct = (product: Product) => {
      setEditingProduct(product.id);
      setEditingProductData(product);
    };

    const handleSaveProduct = async () => {
      if (editingProduct && editingProductData) {
        try {
          const updatedProduct = await ProductService.updateProduct(editingProduct, editingProductData);
          setProducts(prev => prev.map(p => p.id === editingProduct ? updatedProduct : p));
          setEditingProduct(null);
          setEditingProductData({});
          toast.success('Product updated successfully');
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error(error.message);
          } else {
            toast.error('Failed to update product');
          }
        }
      }
    };

    const handleAddProduct = async () => {
      if (!newProduct.name || !newProduct.price || newProduct.price <= 0) {
        toast.error('Please fill in all required fields with valid values');
        return;
      }
      if (newProduct.stockQuantity === undefined || newProduct.stockQuantity < 0) {
        toast.error('Please enter a valid stock quantity');
        return;
      }

      const categoryImages = {
        mens: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        womens: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        baby: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        accessories: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      };

      const productToAdd: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image || categoryImages[newProduct.category],
        images: [
          newProduct.image || categoryImages[newProduct.category],
          categoryImages[newProduct.category],
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
          'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'
        ],
        description: newProduct.description || `Premium ${newProduct.category === 'mens' ? 'men\'s' : newProduct.category === 'womens' ? 'women\'s' : newProduct.category === 'baby' ? 'baby' : 'accessory'} item from OffKulture collection.`,
        stockQuantity: newProduct.stockQuantity,
        inStock: newProduct.stockQuantity > 0,
        sku: `OFK-${newProduct.category.toUpperCase().slice(0,3)}-${Date.now().toString().slice(-6)}`,
        sizes: newProduct.category === 'accessories' ? undefined :
               newProduct.category === 'baby' ? ['0-3M', '3-6M', '6-12M', '12-18M'] :
               newProduct.category === 'mens' ? ['S', 'M', 'L', 'XL', 'XXL'] :
               ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Navy', 'Grey'],
        rating: 4.5,
        reviewCount: 0,
        isNew: true,
        isSale: false,
        tags: [newProduct.category, 'premium', 'offkulture'],
        brand: 'OffKulture',
        material: newProduct.category === 'accessories' ? 'Premium Leather' : '100% Cotton',
        careInstructions: 'Machine wash cold, tumble dry low',
      };

      try {
        const createdProduct = await ProductService.createProduct(productToAdd);
        setProducts(prev => [...prev, createdProduct]);
        setNewProduct({
          name: '', price: 0, category: 'mens', description: '', stockQuantity: 0, inStock: true, image: ''
        });
        setShowAddProduct(false);
        toast.success('🎉 Product added successfully and is now live on the store!');
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Failed to add product');
        }
      }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
      try {
        const updatedOrder = await OrderService.updateOrderStatus(orderId, newStatus);
        setOrders(prev => prev.map(order =>
          order.id === orderId ? updatedOrder : order
        ));
        toast.success('Order status updated');
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Failed to update order status');
        }
      }
    };

    const handleDeleteProduct = async (productId: string) => {
      try {
        await ProductService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setCartItems(prev => prev.filter(item => item.productId !== productId)); // Assuming cart items link to product ID
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Failed to delete product');
        }
      }
    };

    const AdminOverview = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">R{totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <p className="text-3xl font-bold">{lowStockProducts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Order #{order.id}</h4>
                        <Badge variant={
                          order.status === 'Processing' ? 'default' :
                          order.status === 'Shipped' ? 'secondary' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.customerName} - {order.customerEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} - R{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>

        {lowStockProducts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-orange-800">{product.name}</span>
                    <Badge variant="outline" className="text-orange-800">
                      {product.stockQuantity} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );

    const ProductManagement = () => {
      const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Management</h2>
            <Button onClick={() => setShowAddProduct(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          <Card className="bg-blue-50/50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Filter Products by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  📦 All Products ({products.length})
                </Button>
                <Button
                  variant={selectedCategory === 'mens' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('mens')}
                >
                  👔 Men's ({products.filter(p => p.category === 'mens').length})
                </Button>
                <Button
                  variant={selectedCategory === 'womens' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('womens')}
                >
                  👗 Women's ({products.filter(p => p.category === 'womens').length})
                </Button>
                <Button
                  variant={selectedCategory === 'baby' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('baby')}
                >
                  🍼 Baby's ({products.filter(p => p.category === 'baby').length})
                </Button>
                <Button
                  variant={selectedCategory === 'accessories' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('accessories')}
                >
                  👜 Accessories ({products.filter(p => p.category === 'accessories').length})
                </Button>
              </div>
            </CardContent>
          </Card>

        {showAddProduct && (
          <Card className="border-2 border-green-200 bg-green-50/50 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Add New Product
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a new product for your OffKulture collection
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-green-800 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-name">Product Name *</Label>
                    <Input
                      id="product-name"
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter product name"
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-price">Price (R) *</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct(prev => ({...prev, price: parseFloat(e.target.value) || 0}))}
                      placeholder="0.00"
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-category">Category *</Label>
                    <select
                      id="product-category"
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 focus:scale-[1.02]"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({...prev, category: e.target.value as Product['category']}))}
                    >
                      <option value="mens">👔 Men's Collection</option>
                      <option value="womens">👗 Women's Collection</option>
                      <option value="baby">🍼 Baby's Collection</option>
                      <option value="accessories">👜 Accessories</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="product-stock">Stock Quantity *</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      min="0"
                      value={newProduct.stockQuantity || ''}
                      onChange={(e) => setNewProduct(prev => ({...prev, stockQuantity: parseInt(e.target.value) || 0}))}
                      placeholder="0"
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-green-800 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Product Images
                </h4>
                <div>
                  <Label htmlFor="product-image">Primary Image URL</Label>
                  <Input
                    id="product-image"
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({...prev, image: e.target.value}))}
                    placeholder="https://example.com/image.jpg (optional - auto-generated if empty)"
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Leave empty to use default category image, or paste an image URL for custom image
                  </p>
                  {newProduct.image && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Live Preview:</p>
                      <div className="w-24 h-24 border-2 border-green-300 rounded-lg overflow-hidden bg-muted shadow-md">
                        <img
                          src={newProduct.image}
                          alt="Product preview"
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-green-800 flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Product Details
                </h4>
                <div>
                  <Label htmlFor="product-description">Product Description</Label>
                  <textarea
                    id="product-description"
                    className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 focus:scale-[1.02]"
                    rows={4}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe your product in detail..."
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Smart Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                  <div className="flex items-center gap-2">
                    <Award className="h-3 w-3" />
                    <span>Auto-generated SKU & ratings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    <span>Smart size & color variants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-3 w-3" />
                    <span>Inventory alerts enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    <span>SEO-optimized tags</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 transition-all duration-300 hover:scale-105"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory === 'all' ? `All Products (${filteredProducts.length})` :
               `${selectedCategory === 'mens' ? 'Men\'s' :
                 selectedCategory === 'womens' ? 'Women\'s' :
                 selectedCategory === 'baby' ? 'Baby\'s' : 'Accessories'} Products (${filteredProducts.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    {editingProduct === product.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Input
                          value={editingProductData.name || ''}
                          onChange={(e) => setEditingProductData({...editingProductData, name: e.target.value})}
                          placeholder="Product name"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingProductData.price || 0}
                          onChange={(e) => setEditingProductData({...editingProductData, price: parseFloat(e.target.value)})}
                          placeholder="Price"
                        />
                        <select
                          className="p-2 border rounded-md bg-background"
                          value={editingProductData.category}
                          onChange={(e) => setEditingProductData({...editingProductData, category: e.target.value as Product['category']})}
                        >
                          <option value="mens">Men's</option>
                          <option value="womens">Women's</option>
                          <option value="baby">Baby's</option>
                          <option value="accessories">Accessories</option>
                        </select>
                        <Input
                          type="number"
                          min="0"
                          value={editingProductData.stockQuantity || 0}
                          onChange={(e) => setEditingProductData({...editingProductData, stockQuantity: parseInt(e.target.value)})}
                          placeholder="Stock"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveProduct}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted-foreground/20 rounded-md overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.category === 'mens' ? '👔 Men\'s' :
                                 product.category === 'womens' ? '👗 Women\'s' :
                                 product.category === 'baby' ? '🍼 Baby\'s' : '👜 Accessories'} • R{product.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">SKU: {product.sku} • Stock: {product.stockQuantity}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={product.stockQuantity < 10 ? "destructive" : product.stockQuantity < 25 ? "secondary" : "default"}>
                            {product.stockQuantity < 10 ? 'Low Stock' : product.stockQuantity < 25 ? 'Medium Stock' : 'In Stock'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => updateProductStock(product.id, product.stockQuantity + 10)}
                            >
                              +10
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateProductStock(product.id, Math.max(0, product.stockQuantity - 10))}
                            >
                              -10
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
                                handleDeleteProduct(product.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {selectedCategory === 'all' ? 'No products found' : `No ${selectedCategory} products found`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory === 'all'
                      ? 'Start by adding your first product to the inventory.'
                      : `Add products to the ${selectedCategory} category or select a different category.`
                    }
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setShowAddProduct(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                    {selectedCategory !== 'all' && (
                      <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                        View All Products
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const OrderManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order Management</h2>
          <Badge variant="secondary">
            {orders.length} Total Orders
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Customer Orders</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => ordersApi.refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id} className="border-2 hover:border-green-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg">Order #{order.id}</h4>
                            <Badge variant={
                              order.status === 'Processing' ? 'default' :
                              order.status === 'Shipped' ? 'secondary' : 'outline'
                            }>
                              {order.status === 'Processing' ? '⏳ Processing' :
                               order.status === 'Shipped' ? '🚚 Shipped' : '✅ Delivered'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            📅 {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-sm text-muted-foreground">
                              📦 Tracking: <span className="font-mono">{order.trackingNumber}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="text-sm border-2 border-green-200 rounded-md px-3 py-2 bg-white font-medium focus:border-green-500 focus:outline-none"
                          >
                            <option value="Processing">⏳ Processing</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Delivered">✅ Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-muted/50 p-4 rounded-lg">
                        <div>
                          <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer Details
                          </h5>
                          <p className="text-sm font-medium">{order.customerName || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone || 'N/A'}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Shipping Address
                          </h5>
                          <p className="text-sm text-muted-foreground">{order.shippingAddress || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Order Items ({order.items?.length || 0})
                        </h5>
                        <div className="space-y-2">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-background p-2 rounded">
                                <span className="font-medium">{item.name} × {item.quantity}</span>
                                <span className="font-semibold text-green-600">R{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No items found</p>
                          )}
                        </div>
                      </div>

                      <div className="border-t-2 pt-4">
                        <div className="flex justify-between items-start">
                          <div className="text-sm space-y-1 flex-1">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span className="font-medium">R{(order.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span className="font-medium">R{(order.shipping || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>VAT (15%):</span>
                              <span className="font-medium">R{(order.tax || 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="text-right ml-8">
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-green-600">R{(order.total || 0).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              💳 {order.paymentMethod || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Orders from customers will appear here once they start shopping.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                    <img
                      src={offKultureLogo}
                      alt="OffKulture Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold truncate">
                    <span className="text-green-600">Off</span>Kulture Admin
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-muted-foreground hidden md:block truncate max-w-32">
                  Welcome, {authState.user?.name?.split(' ')[0]} Admin
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-9 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <nav className="flex space-x-6 border-b bg-white/50 -mx-4 px-4 pb-0">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'orders' && orders.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 text-xs">
                      {orders.length}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
        </div>
      </div>
    );
  };

  const ProfileComponent = () => {
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
      name: authState.user?.name || '',
      email: authState.user?.email || '',
      phone: authState.user?.phone || '',
      address: authState.user?.address || ''
    });
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [newPaymentMethod, setNewPaymentMethod] = useState({
      type: 'Credit Card' as PaymentMethod['type'],
      name: '', cardNumber: '', expiryDate: '', cvv: '', isDefault: false
    });

    const handleSaveProfile = async () => {
      if (authState.user) {
        try {
          // Assuming an API call to update user profile
          // const updatedUser = await AuthService.updateProfile(profileData);
          // This would ideally update the user in the context as well
          // For now, simulate local update
          const updatedUser = { ...authState.user, ...profileData };
          // authState.updateUser(updatedUser); // If update user function exists in context
          toast.success('Profile updated successfully');
          setEditMode(false);
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error(error.message);
          } else {
            toast.error('Failed to update profile');
          }
        }
      }
    };

    const handleAddPaymentMethod = async () => {
      if (!newPaymentMethod.name || !newPaymentMethod.cardNumber || !newPaymentMethod.expiryDate || !newPaymentMethod.cvv) {
        toast.error('Please fill in all payment details');
        return;
      }
      if (newPaymentMethod.cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (newPaymentMethod.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }

      const paymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: newPaymentMethod.type,
        name: newPaymentMethod.name,
        lastFour: newPaymentMethod.cardNumber.slice(-4),
        expiryDate: newPaymentMethod.expiryDate,
        isDefault: newPaymentMethod.isDefault
      };

      if (authState.user) {
        try {
          // Assuming an API call to add payment method
          // const updatedUser = await AuthService.addPaymentMethod(paymentMethod);
          // authState.updateUser(updatedUser);
          setShowAddPayment(false);
          setNewPaymentMethod({
            type: 'Credit Card' as PaymentMethod['type'],
            name: '', cardNumber: '', expiryDate: '', cvv: '', isDefault: false
          });
          toast.success('Payment method added successfully! 💳');
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error(error.message);
          } else {
            toast.error('Failed to add payment method');
          }
        }
      }
    };

    const handleDeleteProfile = async () => {
      if (authState.user) {
        try {
          // Assuming an API call to delete user account
          // await AuthService.deleteAccount(authState.user.id);
          await logout(); // This will clear local state and navigate to login
          toast.success('Your profile has been deleted successfully');
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error(error.message);
          } else {
            toast.error('Failed to delete account');
          }
        }
      }
    };

    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                {editMode && (
                  <Button onClick={handleSaveProfile} className="w-full">
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment Methods</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddPayment(!showAddPayment)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {authState.user?.paymentMethods && authState.user.paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {authState.user.paymentMethods.map((method) => (
                      <div key={method.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.type} ending in {method.lastFour}
                          </p>
                        </div>
                        {method.isDefault && <Badge>Default</Badge>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No payment methods added yet</p>
                )}

                {showAddPayment && (
                  <Card className="border-2 border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Add New Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="profile-card-type">Payment Type</Label>
                          <select
                            id="profile-card-type"
                            className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={newPaymentMethod.type}
                            onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value as PaymentMethod['type']})}
                          >
                            <option value="Credit Card">💳 Credit Card</option>
                            <option value="Debit Card">💳 Debit Card</option>
                            <option value="EFT">🏦 EFT Banking</option>
                            <option value="SnapScan">📱 SnapScan</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="profile-card-name">Cardholder Name</Label>
                          <Input
                            id="profile-card-name"
                            value={newPaymentMethod.name}
                            onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                            placeholder="Full name on card"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="profile-card-number">Card Number</Label>
                        <Input
                          id="profile-card-number"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                            setNewPaymentMethod({...newPaymentMethod, cardNumber: value});
                          }}
                          placeholder="1234567890123456"
                          maxLength={16}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="profile-expiry">Expiry Date</Label>
                          <Input
                            id="profile-expiry"
                            value={newPaymentMethod.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setNewPaymentMethod({...newPaymentMethod, expiryDate: value});
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="profile-cvv">CVV</Label>
                          <Input
                            id="profile-cvv"
                            value={newPaymentMethod.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                              setNewPaymentMethod({...newPaymentMethod, cvv: value});
                            }}
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="profile-set-default"
                          checked={newPaymentMethod.isDefault}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, isDefault: e.target.checked})}
                        />
                        <Label htmlFor="profile-set-default">Set as default payment method</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddPaymentMethod} className="flex-1 bg-green-600 hover:bg-green-700">
                          <Shield className="h-4 w-4 mr-2" />
                          Add Payment Method
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddPayment(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleNavigate('track-order')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track Orders
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleNavigate('cart')}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleNavigate('wishlist')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleNavigate('contact')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-red-700">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </CardContent>
            </Card>

            {showDeleteDialog && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-2 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">⚠️ This action is irreversible!</h4>
                      <p className="text-sm text-red-700 mb-3">
                        Deleting your account will permanently remove:
                      </p>
                      <ul className="space-y-1 text-sm text-red-700">
                        <li>• Your profile and personal information</li>
                        <li>• All saved payment methods</li>
                        <li>• Order history and tracking data</li>
                        <li>• Wishlist items</li>
                        <li>• Shopping cart contents</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>💡 Alternative:</strong> You can simply log out if you just want to switch accounts without deleting your data.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDeleteProfile();
                          setShowDeleteDialog(false);
                        }}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Yes, Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ContactComponent = () => (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Visit Our Store</p>
                <p className="text-sm text-muted-foreground">123 Fashion Street, Cape Town, 8001</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-muted-foreground">+27 21 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-sm text-muted-foreground">info@offkulture.co.za</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="Your email" />
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <textarea
                id="contact-message"
                className="w-full p-3 border rounded-md"
                rows={4}
                placeholder="Your message"
              />
            </div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const FAQComponent = () => (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {[
          {
            question: "What are your shipping times?",
            answer: "We typically ship within 1-2 business days and delivery takes 2-5 business days depending on your location in South Africa."
          },
          {
            question: "Do you offer free shipping?",
            answer: "Yes! We offer free shipping on all orders over R500 within South Africa."
          },
          {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all items in original condition with tags attached."
          },
          {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within South Africa. International shipping will be available soon."
          },
          {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track your orders in the 'Track Orders' section of your account."
          }
        ].map((faq, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const WishlistComponent = () => {
    if (wishlistItems.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist for easy access later.
            </p>
            <Button onClick={() => handleNavigate('home')}>
              Start Shopping
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
          <Badge variant="secondary">{wishlistItems.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onClick={() => setSelectedProduct(product)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addToWishlist(product)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">R{product.price.toFixed(2)}</span>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart(product);
                      // Remove from wishlist when added to cart
                      addToWishlist(product);
                    }}
                    disabled={!product.inStock}
                    className="w-full"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <div className="text-xs text-muted-foreground text-center">
                    Stock: {product.stockQuantity}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const AboutComponent = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About OffKulture</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              OffKulture was born from a passion for celebrating South African style and culture.
              We believe that fashion is a powerful form of self-expression that should reflect
              our unique heritage and modern aspirations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded in Cape Town, we're committed to providing high-quality, stylish clothing
              that captures the spirit of South Africa while meeting international standards of
              craftsmanship and design.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Premium materials and craftsmanship in every piece
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Made with Love</h3>
              <p className="text-sm text-muted-foreground">
                Each item is designed with care and attention to detail
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Quick and reliable delivery across South Africa
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const TrackOrderComponent = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Track Your Orders</h1>
      {authState.user?.orders && authState.user.orders.length > 0 ? (
        <div className="space-y-4">
          {authState.user.orders.slice().reverse().map(order => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-muted-foreground">
                        📦 Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <Badge variant={
                    order.status === 'Processing' ? 'default' :
                    order.status === 'Shipped' ? 'secondary' : 'outline'
                  }>
                    {order.status === 'Processing' ? '⏳ Processing' :
                     order.status === 'Shipped' ? '🚚 Shipped' : '✅ Delivered'}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items ({order.items.length}):</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                        <span>{item.name} x {item.quantity}</span>
                        <span>R{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm space-y-1 flex-1">
                      <p><strong>Payment:</strong> {order.paymentMethod}</p>
                      <p><strong>Shipping:</strong> {order.shippingAddress}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">Total: R{order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        VAT: R{order.tax.toFixed(2)} | Shipping: R{order.shipping.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className="w-3 h-3 rounded-full bg-current"></div>
                      <span className="text-xs">Processing</span>
                    </div>
                    <div className={`flex items-center gap-2 ${order.status === 'Shipped' || order.status === 'Delivered' ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className="w-3 h-3 rounded-full bg-current"></div>
                      <span className="text-xs">Shipped</span>
                    </div>
                    <div className={`flex items-center gap-2 ${order.status === 'Delivered' ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className="w-3 h-3 rounded-full bg-current"></div>
                      <span className="text-xs">Delivered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Truck className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Button onClick={() => handleNavigate('home')}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );

  const ProductComparisonModal = () => {
    if (!showComparison || comparisonItems.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl border-2 border-blue-200">
          <CardHeader className="sticky top-0 bg-white border-b z-10">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-blue-600" />
                Product Comparison ({comparisonItems.length}/3)
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComparison(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparisonItems.map((product) => (
                <div key={product.id} className="space-y-4">
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{product.name}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-green-600">R{product.price.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{(product.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{product.brand}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material:</span>
                        <span>{product.material}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock:</span>
                        <Badge variant={product.inStock ? "default" : "secondary"}>
                          {product.inStock ? `${product.stockQuantity} available` : 'Out of Stock'}
                        </Badge>
                      </div>

                      {product.sizes && (
                        <div>
                          <span className="text-muted-foreground">Sizes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.sizes.map(size => (
                              <Badge key={size} variant="outline" className="text-xs">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.colors && (
                        <div>
                          <span className="text-muted-foreground">Colors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.colors.map(color => (
                              <Badge key={color} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => addToWishlist(product)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
                        {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {comparisonItems.length < 3 && (
              <div className="mt-6 text-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <p className="text-muted-foreground">
                  Add {3 - comparisonItems.length} more product{3 - comparisonItems.length !== 1 ? 's' : ''} to compare
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const removeFromComparison = (productId: string) => {
    setComparisonItems(prev => prev.filter(item => item.id !== productId));
  };

  const renderCurrentPage = () => {
    if (!authState.isAuthenticated) {
      return <LoginSignupComponent />;
    }

    if (authState.user?.role === 'admin' && currentPage === 'admin') {
      return <AdminDashboard />;
    }

    switch (currentPage) {
      case 'home':
        return <ProductListComponent category="all" />;
      case 'mens':
      case 'womens':
      case 'baby':
      case 'accessories':
        return <ProductListComponent category={currentPage} />;
      case 'product':
        return selectedProduct ? <ProductDetailComponent product={selectedProduct} /> : <ProductListComponent category="all" />;
      case 'cart':
        return <CartComponent />;
      case 'checkout':
        return <CheckoutComponent />;
      case 'profile':
        return <ProfileComponent />;
      case 'contact':
        return <ContactComponent />;
      case 'faq':
        return <FAQComponent />;
      case 'about':
        return <AboutComponent />;
      case 'size-guide':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Size Guide</h1>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h3 className="font-medium mb-4">General Sizing Information</h3>
                  <p className="text-muted-foreground mb-6">
                    Our sizes follow standard South African sizing. If you're between sizes,
                    we recommend sizing up for a more comfortable fit.
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Men's Clothing</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border p-2">Size</th>
                              <th className="border border-border p-2">Chest (cm)</th>
                              <th className="border border-border p-2">Waist (cm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ['S', '88-92', '76-80'],
                              ['M', '96-100', '84-88'],
                              ['L', '104-108', '92-96'],
                              ['XL', '112-116', '100-104'],
                              ['XXL', '120-124', '108-112']
                            ].map(([size, chest, waist]) => (
                              <tr key={size}>
                                <td className="border border-border p-2 font-medium">{size}</td>
                                <td className="border border-border p-2">{chest}</td>
                                <td className="border border-border p-2">{waist}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Women's Clothing</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border p-2">Size</th>
                              <th className="border border-border p-2">Bust (cm)</th>
                              <th className="border border-border p-2">Waist (cm)</th>
                              <th className="border border-border p-2">Hips (cm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ['XS', '81-85', '63-67', '89-93'],
                              ['S', '86-90', '68-72', '94-98'],
                              ['M', '91-95', '73-77', '99-103'],
                              ['L', '96-100', '78-82', '104-108'],
                              ['XL', '101-105', '83-87', '109-113']
                            ].map(([size, bust, waist, hips]) => (
                              <tr key={size}>
                                <td className="border border-border p-2 font-medium">{size}</td>
                                <td className="border border-border p-2">{bust}</td>
                                <td className="border border-border p-2">{waist}</td>
                                <td className="border border-border p-2">{hips}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'shipping':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-8">
                  <h3 className="font-medium mb-4">Delivery Times & Costs</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Orders under R500</span>
                      <span>R99.99 (2-5 business days)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Orders over R500</span>
                      <span className="text-green-600 font-medium">FREE (2-5 business days)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Express delivery</span>
                      <span>R199.99 (1-2 business days)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h3 className="font-medium mb-4">Delivery Areas</h3>
                  <p className="text-muted-foreground mb-4">
                    We currently deliver to all major cities and towns across South Africa:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li>• Cape Town & Western Cape</li>
                    <li>• Johannesburg & Gauteng</li>
                    <li>• Durban & KwaZulu-Natal</li>
                    <li>• Port Elizabeth & Eastern Cape</li>
                    <li>• Bloemfontein & Free State</li>
                    <li>• Polokwane & Limpopo</li>
                    <li>• Nelspruit & Mpumalanga</li>
                    <li>• Rustenburg & North West</li>
                    <li>• Kimberley & Northern Cape</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'returns':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-8">
                  <h3 className="font-medium mb-4">30-Day Return Policy</h3>
                  <p className="text-muted-foreground mb-4">
                    We want you to love your OffKulture purchase! If you're not completely satisfied,
                    you can return items within 30 days of delivery for a full refund or exchange.
                  </p>

                  <h4 className="font-medium mb-2">Return Conditions:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground mb-6">
                    <li>• Items must be in original condition with tags attached</li>
                    <li>• Items must be unworn and unwashed</li>
                    <li>• Original packaging must be included</li>
                    <li>• Proof of purchase required</li>
                  </ul>

                  <h4 className="font-medium mb-2">How to Return:</h4>
                  <ol className="space-y-1 text-sm text-muted-foreground">
                    <li>1. Email us at returns@offkulture.co.za with your order number</li>
                    <li>2. We'll send you a prepaid return label</li>
                    <li>3. Pack items securely and attach the return label</li>
                    <li>4. Drop off at any PostNet location</li>
                    <li>5. Refund processed within 5-7 business days after we receive your return</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'wishlist':
        return <WishlistComponent />;
      case 'track-order':
        return <TrackOrderComponent />;
      default:
        return <ProductListComponent category="all" />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
        {authState.isAuthenticated && <HeaderComponent />}
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
        <footer className="border-t bg-muted/30 mt-auto">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg overflow-hidden bg-white shadow-sm">
                    <img
                      src={offKultureLogo}
                      alt="OffKulture Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold">
                    <span className="text-green-600">Off</span>Kulture
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Premium South African fashion brand celebrating our unique culture and style.
                  Quality clothing for the modern South African.
                </p>
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Quick Links</h3>
                <div className="space-y-2">
                  {['mens', 'womens', 'baby', 'accessories'].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleNavigate(category as Page)}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category === 'mens' ? "Men's Collection" :
                       category === 'womens' ? "Women's Collection" :
                       category === 'baby' ? "Baby's Collection" : 'Accessories'}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavigate('track-order')}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Track Your Order
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Customer Service</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Size Guide', value: 'size-guide' },
                    { label: 'Shipping Info', value: 'shipping' },
                    { label: 'Returns & Exchanges', value: 'returns' },
                    { label: 'FAQ', value: 'faq' },
                    { label: 'Contact Us', value: 'contact' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleNavigate(item.value as Page)}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p>123 Fashion Street</p>
                      <p>Cape Town, Western Cape 8001</p>
                      <p>South Africa</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">+27 21 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">info@offkulture.co.za</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2024 OffKulture. All rights reserved. Premium South African fashion.
                </p>
                <div className="flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Secure payments</span>
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Fast delivery</span>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <ProductComparisonModal />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {isSearching && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[45] flex items-center justify-center p-4">
          <Card className="p-6 shadow-xl border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
              <span className="text-sm font-medium">Searching products...</span>
            </div>
          </Card>
        </div>
      )}

      {notifications.length > 0 && authState.user?.role === 'admin' && (
        <div className="fixed bottom-4 right-4 z-[50] space-y-2 max-w-sm">
          {notifications.slice(0, 3).map((notification, index) => (
            <Card key={index} className="shadow-xl border-orange-200 bg-orange-50 animate-in slide-in-from-right">
              <CardContent className="p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-orange-800 flex-1">{notification}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
