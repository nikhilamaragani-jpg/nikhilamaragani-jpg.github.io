SELECT
  order_id,
  DATE_DIFF('day',
    CAST(order_purchase_timestamp AS DATE),
    CAST(order_delivered_customer_date AS DATE)
  ) AS delivery_days,
  DATE_DIFF('day',
    CAST(order_estimated_delivery_date AS DATE),
    CAST(order_delivered_customer_date AS DATE)
  ) AS delivery_delay_days,
  CASE
    WHEN order_delivered_customer_date IS NULL THEN NULL
    WHEN order_delivered_customer_date <= order_estimated_delivery_date THEN 1
    ELSE 0
  END AS on_time_flag
FROM olist_orders_dataset
WHERE order_delivered_customer_date IS NOT NULL;
