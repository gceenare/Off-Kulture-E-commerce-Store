import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { User as UserIcon, Package, Heart, Settings, LogOut, CreditCard } from 'lucide-react';
import { User, Order, WishlistItem, CartItem } from '../App';
import { toast } from 'sonner@2.0.3';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  orders: Order[];
  wishlist: WishlistItem[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: WishlistItem, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  onNavigate: (page: string) => void;
}

export function Profile({ user, onLogout, orders, wishlist, onRemoveFromWishlist, onAddToCart, onNavigate }: ProfileProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotionalEmails: false
  });

  const handleAddToCartFromWishlist = (item: WishlistItem) => {
    onAddToCart(item, 1);
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    onRemoveFromWishlist(productId);
    toast.success('Item removed from wishlist');
  };

  const handleViewOrderDetails = (order: Order) => {
    toast.info(`Order ${order.id} details would open here`);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      onAddToCart(item, item.quantity, item.selectedSize, item.selectedColor);
    });
    toast.success('Items added to cart for reorder!');
    onNavigate('cart');
  };

  const handleChangePassword = () => {
    toast.info('Change password functionality would open here');
  };

  const handleTwoFactor = () => {
    toast.info('Two-factor authentication setup would open here');
  };

  const handleEditPayment = () => {
    toast.info('Payment method editing would open here');
  };

  const handleAddPayment = () => {
    toast.info('Add payment method would open here');
  };

  const toggleNotification = (type: 'orderUpdates' | 'promotionalEmails') => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success(`${type === 'orderUpdates' ? 'Order updates' : 'Promotional emails'} ${notificationSettings[type] ? 'disabled' : 'enabled'}`);
  };

  const handleProfileSave = () => {
    // Mock save functionality
    toast.success('Profile updated successfully!');
    setEditingProfile(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and orders</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProfile(!editingProfile)}
                  >
                    {editingProfile ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!editingProfile}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!editingProfile}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!editingProfile}
                  />
                </div>

                {editingProfile && (
                  <Button onClick={handleProfileSave}>
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => onNavigate('home')}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <h3 className="font-medium">{order.id}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R{order.total.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Items: {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order)}>
                            View Details
                          </Button>
                          {order.status === 'Delivered' && (
                            <Button variant="outline" size="sm" onClick={() => handleReorder(order)}>
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your wishlist is empty</p>
                    <Button variant="outline" className="mt-4" onClick={() => onNavigate('home')}>
                      Discover Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-lg font-semibold">R{item.price.toFixed(2)}</p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" onClick={() => handleAddToCartFromWishlist(item)}>
                                Add to Cart
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(item.id)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6" />
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleEditPayment}>
                        Edit
                      </Button>
                    </div>
                    <Button variant="outline" onClick={handleAddPayment}>
                      Add New Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order updates</p>
                        <p className="text-sm text-muted-foreground">Get notified when your order status changes</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleNotification('orderUpdates')}
                        className={notificationSettings.orderUpdates ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      >
                        {notificationSettings.orderUpdates ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotional emails</p>
                        <p className="text-sm text-muted-foreground">Receive emails about sales and new products</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleNotification('promotionalEmails')}
                        className={notificationSettings.promotionalEmails ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      >
                        {notificationSettings.promotionalEmails ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" onClick={handleChangePassword}>
                      Change Password
                    </Button>
                    <Button variant="outline" onClick={handleTwoFactor}>
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}