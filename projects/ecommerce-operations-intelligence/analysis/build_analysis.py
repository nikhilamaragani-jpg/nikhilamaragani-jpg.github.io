"""
E-Commerce Operations & Customer Intelligence
Builds real-data analytical outputs from the public Olist dataset.
"""
from __future__ import annotations
import json
import math
from pathlib import Path
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "dashboard" / "data"
DOCS = ROOT / "docs"
OUT.mkdir(parents=True, exist_ok=True)
DOCS.mkdir(parents=True, exist_ok=True)

SOURCE_BASE = "https://raw.githubusercontent.com/spdrio/Brazilian-E-Commerce-Public-Dataset-by-Olist/master/files"
FILES = {
    "orders": ("olist_orders_dataset.csv", ["order_id","customer_id","order_status","order_purchase_timestamp","order_approved_at","order_delivered_carrier_date","order_delivered_customer_date","order_estimated_delivery_date"]),
    "items": ("olist_order_items_dataset.csv", ["order_id","order_item_id","product_id","seller_id","shipping_limit_date","price","freight_value"]),
    "customers": ("olist_customers_dataset.csv", ["customer_id","customer_unique_id","customer_zip_code_prefix","customer_city","customer_state"]),
    "products": ("olist_products_dataset.csv", ["product_id","product_category_name"]),
    "reviews": ("olist_order_reviews_dataset.csv", ["review_id","order_id","review_score"]),
    "payments": ("olist_order_payments_dataset.csv", ["order_id","payment_type","payment_installments","payment_value"]),
    "sellers": ("olist_sellers_dataset.csv", ["seller_id","seller_zip_code_prefix","seller_city","seller_state"]),
    "translation": ("product_category_name_translation.csv", ["product_category_name","product_category_name_english"]),
}
STATE_CENTROIDS = {
    "AC": (-8.77,-70.55),"AL": (-9.57,-36.78),"AP": (0.03,-51.07),"AM": (-3.47,-65.10),
    "BA": (-12.96,-38.51),"CE": (-5.20,-39.53),"DF": (-15.78,-47.93),"ES": (-19.18,-40.31),
    "GO": (-16.64,-49.31),"MA": (-2.53,-44.30),"MT": (-12.64,-55.42),"MS": (-20.51,-54.54),
    "MG": (-18.10,-44.38),"PA": (-3.79,-52.48),"PB": (-7.28,-36.72),"PR": (-24.89,-51.55),
    "PE": (-8.38,-37.86),"PI": (-7.72,-42.73),"RJ": (-22.25,-42.66),"RN": (-5.81,-36.59),
    "RS": (-30.17,-53.50),"RO": (-11.22,-62.80),"RR": (2.74,-62.08),"SC": (-27.45,-50.95),
    "SP": (-22.19,-48.79),"SE": (-10.57,-37.45),"TO": (-10.18,-48.33),
}

def load(name):
    filename, usecols = FILES[name]
    local = RAW / filename
    source = str(local) if local.exists() else f"{SOURCE_BASE}/{filename}"
    enc = "utf-8-sig" if name == "translation" else "utf-8"
    return pd.read_csv(source, usecols=usecols, encoding=enc)

def money(v): return round(float(v), 2)
def pct(v): return round(float(v), 2)
def category_name(v):
    if pd.isna(v) or str(v).strip() == "": return "Unknown"
    return str(v).replace("_"," ").title()

