import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './index';
import { Product, ProductReview } from '../AppWithApi';

export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  rating?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  // Get all products with optional filtering and pagination
  static async getProducts(params?: ProductSearchParams): Promise<PaginatedProductsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedProductsResponse>>('/products', {
        params,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get products by category
  static async getProductsByCategory(
    category: string,
    params?: Omit<ProductSearchParams, 'filters'>
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedProductsResponse>>(
        `/products/category/${category}`,
        { params }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Search products
  static async searchProducts(
    query: string,
    params?: ProductSearchParams
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedProductsResponse>>(
        '/products/search',
        {
          params: { q: query, ...params },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit?: number): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/featured', {
        params: { limit },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get new arrivals
  static async getNewArrivals(limit?: number): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/new', {
        params: { limit },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get sale products
  static async getSaleProducts(limit?: number): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/sale', {
        params: { limit },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get related products
  static async getRelatedProducts(productId: string, limit?: number): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products/${productId}/related`,
        {
          params: { limit },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Create new product
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>('/products', productData);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Update product
  static async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, productData);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Update product stock
  static async updateProductStock(id: string, quantity: number): Promise<Product> {
    try {
      const response = await apiClient.patch<ApiResponse<Product>>(
        `/products/${id}/stock`,
        { quantity }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product reviews
  static async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const response = await apiClient.get<ApiResponse<ProductReview[]>>(
        `/products/${productId}/reviews`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add product review
  static async addProductReview(
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date' | 'verified'>
  ): Promise<ProductReview> {
    try {
      const response = await apiClient.post<ApiResponse<ProductReview>>(
        `/products/${productId}/reviews`,
        reviewData
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product categories
  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/products/categories');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product sizes for a category
  static async getSizesForCategory(category: string): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        `/products/categories/${category}/sizes`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product colors for a category
  static async getColorsForCategory(category: string): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        `/products/categories/${category}/colors`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}