import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './api';
import { CartItem, Product } from '../App';

export interface AddToCartData {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface UpdateCartItemData {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  itemCount: number;
}

export class CartService {
  // Get user's cart
  static async getCart(): Promise<CartResponse> {
    try {
      const response = await apiClient.get<ApiResponse<CartResponse>>('/cart');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add item to cart
  static async addToCart(itemData: AddToCartData): Promise<CartResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/items', itemData);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update cart item
  static async updateCartItem(itemId: string, itemData: UpdateCartItemData): Promise<CartResponse> {
    try {
      const response = await apiClient.put<ApiResponse<CartResponse>>(
        `/cart/items/${itemId}`,
        itemData
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove item from cart
  static async removeFromCart(itemId: string): Promise<CartResponse> {
    try {
      const response = await apiClient.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Clear entire cart
  static async clearCart(): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>('/cart');
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get cart item count
  static async getCartItemCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>('/cart/count');
      const { count } = handleApiResponse(response);
      return count;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Apply coupon code
  static async applyCoupon(couponCode: string): Promise<CartResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/coupon', {
        couponCode,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove coupon code
  static async removeCoupon(): Promise<CartResponse> {
    try {
      const response = await apiClient.delete<ApiResponse<CartResponse>>('/cart/coupon');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Calculate shipping
  static async calculateShipping(address: string): Promise<{ shipping: number; methods: any[] }> {
    try {
      const response = await apiClient.post<ApiResponse<{ shipping: number; methods: any[] }>>(
        '/cart/shipping',
        { address }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Merge guest cart with user cart (after login)
  static async mergeCart(guestCartItems: CartItem[]): Promise<CartResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/merge', {
        items: guestCartItems,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Validate cart (check stock, prices, etc.)
  static async validateCart(): Promise<{
    valid: boolean;
    items: CartItem[];
    issues: string[];
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        valid: boolean;
        items: CartItem[];
        issues: string[];
      }>>('/cart/validate');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Save cart for later (guest users)
  static async saveCartForLater(email: string): Promise<{ cartId: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ cartId: string }>>('/cart/save', {
        email,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Load saved cart (guest users)
  static async loadSavedCart(cartId: string): Promise<CartResponse> {
    try {
      const response = await apiClient.get<ApiResponse<CartResponse>>(`/cart/saved/${cartId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}