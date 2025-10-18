import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Store, 
  CreditCard, 
  Shield, 
  Mail, 
  Bell,
  Upload,
  Save
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'OffKulture',
    storeDescription: 'Authentic South African fashion and lifestyle brand',
    storeAddress: '123 Fashion Street, Cape Town, Western Cape, 8001',
    storePhone: '+27 21 123 4567',
    storeEmail: 'hello@offkulture.co.za',
    website: 'https://www.offkulture.co.za',
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
    language: 'English'
  });

  const [taxSettings, setTaxSettings] = useState({
    vatNumber: '4123456789',
    vatRate: 15,
    includeTaxInPrices: true,
    taxDisplayType: 'inclusive'
  });

  const [emailSettings, setEmailSettings] = useState({
    fromName: 'OffKulture',
    fromEmail: 'noreply@offkulture.co.za',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@offkulture.co.za',
    smtpPassword: '••••••••',
    enableSSL: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockAlerts: true,
    customerSignups: true,
    paymentAlerts: true,
    systemUpdates: false,
    marketingEmails: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    enableAuditLog: true
  });

  const handleSaveStoreSettings = () => {
    // Mock save - in real app, this would save to backend
    toast.success('Store settings saved successfully!');
  };

  const handleSaveTaxSettings = () => {
    toast.success('Tax settings saved successfully!');
  };

  const handleSaveEmailSettings = () => {
    toast.success('Email settings saved successfully!');
  };

  const handleSaveNotificationSettings = () => {
    toast.success('Notification settings saved successfully!');
  };

  const handleSaveSecuritySettings = () => {
    toast.success('Security settings saved successfully!');
  };

  const handleTestEmailSettings = () => {
    toast.success('Test email sent successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration, policies, and system preferences</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Tax & VAT
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Store Name</label>
                  <Input
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2">Website URL</label>
                  <Input
                    value={storeSettings.website}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Store Description</label>
                <Textarea
                  value={storeSettings.storeDescription}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-2">Store Address</label>
                <Textarea
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Phone Number</label>
                  <Input
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storePhone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Currency</label>
                  <Input
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                    disabled
                  />
                </div>
                <div>
                  <label className="block mb-2">Timezone</label>
                  <Input
                    value={storeSettings.timezone}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2">Language</label>
                  <Input
                    value={storeSettings.language}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, language: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveStoreSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  VAT & Tax Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">VAT Registration Number</label>
                    <Input
                      value={taxSettings.vatNumber}
                      onChange={(e) => setTaxSettings(prev => ({ ...prev, vatNumber: e.target.value }))}
                      placeholder="VAT number"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">VAT Rate (%)</label>
                    <Input
                      type="number"
                      value={taxSettings.vatRate}
                      onChange={(e) => setTaxSettings(prev => ({ ...prev, vatRate: Number(e.target.value) }))}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Include VAT in Product Prices</h4>
                      <p className="text-sm text-muted-foreground">Display prices inclusive of VAT</p>
                    </div>
                    <Switch
                      checked={taxSettings.includeTaxInPrices}
                      onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, includeTaxInPrices: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveTaxSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Tax Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">South African VAT Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Standard VAT rate in South Africa is 15%</li>
                    <li>• VAT registration is mandatory for businesses with annual turnover exceeding R1 million</li>
                    <li>• VAT returns must be submitted monthly or bi-monthly</li>
                    <li>• Keep detailed records of all VAT transactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">From Name</label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2">From Email</label>
                  <Input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">SMTP Host</label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2">SMTP Port</label>
                  <Input
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">SMTP Username</label>
                  <Input
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2">SMTP Password</label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable SSL/TLS</h4>
                  <p className="text-sm text-muted-foreground">Use secure connection for email sending</p>
                </div>
                <Switch
                  checked={emailSettings.enableSSL}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableSSL: checked }))}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleTestEmailSettings}>
                  Send Test Email
                </Button>
                <Button onClick={handleSaveEmailSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-muted-foreground">Alerts when products are running low</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, lowStockAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Customer Signups</h4>
                    <p className="text-sm text-muted-foreground">Notifications for new customer registrations</p>
                  </div>
                  <Switch
                    checked={notificationSettings.customerSignups}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, customerSignups: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Alerts</h4>
                    <p className="text-sm text-muted-foreground">Notifications for payment successes and failures</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">Notifications about system maintenance and updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">Receive marketing tips and feature updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotificationSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Audit Log</h4>
                    <p className="text-sm text-muted-foreground">Track all admin actions and changes</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableAuditLog}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableAuditLog: checked }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                    min="5"
                    max="1440"
                  />
                </div>
                <div>
                  <label className="block mb-2">Password Min Length</label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: Number(e.target.value) }))}
                    min="6"
                    max="32"
                  />
                </div>
                <div>
                  <label className="block mb-2">Max Login Attempts</label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: Number(e.target.value) }))}
                    min="3"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecuritySettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}