# SEO + AI visibility + growth plan

Goal: inbound leads from founders in the US, Canada, UK, Singapore, UAE and Europe, at $6k+ per project.

The site now has the technical basics (see "Done in code"). Most of what decides ranking, and nearly all of what
decides whether ChatGPT, Gemini, Claude or Perplexity name you, happens off the site: other websites mentioning and
reviewing you. This plan is mostly that work.

---

## Done in code (Nov 2026)

- Keyword-led titles and descriptions on every page ("branding & logo design agency", "rebranding services", "logo design portfolio", "brand identity case study").
- Organization + ProfessionalService schema on the homepage: founders, services, countries served, all social profiles (incl. Contra).
- Service list schema on /services, FAQPage schema on /contact, CreativeWork + Breadcrumb schema on all 31 case studies.
- Absolute Open Graph tags on every page, so links preview properly on LinkedIn, X, WhatsApp and Slack.
- `/llms.txt`, an AI-readable summary of the studio and every case study, rebuilt from projects.json on each build.
- Vercel Web Analytics + Speed Insights, GA4 (needs `VITE_GA_ID`), and a `generate_lead` event when the inquiry form sends.

## Week 1: switch on measurement (1–2 hours)

1. **GA4**: create a property at analytics.google.com and copy the Measurement ID (`G-XXXXXXX`). In Vercel → Project → Settings → Environment Variables, add `VITE_GA_ID` = that ID (Production), then redeploy. In GA4 → Admin → Events, mark `generate_lead` as a key event.
2. **Vercel**: Project → Analytics → Enable, and Speed Insights → Enable. (Custom events like `generate_lead` show up in Vercel only on the Pro plan. GA4 records them either way.)
3. **Google Search Console**: add `inksandinterfaces.design` (Domain property, verify via DNS), submit `https://inksandinterfaces.design/sitemap.xml`, and request indexing for the home, services, work and contact pages.
4. **Bing Webmaster Tools**: import from Search Console in one click. ChatGPT search and Copilot pull from Bing's index, so this one matters for AI answers more than people expect.
5. **Share image**: export a 1200×630 PNG (wordmark on coral or black plus one hero mockup) to `/public/brand/og.png` and swap the `og:image` tags. LinkedIn renders WebP inconsistently.
6. **UK/EU consent**: GA runs cookieless for EEA/UK visitors until there's a consent banner. Fine to start with; add a banner once traffic there is worth measuring exactly.

## Weeks 1–4: get listed where AI assistants look

When someone asks an AI assistant "best branding agency for startups" or "logo designer for a SaaS company", it answers from
directory listings, review sites, "top agencies" articles and Reddit/LinkedIn threads. You have to be on those pages.

Do these in order. Use the same studio description everywhere (copy the first paragraph of `/llms.txt`):

| Platform | Why | Action |
|---|---|---|
| **Clutch.co** | Most cited source for "best agency" questions, by both AI assistants and Google | Free profile, then ask 5–8 past international clients (Azonix, PIQ, Go Miles, The Saucy Heat, Plush Paws, Pure Sip, Satori Bites…) for a Clutch review. Clutch phones them; it takes them 15 min. |
| **DesignRush** | Ranks for "top branding agencies [country]" lists | Free listing; their "top agencies" lists are partly merit-based once you have reviews |
| **Sortlist, GoodFirms, The Manifest** | Shown in AI answers for EU/UK and US queries | Free profiles |
| **Google Business Profile** | Knowledge panel and branded searches | Create for the India address, service area "worldwide" |
| **Behance, Dribbble, Contra** | Designers and founders search these directly; they rank well on Google | Post every case study with a link back to `/work/<slug>`, title "<Brand> brand identity" |
| **LinkedIn company page** | Signals the studio is real | Complete it, link the site, post every case study |
| **Crunchbase** | Founders and AI tools use it to check that a company exists | Free company profile |

Reviews are the biggest single lever. A studio with 10 Clutch reviews from US/UK founders will be named by AI
assistants; one with a great site and zero reviews usually won't.

