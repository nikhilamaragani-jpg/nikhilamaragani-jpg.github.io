-- Every final business answer should follow:
-- question -> SQL -> result -> interpretation -> limitation

-- Example:
-- Which states combine high revenue with strong on-time delivery?
WITH state_metrics AS (
  SELECT
    c.customer_state,
    SUM(oi.price * oi.quantity) AS revenue,
    AVG(
      CASE
        WHEN o.order_delivered_customer_date IS NULL THEN NULL
        WHEN o.order_delivered_customer_date <= o.order_estimated_delivery_date THEN 1
        ELSE 0
      END
    ) * 100 AS on_time_rate
  FROM olist_customers_dataset c
  JOIN olist_orders_dataset o ON c.customer_id = o.customer_id
  JOIN olist_order_items_dataset oi ON o.order_id = oi.order_id
  WHERE o.order_status <> 'canceled'
  GROUP BY c.customer_state
)
SELECT *
FROM state_metrics
ORDER BY revenue DESC;
