import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertTriangle, Edit, Eye, Package, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'mens' | 'womens' | 'baby' | 'accessories';
  image: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  stockQuantity: number;
  sku?: string;
}

interface ProductManagementProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductManagement({ products, onUpdateStock, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductManagementProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'mens',
    sizes: [],
    colors: [],
    stockQuantity: 0,
    image: '',
    sku: '',
    inStock: true
  });

  const categories = ['mens', 'womens', 'baby', 'accessories'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
  const availableColors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Navy', 'Beige'];

  const filteredProducts = (products || []).filter(product => {
    const matchesSelection = selectedProductId === '' || product.id === selectedProductId;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.inStock) ||
                         (filterStatus === 'inactive' && !product.inStock) ||
                         (filterStatus === 'low-stock' && product.stockQuantity <= 10) ||
                         (filterStatus === 'out-of-stock' && product.stockQuantity <= 0);
    
    return matchesSelection && matchesCategory && matchesStatus;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || newProduct.price === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: `prod_${Date.now()}`,
      name: newProduct.name!,
      description: newProduct.description!,
      price: newProduct.price!,
      category: newProduct.category!,
      image: newProduct.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      sizes: newProduct.sizes!,
      colors: newProduct.colors!,
      stockQuantity: newProduct.stockQuantity!,
      sku: newProduct.sku!,
      inStock: newProduct.stockQuantity! > 0
    };

    onAddProduct(product);
    setNewProduct({
      name: '', description: '', price: 0, category: 'mens',
      sizes: [], colors: [], stockQuantity: 0,
      image: '', sku: '', inStock: true
    });
    setIsAddDialogOpen(false);
    toast.success('Product added successfully!');
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name!,
      description: newProduct.description!,
      price: newProduct.price!,
      category: newProduct.category!,
      image: newProduct.image || editingProduct.image,
      sizes: newProduct.sizes!,
      colors: newProduct.colors!,
      stockQuantity: newProduct.stockQuantity!,
      sku: newProduct.sku!,
      inStock: newProduct.stockQuantity! > 0
    };

    onUpdateProduct(updatedProduct);
    setEditingProduct(null);
    setNewProduct({
      name: '', description: '', price: 0, category: 'mens',
      sizes: [], colors: [], stockQuantity: 0,
      image: '', sku: '', inStock: true
    });
    setIsAddDialogOpen(false);
    toast.success('Product updated successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    onDeleteProduct(productId);
    toast.success('Product deleted successfully!');
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    if (newStock < 0) {
      toast.error('Stock quantity cannot be negative');
      return;
    }
    onUpdateStock(productId, newStock);
    toast.success('Stock updated successfully!');
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stockQuantity: product.stockQuantity,
      image: product.image,
      sku: product.sku,
      inStock: product.inStock
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Product & Stock Management</h1>
          <p className="text-muted-foreground">Manage your inventory and product catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                name: '', description: '', price: 0, category: 'mens',
                sizes: [], colors: [], stockQuantity: 0,
                image: '', sku: '', inStock: true
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information' : 'Create a new product for your store'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    value={newProduct.sku || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Enter SKU"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price (R)</label>
                  <Input
                    type="number"
                    value={newProduct.price || 0}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input
                    type="number"
                    value={newProduct.stockQuantity || 0}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={newProduct.image || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} className="flex-1">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product to manage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  {products && products.length > 0 ? products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.sku || product.id}
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-products" disabled>No products available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-40">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku || product.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>R{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={product.stockQuantity}
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                          min="0"
                        />
                        {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {product.stockQuantity === 0 && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stockQuantity > 10 ? "default" : product.stockQuantity > 0 ? "secondary" : "destructive"}>
                        {product.stockQuantity > 10 ? 'In Stock' : product.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}