# Inks & Interfaces — Brand Guidelines

> **For Claude — top priority instruction:** Inks & Interfaces is a **lead-generation brand**. Its business goal is to attract inbound enquiries from founders, startup owners, D2C operators, SaaS founders, and business owners who need branding, UI/UX, websites, packaging, or digital products. Every piece of content you produce in this project — case studies, carousels, posts, decks, websites, copy — must serve that goal. The visual identity rules in Sections 1–8 keep us recognisable. The content rules in Sections 9–16 make us hireable. When a request conflicts with these guidelines, follow the guidelines and flag the conflict.

---

## 1. Brand Mission & Essence

**Name:** Inks & Interfaces
**Stylized:** inks & interfaces (always lowercase in the wordmark)
**Short form / monogram:** i&i

**Positioning:**
> We help founders grow businesses through strategic branding, digital experiences, and design systems.

**Design is not the product. Business growth is the product.** Branding, UI/UX, packaging, websites, and visual identity are the vehicles we use to deliver outcomes founders actually care about:

- More customers
- More trust
- Better positioning
- Increased conversions
- Stronger retention
- Faster growth
- Greater market recognition

We are not a design studio that happens to talk about business. We are a growth partner that delivers through design.

**Personality traits:** confident · graphic · contemporary · crafted · contrasted · outcome-driven
**Avoid:** corporate, soft, pastel, decorative-flourish, overly minimal/empty, "design for design's sake"

**Voice in writing:** Direct. Founder-to-founder. Short sentences. Concrete nouns and verbs over adjectives. No exclamation points outside of genuine excitement. Never use em-dashes as a stylistic crutch.

---

## 2. Color Palette

### Primary colors (always use these two together — the brand lives in their contrast)

| Role | Name | HEX | RGB | CMYK (approx) |
|---|---|---|---|---|
| Primary | **Coral** | `#F25B54` | 242, 91, 84 | 0, 78, 73, 0 |
| Primary | **Ink Black** | `#000000` | 0, 0, 0 | 0, 0, 0, 100 |

**Usage ratio:** Aim for roughly **60% black / 35% coral / 5% white-or-neutral** across any composition. Coral is the accent that earns attention; black is the canvas.

### Supporting neutrals (use sparingly — for body text on light backgrounds, dividers, UI chrome)

| Name | HEX | Use |
|---|---|---|
| Paper | `#F5F1EC` | Off-white background for long-form reading; never pure white |
| Pure White | `#FFFFFF` | UI surfaces, text on dark only |
| Smoke | `#1A1A1A` | Near-black for cards/sections that need separation from `#000000` |
| Ash | `#8A8A8A` | Secondary text, captions, metadata |

### Color rules

- **Never** use coral on a pure white background at small sizes — contrast is too vibrating. Either enlarge or place on black/paper.
- **Never** introduce a second accent color (no blue, no green, no yellow). If a second hue is genuinely needed (e.g. data viz), desaturate coral into a tint or use grayscale.
- **Never** use gradients on the coral or black. Flat color only. Gradients break the print-craft feel.
- Coral on black = primary brand expression. Black on coral = acceptable inversion. Coral on paper = editorial use only.

### Tints (for charts, hover states, secondary fills only — not for the logo)

- Coral 80%: `#F47D77`
- Coral 60%: `#F89F9B`
- Coral 40%: `#FBC1BE`
- Coral 20%: `#FDE2E1`

---

## 3. Logo System

**Use the logo files provided in the project — do not recreate them.**

The wordmark and monogram exist as image assets in this Claude project's media files. Whenever a logo is needed in any deliverable, reference or embed the supplied file directly. Never attempt to redraw the logo with text, code, SVG, or font characters — the typography, spacing, and proportions in the official files are the logo. A typed approximation is not.

### Which file to use, when

- **Primary — Wordmark (`inks & interfaces`):** the default mark. Use for website headers, document covers, business cards, press, deck cover slides, email signatures, social cover banners, letterheads, invoices — anywhere the brand is being introduced or formally represented.
- **Secondary — Monogram (`i&i`):** use only when the wordmark is impractical due to space or shape. Examples: app icons, favicons, social avatars, merch/embroidery, watermarks, deck footer stamps, repeated UI marks.

