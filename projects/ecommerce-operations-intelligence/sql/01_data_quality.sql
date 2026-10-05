-- Profile source-table quality before KPI analysis.
SELECT 'orders' AS table_name, COUNT(*) AS row_count FROM olist_orders_dataset
UNION ALL SELECT 'order_items', COUNT(*) FROM olist_order_items_dataset
UNION ALL SELECT 'payments', COUNT(*) FROM olist_order_payments_dataset
UNION ALL SELECT 'reviews', COUNT(*) FROM olist_order_reviews_dataset
UNION ALL SELECT 'products', COUNT(*) FROM olist_products_dataset
UNION ALL SELECT 'customers', COUNT(*) FROM olist_customers_dataset
UNION ALL SELECT 'sellers', COUNT(*) FROM olist_sellers_dataset;

-- Check missing/invalid core fields.
SELECT COUNT(*) AS orders_without_customer_id
FROM olist_orders_dataset o
JOIN olist_customers_dataset c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;

SELECT COUNT(*) AS orders_with_missing_purchase_ts
FROM olist_orders_dataset
WHERE order_purchase_timestamp IS NULL;

SELECT COUNT(*) AS non_positive_item_quantities
FROM olist_order_items_dataset
WHERE quantity <= 0;

SELECT COUNT(*) AS non_positive_item_prices
FROM olist_order_items_dataset
WHERE price <= 0;
