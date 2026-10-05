# Power BI DAX Measures

Use these measures after importing the cleaned analytical model.

> Table/column names are a recommended model naming convention. Adapt names only where the final PBIX uses different physical names.

## Core commercial measures

```DAX
Revenue :=
CALCULATE(
    SUM(FactOrderItems[price]),
    FactOrder[order_status] <> "canceled",
    FactOrder[order_status] <> "unavailable"
)
```

```DAX
Orders :=
CALCULATE(
    DISTINCTCOUNT(FactOrder[order_id]),
    FactOrder[order_status] <> "canceled",
    FactOrder[order_status] <> "unavailable"
)
```

```DAX
Customers :=
CALCULATE(
    DISTINCTCOUNT(DimCustomer[customer_unique_id]),
    FactOrder[order_status] <> "canceled",
    FactOrder[order_status] <> "unavailable"
)
```

```DAX
Average Order Value :=
DIVIDE([Revenue], [Orders])
```

## Customer measures

```DAX
Repeat Customers :=
COUNTROWS(
    FILTER(
        VALUES(DimCustomer[customer_unique_id]),
        CALCULATE(
            DISTINCTCOUNT(FactOrder[order_id]),
            FactOrder[order_status] <> "canceled",
            FactOrder[order_status] <> "unavailable"
        ) > 1
    )
)
```

```DAX
Repeat Customer Rate :=
DIVIDE([Repeat Customers], [Customers])
```

## Customer experience

```DAX
Average Review Score :=
AVERAGE(FactReview[review_score])
```

```DAX
On-Time Delivery Rate :=
VAR DeliveredOrders =
    FILTER(
        VALUES(FactOrder[order_id]),
        NOT ISBLANK(FactOrder[order_delivered_customer_date])
            && NOT ISBLANK(FactOrder[order_estimated_delivery_date])
    )
RETURN
    DIVIDE(
        COUNTROWS(
            FILTER(
                DeliveredOrders,
                CALCULATE(MAX(FactOrder[order_delivered_customer_date]))
                    <= CALCULATE(MAX(FactOrder[order_estimated_delivery_date]))
            )
        ),
        COUNTROWS(DeliveredOrders)
    )
```

```DAX
Cancellation Rate :=
DIVIDE(
    CALCULATE(
        DISTINCTCOUNT(FactOrder[order_id]),
        FactOrder[order_status] = "canceled"
    ),
    DISTINCTCOUNT(FactOrder[order_id])
)
```

## Freight

```DAX
Freight Value :=
CALCULATE(
    SUM(FactOrderItems[freight_value]),
    FactOrder[order_status] <> "canceled",
    FactOrder[order_status] <> "unavailable"
)
```

## Modeling rule

Do not flatten order items, payments and reviews into one table and then sum values without controlling grain. A single order can have multiple item rows, payment rows and review records. Keep separate fact tables or pre-aggregate to the required grain before combining measures.
