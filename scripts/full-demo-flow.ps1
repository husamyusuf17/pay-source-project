$ErrorActionPreference = "Stop"
$base = "http://localhost:5000/api"

function Login($email) {
    $body = @{ email=$email; password="Password123!" } | ConvertTo-Json
    return Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType "application/json" -Body $body
}
function H($token) { return @{ Authorization = "Bearer $token" } }

Write-Host "1) Login demo users"
$requester = Login "requester@demo.com"
$manager = Login "manager@demo.com"
$procurement = Login "procurement@demo.com"
$finance = Login "finance@demo.com"

Write-Host "2) Create Purchase Request"
$prBody = @{
    department="IT"
    reason="New employee laptops"
    items=@(@{description="Laptop"; quantity=10; estimatedUnitPrice=500})
} | ConvertTo-Json -Depth 5
$pr = (Invoke-RestMethod -Uri "$base/purchase-requests" -Method Post -Headers (H $requester.token) -ContentType "application/json" -Body $prBody).data
Write-Host "PR:" $pr._id $pr.status $pr.estimatedAmount

Write-Host "3) Manager approves"
$pr = (Invoke-RestMethod -Uri "$base/purchase-requests/$($pr._id)/approve" -Method Patch -Headers (H $manager.token) -ContentType "application/json" -Body '{"comment":"Budget justified"}').data
Write-Host "PR status:" $pr.status

Write-Host "4) Get suppliers and create RFQ"
$suppliers = (Invoke-RestMethod -Uri "$base/suppliers" -Method Get -Headers (H $procurement.token)).data
$s1=$suppliers[0]; $s2=$suppliers[1]
$deadline=(Get-Date).AddDays(7).ToString("yyyy-MM-dd")
$rfqBody=@{purchaseRequestId=$pr._id;supplierIds=@($s1._id,$s2._id);deadline=$deadline;notes="Please quote delivery and warranty"}|ConvertTo-Json -Depth 5
$rfq=(Invoke-RestMethod -Uri "$base/sourcing/rfqs" -Method Post -Headers (H $procurement.token) -ContentType "application/json" -Body $rfqBody).data
Write-Host "RFQ:" $rfq._id

Write-Host "5) Submit two offers"
$o1Body=@{supplierId=$s1._id;totalAmount=4900;deliveryDays=5;warrantyMonths=12;paymentTerms="Net 30"}|ConvertTo-Json
$o2Body=@{supplierId=$s2._id;totalAmount=4850;deliveryDays=7;warrantyMonths=24;paymentTerms="Net 30"}|ConvertTo-Json
$o1=(Invoke-RestMethod -Uri "$base/sourcing/rfqs/$($rfq._id)/offers" -Method Post -Headers (H $procurement.token) -ContentType "application/json" -Body $o1Body).data
$o2=(Invoke-RestMethod -Uri "$base/sourcing/rfqs/$($rfq._id)/offers" -Method Post -Headers (H $procurement.token) -ContentType "application/json" -Body $o2Body).data
Write-Host "Offers:" $o1._id $o2._id

Write-Host "6) Award second offer"
Invoke-RestMethod -Uri "$base/sourcing/rfqs/$($rfq._id)/award/$($o2._id)" -Method Patch -Headers (H $procurement.token) | Out-Null

Write-Host "7) Create PO"
$po=(Invoke-RestMethod -Uri "$base/purchase-orders/from-rfq/$($rfq._id)" -Method Post -Headers (H $procurement.token)).data
Write-Host "PO:" $po.poNumber $po._id $po.totalAmount

Write-Host "8) Receive all goods (GRN)"
$grnBody=@{purchaseOrderId=$po._id;receivedItems=@(@{description="Laptop";quantityReceived=10});note="All goods received"}|ConvertTo-Json -Depth 5
$grn=(Invoke-RestMethod -Uri "$base/grns" -Method Post -Headers (H $procurement.token) -ContentType "application/json" -Body $grnBody).data
Write-Host "GRN:" $grn.grnNumber

Write-Host "9) Create supplier invoice"
$invoiceNumber="INV-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
$invBody=@{purchaseOrderId=$po._id;invoiceNumber=$invoiceNumber;amount=$po.totalAmount}|ConvertTo-Json
$invoice=(Invoke-RestMethod -Uri "$base/invoices" -Method Post -Headers (H $finance.token) -ContentType "application/json" -Body $invBody).data
Write-Host "Invoice:" $invoice.invoiceNumber $invoice.status

Write-Host "10) Run 3-way match"
$invoice=(Invoke-RestMethod -Uri "$base/invoices/$($invoice._id)/match" -Method Post -Headers (H $finance.token)).data
Write-Host "Match:" $invoice.status $invoice.matchResult.details

Write-Host "11) Pay invoice"
$payment=(Invoke-RestMethod -Uri "$base/payments/$($invoice._id)" -Method Post -Headers (H $finance.token)).data
Write-Host "Payment:" $payment._id $payment.status

Write-Host "12) BFF returns whole lifecycle"
$details=(Invoke-RestMethod -Uri "$base/bff/purchase-requests/$($pr._id)/details" -Method Get -Headers (H $manager.token)).data
$details | ConvertTo-Json -Depth 10