def build():
    orders = load("orders"); items = load("items"); customers = load("customers")
    products = load("products"); reviews = load("reviews"); payments = load("payments")
    sellers = load("sellers"); translation = load("translation")

    for col in ["order_purchase_timestamp","order_approved_at","order_delivered_carrier_date","order_delivered_customer_date","order_estimated_delivery_date"]:
        orders[col] = pd.to_datetime(orders[col], errors="coerce")
    orders["is_canceled"] = orders["order_status"].eq("canceled")
    orders["is_unavailable"] = orders["order_status"].eq("unavailable")
    orders["sales_eligible"] = ~orders["order_status"].isin(["canceled","unavailable"])

    items["price"] = pd.to_numeric(items["price"], errors="coerce")
    items["freight_value"] = pd.to_numeric(items["freight_value"], errors="coerce")
    items["line_revenue"] = items["price"].fillna(0)

    products = products.merge(translation, on="product_category_name", how="left")
    products["category"] = products["product_category_name_english"].fillna(products["product_category_name"]).map(category_name)
    items = items.merge(products[["product_id","category"]], on="product_id", how="left")

    order_values = items.groupby("order_id", as_index=False).agg(
        revenue=("line_revenue","sum"),
        freight_value=("freight_value","sum"),
        item_lines=("order_item_id","count"),
    )
    order_values = orders.merge(order_values, on="order_id", how="left")
    order_values["revenue"] = order_values["revenue"].fillna(0)
    order_values["freight_value"] = order_values["freight_value"].fillna(0)
    order_values["item_lines"] = order_values["item_lines"].fillna(0)

    sales_orders = order_values[order_values["sales_eligible"] & (order_values["revenue"] > 0)].copy()

    customer_dim = customers.drop_duplicates("customer_id").copy()
    customer_orders = (
        sales_orders.merge(customer_dim[["customer_id","customer_unique_id","customer_state"]], on="customer_id", how="left")
        .groupby("customer_unique_id", dropna=True, as_index=False)
        .agg(orders=("order_id","nunique"),revenue=("revenue","sum"),last_purchase=("order_purchase_timestamp","max"),first_purchase=("order_purchase_timestamp","min"))
    )
    as_of = sales_orders["order_purchase_timestamp"].max()
    customer_orders["recency_days"] = (as_of - customer_orders["last_purchase"]).dt.days
    customer_orders["frequency"] = customer_orders["orders"]
    customer_orders["monetary"] = customer_orders["revenue"]
    customer_orders["r_score"] = np.ceil(customer_orders["recency_days"].rank(method="average",pct=True,ascending=False)*5).clip(1,5).astype(int)
    customer_orders["f_score"] = np.ceil(customer_orders["frequency"].rank(method="average",pct=True)*5).clip(1,5).astype(int)
    customer_orders["m_score"] = np.ceil(customer_orders["monetary"].rank(method="average",pct=True)*5).clip(1,5).astype(int)
    customer_orders["rfm_score"] = customer_orders["r_score"] + customer_orders["f_score"] + customer_orders["m_score"]
    customer_orders["segment"] = pd.cut(customer_orders["rfm_score"],bins=[0,4,6,9,11,15],labels=["Lost","At Risk","Potential Loyalists","Loyal Customers","Champions"],include_lowest=True).astype(str)

    review_order = reviews.groupby("order_id",as_index=False).agg(review_score=("review_score","mean"),review_count=("review_id","nunique"))
    order_values = order_values.merge(review_order,on="order_id",how="left")

    delivery = order_values[order_values["order_delivered_customer_date"].notna() & order_values["order_estimated_delivery_date"].notna()].copy()
    delivery["delivery_days"] = (delivery["order_delivered_customer_date"] - delivery["order_purchase_timestamp"]).dt.days
    delivery["delay_days"] = (delivery["order_delivered_customer_date"] - delivery["order_estimated_delivery_date"]).dt.days
    delivery["on_time"] = delivery["delay_days"] <= 0
    delivery["delay_group"] = pd.cut(delivery["delay_days"],bins=[-np.inf,0,3,7,np.inf],labels=["On time","1–3 days late","4–7 days late","8+ days late"]).astype(str)

    total_revenue = sales_orders["revenue"].sum()
    total_orders = sales_orders["order_id"].nunique()
    total_customers = customer_orders["customer_unique_id"].nunique()
    repeat_customers = (customer_orders["orders"] > 1).sum()
    repeat_rate = repeat_customers / total_customers * 100 if total_customers else 0
    aov = total_revenue / total_orders if total_orders else 0
    avg_review = reviews["review_score"].mean()
    on_time_rate = delivery["on_time"].mean() * 100 if len(delivery) else 0
    cancel_rate = order_values["is_canceled"].mean() * 100

    monthly = sales_orders.assign(month=sales_orders["order_purchase_timestamp"].dt.to_period("M").astype(str)).groupby("month",as_index=False).agg(revenue=("revenue","sum"),orders=("order_id","nunique"))
    monthly["revenue"] = monthly["revenue"].round(2)

    cat_items = items.merge(order_values[["order_id","sales_eligible"]],on="order_id",how="left")
    cat_items = cat_items[cat_items["sales_eligible"]].copy()
    categories = cat_items.groupby("category",as_index=False).agg(revenue=("line_revenue","sum"),freight_value=("freight_value","sum"),order_lines=("order_item_id","count"),orders=("order_id","nunique")).sort_values("revenue",ascending=False)
    categories["revenue_share_pct"] = categories["revenue"] / total_revenue * 100

    order_state = sales_orders.merge(customer_dim[["customer_id","customer_unique_id","customer_state"]],on="customer_id",how="left")
    state = order_state.groupby("customer_state",as_index=False).agg(revenue=("revenue","sum"),orders=("order_id","nunique"),customers=("customer_unique_id","nunique")).rename(columns={"customer_state":"state"})
    delivery_state = delivery.merge(customer_dim[["customer_id","customer_state"]],on="customer_id",how="left").groupby("customer_state")["on_time"].mean()*100
    state["on_time_rate_pct"] = state["state"].map(delivery_state).fillna(0)
    review_by_state = order_values.merge(customer_dim[["customer_id","customer_state"]],on="customer_id",how="left").groupby("customer_state",as_index=False)["review_score"].mean().rename(columns={"customer_state":"state","review_score":"avg_review"})
    state = state.merge(review_by_state,on="state",how="left")
    state["lat"] = state["state"].map(lambda x: STATE_CENTROIDS.get(x,(None,None))[0])
    state["lon"] = state["state"].map(lambda x: STATE_CENTROIDS.get(x,(None,None))[1])
    state = state.sort_values("revenue",ascending=False)

    payments["payment_value"] = pd.to_numeric(payments["payment_value"],errors="coerce").fillna(0)
    pay = payments.groupby("payment_type",as_index=False).agg(payment_value=("payment_value","sum"),orders=("order_id","nunique")).sort_values("payment_value",ascending=False)
    pay["share_pct"] = pay["payment_value"] / pay["payment_value"].sum() * 100

    review_delivery = delivery.dropna(subset=["review_score"]).groupby("delay_group",as_index=False).agg(orders=("order_id","nunique"),avg_review=("review_score","mean"))
    review_delivery["avg_review"] = review_delivery["avg_review"].round(2)

    quality = {
        "orders_rows":int(len(orders)),
        "order_items_rows":int(len(items)),
        "customers_rows":int(len(customers)),
        "products_rows":int(len(products)),
        "reviews_rows":int(len(reviews)),
        "payments_rows":int(len(payments)),
        "sellers_rows":int(len(sellers)),
        "duplicate_order_ids":int(orders["order_id"].duplicated().sum()),
        "duplicate_customer_ids":int(customers["customer_id"].duplicated().sum()),
        "missing_customer_id_in_orders":int(orders["customer_id"].isna().sum()),
        "missing_product_category":int(products["category"].eq("Unknown").sum()),
        "missing_review_score":int(reviews["review_score"].isna().sum()),
        "missing_delivered_date":int(orders["order_delivered_customer_date"].isna().sum()),
        "negative_or_zero_price_lines":int((items["price"]<=0).sum()),
        "canceled_orders":int(order_values["is_canceled"].sum()),
    }

    top_cat = categories.iloc[0]; top_state = state.iloc[0]
    ontime_rows = review_delivery[review_delivery["delay_group"]=="On time"]
    late_rows = review_delivery[review_delivery["delay_group"]!="On time"]
    ontime_score = float(ontime_rows["avg_review"].iloc[0]) if len(ontime_rows) else float("nan")
    late_score = float(late_rows["avg_review"].mean()) if len(late_rows) else float("nan")

    insights = [
        f"{category_name(top_cat['category'])} is the largest revenue category at {money(top_cat['revenue']):,.0f}, representing {pct(top_cat['revenue_share_pct']):.1f}% of merchandise revenue.",
        f"{top_state['state']} is the largest customer state by revenue at {money(top_state['revenue']):,.0f}, with {int(top_state['orders']):,} orders.",
        f"Repeat customers account for {pct(repeat_rate):.1f}% of customers in the observed dataset.",
        f"Average order value is {money(aov):,.2f} based on {total_orders:,} sales-eligible orders with item revenue.",
        f"On-time delivery is {pct(on_time_rate):.1f}% among orders with both delivered and estimated delivery dates.",
    ]
    if not math.isnan(ontime_score) and not math.isnan(late_score):
        direction = "lower" if late_score < ontime_score else "higher"
        insights.append(f"Orders classified as late have an average review score {direction} than on-time orders ({late_score:.2f} vs {ontime_score:.2f}); this is an association, not proof of causality.")

    recommendations = [
        f"Protect availability and merchandising for {category_name(top_cat['category'])}, which contributes {top_cat['revenue_share_pct']:.1f}% of revenue.",
        f"Prioritize operational review for {top_state['state']} because it is the highest-revenue customer state; compare demand with its delivery performance before changing capacity.",
        "Use repeat-customer analysis to identify retention opportunities, but avoid treating descriptive segments as causal or predictive without further validation.",
    ]
    if not math.isnan(ontime_score) and not math.isnan(late_score) and late_score < ontime_score:
        recommendations.append("Investigate late-delivery orders as a customer-experience risk because late orders have a lower observed review score; validate with additional operational data before making causal claims.")

    summary = {
        "meta":{
            "project":"E-Commerce Operations & Customer Intelligence",
            "dataset":"Olist Brazilian E-Commerce Public Dataset",
            "dataset_period":f"{orders['order_purchase_timestamp'].min().date()} to {orders['order_purchase_timestamp'].max().date()}",
            "source":"https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce",
            "source_mirror":"https://github.com/spdrio/Brazilian-E-Commerce-Public-Dataset-by-Olist",
            "method":"Real public anonymized transaction data; results generated by this repository's reproducible pipeline.",
            "built_at_utc":pd.Timestamp.utcnow().isoformat(),
        },
        "kpis":{
            "revenue":money(total_revenue),"orders":int(total_orders),"customers":int(total_customers),
            "aov":money(aov),"repeat_customer_rate_pct":pct(repeat_rate),
            "avg_review_score":pct(avg_review),"on_time_delivery_pct":pct(on_time_rate),
            "cancellation_rate_pct":pct(cancel_rate),"freight_value":money(sales_orders["freight_value"].sum())
        },
        "quality":quality,
        "monthly":monthly.to_dict(orient="records"),
        "categories":categories.head(12).round(2).to_dict(orient="records"),
        "states":state.head(20).round(2).to_dict(orient="records"),
        "payments":pay.round(2).to_dict(orient="records"),
        "review_delivery":review_delivery.round(2).to_dict(orient="records"),
        "rfm_segments":customer_orders.groupby("segment",as_index=False).agg(customers=("customer_unique_id","nunique"),revenue=("revenue","sum")).sort_values("revenue",ascending=False).round(2).to_dict(orient="records"),
        "insights":insights,"recommendations":recommendations
    }
    (OUT/"summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2,default=str),encoding="utf-8")
    (DOCS/"data-quality.md").write_text(
        "# Data Quality Report\n\nGenerated from the real Olist source by the repository pipeline.\n\n"
        + "\n".join([f"- **{k.replace('_',' ').title()}:** {v:,}" for k,v in quality.items()])
        + "\n\n## Important modeling note\n\nThe Olist order-items table does not contain a quantity field. Each row is an order line identified by order_item_id; merchandise revenue is therefore calculated as the sum of price across eligible order lines rather than price × quantity.\n",
        encoding="utf-8")
    md=["# Evidence-Based Insights","","Generated by the analytical pipeline.",""]
    md += [f"{i}. {x}" for i,x in enumerate(insights,1)]
    md += ["","## Recommendations",""] + [f"{i}. {x}" for i,x in enumerate(recommendations,1)]
    md += ["","## Analytical caution","","These findings describe the observed Olist dataset. They are not current Brazilian market statistics and do not establish causal relationships."]
    (DOCS/"insights.md").write_text("\n".join(md),encoding="utf-8")

if __name__ == "__main__":
    build()
