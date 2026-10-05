-- Profile source-table quality before KPI analysis.
SELECT 'orders' AS table_name, COUNT(*) AS row_count FROM olist_orders_dataset
UNION ALL SELECT 'order_items', COUNT(*) FROM olist_order_items_dataset
UNION ALL SELECT 'payments', COUNT(*) FROM olist_order_payments_dataset
UNION ALL SELECT 'reviews', COUNT(*) FROM olist_order_reviews_dataset
UNION ALL SELECT 'products', COUNT(*) FROM olist_products_dataset
UNION ALL SELECT 'customers', COUNT(*) FROM olist_customers_dataset
UNION ALL SELECT 'sellers', COUNT(*) FROM olist_sellers_dataset;

-- Key uniqueness checks.
SELECT COUNT(*) AS duplicate_order_ids
FROM (
  SELECT order_id FROM olist_orders_dataset GROUP BY order_id HAVING COUNT(*) > 1
) t;

SELECT COUNT(*) AS duplicate_customer_ids
FROM (
  SELECT customer_id FROM olist_customers_dataset GROUP BY customer_id HAVING COUNT(*) > 1
) t;

-- Missing timestamps / invalid price values.
SELECT COUNT(*) AS orders_with_missing_purchase_ts
FROM olist_orders_dataset
WHERE order_purchase_timestamp IS NULL;

SELECT COUNT(*) AS non_positive_item_prices
FROM olist_order_items_dataset
WHERE price <= 0 OR price IS NULL;

-- Important: order_items has order_item_id rows and does not contain a quantity field.
