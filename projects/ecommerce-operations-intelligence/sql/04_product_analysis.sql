SELECT
  COALESCE(p.product_category_name, 'Unknown') AS category,
  SUM(oi.price * oi.quantity) AS revenue,
  SUM(oi.quantity) AS units,
  SUM(oi.freight_value) AS freight_value
FROM olist_order_items_dataset oi
LEFT JOIN olist_products_dataset p ON oi.product_id = p.product_id
GROUP BY 1
ORDER BY revenue DESC;
