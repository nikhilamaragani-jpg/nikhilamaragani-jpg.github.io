-- Customer-level metrics must use customer_unique_id.

WITH customer_orders AS (
  SELECT
    c.customer_unique_id,
    COUNT(DISTINCT o.order_id) AS order_count,
    SUM(oi.price * oi.quantity) AS revenue
  FROM olist_customers_dataset c
  JOIN olist_orders_dataset o ON c.customer_id = o.customer_id
  JOIN olist_order_items_dataset oi ON o.order_id = oi.order_id
  WHERE o.order_status <> 'canceled'
  GROUP BY c.customer_unique_id
)
SELECT
  COUNT(*) AS customers,
  AVG(order_count) AS average_orders_per_customer,
  AVG(revenue) AS average_customer_revenue
FROM customer_orders;

WITH customer_orders AS (
  SELECT
    c.customer_unique_id,
    COUNT(DISTINCT o.order_id) AS order_count
  FROM olist_customers_dataset c
  JOIN olist_orders_dataset o ON c.customer_id = o.customer_id
  WHERE o.order_status <> 'canceled'
  GROUP BY c.customer_unique_id
)
SELECT
  100.0 * AVG(CASE WHEN order_count > 1 THEN 1.0 ELSE 0.0 END) AS repeat_customer_rate
FROM customer_orders;
