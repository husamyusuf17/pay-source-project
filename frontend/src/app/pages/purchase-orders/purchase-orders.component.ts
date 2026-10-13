import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProcurementApiService } from '../../core/services/procurement-api.service';
import { AuthService } from '../../core/services/auth.service';
@Component({selector:'app-purchase-orders',standalone:true,imports:[ReactiveFormsModule],template:`
<h1>Purchase Orders</h1>
@if(auth.hasRole('PROCUREMENT','ADMIN')){<section class="card"><form [formGroup]="form" (ngSubmit)="create()"><label>Awarded RFQ ID<input formControlName="rfqId"></label><button>Create PO from awarded RFQ</button></form></section>}
<section class="card"><button (click)="load()">Refresh</button><table><thead><tr><th>PO</th><th>ID</th><th>Supplier</th><th>Amount</th><th>Status</th></tr></thead><tbody>@for(po of pos();track po._id){<tr><td>{{po.poNumber}}</td><td><code>{{po._id}}</code></td><td>{{po.supplier?.name}}</td><td>{{po.totalAmount}}</td><td>{{po.status}}</td></tr>}</tbody></table></section>`})
export class PurchaseOrdersComponent implements OnInit{pos=signal<any[]>([]);form;constructor(private fb:FormBuilder,private api:ProcurementApiService,public auth:AuthService){this.form=this.fb.nonNullable.group({rfqId:['',Validators.required]});}ngOnInit(){this.load();}load(){this.api.listPurchaseOrders().subscribe(r=>this.pos.set(r.data));}create(){this.api.createPOFromRFQ(this.form.getRawValue().rfqId).subscribe(()=>this.load());}}
