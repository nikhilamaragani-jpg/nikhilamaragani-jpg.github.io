# Power BI Report Specification

## Model

Recommended analytical model:

### Fact tables
- FactOrder — one row per order
- FactOrderItem — one row per order line
- FactPayment — one row per payment record
- FactReview — one row per review record

### Dimensions
- DimDate
- DimCustomer
- DimProduct
- DimSeller
- DimGeography

Do not flatten all fact tables into one table.

## Page 1 — Executive Overview

KPIs:
- Revenue
- Orders
- Customers
- Average Order Value
- Repeat Customer Rate
- Average Review Score
- On-Time Delivery Rate

Visuals:
- Monthly revenue trend
- Revenue by category
- Revenue by state
- Key insight panel

## Page 2 — Sales & Revenue

- Monthly/weekly trend
- Revenue by category
- Revenue by state
- Average order value
- Freight value
- Order status overview

## Page 3 — Customer Intelligence

- New vs returning customers
- Orders per customer
- Revenue by customer segment
- RFM segment distribution
- Cohort-style repeat activity

## Page 4 — Product Performance

- Category revenue
- Category order lines
- Freight burden
- Top products
- Review score by category

## Page 5 — Logistics & Delivery

- On-time delivery
- Delivery days
- Delay days
- Delay severity
- Delivery performance by state

## Page 6 — Customer Experience

- Review score distribution
- Review score by delivery group
- Review score by category
- Review score by geography

Use wording such as "associated with" rather than claiming that delivery delay causes review outcomes.

## Page 7 — Data Quality & Methodology

Show:
- Source table row counts
- Duplicate checks
- Missing-field checks
- Exclusions
- Metric definitions
- Grain definitions
- Limitations

## UX standards

- Keep slicers minimal and purposeful.
- Use meaningful chart titles phrased as questions where possible.
- Use consistent KPI formatting.
- Include accessible labels and sufficient contrast.
- Provide drill-through only where it adds analytical value.
- Avoid decorative visuals that do not answer business questions.
