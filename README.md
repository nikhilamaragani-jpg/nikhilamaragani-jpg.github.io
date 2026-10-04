# Amaragani Nikhil Sai — Data Analyst Portfolio

An early-career portfolio focused on data analysis and business intelligence, supported by a Computer Science Engineering education and academic AI/ML project work.

## Portfolio contents

- `index.html` — responsive portfolio website with an accessible SVG chart of the synthetic retail sample
- `styles.css` — editorial visual system, responsive layout, and reduced-motion-aware chart treatment
- `showcase.js` — dependency-free homepage explorer for the synthetic retail summary
- `assets/images/` — profile image carried forward from the original portfolio
- `assets/powerbi-dashboards.pdf` — original two-page dashboard PDF supplied by the author
- `assets/certificates/be10x-ai-tools-claude-workshop.pdf` — original BE10X AI Tools & Claude Workshop certificate
- `projects/analytics-foundations/` — two reproducible foundational analytics case studies and dashboards
- `projects/analytics-foundations/powerbi/dashboard-spec.md` — Power BI model and report build specification
- `images/` — portrait and supporting image assets retained from the previous site
- `docs/powerbi-dashboards.md` — project descriptions and metric context
- `docs/data-analyst-project.md` — project overview and data limitations
- `docs/resume-draft.md` — resume content draft; personal details still need completion
- `docs/linkedin-profile-summary.md` — LinkedIn headline and About draft
- `docs/job-search-plan.md` — Europe-focused application checklist

## Current profile

The portfolio targets entry-level Data Analyst and BI Analyst opportunities, particularly in Germany and Switzerland. It lists IBM's *Introduction to Data Analytics*, Course 1, completed October 3, 2026; this is not the full IBM Professional Certificate. Office Master Power BI and Python workshop certificates are identified as workshops. The site also includes BE10X's *AI Tools & Claude Workshop* certificate of completion; its stated outcomes are presented as certificate claims, not independently validated skills or job experience.

## Projects

The top portfolio projects are self-directed SQL/Python exercises on generated, fictional retail data. All synthetic data and deliberate assumptions are labeled; the projects are not IBM assignments or a course capstone. The Power BI dashboards are presented as learning/workshop projects, not professional client engagements. Their original PDF is included; because the PDF does not provide editable `.pbix` files or source data, its existing report calculations cannot yet be changed or fully validated. Review recommendations are documented in [`docs/powerbi-dashboards.md`](docs/powerbi-dashboards.md).

## Preview locally

From this directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. The homepage explorer and analytics dashboards use the included `projects/analytics-foundations/dashboard/summary.json`; see [`projects/analytics-foundations/README.md`](projects/analytics-foundations/README.md) for how to regenerate the synthetic data and dashboard summary. The homepage includes a static snapshot and data table if JavaScript is unavailable.

## Publish

The site is static and served from the repository root by GitHub Pages. The root `index.html` is the single portfolio landing page; the two local dashboard pages are project deliverables.

## Author

Amaragani Nikhil Sai · B.Tech Computer Science Engineering

GitHub: [nikhilamaragani-jpg](https://github.com/nikhilamaragani-jpg) · LinkedIn: [nikhil-sai-amaragani](https://www.linkedin.com/in/nikhil-sai-amaragani-219115382)
