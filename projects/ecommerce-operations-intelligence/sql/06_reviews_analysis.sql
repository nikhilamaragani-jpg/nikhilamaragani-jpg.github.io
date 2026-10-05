SELECT review_score, COUNT(*) AS review_count
FROM olist_order_reviews_dataset
GROUP BY review_score
ORDER BY review_score;

SELECT
  CASE
    WHEN o.order_delivered_customer_date IS NULL THEN 'Not delivered'
    WHEN o.order_delivered_customer_date <= o.order_estimated_delivery_date THEN 'On time'
    WHEN DATE_DIFF('day', CAST(o.order_estimated_delivery_date AS DATE), CAST(o.order_delivered_customer_date AS DATE)) <= 3 THEN '1-3 days late'
    WHEN DATE_DIFF('day', CAST(o.order_estimated_delivery_date AS DATE), CAST(o.order_delivered_customer_date AS DATE)) <= 7 THEN '4-7 days late'
    ELSE '8+ days late'
  END AS delivery_group,
  AVG(r.review_score) AS average_review_score,
  COUNT(*) AS reviews
FROM olist_orders_dataset o
JOIN olist_order_reviews_dataset r ON o.order_id = r.order_id
GROUP BY 1
ORDER BY 1;
