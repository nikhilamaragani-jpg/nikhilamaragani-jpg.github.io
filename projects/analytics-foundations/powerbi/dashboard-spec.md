# Power BI Build Specification

This is a build plan for recreating the self-directed retail analysis in Power BI Desktop. The supplied project currently includes the source CSV and starter DAX measures, not an editable `.pbix` report.

## Data and model

- Import `data/retail_orders.csv` as `retail_orders`; set date columns to Date, IDs and labels to Text, `units` to Whole Number, and price/cost/discount fields to Decimal Number.
- The table is at one row per synthetic order. `order_id` is unique in the generated file.
- Create a marked calendar table spanning the `order_date` range and relate it one-to-many to `retail_orders[order_date]`. Use the calendar for year and month filtering.
- Format currency measures as EUR. Keep discount as a decimal fraction (for example, `0.10` is 10%).
- Use the formulas in `measures.dax`. Aggregate raw line-level revenue and costs before formatting or rounding displayed totals.

## Report pages

### Retail performance

- KPI cards: Total Revenue EUR, Gross Profit EUR, Gross Margin %, Average Order Value EUR.
- Monthly column chart: revenue by calendar month, with months in chronological order and zero-activity months retained within the observed period.
- Category and region comparisons: revenue by product category and region, sorted descending.
- Slicers: reporting year, region, channel, and product category. Keep the reporting year selection visible.
- Add a subtitle or note that the dataset is synthetic and values demonstrate calculations rather than describe a real retailer.

### Customer retention

- Matrix rows: acquisition cohort month; columns: elapsed month since acquisition; values: cohort retention.
- Include cohort size and retained-customer count in tooltips or a companion table.
- Distinguish an unobserved month from 0% activity. Compare only cohorts with the same observation window.
- Use the definitions in the project README: retention for month N is the share of the original cohort with at least one order in that specific elapsed calendar month, not cumulative retention.

## Validation and interpretation

- Confirm `order_id` uniqueness, positive units, valid discount rates, non-missing required fields, and that no order predates customer acquisition.
- Reconcile revenue, gross profit, distinct orders, and distinct customers against the Python summary and SQLite queries before publishing a PBIX.
- The deterministic generator intentionally designs repeat-order and seasonal patterns. Do not present the resulting measures as discovered commercial findings or causal evidence.
