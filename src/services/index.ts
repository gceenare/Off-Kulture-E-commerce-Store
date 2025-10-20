// Export all API services

export { apiClient, handleApiResponse, handleApiError, ApiResponse, ApiError } from './api';
export { ProductService } from './productService';
export { AuthService } from './authService';
export { CartService } from './cartService';
export { OrderService } from './orderService';
export { WishlistService } from './wishlistService';
export { AdminService } from './adminService';

// Export types
export type {
  ProductFilters,
  ProductSearchParams,
  PaginatedProductsResponse,
} from './productService';

export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetData,
  PasswordChangeData,
} from './authService';

export type {
  AddToCartData,
  UpdateCartItemData,
  CartResponse,
} from './cartService';

export type {
  CreateOrderData,
  PaymentData,
  OrderFilters,
  OrderSearchParams,
  PaginatedOrdersResponse,
  OrderTrackingResponse,
} from './orderService';

export type {
  WishlistResponse,
} from './wishlistService';

export type {
  DashboardStats,
  CustomerFilters,
  CustomerSearchParams,
  PaginatedCustomersResponse,
  InventoryAlert,
  SystemSettings,
} from './adminService';