## Months 1–3: content that ranks and gets cited

Write pages that answer what a foreign founder searches *before* they hire. AI assistants quote pages that give a direct
answer in the first two sentences.

Priority pages (one every 1–2 weeks, 1,200–2,000 words, real examples from your own projects):

1. **"How much does branding cost in 2027?"** with real USD ranges per package. This is the most-searched pre-hire question, and AI assistants cite pricing pages all the time. It needs the founders' actual prices (the site's FAQ still has a TODO for them).
2. **"Logo design vs brand identity: what founders actually need"**
3. **"How long does a rebrand take?"** using your 4–6 week process and the four-act roadmap
4. **"Branding agency vs freelancer vs in-house"**, where your two-founder model is the answer
5. **Industry pages** where you have 3+ case studies: "Branding for food & beverage brands", "Branding for SaaS and tech startups", "Branding for luxury and D2C". Link each to its case studies.
6. **"How we rebranded [client]"** long-form versions of the best 5 case studies, with founder quotes and numbers where real ones exist.

Rules:
- Never make "branding agency in [city]" copies of one page for each city. Google treats them as doorway pages and AI tools ignore them. Mention real clients by city inside the content instead (you have work in LA, SF, Austin, Portland, Brooklyn, London, Dublin, Paris, Lisbon, Singapore, Dubai, Melbourne, Tokyo).
- Every article ends with a link to `/contact` and 2–3 related case studies.
- This needs a `/journal` (blog) section. It's a small build on the existing generator pattern; ask when the first two articles are written.

## Ongoing: outbound and demand (this is what brings the high-paying clients)

SEO takes 3–6 months to compound. Run these in parallel:

- **Founder-led LinkedIn (Shivani)**, 3 posts/week: before/after rebrands, a teardown of a well-known startup's brand, the reasoning behind one design decision. For global B2B founders this is the highest-converting channel for studios of your size.
- **Targeted outreach**, 20/week: founders who just raised a seed or Series A (Crunchbase, YC batch pages, TechCrunch funding posts) in the US/UK/SG/UAE. A raise is the moment they rebrand. Send a short Loom with 3 specific observations about their current brand, plus a link to one relevant case study.
- **Partnerships**: dev shops, Webflow/Framer agencies and fractional CMOs abroad who need a branding partner. Offer 10% referral.
- **Launch the studio on Product Hunt / Indie Hackers** with a free tool (e.g. a brand-audit checklist PDF). It earns backlinks and an email list.
- **Podcasts and guest posts**: pitch founder/design podcasts in the US/UK. Each appearance is a backlink and a mention AI assistants can find.
- **Reddit** (r/startups, r/Entrepreneur, r/branding, r/smallbusiness): answer branding questions genuinely, no links in the first month. AI assistants lean heavily on Reddit.
- **Paid, later**: once the pricing page converts, test Google Ads on "rebranding agency" / "brand identity agency" in the US and UK at $20–30/day, sent to /services. Not before. Paid clicks there cost $8–25 each.

## Pricing note

The contact form's USD budget options start at $1.2k. For a "high-paying international clients" position, consider starting
the USD options at $4–5k (an earlier plan in `docs/REVISED-IMPLEMENTATION-PLAN.md` had $4.5k / $8k / $15k+). Low anchors
attract low-budget leads and make US founders doubt quality.

## What to watch (monthly)

| Metric | Where | Healthy at month 3 |
|---|---|---|
| Impressions/clicks for "branding agency", "rebranding", "logo design" queries | Search Console → Performance | Clicks rising month over month |
| Visitors from US/UK/CA/SG/AE | GA4 → Reports → Demographics | 40%+ of traffic |
| `generate_lead` events | GA4 → Key events | 4–8 qualified inquiries/month |
| Clutch reviews | Clutch | 8+ |
| Do AI assistants name you? | Ask ChatGPT, Gemini, Claude, Perplexity "best branding studio for startups that works with US founders" every month | Named in at least one |
| Core Web Vitals | Vercel Speed Insights | All green |
