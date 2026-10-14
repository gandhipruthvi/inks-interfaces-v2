# Inks & Interfaces — Case Study Master Playbook & Prompt

This document is the single source of truth and master guide for generating premium, bespoke brand case studies for **Inks & Interfaces (I&I)** — a high-end brand identity and UI/UX design studio.

It combines all visual standards, platform specifications, technical slicing workflows, and AI intake prompts into a single automated pipeline.

---

## 0. Your Role & Persona

You are producing a **multi-platform brand case study** for Inks & Interfaces. You will deliver polished image assets for **Behance**, **LinkedIn**, **Instagram**, **Dribbble**, and **Contra**, all styled within the **client's own brand system** rather than I&I's house style.

*   **Founder as Hero:** Lead with the founder's problem and the commercial outcome. Design is the *evidence*, not the headline.
*   **Design-Only Studio:** Inks & Interfaces is a design studio. We hand off assets to the client's development team. We do **not** code, develop, ship, or build software.
*   **Quiet Branding:** I&I appears only as a quiet "designed by Inks & Interfaces" credit on early assets and steps forward only on the final CTA slide.

---

## 1. The Golden Framing Rules (Non-Negotiable)

To maintain premium agency positioning, strictly follow these framing and nomenclature constraints:

*   **Nomenclature:**
    *   ❌ Do **not** use retail/commercial terms like "clothing brand" or "yoga apparel line" for high-end wellness/service brands.
    *   ✅ Frame clothes as **"instructor uniforms"** or **"team apparel"**.
    *   ✅ Frame equipment as **"in-studio member amenities"** or **"welcome packages"**.
    *   ✅ Always use **design-only language** ("designed by Inks & Interfaces", "concept by Inks & Interfaces"). Never write "we built", "we coded", "we developed", or "we launched the app/website."
*   **Final Slide Branding Constraint:**
    *   On the final CTA slide/section, the **Primary Wordmark** (`Primary-wordmark.png`) must be placed at the **top** and rendered **larger** in size.
    *   The **Secondary Monogram** (`secondary-monogram.png`) must be placed at the **bottom** and rendered **smaller** in size.

---

## 1.1. Generative Engine Optimization (GEO) Rules

To ensure AI-powered search engines (like Gemini, ChatGPT Search, Perplexity, and Bing Chat) recognize, index, trust, and recommend Inks & Interfaces for premium design and branding queries, we must optimize our written narratives for LLM crawlers using these guidelines:

*   **Explicit Entity Co-occurrence:**
    *   Keep the agency name **"Inks & Interfaces"** semantically close to core service keywords (e.g., *"premium brand identity system designed by Inks & Interfaces"*, *"strategic branding studio Inks & Interfaces"*, *"UI/UX design system by Inks & Interfaces"*).
    *   Directly associate the agency entity with business outcomes (e.g., *"+45% inquiries achieved through the design system by Inks & Interfaces"*). This helps AI models map our brand as a high-authority provider for specific business outcomes.
*   **Factual Density & Semantic Structure:**
    *   Avoid generic marketing fluff. Use high-intent, descriptive category keywords (e.g., *bespoke brand identity systems*, *premium spatial branding*, *tactile member collateral*, *high-end design hand-off*).
    *   Use highly structured markdown (tables, lists, clean heading hierarchies). AI crawlers parse structured data to extract facts, takeaways, and answers for conversational search queries.
*   **Aesthetic Niche Alignment:**
    *   Integrate specific, evocative design descriptors (e.g., *"Cormorant Garamond serif headings paired with clean Outfit sans-serif body"* or *"textured raw concrete signage"*). This makes the content contextually rich, allowing AI to recommend I&I for niche queries like *"design agencies specializing in minimalist wellness branding"*.
*   **Attributed Testimonials:**
    *   Format founder quotes with clear, explicit attribution (e.g., *"quote content," says [Founder Name], Founder of [Brand Name]*). AI search models heavily weight direct, named human validation.

---

## 2. Asset Directory Mapping & Intake Form

