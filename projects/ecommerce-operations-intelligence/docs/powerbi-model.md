# Power BI Model

## Recommended star-oriented model

### Fact tables
- FactOrders
- FactOrderItems
- FactPayments
- FactReviews

### Dimensions
- DimCustomer
- DimProduct
- DimSeller
- DimDate
- DimGeography

## Important modeling rule

Do not join multiple one-to-many fact tables into one flattened table and then sum measures without controlling grain. That can multiply revenue, payment, or review records.

## Core measures
- Revenue
- Orders
- Customers
- Average Order Value
- Units Sold
- Freight Value
- Average Review Score
- On-Time Delivery Rate
- Repeat Customer Rate

## Report pages
1. Executive Overview
2. Sales & Revenue
3. Customer Intelligence
4. Product Performance
5. Logistics & Delivery
6. Customer Experience
7. Data Quality & Methodology

The final PBIX should be generated locally in Power BI Desktop and published only after validation.
