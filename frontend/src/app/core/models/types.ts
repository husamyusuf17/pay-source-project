export type Role = 'REQUESTER' | 'MANAGER' | 'PROCUREMENT' | 'FINANCE' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface PurchaseItem {
  description: string;
  quantity: number;
  estimatedUnitPrice: number;
}

export interface PurchaseRequest {
  _id: string;
  requester: User | string;
  department: string;
  reason: string;
  items: PurchaseItem[];
  estimatedAmount: number;
  status: string;
  approvals: Array<{ role: Role; decision: string; comment?: string }>;
  createdAt: string;
}

export interface DashboardSummary {
  requests: number;
  pendingApprovals: number;
  suppliers: number;
  openRfqs: number;
  openPos: number;
  unmatchedInvoices: number;
}
