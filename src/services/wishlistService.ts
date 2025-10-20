import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './api';
import { WishlistItem, Product } from '../App';

export interface WishlistResponse {
  items: WishlistItem[];
  itemCount: number;
}

export class WishlistService {
  // Get user's wishlist
  static async getWishlist(): Promise<WishlistResponse> {
    try {
      const response = await apiClient.get<ApiResponse<WishlistResponse>>('/wishlist');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add item to wishlist
  static async addToWishlist(productId: string): Promise<WishlistResponse> {
    try {
      const response = await apiClient.post<ApiResponse<WishlistResponse>>('/wishlist/items', {
        productId,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove item from wishlist
  static async removeFromWishlist(productId: string): Promise<WishlistResponse> {
    try {
      const response = await apiClient.delete<ApiResponse<WishlistResponse>>(
        `/wishlist/items/${productId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Clear entire wishlist
  static async clearWishlist(): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>('/wishlist');
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Check if product is in wishlist
  static async isInWishlist(productId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<ApiResponse<{ inWishlist: boolean }>>(
        `/wishlist/check/${productId}`
      );
      const { inWishlist } = handleApiResponse(response);
      return inWishlist;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Move item from wishlist to cart
  static async moveToCart(
    productId: string,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ): Promise<{ message: string; cartUpdated: boolean }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; cartUpdated: boolean }>>(
        `/wishlist/move-to-cart/${productId}`,
        {
          quantity,
          selectedSize,
          selectedColor,
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get wishlist item count
  static async getWishlistItemCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>('/wishlist/count');
      const { count } = handleApiResponse(response);
      return count;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Share wishlist
  static async shareWishlist(emails: string[], message?: string): Promise<{
    shareUrl: string;
    expiresAt: string;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        shareUrl: string;
        expiresAt: string;
      }>>('/wishlist/share', {
        emails,
        message,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get shared wishlist
  static async getSharedWishlist(shareToken: string): Promise<{
    items: WishlistItem[];
    userName: string;
    message?: string;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        items: WishlistItem[];
        userName: string;
        message?: string;
      }>>(`/wishlist/shared/${shareToken}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get price drop alerts for wishlist items
  static async getPriceDropAlerts(): Promise<{
    items: (WishlistItem & {
      originalPrice: number;
      currentPrice: number;
      priceDrop: number;
      priceDropPercentage: number;
    })[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        items: (WishlistItem & {
          originalPrice: number;
          currentPrice: number;
          priceDrop: number;
          priceDropPercentage: number;
        })[];
      }>>('/wishlist/price-alerts');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Set price alert for wishlist item
  static async setPriceAlert(
    productId: string,
    targetPrice: number
  ): Promise<{ alertId: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ alertId: string }>>(
        `/wishlist/price-alert/${productId}`,
        { targetPrice }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove price alert
  static async removePriceAlert(productId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/wishlist/price-alert/${productId}`
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get back in stock alerts for wishlist items
  static async getBackInStockAlerts(): Promise<{
    items: WishlistItem[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        items: WishlistItem[];
      }>>('/wishlist/stock-alerts');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Export wishlist
  static async exportWishlist(format: 'json' | 'csv' | 'pdf'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        downloadUrl: string;
        expiresAt: string;
      }>>('/wishlist/export', { format });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Merge guest wishlist with user wishlist (after login)
  static async mergeWishlist(guestWishlistItems: WishlistItem[]): Promise<WishlistResponse> {
    try {
      const response = await apiClient.post<ApiResponse<WishlistResponse>>('/wishlist/merge', {
        items: guestWishlistItems,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}