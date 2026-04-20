import apiClient from "./apiClient";

/* ══════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════ */

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CARD" | "CASH";

export interface TripPaymentRecord {
  id: string;
  rideId: string;
  passengerId: string;
  driverId: string | null;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  ride?: {
    id: string;
    pickupAddress: string;
    dropoffAddress: string;
    distanceKm: number | null;
    durationMin: number | null;
    priceEstimate: number | null;
    priceFinal: number | null;
    scheduledAt: string | null;
    vehicleClass?: { name: string };
  };
}

export interface CommissionTierRecord {
  id: string;
  name: string;
  requiredRides: number;
  bonusAmount: number;
  sortOrder: number;
  isActive: boolean;
}

export interface DriverEarningRecord {
  driverProfileId: string;
  driverId: string;
  driverName: string;
  driverEmail?: string | null;
  completedTrips: number;
  fixedSalary: number;
  totalBonuses: number;
  netEarnings: number;
}

export interface RevenueStats {
  totalEarnings: number;
  paidRevenue: number;
  pendingPayments: number;
  refundedAmount: number;
  totalTrips: number;
}

export interface DailyRevenue {
  day: string;
  earnings: number;
}

export interface MonthlyRevenue {
  month: string;
  earnings: number;
}

export interface ClassRevenue {
  className: string;
  revenue: number;
}

export interface CompanyProfit {
  month: string;
  totalRevenue: number;
  totalDriverCosts: number;
  profit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

/* ══════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════ */

export function formatId(prefix: string, uuid: string): string {
  return `${prefix}-${uuid.slice(0, 8).toUpperCase()}`;
}

/* ══════════════════════════════════════════════════
   API Calls
══════════════════════════════════════════════════ */

export const billingApi = {
  /* ── Trip Payments ── */
  getPayments(params?: {
    status?: PaymentStatus;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient
      .get<PaginatedResponse<TripPaymentRecord>>("/billing/payments", { params })
      .then((r) => r.data);
  },

  getPaymentById(id: string) {
    return apiClient
      .get<TripPaymentRecord>(`/billing/payments/${id}`)
      .then((r) => r.data);
  },

  /* ── Stripe ── */
  createStripeIntent(tripPaymentId: string) {
    return apiClient
      .post<{ clientSecret: string; paymentIntentId: string }>(
        `/billing/payments/${tripPaymentId}/stripe-intent`
      )
      .then((r) => r.data);
  },

  /* ── Cash ── */
  confirmCashPayment(tripPaymentId: string) {
    return apiClient
      .patch<TripPaymentRecord>(`/billing/payments/${tripPaymentId}/confirm-cash`)
      .then((r) => r.data);
  },

  /* ── Revenue Stats ── */
  getRevenueStats() {
    return apiClient.get<RevenueStats>("/billing/revenue/stats").then((r) => r.data);
  },

  getDailyRevenue(days?: number) {
    return apiClient
      .get<DailyRevenue[]>("/billing/revenue/daily", { params: { days } })
      .then((r) => r.data);
  },

  getMonthlyRevenue(months?: number) {
    return apiClient
      .get<MonthlyRevenue[]>("/billing/revenue/monthly", { params: { months } })
      .then((r) => r.data);
  },

  getRevenueByClass() {
    return apiClient.get<ClassRevenue[]>("/billing/revenue/by-class").then((r) => r.data);
  },

  /* ── Commission Tiers ── */
  getTiers() {
    return apiClient
      .get<CommissionTierRecord[]>("/billing/commission-tiers")
      .then((r) => r.data);
  },

  createTier(data: { name: string; requiredRides: number; bonusAmount: number; sortOrder?: number }) {
    return apiClient
      .post<CommissionTierRecord>("/billing/commission-tiers", data)
      .then((r) => r.data);
  },

  updateTier(id: string, data: Partial<{ name: string; requiredRides: number; bonusAmount: number; sortOrder: number; isActive: boolean }>) {
    return apiClient
      .patch<CommissionTierRecord>(`/billing/commission-tiers/${id}`, data)
      .then((r) => r.data);
  },

  deleteTier(id: string) {
    return apiClient
      .delete(`/billing/commission-tiers/${id}`)
      .then((r) => r.data);
  },

  /* ── Driver Earnings ── */
  getDriverEarnings(params?: { month?: string; driverId?: string; page?: number; limit?: number }) {
    return apiClient
      .get<PaginatedResponse<DriverEarningRecord>>("/billing/driver-earnings", { params })
      .then((r) => r.data);
  },

  /* ── Company Profit ── */
  getCompanyProfit(month?: string) {
    return apiClient
      .get<CompanyProfit>("/billing/company-profit", { params: { month } })
      .then((r) => r.data);
  },
};
