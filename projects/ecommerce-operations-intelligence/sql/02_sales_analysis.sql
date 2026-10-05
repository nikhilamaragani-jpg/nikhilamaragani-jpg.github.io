-- Revenue and order-performance questions.
-- Revenue uses item price; order_items does not contain a quantity field.

WITH order_revenue AS (
  SELECT
    order_id,
    SUM(price) AS revenue,
    SUM(freight_value) AS freight_value
  FROM olist_order_items_dataset
  GROUP BY order_id
)
SELECT
  COUNT(*) AS orders,
  SUM(revenue) AS total_revenue,
  AVG(revenue) AS average_order_value,
  SUM(freight_value) AS total_freight
FROM order_revenue;

SELECT
  DATE_TRUNC('month', o.order_purchase_timestamp) AS month,
  SUM(oi.price) AS revenue,
  COUNT(DISTINCT o.order_id) AS orders
FROM olist_orders_dataset o
JOIN olist_order_items_dataset oi
  ON o.order_id = oi.order_id
WHERE o.order_status NOT IN ('canceled', 'unavailable')
GROUP BY 1
ORDER BY 1;
