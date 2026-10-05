# E-Commerce Operations & Customer Intelligence

**Real-world Data Analyst case study**

Revenue · Customers · Products · Logistics · Customer Experience · Geography

## Business question

How can an e-commerce business use transaction, customer, product, logistics, payment and review data to improve commercial and customer outcomes?

## Why this project exists

This is the flagship analytical project for the portfolio. It is deliberately focused on the core Data Analyst workflow rather than machine learning:

**Business question → data quality → SQL → Python → data model → Power BI → insights → recommendations**

## Source data

**Olist Brazilian E-Commerce Public Dataset**

Official Kaggle data page:

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

The dataset contains about 100K anonymized commercial orders from the Brazilian e-commerce marketplace Olist and multiple related tables covering orders, customers, products, sellers, payments, reviews and geolocation.

Do not commit the original raw dataset unless the repository explicitly documents why doing so is permitted. Follow the dataset's current license/terms and provide download instructions instead.

## Analytical modules

### 01 — Executive Performance
- Total revenue
- Orders
- Customers
- Average order value
- Average review score
- On-time delivery rate
- Cancellation rate

### 02 — Customer Intelligence
- New vs returning customers
- Orders per customer
- Average customer value
- Repeat purchase rate
- RFM segmentation
- Cohort-style repeat behaviour where appropriate

### 03 — Product Analytics
- Revenue by category
- Order volume
- Product contribution
- Freight cost patterns
- Cancellation/return patterns where the data supports them

### 04 — Logistics Analytics
- Order-to-delivery duration
- Estimated vs actual delivery
- On-time rate
- Delay severity
- Delivery performance by geography

### 05 — Customer Experience
- Review score distribution
- Review score by category
- Review score vs delivery performance
- Review score by geography

### 06 — Geographic Analytics
- Orders by state
- Revenue by state
- Customers by state
- Delivery performance by state
- Interactive 2D map
- Optional 3D geographic showcase

## Analytical rules\n\n**Important source-grain note:** the Olist order-items table uses `order_item_id` rows and does not provide a quantity field. Merchandise revenue is therefore calculated as the sum of `price` across eligible order lines, not `price × quantity`.\n

Do not confuse transaction lines with orders.

Use the correct grain for each metric.

Do not infer causality from observational data.

Clearly distinguish:
- Observation
- Interpretation
- Hypothesis
- Recommendation

Do not claim profitability unless a valid cost field is available. The primary commercial KPI is revenue.

## Project structure

```
ecommerce-operations-intelligence/
├── README.md
├── data/
├── sql/
├── python/
├── notebooks/
├── powerbi/
├── dashboard/
├── docs/
├── assets/
├── requirements.txt
├── .gitignore
└── LICENSE
```

## Status

**Stage:** Automated real-data pipeline + interactive dashboard in repository.\n\nThe GitHub Actions workflow downloads the public source CSVs, runs `analysis/build_analysis.py`, validates the outputs, and commits the compact derived analytics used by the dashboard. The raw source data is not committed. Final Power BI work remains a local `.pbix` deliverable.

## Reproducibility target

A reviewer should be able to understand:
1. where the data came from
2. what each table represents
3. what was cleaned
4. how KPIs were defined
5. which SQL answered which business question
6. how Python was used
7. how the Power BI model was structured
8. what the final dashboard says
9. what limitations remain

## Live dashboard\n\n`dashboard/index.html` is the recruiter-facing analytical experience. It includes KPI cards, monthly revenue, category and state analysis, RFM segmentation, delivery/review analysis, recommendations, and a restrained 3D geographic showcase.\n\n## Power BI handoff

See `powerbi/report-spec.md` for the seven-page report design and `powerbi/dax-measures.md` for the core measure definitions. The final PBIX must be built and validated in Power BI Desktop.

### 3D geographic precision

The 3D view uses the analytical state-level dataset and geographic centroids rather than polygon boundaries. This keeps the visualization lightweight and reproducible while avoiding the false impression of administrative boundary precision. The 2D analytical charts remain the primary source for exact comparison; the 3D view is an interactive geographic exploration layer.

## Power BI Analyst development

The project now includes a dedicated Power BI Analyst layer designed to demonstrate practical BI delivery rather than only chart creation:

- Controlled fact/dimension semantic model
- Reusable DAX KPI layer
- Eight-page report specification
- Evidence-backed Power BI insight cards
- Drill-through, tooltip and metric-selector interaction design
- Conditional formatting and accessibility guidance
- KPI reconciliation and data-quality QA checklist

### Evidence-backed Power BI insights

- Top five product categories: about 39.8% of merchandise revenue.
- Top three customer states: about 63.4% of merchandise revenue.
- Repeat-customer rate: 3.04%.
- On-time delivery among qualifying orders: 93.23%.
- Order-level review analysis shows a roughly 2.02-point gap between on-time and late orders in the delivery population; this is an association, not a causal estimate.
- Freight value equals about 16.6% of merchandise revenue; this is not a profit or margin measure.

[Power BI Analyst report](POWERBI_ANALYST_REPORT.md)

## Portfolio deliverables

- Executive Power BI dashboard
- Sales/revenue analysis
- Customer analytics
- Product analytics
- Logistics dashboard
- Customer-experience dashboard
- Data-quality report
- SQL library
- Python notebooks/scripts
- Interactive web dashboard
- 2D geographic exploration
- One restrained 3D geographic visualization

## Limitations

The Olist dataset represents a historical, anonymized marketplace and should not be presented as current market intelligence. Conclusions apply to the observed dataset, not to Brazilian e-commerce as a whole or today's global market.

## Source attribution

Dataset: Olist Brazilian E-Commerce Public Dataset

Kaggle:
https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

Always include the current dataset license/terms in the final published project.