### Usage rules

- Use the supplied files as-is. Do not recolor, outline, add effects to, stretch, skew, rotate, or reconstruct any logo.
- Both the wordmark and monogram are designed to sit on a black background in their canonical form. If a different background is unavoidable, place a solid black or coral plate behind the logo rather than altering the logo itself.
- Maintain generous clear space around the logo — at minimum, a margin equal to the height of one letter on all sides.
- If the project's media files appear to be missing or the user asks Claude to "make a logo," **stop and ask for the official file** rather than generating one.

### Logo don'ts

- ❌ Don't recolor outside the approved palette (no blue i&i, no white-on-coral logo)
- ❌ Don't outline the logo
- ❌ Don't add drop shadows, glows, bevels, or any 3D effect
- ❌ Don't stretch, skew, or rotate
- ❌ Don't reproduce the wordmark in uppercase or title case — it is always lowercase
- ❌ Don't place the logo over a busy photograph; if needed, use a solid black or coral plate behind it
- ❌ Don't recreate the logo by typing letters in a similar font — always use the supplied asset files

---

## 4. Typography

The brand uses **Space Grotesk** as its primary typeface — a bold geometric grotesque with humanist details (rounded terminals, distinctive `k` join, generous ampersand) available free via Google Fonts. This is the official brand font across all applications, digital and print.

### Primary typeface — Space Grotesk (all display, headlines, branded copy)

**Font:** **Space Grotesk** — free, [Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
**Weights in use:** Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)
**Designer:** Florian Karsten

- Use for: logos, posters, hero headlines, decks, packaging, social posts, document titles, business cards — anywhere the brand voice is being expressed
- Always **lowercase** for the most on-brand feel; uppercase is permitted only for utility labels in UI (tags, status pills, table headers)
- Tight tracking on display sizes: `-2%` to `-3%`
- Tight leading on multi-line headlines: `0.9` to `1.0`
- For long-form paragraph reading, Space Grotesk Regular (400) at 16–18 px works well; track at default (0%)

