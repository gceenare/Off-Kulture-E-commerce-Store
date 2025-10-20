import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '../App';
import { Order, CartItem } from '../AppWithApi';

export interface CreateOrderData {
  items: CartItem[];
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
}

export interface PaymentData {
  paymentMethodId?: string;
  paymentType: 'Credit Card' | 'Debit Card' | 'EFT' | 'SnapScan';
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  savePaymentMethod?: boolean;
}

export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
}

export interface OrderSearchParams {
  page?: number;
  limit?: number;
  filters?: OrderFilters;
  sortBy?: 'date' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderTrackingResponse {
  order: Order;
  trackingHistory: {
    date: string;
    status: string;
    location: string;
    description: string;
  }[];
  estimatedDelivery?: string;
}

export class OrderService {
  // Create new order
  static async createOrder(orderData: CreateOrderData, paymentData?: PaymentData): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>('/orders', {
        ...orderData,
        payment: paymentData,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get user's orders
  static async getUserOrders(params?: OrderSearchParams): Promise<PaginatedOrdersResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedOrdersResponse>>('/orders', {
        params,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get single order by ID
  static async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Track order
  static async trackOrder(trackingNumber: string): Promise<OrderTrackingResponse> {
    try {
      const response = await apiClient.get<ApiResponse<OrderTrackingResponse>>(
        `/orders/track/${trackingNumber}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`, {
        reason,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Request return
  static async requestReturn(
    orderId: string,
    itemIds: string[],
    reason: string,
    notes?: string
  ): Promise<{ returnId: string; instructions: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ returnId: string; instructions: string }>>(
        `/orders/${orderId}/return`,
        {
          itemIds,
          reason,
          notes,
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get order status
  static async getOrderStatus(orderId: string): Promise<{
    status: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        status: string;
        estimatedDelivery?: string;
        trackingNumber?: string;
      }>>(`/orders/${orderId}/status`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update shipping address
  static async updateShippingAddress(
    orderId: string,
    newAddress: string
  ): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(
        `/orders/${orderId}/shipping-address`,
        { address: newAddress }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Reorder items from previous order
  static async reorderItems(orderId: string): Promise<{ addedToCart: number; failed: string[] }> {
    try {
      const response = await apiClient.post<ApiResponse<{ addedToCart: number; failed: string[] }>>(
        `/orders/${orderId}/reorder`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get order invoice
  static async getOrderInvoice(orderId: string): Promise<{
    invoiceUrl: string;
    invoiceNumber: string;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        invoiceUrl: string;
        invoiceNumber: string;
      }>>(`/orders/${orderId}/invoice`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Get all orders
  static async getAllOrders(params?: OrderSearchParams): Promise<PaginatedOrdersResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedOrdersResponse>>('/admin/orders', {
        params,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Update order status
  static async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    notes?: string
  ): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
        status,
        trackingNumber,
        notes,
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Add tracking information
  static async addTrackingInfo(
    orderId: string,
    trackingNumber: string,
    carrier: string
  ): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(
        `/admin/orders/${orderId}/tracking`,
        {
          trackingNumber,
          carrier,
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Process return
  static async processReturn(
    returnId: string,
    action: 'approve' | 'reject',
    notes?: string
  ): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/admin/returns/${returnId}`, {
        action,
        notes,
      });
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin: Get order statistics
  static async getOrderStatistics(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<string, number>;
    revenueByDay: { date: string; revenue: number }[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        ordersByStatus: Record<string, number>;
        revenueByDay: { date: string; revenue: number }[];
      }>>('/admin/orders/statistics', {
        params: { dateFrom, dateTo },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}