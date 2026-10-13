import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardSummary } from '../models/types';

@Injectable({ providedIn: 'root' })
export class BffService {
  constructor(private http: HttpClient) {}
  dashboard() { return this.http.get<{ data: DashboardSummary }>('/api/bff/dashboard'); }
  purchaseRequestDetails(id: string) { return this.http.get<{ data: any }>(`/api/bff/purchase-requests/${id}/details`); }
}
