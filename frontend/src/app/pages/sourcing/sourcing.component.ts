import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProcurementApiService } from '../../core/services/procurement-api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-sourcing', standalone: true, imports: [ReactiveFormsModule], template: `
<h1>Sourcing / RFQ</h1>
<p class="muted">Use IDs shown in Requests and Suppliers. This page intentionally exposes the IDs so you learn how the APIs relate.</p>
@if (auth.hasRole('PROCUREMENT','ADMIN')) {
<section class="card"><h2>Create RFQ</h2><form [formGroup]="rfqForm" (ngSubmit)="createRFQ()" class="form-grid">
<label>Approved Purchase Request ID<input formControlName="purchaseRequestId"></label>
<label>Supplier IDs (comma separated)<input formControlName="supplierIds"></label>
<label>Deadline<input type="date" formControlName="deadline"></label><label>Notes<input formControlName="notes"></label>
<button [disabled]="rfqForm.invalid">Create RFQ</button></form></section>
<section class="card"><h2>Submit offer</h2><form [formGroup]="offerForm" (ngSubmit)="submitOffer()" class="form-grid two">
<label>RFQ ID<input formControlName="rfqId"></label><label>Supplier ID<input formControlName="supplierId"></label>
<label>Total amount<input type="number" formControlName="totalAmount"></label><label>Delivery days<input type="number" formControlName="deliveryDays"></label>
<label>Warranty months<input type="number" formControlName="warrantyMonths"></label><label>Payment terms<input formControlName="paymentTerms"></label>
<button>Submit offer</button></form></section>
}
<section class="card"><button (click)="load()">Refresh RFQs</button><table><thead><tr><th>ID</th><th>Status</th><th>Request</th><th>Awarded offer</th></tr></thead><tbody>
@for(r of rfqs(); track r._id){<tr><td><code>{{r._id}}</code></td><td>{{r.status}}</td><td><code>{{r.purchaseRequest?._id || r.purchaseRequest}}</code></td><td><code>{{r.awardedOffer?._id || r.awardedOffer || '-'}}</code></td></tr>}</tbody></table></section>
<section class="card"><h2>Award offer</h2><form [formGroup]="awardForm" (ngSubmit)="award()" class="form-grid two"><label>RFQ ID<input formControlName="rfqId"></label><label>Offer ID<input formControlName="offerId"></label><button>Award</button></form></section>
` })
export class SourcingComponent implements OnInit {
  rfqs = signal<any[]>([]);
  rfqForm; offerForm; awardForm;
  constructor(private fb: FormBuilder, private api: ProcurementApiService, public auth: AuthService){
    this.rfqForm=this.fb.nonNullable.group({purchaseRequestId:['',Validators.required], supplierIds:['',Validators.required], deadline:['',Validators.required], notes:['']});
    this.offerForm=this.fb.nonNullable.group({rfqId:['',Validators.required],supplierId:['',Validators.required],totalAmount:[4850,Validators.required],deliveryDays:[6,Validators.required],warrantyMonths:[12],paymentTerms:['Net 30']});
    this.awardForm=this.fb.nonNullable.group({rfqId:['',Validators.required],offerId:['',Validators.required]});
  }
  ngOnInit(){this.load();} load(){this.api.listRFQs().subscribe(r=>this.rfqs.set(r.data));}
  createRFQ(){const v=this.rfqForm.getRawValue();this.api.createRFQ({...v,supplierIds:v.supplierIds.split(',').map(x=>x.trim()).filter(Boolean)}).subscribe(()=>this.load());}
  submitOffer(){const v=this.offerForm.getRawValue();this.api.submitOffer(v.rfqId,{supplierId:v.supplierId,totalAmount:v.totalAmount,deliveryDays:v.deliveryDays,warrantyMonths:v.warrantyMonths,paymentTerms:v.paymentTerms}).subscribe(()=>alert('Offer submitted'));}
  award(){const v=this.awardForm.getRawValue();this.api.awardOffer(v.rfqId,v.offerId).subscribe(()=>this.load());}
}
