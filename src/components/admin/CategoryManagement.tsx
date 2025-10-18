import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Tag,
  Image
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  productCount: number;
  parentId?: string;
  sortOrder: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  image?: string;
  startDate?: string;
  endDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [collections, setCollections] = useState<Collection[]>([]);

  const [activeTab, setActiveTab] = useState<'categories' | 'collections'>('categories');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    slug: '',
    isActive: true,
    sortOrder: 1
  });

  const [newCollection, setNewCollection] = useState<Partial<Collection>>({
    name: '',
    description: '',
    slug: '',
    isActive: true,
    isFeatured: false,
    tags: []
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    const category: Category = {
      id: `cat_${Date.now()}`,
      name: newCategory.name!,
      description: newCategory.description!,
      slug: newCategory.slug!,
      isActive: newCategory.isActive!,
      productCount: 0,
      sortOrder: newCategory.sortOrder!,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({ name: '', description: '', slug: '', isActive: true, sortOrder: 1 });
    setIsCategoryDialogOpen(false);
    toast.success('Category added successfully!');
  };

  const handleAddCollection = () => {
    if (!newCollection.name || !newCollection.slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    const collection: Collection = {
      id: `coll_${Date.now()}`,
      name: newCollection.name!,
      description: newCollection.description!,
      slug: newCollection.slug!,
      isActive: newCollection.isActive!,
      isFeatured: newCollection.isFeatured!,
      productCount: 0,
      tags: newCollection.tags!,
      startDate: newCollection.startDate,
      endDate: newCollection.endDate,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setCollections(prev => [...prev, collection]);
    setNewCollection({ name: '', description: '', slug: '', isActive: true, isFeatured: false, tags: [] });
    setIsCollectionDialogOpen(false);
    toast.success('Collection added successfully!');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setNewCollection(collection);
    setIsCollectionDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory.id 
        ? { ...newCategory as Category, id: editingCategory.id, updatedAt: new Date().toISOString().split('T')[0] }
        : cat
    ));
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', slug: '', isActive: true, sortOrder: 1 });
    setIsCategoryDialogOpen(false);
    toast.success('Category updated successfully!');
  };

  const handleUpdateCollection = () => {
    if (!editingCollection) return;

    setCollections(prev => prev.map(coll => 
      coll.id === editingCollection.id 
        ? { ...newCollection as Collection, id: editingCollection.id, updatedAt: new Date().toISOString().split('T')[0] }
        : coll
    ));
    setEditingCollection(null);
    setNewCollection({ name: '', description: '', slug: '', isActive: true, isFeatured: false, tags: [] });
    setIsCollectionDialogOpen(false);
    toast.success('Collection updated successfully!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success('Category deleted successfully!');
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(coll => coll.id !== collectionId));
    toast.success('Collection deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Category & Collection Management</h1>
          <p className="text-muted-foreground">Organize your products into categories and create featured collections</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'categories' ? 'default' : 'outline'}
          onClick={() => setActiveTab('categories')}
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Categories
        </Button>
        <Button 
          variant={activeTab === 'collections' ? 'default' : 'outline'}
          onClick={() => setActiveTab('collections')}
        >
          <Star className="h-4 w-4 mr-2" />
          Collections
        </Button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCategory(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                  <DialogDescription>
                    {editingCategory ? 'Modify the category details below.' : 'Create a new product category.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Category Name *</label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Slug *</label>
                    <Input
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="category-slug"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Description</label>
                    <Textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Sort Order</label>
                    <Input
                      type="number"
                      value={newCategory.sortOrder}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Categories ({categories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                      <TableCell>{category.productCount}</TableCell>
                      <TableCell>{category.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={category.isActive ? 'default' : 'outline'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCollection(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCollection ? 'Edit Collection' : 'Add New Collection'}</DialogTitle>
                  <DialogDescription>
                    {editingCollection ? 'Update the collection information below.' : 'Create a new product collection.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Collection Name *</label>
                      <Input
                        value={newCollection.name}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter collection name"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Slug *</label>
                      <Input
                        value={newCollection.slug}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="collection-slug"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2">Description</label>
                    <Textarea
                      value={newCollection.description}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter collection description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={newCollection.startDate}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">End Date</label>
                      <Input
                        type="date"
                        value={newCollection.endDate}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2">Tags (comma-separated)</label>
                    <Input
                      value={newCollection.tags?.join(', ')}
                      onChange={(e) => setNewCollection(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                      }))}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newCollection.isActive}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newCollection.isFeatured}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      />
                      Featured
                    </label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCollectionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingCollection ? handleUpdateCollection : handleAddCollection}>
                      {editingCollection ? 'Update Collection' : 'Add Collection'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Collections ({collections.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-sm text-muted-foreground">{collection.description}</p>
                          <div className="flex gap-1 mt-1">
                            {collection.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{collection.productCount}</TableCell>
                      <TableCell>
                        <Badge variant={collection.isActive ? 'default' : 'outline'}>
                          {collection.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {collection.isFeatured && (
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {collection.startDate && collection.endDate ? (
                          <div className="text-sm">
                            <p>{collection.startDate}</p>
                            <p className="text-muted-foreground">to {collection.endDate}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Ongoing</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCollection(collection)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCollection(collection.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}