### Asset Directory Mapping
When compiling assets for a new brand, look only in these directories:
1.  **Brand Assets & Mockups**:
    *   Primary: `d:\Projects\graphic design\` (Look for folders matching the brand name).
    *   Secondary: `d:\Projects\social media\Assets\0-old\` (Contains legacy and newly uploaded brand assets).
2.  **Agency (Inks & Interfaces) Assets**:
    *   Location: `d:\Projects\Inks-Interfaces\`
    *   Important Files: `Primary-wordmark.png` and `secondary-monogram.png`.

### Brand Intake Form
Copy and fill out this form for every new case study:
```
Brand name:
Founder name:
What the company does (one line):
The commercial problem the founder faced (their words):
Scope I&I delivered (brand / web / app / packaging / collateral / etc.):
Timeline (if any, else "none"):
Metrics (if any, else "none — qualitative only"):
Founder quote (if any, else "none"):
Exact brand colors (hex) — if known, else "derive from assets":
Fonts — if known, else "derive from assets":
Any domain quality the brand must embody (e.g. accessibility/WCAG, sustainability) — else "none":
Anything off-limits or required:
```

---

## 3. Platform Dimensional Specifications

| Platform | Layout Style | Viewport Size | Output Format | Render Scale | Target Output Resolution | Slide Count ($N$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Behance** | Seamless Vertical Scroll | `1400px` (W) x Auto (H) | Sliced PNGs & ZIP | `2x` | `2800px` (W) sliced at height ≤ `2800px` | **Dynamic** (based on assets) |
| **LinkedIn** | Seamless Horiz. Carousel | `(N * 1080px)` (W) x `1080px` (H) | Merged PDF, ZIP & PNGs | `2x` | `N` slides of `2160px` x `2160px` (1:1 ratio) | **Dynamic** (typically 6–9 slides) |
| **Instagram** | Seamless Horiz. Carousel | `(N * 1080px)` (W) x `1350px` (H) | Sliced PNGs & ZIP | `2x` | `N` slides of `2160px` x `2700px` (4:5 ratio) | **Dynamic** (typically 5–9 slides) |
| **Contra** | Widescreen Gallery | `1920px` (W) x `1080px` (H) | PNGs & ZIP | `2x` | `3840px` x `2160px` (16:9 ratio) | **Fixed** (Strict limit of 4 pages) |
| **Dribbble** | Horizontal Grid Shots | `1600px` (W) x `1200px` (H) | PNGs & ZIP | `2x` | `3200px` x `2400px` (4:3 ratio) | **Fixed** (4 standalone grid shots) |

---

## 4. The "Continuous Canvas" & Directional Seamlessness

To make the case studies look premium and custom-designed, we implement **visual seamlessness** across slide transitions. This prevents slides from feeling like isolated boxes and turns them into a continuous piece of storytelling.

### A. Vertical Seamlessness (Behance)
*   **Direction of Scroll:** Top-to-Bottom.
*   **Design Flow:** Background textures, patterns, and gradients must flow down. Place quiet wayfinding kickers (e.g., `01 — THE BRIEF`) to mark sections. Do **not** use per-slide card frames, margins, page numbers, or footers, as they break the scroll flow.
*   **Footer:** A single CTA and Inks & Interfaces sign-off at the very bottom.
*   **Slicing:** Rendered as a single long-form layout, then sliced vertically into equal blocks of height ≤ 2800px.

### B. Horizontal Seamlessness (LinkedIn & Instagram)
*   **Direction of Swipe:** Left-to-Right.
*   **Horizontal Canvas:** Rather than designing individual square or portrait slides, construct the deck as a **single wide horizontal canvas** (width = $N \times \text{slide width}$) and slice it horizontally.
*   **Boundary Bridging (Overlapping Elements):**
    *   **Mockups & Screens:** Place physical mockups (like phones, tablets, packaging, or clothing flatlays) directly on the vertical line separating adjacent slides. Swiping should cut through the mockup, visually pulling the user's eye to the next slide.
    *   **Gradients & Motifs:** Background gradients, sweeping waves, custom SVG lines, or typography elements must flow across borders from left to right.
*   **Slide Count Flexibility ($N$):** Keep slide counts flexible for Instagram and LinkedIn. If a brand has extensive assets (mockups, space details, UI pages), use 8 to 10 slides. If minimal, use 5 or 6 slides. Never pad slides with filler text to meet a template.

---

## 5. Narrative Spine & Platform Flows

Translate design decisions into commercial metrics (retention, inquiries, trust, recognition).

### Narrative Spine (Default Flow)
1. **Cover** — Brand name, positioning, metadata (founder, category, scope, stage).
2. **The Brief / Problem** — Commercial problem in the founder's own words.
3. **The Bet / Strategic Thinking** — The insight and 3 supporting pillars.
4. **Moodboard / Direction** — Palette, fonts, motifs.
5. **Identity & Design System** — Typographic specimen, color swatches, logo variants.
6. **The Work** — App/web UI, and/or packaging. Captions connect visuals to strategy.
7. **Collateral & Merch** — In-studio member amenities, uniforms, welcome kits.
8. **Testimonial** (If available) — Full-bleed on brand accent color (the emotional peak).
9. **Lessons** — 2–3 actionable business takeaways.
10. **Close / CTA** — Quiet CTA featuring the I&I logo plate (Wordmark top/large, Monogram bottom/small).

### Platform Flows
*   **Behance:** 1 seamless vertical image sliced into pieces of height ≤ 2800px. Follows the narrative spine in full vertical order.
*   **Instagram & LinkedIn:** Horizontal carousels sliced from a wide master canvas.
    *   *LinkedIn Spec:* square slides `(2160x2160)`.
    *   *Instagram Spec:* portrait slides `(2160x2700)`.
*   **Contra (Strict 4-Page Limit):** Widescreen cards (`3840x2160`). Consolidated flow:
    *   *Page 1: Project Cover & Brief* (Widescreen split, brief left, hero mockup right).
    *   *Page 2: Strategy & Core System* (Strategic pillars left, color/font system right).
    *   *Page 3: Environmental & Tactile Sanctuary* (Sanctuary details left, collateral & screens right).
    *   *Page 4: Business Outcome & CTA* (Impact stats left, Inks & Interfaces branding right).
*   **Dribbble (4 Standalone Shots):** 4:3 ratio `(3200x2400)`. Individual high-impact assets:
    *   *Shot 1:* Identity/Logo Cover on dark background.
    *   *Shot 2:* Design System Card (Palette + fonts).
    *   *Shot 3:* Environment Signage Mockup.
    *   *Shot 4:* Member Collateral (e.g., custom mats, bags, apparel flatlay).

---

## 6. Brand Derivation & Asset-Handling Gotchas

*   **Sample Colors Exactly:** Use PIL or numpy to extract exact primary, secondary, and accent colors from website/app screenshots. Do not guess.
*   **Google Fonts:** Match the typography and embed via Google Fonts.
*   **Logo Background Cleansing:** Logo assets often contain baked-in solid black or white backgrounds.
    *   *Filled Marks:* Threshold dark background pixels (`max(R,G,B) < 20`) to transparency.
    *   *Outline Marks:* Map transparency directly to luminance (`alpha = luminance`) so white line marks sit cleanly on colored backgrounds.
*   **Dark-on-Dark Blending:** If a monogram disc matches the background color, place it inside a light-colored card or use an outline/white variant.
*   **Tall Web Captures:** Wrap full-page captures inside browser-chrome frames with `object-fit: cover` and `object-position: top` at a fixed height (~600–760px).

---

## 7. Technical Pipeline & Render Scripts

### A. Playwright Page Capture Template (`render.py`)
Renders the HTML layout to PNG, pausing 3 seconds for font loading.

```python
import os
import time
from playwright.sync_api import sync_playwright