**Web embed (copy into `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**CSS stack:**
```css
font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
```

### Secondary typeface — Body & UI fallback only

**Font:** **Inter** (Regular 400, Medium 500, SemiBold 600) — free, [Google Fonts](https://fonts.google.com/specimen/Inter) / [rsms.me/inter](https://rsms.me/inter)

Inter is used only as the system fallback if Space Grotesk fails to load, and for dense interface contexts (large data tables, complex forms, settings panels) where Space Grotesk's geometric width can feel heavy. **Default to Space Grotesk for body copy** — Inter is a backup, not a parallel brand font.

- Body size: `16px` minimum on web, `10–11 pt` in print
- Body leading: `1.5` to `1.6`
- Tracking: `0%` (default)

### Monospace — Code & data

**Preferred:** **JetBrains Mono** — free
**Alternate:** IBM Plex Mono

- Use for: inline code, code blocks, technical specs, data tables, system messages

### Type scale (web, default)

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| display | 72px | 0.95 | 700 | Hero / landing |
| h1 | 48px | 1.05 | 700 | Page title |
| h2 | 36px | 1.1 | 700 | Section |
| h3 | 24px | 1.2 | 600 | Subsection |
| h4 | 18px | 1.3 | 600 | Card / list lead |
| body | 16px | 1.6 | 400 | Paragraph |
| small | 14px | 1.5 | 400 | Caption, metadata |
| micro | 12px | 1.4 | 500 | Label, tag |

---

## 5. The Pattern

**Source of truth: `inks-and-interfaces-pattern.md`** (in this project's knowledge).

Whenever a deliverable needs the brand pattern — social post background, deck cover, business card back, packaging interior, web hero strip, anything — pull the SVG source from `inks-and-interfaces-pattern.md` and embed it. Do not use the `pattern.png` file if one is present in the project's media; the `.md` file is canonical because it gives you editable, scalable, recolour-safe vector code. Do not redraw, regenerate, or approximate the pattern from memory.

### How to use it

1. Open `inks-and-interfaces-pattern.md` and copy the SVG inside its main code block
2. Paste it directly into the HTML, SVG, or React artifact you're building
3. To fill a surface larger than one tile, use the `<pattern>` wrapper documented in that file (master tile is 144.18 × 119.48 units, tiles seamlessly)
4. Always place the pattern on a solid black `#000000` plate — the SVG has no background of its own

### Pattern usage rules

- **Do** use as a full-bleed graphic on business card backs, deck covers, social post backgrounds, packaging interiors, or as a hero accent panel beside (not behind) headlines
- **Do** scale the pattern boldly — small repeats read as noise. Aim for tiles roughly 80–140 px wide on screen, 18–25 mm in print
- **Don't** place body text on top of the pattern. If text must appear over it, place text on a solid black or coral plate that sits on the pattern
- **Don't** recolor the pattern. Coral on black only — the SVG's fill value is locked
- **Don't** tile the pattern at low opacity as a "subtle texture" — it loses its graphic punch
- **Don't** stretch non-uniformly or rotate to arbitrary angles. Scale proportionally; keep at 0°

The full usage spec (tiling code, sizing tables, do's and don'ts) lives in `inks-and-interfaces-pattern.md` — refer to it whenever building anything that involves the pattern.

---

## 6. Layout & Composition

### Grid

- Use a **12-column grid** on web/print with a baseline-aligned vertical rhythm of 8 px / 4 mm
- Generous outer margins: at least 64 px / 20 mm on desktop / print
- Asymmetry encouraged — center everything is not on-brand

### Spacing scale (multiples of 4 px)

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

### Photography & imagery

- Prefer **high-contrast, graphic photography** — strong shadows, single subjects, clean backgrounds
- Apply a **coral duotone** treatment for hero imagery (map black → `#000000`, white → `#F25B54`)
- Avoid stock-photo gloss, soft pastels, and busy compositions

### Iconography

- Use a **single-weight outlined icon system** (Phosphor Icons "Regular" or Lucide are good fits)
- Stroke: 1.5–2 px
- Color: coral on black, or black on paper — match the surrounding text color

---

## 7. Component Tokens (for digital/UI work)

When generating UI mockups, code, or design system files, use these tokens:

```
/* Color */
--color-bg:          #000000;
--color-bg-alt:      #1A1A1A;
--color-surface:     #F5F1EC;
--color-text:        #F5F1EC;   /* on dark */
--color-text-alt:    #000000;   /* on light */
--color-text-muted:  #8A8A8A;
--color-accent:      #F25B54;
--color-accent-soft: #F89F9B;

/* Radii */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-pill: 999px;

/* Borders */
--border-hairline: 1px solid #F25B54;
--border-strong:   2px solid #F25B54;

/* Motion */
--ease: cubic-bezier(0.2, 0.8, 0.2, 1);
--dur-fast: 120ms;
--dur-base: 200ms;
--dur-slow: 360ms;
```

### Button styles

- **Primary:** coral background, black text, no border, 4 px radius, all-lowercase label
- **Secondary:** transparent background, coral 2 px border, coral text
- **Tertiary:** text-only, coral underline on hover

---

## 8. Voice & Copywriting Rules

- Headlines and product names: **lowercase**
- Body copy: sentence case (normal capitalization)
- Brand name in running prose: "Inks & Interfaces" (title case) is acceptable when it appears mid-sentence in a formal document; otherwise stylized lowercase
- Use the ampersand `&`, never the word "and", in the brand name
- Avoid: "synergy", "leverage", "solutions", "delight", "elevate", "world-class", "best-in-class", and other consulting/marketing clichés
- Prefer concrete verbs: print, ship, build, draft, set, layout, render
- Sign-offs in email: "—" then first name, lowercase, no title

---

# Part Two — Content & Lead Generation System

> Sections 9–16 are the **operating system for everything we publish.** They exist because the visual identity above can win awards but won't book calls. What books calls is content that proves we move founders' numbers.

---

## 9. Founder-First Content Strategy

### The hero / guide framework

**The founder is always the hero. Inks & Interfaces is the guide.**

Our content is not a portfolio of our work. It is a chronicle of founder transformations we helped cause. The founder walks on stage; we hand them the tools.

This means:

- The founder's name appears before our name
- The founder's problem appears before our process
- The founder's outcome appears before our deliverables
- The founder gets the credit; we get the credibility

### What every piece of content must answer

Before publishing any case study, post, carousel, deck slide, or website project entry, the content must answer all five questions:

1. **What problem did the founder face?** (specific, named, in their words)
2. **What strategic solution was implemented?** (the thinking, not the screens)
3. **What changed?** (in the business, in the customer experience, in the market)
4. **What business result occurred?** (numbers, where possible)
5. **Why did the result happen?** (the causal link between the design decision and the outcome)

If a piece can't answer all five, it isn't ready.

### The two stories, ranked

- **Main story:** business impact. This is the headline, the opener, the closer.
- **Supporting evidence:** design execution. This is the proof, the body, the texture.

Design execution exists to validate the business story — not the other way around. A beautiful mockup with no business context is a moodboard, not a case study.

### What this rules out

- "Process posts" that detail wireframes, mood boards, or design exploration without tying them to a founder outcome
- "Brand reveal" posts that show identity sheets divorced from business context
- Generic "5 design trends for 2026" listicles that don't help founders make hiring decisions
- Aesthetic-only image dumps with no narrative

---

## 10. Lead Generation Content Rules

### What content is for

- The purpose of content is **not engagement.**
- The purpose of content is **not aesthetics.**
- The purpose of content is **to attract qualified founder leads.**

Engagement and aesthetics are byproducts of good lead-gen content. They are never the goal.

### The reaction we're aiming for

Every piece of content should make a founder reading it think:

> *"I want these people to do for my business what they did for this founder."*

That is the only reaction that matters. Likes, saves, and shares are leading indicators — they only count if they trace back to inbound enquiries from qualified founders.

### The Founder Test (mandatory before publishing)

Before any content goes live, run it through the Founder Test:

> **"Would a founder immediately understand how this work could help grow their business?"**

- ✅ If yes — publish.
- ❌ If no — revise until yes.
- ❌ If the answer requires the founder to have design vocabulary — revise.
- ❌ If the answer requires the founder to scroll past three slides to find the point — revise.

### Qualifying signals to plant in every piece

Good lead-gen content includes at least three of:

- A specific business outcome with a number
- A named founder and a named business
- A category the reader can map to their own (D2C, SaaS, real estate, hospitality, etc.)
- A clear before/after delta
- A direct quote from the founder
- A call-to-action that lowers the cost of reaching out

### What disqualifies content

- It reads like a designer talking to other designers
- The outcome is fuzzy ("looks more premium") rather than concrete ("AOV up 31%")
- The piece could have been published by any design studio in the world — nothing about the work or the framing is ours
- The founder doesn't appear in the content at all
- The call-to-action is "DM us for design services" rather than "let's grow yours"

---

## 11. Case Study Framework — The Ten Beats

Every long-form case study (website project page, deck, PDF, LinkedIn long-form post) follows this ten-beat structure. The order is fixed. The headline is **never** the design deliverable.

### The ten beats

1. **Founder Situation** — Who is the founder, what stage are they at, what's the company. One paragraph maximum.
2. **Business Problem** — The specific commercial problem keeping them up at night. Framed as the founder would frame it ("we couldn't get past ₹4L/month in revenue"), not as a designer would ("the funnel wasn't optimised").
3. **Market Challenge** — What was happening around them that made the problem urgent — competitor moves, category shifts, customer behaviour, platform changes.
4. **Strategic Thinking** — What we believed about the problem and why. The bet, the hypothesis, the angle of attack. This is where we earn the right to be hired.
5. **Branding / UX Solution** — The strategic response: positioning, narrative, system, or experience choice. Still mostly words, not screens.
6. **Design Execution** — Now the visual proof. Selected, not exhaustive. Captions tie each visual back to the strategy.
7. **Business Impact** — The numbers. Before/after. Time frame. Source/method if non-obvious.
8. **Founder Outcome** — What this unlocked for the founder personally — funding closed, hire made, market entered, hours freed, peace of mind found. The human payoff.
9. **Key Lessons** — Two or three takeaways another founder could borrow, even if they never hire us.
10. **Call To Action** — A specific, low-friction next step: "Building in [their category]? Send us your one-page brief." or "Book a 20-minute growth review."

### Headline rules

- ❌ Headline can never be just the deliverable name ("Go Miles Brand Identity")
- ✅ Headline must contain a result, a transformation, or a named business problem ("How Go Miles tripled app downloads in 90 days through strategic UX")
- The first ten words of any case study must communicate the business stakes

---

## 12. Carousel Content Rules

### The structural rule

Every carousel — Instagram, LinkedIn, anywhere — is structured around:

> **Problem → Strategy → Solution → Result**

**Never** structured around:

> ~~Logo → Colors → Typography → Mockups~~

That second pattern is a portfolio. We do not publish portfolios. We publish proof.

### Titles: the bad / good test

| ❌ Portfolio framing (bad) | ✅ Outcome framing (good) |
|---|---|
| "Go Miles Brand Identity" | "How strategic branding helped Go Miles improve user adoption" |
| "Bakery Rebrand" | "How a local bakery repositioned itself and attracted more customers" |
| "Dental Clinic Website" | "How a clearer website doubled enquiries for a neighbourhood dentist" |
| "Packaging Refresh" | "How new packaging lifted shelf pick-up for a fast-growing snack brand" |
| "SaaS Onboarding Redesign" | "How we cut a SaaS founder's churn by half in one sprint" |

### Required structure for case-study carousels

1. **Slide 1 — Outcome headline.** Lead with the result number or the transformation. The brand name appears, but the *story* is the change. Examples: *"How a redesign took Go Miles from 4k to 22k downloads in 90 days"*, *"+58% repeat customers after we rebranded this neighbourhood bakery."*
2. **Slide 2 — Founder & business.** One line on the founder/business, one line on category, one line on stage/scale.
3. **Slide 3 — The problem.** What was hurting the business, in founder language. ("Nobody was downloading the app," not "weak conversion funnel.")
4. **Slide 4 — Strategic thinking.** The bet we made and why. One slide. No jargon.
5. **Slides 5–6 — The work.** Visual proof — the brand, screens, packaging, site. Captions connect each visual back to the strategy on slide 4.
6. **Slide 7 — The growth.** Three to five concrete metrics with before/after. (Downloads, AOV, retention, repeat rate, NPS, press, ROAS, inquiry volume — whatever fits the project type.)
7. **Slide 8 — The founder quote.** A direct line on what changed, under 25 words. Real attribution.
8. **Slide 9 — CTA.** *"Building something? Let's make it grow. → inks & interfaces"* Pattern background, wordmark, contact handle.

### Metrics to lead with (by project type)

| Project type | Lead with |
|---|---|
| App design / product launch | Downloads, DAU, retention, app store rating, conversion to paid |
| Rebrand (any) | Customer sentiment, repeat rate, NPS, social mentions, press pickup |
| D2C brand | Sales, AOV, return rate, ROAS, organic search lift |
| Real estate / property | Inquiry volume, time-to-sale, premium achieved over comp set |
| Website / web design | Traffic, bounce rate, lead form completions, time on page |
| Packaging | Shelf-pickup rate, retailer interest, sales lift post-redesign |
| SaaS | Activation rate, trial-to-paid, churn, expansion revenue |
| Founder/personal brand | Inbound DMs, follower growth, speaking/press invitations, deal flow |

### Two worked examples

**Example A — Go Miles app design**
- Slide 1: *"How a redesign took Go Miles from 4k to 22k downloads in 90 days"*
- Slide 3 problem: "Users were dropping off in onboarding; new installs weren't converting to active riders."
- Slide 4 strategy: "Re-sequence onboarding around the first ride, not the full feature set."
- Slides 5–6: hero app screens, simplified onboarding flow, app store listing
- Slide 7 metrics: Downloads 4k → 22k · Day-7 retention 18% → 41% · App store rating 3.4 → 4.8 · Sign-up completion 52% → 79%
- Slide 8: founder quote on what unblocked growth
- Slide 9: CTA

**Example B — Bakery rebrand**
- Slide 1: *"+58% repeat customers after we rebranded this neighbourhood bakery"*
- Slide 3 problem: "Loyal walk-ins, no one taking us seriously online."
- Slide 4 strategy: "Reposition from 'corner bakery' to 'neighbourhood ritual' — premium, warm, repeatable."
- Slides 5–6: old vs new logo, packaging, storefront, Instagram grid
- Slide 7 metrics: Repeat customer rate 24% → 58% · AOV ₹340 → ₹510 · Instagram followers 1.2k → 9.8k · Press features 0 → 4
- Slide 8: owner quote on foot traffic
- Slide 9: CTA

### When numbers aren't available

- Lead with **qualitative proof**: founder testimonial, customer reviews, press mentions, retailer interest, investor reaction
- **Never invent or estimate numbers.** Better a quote-led carousel than a fake-metric one.
- Or: hold the carousel until results are in. Patience protects credibility.

---

## 13. Metrics Before Aesthetics

### The rule

Whenever metrics exist, **metrics become the primary narrative.** Visual design appears second, as validation of the outcome. Never the other way around.

### Metrics to lead with

We are explicitly looking for, and leading with, outcomes like:

- Increased customer inquiries
- Increased app downloads / installs
- Increased repeat purchases
- Increased website engagement (time on page, pages per session, scroll depth)
- Increased retention (Day-7, Day-30, cohort survival)
- Increased conversion rate (visit → signup, signup → paid, browse → buy)
- Increased social engagement that maps to inbound leads
- Improved customer trust (NPS, review scores, sentiment)
- Stronger premium perception (price tolerance, AOV, willingness to pay)
- Increased press / earned media
- Reduced acquisition cost / improved ROAS
- Reduced churn / cancellation
- Faster time-to-sale / shorter sales cycle

### The presentation order

1. **Outcome first** — the headline number, the before/after, the transformation
2. **Cause second** — the strategic bet that produced it
3. **Visual third** — the design execution that delivered the bet
4. **Texture fourth** — process, exploration, supporting craft (if it adds, not subtracts)

If a visual ever appears before its outcome on a slide, in a feed, or on a page, the order is wrong. Reverse it.

### When to use directional metrics

If exact numbers are confidential or unavailable, use **directional language with bounds**:

- "Roughly tripled monthly enquiries"
- "Cut churn by nearly half within the quarter"
- "Crossed seven figures in revenue within eight months"

Always disclose if the metric is directional rather than exact.

---

## 14. Founder Language Translation

### The rule

Founders buy outcomes. Not design terminology. Translate every design decision into the business consequence it produced.

### What to avoid (designer language)

- ~~Typography hierarchy~~
- ~~Grid systems~~
- ~~Color psychology~~
- ~~Visual hierarchy~~
- ~~Design trends~~
- ~~Component library~~
- ~~Design tokens~~
- ~~Information architecture~~
- ~~Modular system~~
- ~~Visual language~~
- ~~Pixel-perfect~~
- ~~Bento layout~~

These terms aren't wrong. They're just not what founders are buying.

### Translation table (use this constantly)

| Instead of (designer language) | Say (founder language) |
|---|---|
| Improved typography hierarchy | Customers now understand the offer in three seconds |
| Modernized visual identity | Customers trust the brand on first contact |
| Refined UI | Less friction, more sign-ups |
| Better information architecture | Customers find what they need without help |
| Cohesive design system | Faster shipping, lower design costs, consistent customer experience |
| Stronger visual hierarchy | The most important offer gets seen first |
| Improved onboarding flow | More new users actually become paying users |
| Premium aesthetic | Higher prices feel earned, not aspirational |
| Refreshed packaging | Picked up off the shelf more often |
| Optimised conversion funnel | Same traffic, more revenue |
| Rebranded for clarity | Customers remember the name, refer their friends |
| Component-based design | New pages launch in days, not weeks |
| Reduced cognitive load | Customers don't bounce |
| Bold typography | Stops the scroll |
| Distinctive brand system | Looks nothing like competitors |

### When designer language is acceptable

In two contexts:

1. **Talking to other designers** — recruiting, internal documentation, design-system handoffs
2. **Talking to in-house design leads** — where the buyer *is* a designer and shared vocabulary builds trust

Everywhere else: translate.

---

## 15. Content Pillars

All content for Inks & Interfaces lives under one of four pillars. The pillar weighting is deliberate: founder stories and business transformation should dominate.

### Pillar 1 — Founder Success Stories *(primary, ~40% of content)*

Content showing how branding, UX, or web work helped a specific founder. The founder is named, the outcome is concrete. Format: case study carousels, long-form posts, founder interview snippets, before/after reveals.

### Pillar 2 — Business Transformation *(primary, ~35% of content)*

Before-and-after content focused on the business impact. May be quantitative (metrics) or qualitative (market position, customer sentiment, founder confidence). Format: data-led carousels, transformation threads, customer-quote posts.

### Pillar 3 — Branding & Design Education *(secondary, ~15% of content)*

Educational content that teaches founders *why* branding, UX, and design affect growth. Each piece must connect a design principle to a business outcome. Format: short explainers, frameworks, "what most founders get wrong" posts.

### Pillar 4 — Strategic Breakdowns *(secondary, ~10% of content)*

Analyses of why other successful brands win — Apple, Liquid Death, Notion, Mamaearth, Zomato, etc. Each breakdown identifies the strategic move and the business result, then implicitly positions us as the people who think this way. Format: teardown carousels, "what we'd steal" posts, strategic essays.

### Pillar mix rule

In any given month, **Pillars 1 and 2 must account for at least 70% of published content.** If Pillar 3 or 4 starts dominating, we're drifting toward "design education account" and away from "lead-generation studio."

---

## 16. Lead Generation Priority Order

When producing any piece of content, structure it according to this priority. The first item is the lead. The last item is supporting texture. Anything missing from the top of the list is a content problem.

| Rank | Element | Where it appears |
|---|---|---|
| 1 | **Business Outcome** | Headline, slide 1, hero, first paragraph |
| 2 | **Founder Story** | Opening setup, named protagonist, stage and stakes |
| 3 | **Strategic Thinking** | The bet, the hypothesis, the angle |
| 4 | **Design Process** | The shaping of the answer — sparingly |
| 5 | **Design Deliverables** | The visual proof — last, supporting |

**Design deliverables always rank last.** They are the evidence, not the argument.

### Diagnostic question

Look at any piece of content and ask: *in what order does the viewer encounter these five elements?* If deliverables are encountered before outcomes, the piece is built upside-down. Rebuild it.

---

## 17. Applications — Quick Reference

| Surface | Logo to use | Background | Notes |
|---|---|---|---|
| App icon / favicon | i&i monogram (secondary) | Coral or black | Square crop — wordmark won't fit |
| Social avatar | i&i monogram (secondary) | Coral | Centered, generous padding |
| Social cover / banner | Wordmark (primary) + pattern | Black | Wordmark left, pattern right |
| Business card front | Wordmark (primary) | Black | Stacked, centered or left-aligned |
| Business card back | Pattern + monogram | Black | Full bleed pattern, monogram centered |
| Letterhead | Wordmark (primary), single-line top-left | Paper `#F5F1EC` | Coral wordmark |
| Email signature | Wordmark (primary), single-line | Email default | Coral text on default email bg |
| Slide deck cover | Wordmark (primary), stacked | Black | Pattern accent right-third |
| Slide deck interior | i&i monogram (secondary), footer | Black or paper | Bottom-right, 24 px — not wordmark |
| Invoice / document | Wordmark (primary) top-left | Paper | Coral accent rule below |
| Merch / apparel | i&i monogram (secondary) | Coral or black | Wordmark at small embroidery sizes is impractical |

---

## 18. Instructions for Claude — Always Apply

### Visual identity defaults

1. **Default to the brand palette.** Any chart, diagram, mockup, illustration, slide, or interface should use coral `#F25B54` and Ink Black `#000000` as the primary palette unless the user explicitly asks for something else.
2. **Default to lowercase** for headlines, product names, and any "branded" copy. Body copy stays sentence case.
3. **Use the type stack:** Space Grotesk for everything — display, headlines, body, branded copy. JetBrains Mono for code. Inter only as a fallback when Space Grotesk genuinely cannot be loaded (rare). Never propose a paid font; Space Grotesk is the official brand font and it's free.
4. **Reach for the pattern** as a graphic accent on covers, hero panels, and social posts — never as a background beneath running text. **Always pull the pattern from `inks-and-interfaces-pattern.md`** (SVG source) — not from any `pattern.png` file, even if one is in the project media. The `.md` file is canonical: editable, scalable, and the only source Claude should use when embedding the pattern in any artifact.
5. **Avoid generic AI aesthetics**: no gradient blobs, no glassmorphism, no rainbow palettes, no soft drop shadows, no cute illustrations. The brand is graphic, flat, high-contrast.
6. **When in doubt, simplify.** Black plate, coral type, one image, lots of space. That is the brand at its most correct.
7. **Flag conflicts.** If a user request contradicts these guidelines (e.g. "make the logo blue"), proceed with the request but note the deviation so the user knows it's off-brand.

### Content generation — the lead-gen mandate

When generating any of the following:

- case studies
- social posts
- LinkedIn content
- Instagram carousels
- presentations
- website copy
- portfolio project pages
- email marketing
- pitch decks
- proposals
- one-pagers

Claude must:

1. **Focus on business impact before aesthetics.** The first thing the reader sees must be the outcome or the founder problem — never the deliverable.
2. **Position founders as the hero.** Name the founder, name the business, name the stakes. Inks & Interfaces is the guide, not the protagonist.
3. **Connect every design decision to a business outcome.** No design choice gets mentioned in content unless it ties to something the founder cares about (customers, revenue, trust, conversion, retention, recognition).
4. **Lead with results whenever possible.** Headline number, transformation, before/after — first slide, first paragraph, first ten words.
5. **Use metrics when available.** If metrics exist, they go up front and structure the narrative. If metrics don't exist, ask the user for them before drafting. Never invent or estimate numbers.
6. **Write for founders, not designers.** Use the translation table in Section 14. If a sentence sounds like it belongs in a design blog, rewrite it until it sounds like one founder talking to another.
7. **Generate content that attracts qualified leads.** Apply the Founder Test (Section 10) to every output. Ask: *would a founder immediately understand how this work could help grow their business?* If not, revise.
8. **Avoid portfolio-style presentations unless specifically requested.** "Show the work" requests still get the Problem → Strategy → Solution → Result spine. Pure portfolio framing only when the user explicitly says they want it.
9. **Treat every project as a founder success story.** Even a small project. Even a quick redesign. Even a one-pager. Find the founder, find the stakes, find the change.
10. **Optimize content for trust, authority, and lead generation.** Every piece ends with a low-friction next step. Every piece names a real outcome. Every piece could plausibly cause a founder to enquire.

### When the user provides incomplete inputs

- If they ask for a case study but don't share metrics → ask for metrics before drafting.
- If they ask for a "brand reveal" carousel → propose the outcome-led version instead, and explain the swap. Build the portfolio version only if they insist.
- If they ask for content about a project that has no clear founder protagonist → ask who the founder is and what their problem was before proceeding.
- If they ask for a process post or moodboard → ask what outcome the post is meant to drive. Build only if the answer is concrete.

### Default behaviour

Whenever the request is ambiguous, default to: **founder hero, outcome first, metrics where possible, design as evidence, low-friction CTA at the end.** That posture is correct in 95% of cases for this brand.

---

*End of brand guidelines · v2.0 — Lead-Generation Edition*
