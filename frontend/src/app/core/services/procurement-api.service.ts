import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseRequest } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ProcurementApiService {
  constructor(private http: HttpClient) {}

  listPurchaseRequests() { return this.http.get<{ data: PurchaseRequest[] }>('/api/purchase-requests'); }
  createPurchaseRequest(body: unknown) { return this.http.post<{ data: PurchaseRequest }>('/api/purchase-requests', body); }
  approvePurchaseRequest(id: string, comment = '') { return this.http.patch(`/api/purchase-requests/${id}/approve`, { comment }); }
  rejectPurchaseRequest(id: string, comment = '') { return this.http.patch(`/api/purchase-requests/${id}/reject`, { comment }); }

  listSuppliers() { return this.http.get<{ data: any[] }>('/api/suppliers'); }
  createSupplier(body: unknown) { return this.http.post('/api/suppliers', body); }

  listRFQs() { return this.http.get<{ data: any[] }>('/api/sourcing/rfqs'); }
  createRFQ(body: unknown) { return this.http.post('/api/sourcing/rfqs', body); }
  listOffers(rfqId: string) { return this.http.get<{ data: any[] }>(`/api/sourcing/rfqs/${rfqId}/offers`); }
  submitOffer(rfqId: string, body: unknown) { return this.http.post(`/api/sourcing/rfqs/${rfqId}/offers`, body); }
  awardOffer(rfqId: string, offerId: string) { return this.http.patch(`/api/sourcing/rfqs/${rfqId}/award/${offerId}`, {}); }

  listPurchaseOrders() { return this.http.get<{ data: any[] }>('/api/purchase-orders'); }
  createPOFromRFQ(rfqId: string) { return this.http.post(`/api/purchase-orders/from-rfq/${rfqId}`, {}); }

  listGRNs() { return this.http.get<{ data: any[] }>('/api/grns'); }
  createGRN(body: unknown) { return this.http.post('/api/grns', body); }

  listInvoices() { return this.http.get<{ data: any[] }>('/api/invoices'); }
  createInvoice(body: unknown) { return this.http.post('/api/invoices', body); }
  matchInvoice(id: string) { return this.http.post(`/api/invoices/${id}/match`, {}); }
  payInvoice(id: string) { return this.http.post(`/api/payments/${id}`, {}); }
}
