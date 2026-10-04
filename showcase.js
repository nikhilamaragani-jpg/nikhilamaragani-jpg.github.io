(() => {
  const dataPath = "projects/analytics-foundations/dashboard/summary.json";
  const money = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const percent = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 1 });
  const svgNamespace = "http://www.w3.org/2000/svg";
  const periodFilter = document.querySelector("#lab-period");
  const dimensionFilter = document.querySelector("#lab-dimension");
  const measureFilter = document.querySelector("#lab-measure");
  const chart = document.querySelector("#lab-chart");
  const tableBody = document.querySelector("#lab-table-body");

  function svgElement(name, attributes = {}, text = "") {
    const element = document.createElementNS(svgNamespace, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    return element;
  }

  function appendKpis(summary, orders, customers) {
    const margin = summary.revenue_eur
      ? (summary.gross_profit_eur / summary.revenue_eur) * 100
      : 0;
    const kpis = [
      ["Revenue", money.format(summary.revenue_eur), "After line-level discount"],
      ["Gross profit", money.format(summary.gross_profit_eur), "Revenue less unit cost"],
      ["Gross margin", `${percent.format(margin)}%`, "Profit ÷ revenue"],
      ["Orders", new Intl.NumberFormat("en-IE").format(orders), `${customers} fictional customers`],
    ];
    const container = document.querySelector("#lab-kpis");
    container.replaceChildren(...kpis.map(([label, value, note]) => {
      const article = document.createElement("article");
      const heading = document.createElement("span");
      const metric = document.createElement("strong");
      const detail = document.createElement("small");
      heading.textContent = label;
      metric.textContent = value;
      detail.textContent = note;
      article.append(heading, metric, detail);
      return article;
    }));
  }

  function drawChart(entries, measure, dimension, periodLabel) {
    const sorted = [...entries].sort((a, b) => b[measure] - a[measure]);
    const measureLabel = measure === "revenue_eur" ? "revenue" : "gross profit";
    const dimensionLabel = dimension === "product_category" ? "product category" : "region";
    const maxValue = Math.max(...sorted.map((entry) => entry[measure]), 1);
    const axisMax = maxValue * 1.08;
    const xStart = 145;
    const plotWidth = 438;
    const chartTitle = `Synthetic ${measureLabel} by ${dimensionLabel}`;
    chart.replaceChildren();
    chart.setAttribute("aria-label", `${chartTitle}, ${periodLabel}`);

    const title = svgElement("title", { id: "lab-svg-title" }, chartTitle);
    const description = svgElement(
      "desc",
      { id: "lab-svg-description" },
      `Horizontal bars compare ${sorted.map((entry) => entry[dimension]).join(", ")}. Exact revenue and gross profit values are listed in the table below.`
    );
    chart.setAttribute("aria-labelledby", "lab-svg-title lab-svg-description");
    chart.append(title, description);

    for (let tick = 0; tick <= 4; tick += 1) {
      const x = xStart + (plotWidth * tick) / 4;
      const value = (axisMax * tick) / 4;
      const axisLabel = value >= 1000
        ? `€${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`
        : money.format(value);
      chart.append(
        svgElement("line", { x1: x, y1: 16, x2: x, y2: 238 }),
        svgElement("text", { x, y: 262, "text-anchor": tick === 0 ? "start" : "middle" }, axisLabel)
      );
    }

    sorted.forEach((entry, index) => {
      const y = 31 + index * 52;
      const value = entry[measure];
      const barWidth = Math.max(0, (value / axisMax) * plotWidth);
      chart.append(
        svgElement("text", { class: "chart-label", x: 8, y: y + 19 }, entry[dimension]),
        svgElement(
          "rect",
          {
            class: index === 0 ? "chart-bar chart-bar-primary" : "chart-bar",
            x: xStart,
            y,
            width: barWidth,
            height: 24,
            rx: 2,
          }
        )
      );
      chart.lastChild.append(svgElement("title", {}, `${entry[dimension]}: ${money.format(value)}`));
    });

    const total = sorted.reduce((sum, entry) => sum + entry[measure], 0);
    const leader = sorted[0];
    const share = total ? (leader[measure] / total) * 100 : 0;
    document.querySelector("#lab-chart-title").textContent =
      `${measureLabel[0].toUpperCase()}${measureLabel.slice(1)} by ${dimensionLabel}`;
    document.querySelector("#lab-chart-measure").textContent = measureLabel.toUpperCase();
    document.querySelector("#lab-chart-caption").textContent =
      `${periodLabel} · grouped by ${dimensionLabel}`;
    document.querySelector("#lab-chart-insight").textContent =
      `${leader[dimension]} contributes ${percent.format(share)}% of ${measureLabel} in this ${periodLabel.toLowerCase()} view. These patterns are deliberately built into the synthetic data; they are not evidence about a real retailer.`;

    tableBody.replaceChildren(...sorted.map((entry) => {
      const row = document.createElement("tr");
      const label = document.createElement("th");
      const revenue = document.createElement("td");
      const profit = document.createElement("td");
      label.scope = "row";
      label.textContent = entry[dimension];
      revenue.textContent = money.format(entry.revenue_eur);
      profit.textContent = money.format(entry.gross_profit_eur);
      row.append(label, revenue, profit);
      return row;
    }));
    document.querySelector(".lab-table caption").textContent =
      `${periodLabel} · ${dimensionLabel} · EUR`;
  }

  function render(data) {
    const period = periodFilter.value;
    const dimension = dimensionFilter.value;
    const measure = measureFilter.value;
    const yearSummary = period === "all"
      ? data.overall
      : data.years.find((row) => row.year === Number(period));
    if (!yearSummary) throw new Error(`The synthetic summary does not contain ${period}.`);

    const sourceRows = dimension === "product_category" ? data.categories : data.regions;
    const entries = period === "all"
      ? Object.values(sourceRows.reduce((groups, row) => {
        const label = row[dimension];
        if (!groups[label]) {
          groups[label] = { [dimension]: label, revenue_eur: 0, gross_profit_eur: 0 };
        }
        groups[label].revenue_eur += row.revenue_eur;
        groups[label].gross_profit_eur += row.gross_profit_eur;
        return groups;
      }, {}))
      : sourceRows.filter((row) => row.year === Number(period));
    if (!entries.length) throw new Error(`No ${dimension} rows are available for ${period}.`);

    const periodLabel = period === "all"
      ? "Full period"
      : period === "2025"
        ? `2025 · partial through ${data.metadata.period_end}`
        : "2024";
    const periodDescription = period === "all"
      ? `${data.metadata.period_start} — ${data.metadata.period_end}`
      : period === "2025"
        ? `2025 · partial through ${data.metadata.period_end}`
        : "2024 · full calendar year";
    const customerCount = period === "all" ? data.metadata.customers : yearSummary.customers;
    appendKpis(yearSummary, yearSummary.orders, customerCount);
    document.querySelector("#lab-period-note").textContent =
      `${periodDescription} · EUR · ${yearSummary.orders} orders · ${customerCount} fictional customers`;
    drawChart(entries, measure, dimension, periodLabel);
  }

  async function load() {
    const response = await fetch(dataPath);
    if (!response.ok) throw new Error(`Could not load the project summary (${response.status}).`);
    const data = await response.json();
    if (data.metadata?.data_type !== "synthetic" || data.metadata?.validated !== true) {
      throw new Error("The project summary is missing its synthetic-data validation metadata.");
    }
    [periodFilter, dimensionFilter, measureFilter].forEach((filter) => {
      filter.addEventListener("change", () => render(data));
    });
    render(data);
  }

  load().catch((error) => {
    const message = document.createElement("p");
    message.className = "lab-error";
    message.setAttribute("role", "alert");
    message.textContent = `Interactive figures could not load. The static snapshot remains available below. ${error.message}`;
    document.querySelector(".lab-shell").prepend(message);
  });
})();
