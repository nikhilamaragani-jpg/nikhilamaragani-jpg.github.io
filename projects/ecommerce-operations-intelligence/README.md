# E-Commerce Operations & Customer Intelligence

**Integrated Data Analyst + Power BI Analyst real-data case study**

Revenue · Customers · Products · Logistics · Customer Experience · Geography

## Business question

How can an e-commerce business use transaction, customer, product, logistics, payment and review data to understand commercial performance and customer experience?

## Project workflow

**Business question → data quality → SQL → Python/Pandas → KPI definitions → analytical model → Power BI design → interactive dashboard → insight → recommendation → QA**

## Source data

**Olist Brazilian E-Commerce Public Dataset**

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

The source contains historical anonymized marketplace data across orders, customers, products, sellers, payments, reviews and related tables.

## Verified baseline

| KPI | Observed result |
|---|---:|
| Merchandise revenue | R$13,494,400.74 |
| Sales-eligible orders | 98,199 |
| Unique customers | 94,983 |
| Average order value | R$137.42 |
| Repeat-customer rate | 3.04% |
| Average review score | 4.07 / 5 |
| On-time delivery | 93.23% |

## Analytical modules

### 01 — Executive Performance
- Revenue
- Orders
- Customers
- AOV
- Average review score
- On-time delivery
- Cancellation rate

### 02 — Customer Intelligence
- Orders per customer
- Repeat purchase rate
- Descriptive RFM segmentation
- Customer share
- Segment revenue

### 03 — Product Analytics
- Revenue by category
- Revenue share
- Order-line volume
- Freight value
- Category performance

### 04 — Logistics Analytics
- Delivered vs estimated timing
- On-time rate
- Late rate
- Delay severity
- State-level service performance

### 05 — Customer Experience
- Review score by delivery group
- Review score by state
- Review score context for operational analysis
- Explicit association-based interpretation

### 06 — Geographic Performance
- Revenue by state
- Orders by state
- Customers by state
- On-time delivery by state
- Review score by state
- Click-to-filter state detail

## Interactive dashboard

The public dashboard is the recruiter-facing BI workspace.

Dashboard controls:
- From / To month
- Category
- State
- Metric: Revenue, Orders, Freight value

Dashboard interactions:
- Click category bars to apply category context
- Click state bars to apply state context
- Context-sensitive KPI cards
- Sales exploration
- RFM customer intelligence
- Logistics and customer experience
- Geography
- Data Quality & Method
- State drill-through-style detail

Live dashboard:
https://nikhilamaragani-jpg.github.io/projects/ecommerce-operations-intelligence/dashboard/

## Data and metric governance

The Olist order-items source contains `order_item_id` but no quantity field.

**Merchandise revenue = sum(price) across eligible order lines.**

Orders are handled as distinct order IDs so multi-category orders are not double-counted in the public dashboard.

Payments, reviews, orders and order items remain separate analytical grains.

## Power BI Analyst development

The project includes an eight-page native Power BI report blueprint covering:

- Executive Overview
- Sales & Revenue
- Customer Intelligence
- Product Performance
- Logistics & Delivery
- Customer Experience
- Geographic Performance
- Data Quality & Methodology

Supporting files:
- powerbi/report-spec.md
- powerbi/dax-measures.md
- docs/powerbi-analyst-insights.md
- docs/job-platform-project-report.md

## Evidence-backed insights

- Top five product categories: about 39.8% of merchandise revenue.
- Top three customer states: about 63.4% of merchandise revenue.
- Repeat-customer rate: 3.04%.
- On-time delivery among qualifying orders: 93.23%.
- Late orders have lower observed review scores than on-time orders; this is an association, not a causal estimate.
- Freight value is about 16.6% of merchandise revenue and is treated as a logistics measure.

## Reproducibility

The standalone repository contains the reproducible Python build, SQL modules, derived dashboard outputs, Power BI specification and QA documentation.

## Project status

The interactive portfolio dashboard is published. The native Power BI build specification, DAX layer and QA framework are prepared for Power BI Desktop validation.

## Limitations

This is historical anonymized marketplace data. The findings describe the observed dataset and are not current market benchmarks. Revenue is not treated as profit, RFM is descriptive, and observational relationships are not treated as causal.

## Portfolio deliverables

- Interactive BI dashboard
- SQL analysis library
- Python/Pandas analytical pipeline
- Data-quality documentation
- Power BI model and DAX specification
- Power BI Analyst insight documentation
- Project report

## Source attribution

Dataset: Olist Brazilian E-Commerce Public Dataset

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce