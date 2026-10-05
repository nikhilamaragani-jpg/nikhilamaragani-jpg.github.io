# Data Quality Report

Generated from the real Olist source by the repository pipeline.

- **Orders Rows:** 99,441
- **Order Items Rows:** 112,650
- **Customers Rows:** 99,441
- **Products Rows:** 32,951
- **Reviews Rows:** 100,000
- **Payments Rows:** 103,886
- **Sellers Rows:** 3,095
- **Duplicate Order Ids:** 0
- **Duplicate Customer Ids:** 0
- **Missing Customer Id In Orders:** 0
- **Missing Product Category:** 610
- **Missing Review Score:** 0
- **Missing Delivered Date:** 2,965
- **Negative Or Zero Price Lines:** 0
- **Canceled Orders:** 625

## Important modeling note

The Olist order-items table does not contain a quantity field. Each row is an order line identified by order_item_id; merchandise revenue is therefore calculated as the sum of price across eligible order lines rather than price × quantity.
