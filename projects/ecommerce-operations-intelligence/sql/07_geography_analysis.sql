SELECT
  customer_state,
  COUNT(DISTINCT customer_unique_id) AS customers
FROM olist_customers_dataset
GROUP BY customer_state
ORDER BY customers DESC;

SELECT
  c.customer_state,
  SUM(oi.price * oi.quantity) AS revenue,
  COUNT(DISTINCT o.order_id) AS orders
FROM olist_customers_dataset c
JOIN olist_orders_dataset o ON c.customer_id = o.customer_id
JOIN olist_order_items_dataset oi ON o.order_id = oi.order_id
WHERE o.order_status <> 'canceled'
GROUP BY c.customer_state
ORDER BY revenue DESC;
