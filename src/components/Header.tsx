import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingBag, User, Search, Menu, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
// Logo will be text-based for now

interface HeaderProps {
  onNavigate: (page: string) => void;
  cartItemCount: number;
  user: any;
  onLogout?: () => void;
}

export function Header({ onNavigate, cartItemCount, user, onLogout }: HeaderProps) {
  const navItems = [
    { label: "Men's", value: 'mens' },
    { label: "Women's", value: 'womens' },
    { label: "Baby's", value: 'baby' },
    { label: "Accessories", value: 'accessories' },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="h-10 flex items-center">
              <span className="text-xl font-bold">
                <span className="text-green-600">Off</span>Kulture
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                onClick={() => onNavigate(item.value)}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('login')}
                className="hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('cart')}
              className="relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10 w-full"
                    />
                  </div>
                  
                  {navItems.map((item) => (
                    <Button
                      key={item.value}
                      variant="ghost"
                      onClick={() => onNavigate(item.value)}
                      className="justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                  
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => onNavigate('profile')}
                        className="justify-start"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => onNavigate('login')}
                      className="justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}