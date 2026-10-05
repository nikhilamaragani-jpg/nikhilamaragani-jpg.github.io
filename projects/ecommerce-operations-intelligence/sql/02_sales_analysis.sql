-- Revenue, order performance and trend questions.

WITH order_revenue AS (
  SELECT
    order_id,
    SUM(price * quantity) AS revenue
  FROM olist_order_items_dataset
  GROUP BY order_id
)
SELECT
  COUNT(*) AS orders,
  SUM(revenue) AS total_revenue,
  AVG(revenue) AS average_order_value
FROM order_revenue;

SELECT
  DATE_TRUNC('month', o.order_purchase_timestamp) AS month,
  SUM(oi.price * oi.quantity) AS revenue,
  COUNT(DISTINCT o.order_id) AS orders
FROM olist_orders_dataset o
JOIN olist_order_items_dataset oi ON o.order_id = oi.order_id
WHERE o.order_status <> 'canceled'
GROUP BY 1
ORDER BY 1;
