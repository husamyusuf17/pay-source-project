import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PurchaseRequestsComponent } from './pages/purchase-requests/purchase-requests.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { SourcingComponent } from './pages/sourcing/sourcing.component';
import { PurchaseOrdersComponent } from './pages/purchase-orders/purchase-orders.component';
import { ReceivingComponent } from './pages/receiving/receiving.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'purchase-requests', component: PurchaseRequestsComponent, canActivate: [authGuard] },
  { path: 'suppliers', component: SuppliersComponent, canActivate: [authGuard] },
  { path: 'sourcing', component: SourcingComponent, canActivate: [authGuard] },
  { path: 'purchase-orders', component: PurchaseOrdersComponent, canActivate: [authGuard] },
  { path: 'receiving', component: ReceivingComponent, canActivate: [authGuard] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