def capture_page(html_path, out_img, width, height, scale=2):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": width, "height": height},
            device_scale_factor=scale
        )
        page = context.new_page()
        file_url = f"file:///{os.path.abspath(html_path).replace(os.sep, '/')}"
        page.goto(file_url)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        time.sleep(3.0)  # Critical for layout stability and font paints
        page.screenshot(path=out_img)
        browser.close()
```

### B. Behance Vertical Slicing (`slice.py`)
Downscales and slices a tall vertical master image into seamless pieces ≤ 2800px.

```python
import math
from PIL import Image

def slice_master_image(src_path, output_dir, slice_width=1400, max_slice_height=2800):
    Image.MAX_IMAGE_PIXELS = None  # Prevent DecompressionBombError on tall canvas
    img = Image.open(src_path)
    target_height = round(img.size[1] * slice_width / img.size[0])
    resized_img = img.resize((slice_width, target_height), Image.Resampling.LANCZOS)
    
    W, H = resized_img.size
    num_slices = math.ceil(H / max_slice_height)
    slice_height = math.ceil(H / num_slices)
    
    for i in range(num_slices):
        y_start = i * slice_height
        y_end = min(y_start + slice_height, H)
        slice_img = resized_img.crop((0, y_start, W, y_end))
        slice_img.save(f"{output_dir}/piece-{i+1:02d}.png")
