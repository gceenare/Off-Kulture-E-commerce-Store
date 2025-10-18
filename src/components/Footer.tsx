import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
// Logo will be text-based for now

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="h-12 flex items-center">
              <span className="text-xl font-bold">
                <span className="text-green-600">Off</span>Kulture
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium fashion for every lifestyle. Discover exclusive collections for men, women, babies, and accessories.
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

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('mens')}>
                Men's Collection
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('womens')}>
                Women's Collection
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('baby')}>
                Baby's Collection
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('accessories')}>
                Accessories
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('home')}>
                Sale
              </Button>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-medium">Customer Service</h4>
            <nav className="flex flex-col space-y-2">
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('contact')}>
                Contact Us
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('size-guide')}>
                Size Guide
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('shipping')}>
                Shipping & Returns
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('faq')}>
                FAQ
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" onClick={() => onNavigate('track-order')}>
                Track Your Order
              </Button>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-medium">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get special offers and updates on new collections.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Contact Info & Legal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium">Contact Information</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>15 Nelson Mandela Square, Sandton, Johannesburg, 2196</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+27 11 883 8000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@offkulture.co.za</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Cape Town Store: V&A Waterfront, Victoria Wharf, Cape Town, 8001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+27 21 419 5558</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Legal</h4>
            <nav className="flex flex-wrap gap-4 text-sm">
              <Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => onNavigate('privacy')}>
                Privacy Policy
              </Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => onNavigate('terms')}>
                Terms of Service
              </Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => onNavigate('cookies')}>
                Cookie Policy
              </Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => onNavigate('accessibility')}>
                Accessibility
              </Button>
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 OffKulture. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>We accept:</span>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center text-xs">
                VISA
              </div>
              <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center text-xs">
                MC
              </div>
              <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center text-xs">
                AMEX
              </div>
              <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center text-xs">
                PP
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}