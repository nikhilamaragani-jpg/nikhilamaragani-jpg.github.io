# E-Commerce Operations & Customer Intelligence - Power BI Analyst Case Study

## Executive summary

This project analyzes the public Olist Brazilian E-Commerce Public Dataset as a real-data Data Analyst case study. The upgraded Power BI layer focuses on what a BI/Power BI Analyst would need to deliver: a controlled semantic model, reusable DAX measures, purposeful dashboard interactions, evidence-backed insight cards, data-quality checks, and clear limitations.

The observed dataset contains historical anonymized marketplace transactions from 2016-09-04 to 2018-10-17.

## Verified project snapshot

| KPI | Observed result |
| --- | ---: |
| Merchandise revenue | R$13,494,400.74 |
| Sales-eligible orders | 98,199 |
| Unique customers | 94,983 |
| Average order value | R$137.42 |
| Repeat-customer rate | 3.04% |
| Average review score | 4.07 / 5 |
| On-time delivery | 93.23% |
| Cancellation rate | 0.63% |
| Freight value | R$2,241,126.29 |

## Power BI Analyst insight layer

### 1. Revenue concentration

Observation: The top five product categories contribute about 39.8% of merchandise revenue.

Why it matters: A Power BI analyst can make category concentration visible with a ranked bar chart and a revenue-share measure, then provide drill-through to category detail.

Caution: Revenue concentration is not profitability. The dataset does not provide complete business-cost data for a reliable profit claim.

### 2. Geographic concentration

Observation: The top three customer states contribute about 63.4% of merchandise revenue. Sao Paulo (SP) alone contributes about 38.3% of revenue, with 95.5% observed on-time delivery.

Why it matters: A geographic performance page can combine revenue, order volume, on-time delivery and review score, with state-level drill-through.

Caution: State performance differences are descriptive; they do not identify the operational cause.

### 3. Retention opportunity

Observation: Only 3.04% of observed customers placed more than one sales-eligible order.

The descriptive RFM distribution is:

| Segment | Customers | Customer share | Revenue share |
| --- | ---: | ---: | ---: |
| Potential Loyalists | 44,492 | 46.8% | 32.0% |
| Loyal Customers | 26,387 | 27.8% | 35.4% |
| Champions | 12,712 | 13.4% | 29.6% |
| At Risk | 11,392 | 12.0% | 3.0% |

Why it matters: Power BI can show the repeat-customer KPI beside segment size and segment revenue, helping a business user distinguish retention scale from revenue contribution.

Caution: RFM segments are descriptive. They are not a predictive churn model.

### 4. Delivery and customer experience

Observation: Among orders with both delivered and estimated delivery dates, 93.2% were on time. The observed average review score is materially lower for late orders than for on-time orders.

Using order-level review averages in the delivery population, the review gap is about 2.02 points: roughly 4.28/5 for on-time orders versus 2.26/5 for late orders.

About 6.8% of qualifying delivered orders are late, and approximately 43.8% of late orders are 8+ days late.

Why it matters: A Power BI analyst can make delay severity and customer experience visible together, using a severity matrix, tooltip detail, and state/category filtering.

Caution: This is an association in observational data, not proof that delivery delay caused lower review scores.

### 5. Freight intensity

Observation: Observed freight value is R$2.24M, equal to about 16.6% of merchandise revenue.

Why it matters: A freight-to-revenue KPI can reveal where logistics burden is relatively high and support category/state comparisons.

Caution: Freight value is not equivalent to total fulfillment cost, gross margin, or profit.

### 6. Payment mix

Observation: Credit-card payment records account for about 78.3% of observed payment value.

Why it matters: A payment-mix visual provides a useful commercial context layer and can be filtered by time, state or category where the model supports those relationships.

Caution: Payment records are one-to-many at the order level, so payment values must not be summed after an uncontrolled join to order-item rows.

## Power BI report design

### Page 1 - Executive Overview
- KPI cards: Revenue, Orders, Customers, AOV, Repeat Rate, Avg Review, On-Time Rate
- Monthly revenue trend
- Top categories
- Top states
- Evidence-based insight panel
- Slicers: date, state, category

### Page 2 - Sales & Revenue
- Revenue trend
- Revenue share by category
- Revenue by state
- AOV
- Freight value
- Freight-to-revenue ratio
- Payment mix

### Page 3 - Customer Intelligence
- Repeat-customer rate
- Orders per customer
- RFM segment distribution
- Segment revenue
- Customer share by segment
- Descriptive retention observations

### Page 4 - Product Performance
- Category revenue
- Order-line volume
- Freight value by category
- Revenue share
- Review score by category
- Top products where product-level grain is appropriate

### Page 5 - Logistics & Delivery
- On-time delivery rate
- Late delivery rate
- Delay severity
- Delivery performance by state
- Review score by delivery group
- Drill-through to state operational detail

### Page 6 - Customer Experience
- Review score distribution
- Review score by delivery group
- Review score by category
- Review score by geography
- Clear association / causality wording

### Page 7 - Geographic Performance
- State revenue
- State orders
- State customers
- State on-time rate
- State review score
- Map plus sortable analytical matrix
- Conditional formatting for performance exceptions

### Page 8 - Data Quality & Methodology
- Source row counts
- Duplicate checks
- Missing-field checks
- Exclusions
- Grain definitions
- KPI definitions
- Limitations
- Data freshness / historical-period note

## Report interactions that demonstrate Power BI analyst capability

- Synchronized date, state and category slicers where useful
- Metric selector / field parameter for Revenue, Orders, On-Time Rate and Review Score
- Tooltip pages for state and category context
- Drill-through pages for state and category investigation
- Conditional formatting for operational exceptions
- Bookmarks for Executive, Commercial and Operations views
- Accessible titles, labels, tab order and non-color-only status cues
- Minimal slicers; every control should answer a specific business question

## Data-model controls

The source contains multiple one-to-many tables. The model should keep separate facts for orders, order items, payments and reviews.

Shared dimensions should include date, customer, product, seller and geography.

Do not flatten all facts into one table and then sum values without grain control.

## Critical source-grain rule

The Olist order-items table has order_item_id but no quantity column. Merchandise revenue is therefore the sum of price across eligible order lines. It is not price x quantity.

## Power BI QA checklist

Before publishing a PBIX:
1. Reconcile Revenue to the Python/SQL baseline.
2. Reconcile Orders and Customers under the same exclusion rules.
3. Test filter behavior for date, state and category.
4. Confirm payment values are not duplicated by item joins.
5. Confirm review metrics use the intended order/review grain.
6. Confirm blanks and missing dates are handled explicitly.
7. Check totals, subtotals and drill-through results.
8. Confirm accessibility and readable mobile/layout behavior.
9. Add an explicit historical dataset note.
10. Recheck every executive insight against the underlying measure.

## Project status

Completed: real-data pipeline, SQL modules, Python analytics, recruiter-facing interactive dashboard, Power BI model design, DAX measure definitions, Power BI insight layer and evidence documentation.

Still required for a true PBIX deliverable: building and validating the final PBIX in Power BI Desktop. The portfolio does not claim a completed PBIX until that file has been actually built and checked.

## Links

- Live dashboard: https://nikhilamaragani-jpg.github.io/projects/ecommerce-operations-intelligence/dashboard/
- Portfolio: https://nikhilamaragani-jpg.github.io/
- Repository: https://github.com/nikhilamaragani-jpg/ecommerece-operations-customer-intelligence
- Source dataset: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce