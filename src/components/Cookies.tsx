import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Cookie, Settings, Info, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CookiesProps {
  onBack: () => void;
}

export function Cookies({ onBack }: CookiesProps) {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handleSaveCookieSettings = () => {
    // Save settings to localStorage (in a real app, this would sync with your cookie management system)
    localStorage.setItem('offkulture-cookie-settings', JSON.stringify(cookieSettings));
    toast.success('Cookie preferences saved successfully!');
  };

  const handleToggleSetting = (setting: string) => {
    if (setting === 'essential') return; // Essential cookies cannot be disabled
    
    setCookieSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-primary hover:underline mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Cookie className="h-8 w-8" />
            Cookie Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2024 | Learn about how we use cookies on our website
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                This Cookie Policy explains how OffKulture uses cookies and similar technologies on our website. 
                By using our website, you consent to the use of cookies in accordance with this policy and 
                your chosen preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit a website. 
                They help websites remember your preferences and improve your browsing experience.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Session Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Temporary cookies that are deleted when you close your browser. They help maintain 
                    your session and shopping cart contents.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Persistent Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Cookies that remain on your device for a specified period. They remember your 
                    preferences for future visits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Manage your cookie preferences below. Essential cookies cannot be disabled as they are 
                necessary for the website to function properly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Essential Cookies</h3>
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      These cookies are necessary for the website to function and cannot be disabled.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Authentication and security</li>
                      <li>• Shopping cart functionality</li>
                      <li>• Form submission and validation</li>
                      <li>• Basic website functionality</li>
                    </ul>
                  </div>
                  <Switch 
                    checked={cookieSettings.essential} 
                    disabled 
                    className="ml-4"
                  />
                </div>

                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Help us understand how visitors interact with our website to improve performance.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Page views and user behavior</li>
                      <li>• Performance monitoring</li>
                      <li>• Error tracking</li>
                    </ul>
                  </div>
                  <Switch 
                    checked={cookieSettings.analytics} 
                    onCheckedChange={() => handleToggleSetting('analytics')}
                    className="ml-4"
                  />
                </div>

                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Marketing Cookies</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Used to show relevant advertisements and measure campaign effectiveness.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Facebook Pixel</li>
                      <li>• Google Ads tracking</li>
                      <li>• Retargeting advertisements</li>
                      <li>• Campaign performance</li>
                    </ul>
                  </div>
                  <Switch 
                    checked={cookieSettings.marketing} 
                    onCheckedChange={() => handleToggleSetting('marketing')}
                    className="ml-4"
                  />
                </div>

                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Preference Cookies</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Remember your preferences and settings to enhance your experience.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Language preferences</li>
                      <li>• Currency selection</li>
                      <li>• Wishlist items</li>
                      <li>• Recently viewed products</li>
                    </ul>
                  </div>
                  <Switch 
                    checked={cookieSettings.preferences} 
                    onCheckedChange={() => handleToggleSetting('preferences')}
                    className="ml-4"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveCookieSettings}>
                  Save Cookie Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We may use third-party services that set their own cookies. These services are subject 
                to their own privacy policies:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Analytics Services</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Google Analytics:</strong> Website analytics and reporting</li>
                    <li>• <strong>Hotjar:</strong> User behavior analysis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Marketing Services</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Facebook:</strong> Social media integration and ads</li>
                    <li>• <strong>Google Ads:</strong> Advertising and remarketing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Payment Services</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>PayGate:</strong> Secure payment processing</li>
                    <li>• <strong>PayFast:</strong> Payment gateway services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Support Services</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Intercom:</strong> Customer support chat</li>
                    <li>• <strong>Zendesk:</strong> Help desk functionality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Browser Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Block all cookies</li>
                    <li>• Allow only first-party cookies</li>
                    <li>• Delete existing cookies</li>
                    <li>• Set cookie expiration preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Browser Help Links</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Chrome:</strong> Settings → Privacy → Cookies</p>
                    <p><strong>Firefox:</strong> Options → Privacy → Cookies</p>
                    <p><strong>Safari:</strong> Preferences → Privacy → Cookies</p>
                    <p><strong>Edge:</strong> Settings → Privacy → Cookies</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Disabling certain cookies may affect website functionality and 
                  limit your ability to use some features of our online store.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Session Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically deleted when you close your browser session.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Persistent Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Retained for varying periods, typically 30 days to 2 years depending on their purpose.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Usually retained for 2 years to provide meaningful insights into user behavior.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Typically retained for 30-90 days to deliver relevant advertising campaigns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Questions About Cookies?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about our use of cookies or need help managing your preferences, 
                please contact us:
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span><strong>Email:</strong> privacy@offkulture.co.za</span>
                <span><strong>Phone:</strong> +27 21 123 4567</span>
                <span><strong>Hours:</strong> Mon-Fri 9AM-5PM SAST</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}