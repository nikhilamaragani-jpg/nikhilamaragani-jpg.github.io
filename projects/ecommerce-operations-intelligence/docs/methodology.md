# Methodology

## 1. Business questions first
Organize analysis around revenue, customers, products, logistics, reviews and geography.

## 2. Preserve grain
- orders: one row per order
- order_items: one row per order line
- payments: one row per payment record
- reviews: one row per review record
- customers: customer-to-order rows in the source

## 3. Validate joins
Check row counts before and after joins. Watch for one-to-many multiplication.

## 4. Metric definitions
Revenue = sum(price × quantity) for selected sale lines.
Order = distinct order_id.
Customer = customer_unique_id for customer-level metrics.
AOV = revenue / distinct orders.
On-time = delivered date <= estimated delivery date.
Review score = average valid review_score.

## 5. Causality
This is observational analysis. Report associations as associations; do not claim causality.

## 6. Reproducibility
Every dashboard KPI should be traceable to SQL, Python, or a documented Power BI measure.
