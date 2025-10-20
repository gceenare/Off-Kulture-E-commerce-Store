import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './api';

import { User, Product, Order } from '../App';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: (Product & { salesCount: number })[];
  revenueChart: { date: string; revenue: number; orders: number }[];
  categorySales: { category: string; revenue: number; percentage: number }[];
}

export interface CustomerFilters {
  registrationDateFrom?: string;
  registrationDateTo?: string;
  totalSpentMin?: number;
  totalSpentMax?: number;
  orderCountMin?: number;
  orderCountMax?: number;
  status?: 'active' | 'inactive' | 'vip';
}

export interface CustomerSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: CustomerFilters;
  sortBy?: 'name' | 'email' | 'registrationDate' | 'totalSpent' | 'orderCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedCustomersResponse {
  customers: (User & {
    totalSpent: number;
    orderCount: number;
    lastOrderDate?: string;
    averageOrderValue: number;
  })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: 'low' | 'out' | 'critical';
  lastRestocked?: string;
  daysSinceLastRestock?: number;
}

export interface SystemSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  shippingRates: {
    standard: number;
    express: number;
    freeShippingThreshold: number;
  };
  paymentMethods: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  emailSettings: {
    welcomeEmail: boolean;
    orderConfirmation: boolean;
    shippingNotification: boolean;
    marketingEmails: boolean;
  };
}

export class AdminService {
  // Dashboard
  static async getDashboardStats(
    dateFrom?: string,
    dateTo?: string
  ): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard', {
        params: { dateFrom, dateTo },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Customer Management
  static async getCustomers(params?: CustomerSearchParams): Promise<PaginatedCustomersResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedCustomersResponse>>(
        '/admin/customers',
        { params }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getCustomerById(customerId: string): Promise<User & {
    totalSpent: number;
    orderCount: number;
    orders: Order[];
    averageOrderValue: number;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<User & {
        totalSpent: number;
        orderCount: number;
        orders: Order[];
        averageOrderValue: number;
      }>>(`/admin/customers/${customerId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async updateCustomer(
    customerId: string,
    customerData: Partial<User>
  ): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        `/admin/customers/${customerId}`,
        customerData
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async banCustomer(customerId: string, reason?: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/admin/customers/${customerId}/ban`,
        { reason }
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async unbanCustomer(customerId: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/admin/customers/${customerId}/unban`
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Inventory Management
  static async getInventoryAlerts(): Promise<InventoryAlert[]> {
    try {
      const response = await apiClient.get<ApiResponse<InventoryAlert[]>>(
        '/admin/inventory/alerts'
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async bulkUpdateStock(updates: {
    productId: string;
    quantity: number;
  }[]): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        '/admin/inventory/bulk-update',
        { updates }
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async setStockThreshold(
    productId: string,
    threshold: number
  ): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        `/admin/inventory/${productId}/threshold`,
        { threshold }
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Analytics and Reports
  static async getSalesReport(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    data: {
      date: string;
      revenue: number;
      orders: number;
      customers: number;
    }[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        data: {
          date: string;
          revenue: number;
          orders: number;
          customers: number;
        }[];
      }>>('/admin/reports/sales', {
        params: { dateFrom, dateTo, groupBy },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getProductReport(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    topSelling: (Product & {
      salesCount: number;
      revenue: number;
    })[];
    leastSelling: (Product & {
      salesCount: number;
      revenue: number;
    })[];
    categoryPerformance: {
      category: string;
      revenue: number;
      unitsSold: number;
      percentage: number;
    }[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        topSelling: (Product & {
          salesCount: number;
          revenue: number;
        })[];
        leastSelling: (Product & {
          salesCount: number;
          revenue: number;
        })[];
        categoryPerformance: {
          category: string;
          revenue: number;
          unitsSold: number;
          percentage: number;
        }[];
      }>>('/admin/reports/products', {
        params: { dateFrom, dateTo },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async getCustomerReport(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
    customerRetentionRate: number;
    averageLifetimeValue: number;
    topCustomers: (User & {
      totalSpent: number;
      orderCount: number;
    })[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        newCustomers: number;
        returningCustomers: number;
        totalCustomers: number;
        customerRetentionRate: number;
        averageLifetimeValue: number;
        topCustomers: (User & {
          totalSpent: number;
          orderCount: number;
        })[];
      }>>('/admin/reports/customers', {
        params: { dateFrom, dateTo },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // System Settings
  static async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await apiClient.get<ApiResponse<SystemSettings>>('/admin/settings');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const response = await apiClient.put<ApiResponse<SystemSettings>>('/admin/settings', settings);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Content Management
  static async uploadImage(file: File, folder: string = 'products'): Promise<{
    url: string;
    publicId: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await apiClient.post<ApiResponse<{
        url: string;
        publicId: string;
      }>>('/admin/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/admin/upload/image/${publicId}`
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Notifications
  static async sendNotification(
    userIds: string[],
    title: string,
    message: string,
    type: 'info' | 'promotion' | 'order' | 'system' = 'info'
  ): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/admin/notifications', {
        userIds,
        title,
        message,
        type,
      });
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async sendBulkEmail(
    subject: string,
    content: string,
    recipientFilter: 'all' | 'customers' | 'vip' | 'inactive',
    recipientIds?: string[]
  ): Promise<{ sentCount: number; failedCount: number }> {
    try {
      const response = await apiClient.post<ApiResponse<{ sentCount: number; failedCount: number }>>(
        '/admin/email/bulk',
        {
          subject,
          content,
          recipientFilter,
          recipientIds,
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}