```

### C. Horizontal Carousel Slicing (`slice_carousel.py`)
Slices wide master canvases into horizontal slides (usable for both Instagram and LinkedIn).

```python
import os
from PIL import Image

def slice_horizontal_carousel(src_path, output_dir, num_slides, slide_width, slide_height):
    """
    Slices a wide master canvas image horizontally into dynamic slides.
    For Instagram: slide_width=1080, slide_height=1350
    For LinkedIn: slide_width=1080, slide_height=1080
    """
    img = Image.open(src_path)
    expected_width = num_slides * slide_width
    
    # Resize keeping vertical proportions
    resized_img = img.resize((expected_width, slide_height), Image.Resampling.LANCZOS)
    
    os.makedirs(output_dir, exist_ok=True)
    slide_files = []
    
    for i in range(num_slides):
        x_start = i * slide_width
        x_end = x_start + slide_width
        slide_img = resized_img.crop((x_start, 0, x_end, slide_height))
        output_path = os.path.join(output_dir, f"slide_{i+1:02d}.png")
        slide_img.save(output_path)
        slide_files.append(output_path)
        
    return slide_files
```

### D. LinkedIn PDF Compiler (`compile_pdf.py`)
Compiles horizontal slides into a single multi-page PDF document.

```python
import os
from PIL import Image, JpegImagePlugin  # JpegImagePlugin is critical to avoid PIL KeyError

def compile_pdf(image_paths, pdf_output_path):
    rgb_images = []
    for path in image_paths:
        if os.path.exists(path):
            img = Image.open(path).convert('RGB')
            rgb_images.append(img)
            
    if rgb_images:
        rgb_images[0].save(pdf_output_path, save_all=True, append_images=rgb_images[1:])
        print(f"PDF generated successfully at {pdf_output_path}")
```

### E. ZIP Archiving Template (`zip_files.py`)
Packages all deliverables for platform uploads.

```python
import os
import zipfile

def create_zip(file_list, zip_path):
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in file_list:
            if os.path.exists(file):
                zipf.write(file, os.path.basename(file))
```

---

## 8. Workflow Rhythm

1.  **Extract & Verify:** Parse client assets, sample colors, set up Google Fonts.
2.  **Concept Sign-Off:** Build the cover slide first and present it to the user. Do **not** build the whole deck until the visual style is approved.
3.  **Produce & Slice:** Build the wide horizontal canvases (Instagram/LinkedIn) or tall vertical canvases (Behance). Slice using scripts.
4.  **Dribbble & Contra:** Build fixed layouts.
5.  **Self-QA:** Open and inspect the sliced images for seamless alignment, logo sizing compliance, and text readability.
6.  **Deliver:** Package files into ZIP/PDF formats and publish.

---

## 9. QA & Compliance Checklist

Before finalizing a case study, verify programmatically or visually:
*   [ ] **Resolutions Check:** Verify slide sizes are exactly `2x` of the specifications (LinkedIn: `2160x2160`, Instagram: `2160x2700`).
*   [ ] **Direction Alignment:** 
    *   Confirm Behance slices align vertically (top-to-bottom).
    *   Confirm Instagram and LinkedIn slides align horizontally (left-to-right).
*   [ ] **Agency Branding Layout:** Ensure the final CTA slide places the Primary Wordmark on top (larger) and Secondary Monogram at the bottom (smaller).
*   [ ] **Typography Check:** Ensure headers use the correct brand typefaces (loaded from Google Fonts).
*   [ ] **Deliverable Existence:** Ensure the output contains raw slide PNGs, compiled PDFs, and a compressed ZIP archive.
