# TAVRICON Design System — MASTER.md

> **Brand**: TAVRICON — GROWTH. PERFORMANCE. INTELLIGENCE.  
> **Positioning**: Ultra-Premium Boutique Digital Marketing & Performance Engineering Agency targeting high-value Global ($5,000+), Indian Enterprise, and High-Growth DTC Clients.  
> **Visual Language**: **Royal Cobalt & Neon Cyan Aurora** — Deep Royal Velvet Void (`#030712`, `#070E22`), Electric Royal Cobalt (`#2563EB`, `#3B82F6`), Luminous Neon Cyan (`#00F2FE`, `#38BDF8`), and Imperial Violet Accents (`#8B5CF6`).

---

## 1. Color Palette Tokens

```css
:root {
  /* Surface / Background Tiers — Deep Royal Velvet Void */
  --bg-void: #030712;         /* Deep cosmic velvet obsidian void */
  --bg-surface-1: #070E22;    /* Royal dark glass cards and container surfaces */
  --bg-surface-2: #0E1A38;    /* Elevated surface, interactive inputs, dropdowns */
  --bg-surface-3: #172754;    /* Active card highlight and hover elevation */

  /* Electric Neon Cyan Tokens (Primary Luminous Accent) */
  --cyan-primary: #00F2FE;    /* Electric Neon Cyan */
  --cyan-light: #7CF6FF;      /* Luminous cyan highlight */
  --cyan-bright: #E0FBFF;     /* Super-bright metallic specular tip */
  --cyan-dark: #00A6B4;       /* Deep cyan shade */
  --cyan-glow: rgba(0, 242, 254, 0.42);
  --cyan-subtle: rgba(0, 242, 254, 0.12);
  --cyan-border: rgba(0, 242, 254, 0.35);

  /* Electric Royal Cobalt Tokens (Imperial Depth & Authority) */
  --royal-deep: #071330;      /* Deep midnight navy */
  --royal-primary: #2563EB;   /* Electric Royal Cobalt */
  --royal-light: #3B82F6;     /* Vivid Azure Cobalt */
  --royal-bright: #60A5FA;    /* Bright Sky highlight */
  --royal-glow: rgba(37, 99, 235, 0.45);
  --royal-subtle: rgba(37, 99, 235, 0.15);
  --royal-border: rgba(37, 99, 235, 0.40);

  /* Imperial Violet (Aurora Gradient Transition) */
  --violet-accent: #8B5CF6;
  --violet-glow: rgba(139, 92, 246, 0.35);

  /* Master Royal Aurora Gradients */
  --cyan-gradient: linear-gradient(135deg, #00F2FE 0%, #38BDF8 40%, #2563EB 100%);
  --cyan-gradient-hover: linear-gradient(135deg, #E0FBFF 0%, #00F2FE 40%, #3B82F6 100%);
  --aurora-gradient: linear-gradient(135deg, #00F2FE 0%, #38BDF8 30%, #8B5CF6 70%, #2563EB 100%);
  --aurora-text: linear-gradient(110deg, #FFFFFF 0%, #7CF6FF 30%, #00F2FE 55%, #8B5CF6 80%, #60A5FA 100%);

  /* Neutral & Text Hierarchy */
  --text-primary: #FFFFFF;    /* Pure crisp diamond white (100%) */
  --text-secondary: #E2E8F0;  /* Crisp cool platinum secondary (92%) */
  --text-muted: #94A3B8;      /* Slate blue-gray (65%) */
  --text-faint: #64748B;      /* Inactive & technical labels (45%) */

  /* Borders & Dividers */
  --border-subtle: rgba(56, 189, 248, 0.12);
  --border-glass: rgba(0, 242, 254, 0.22);
  --border-active: rgba(0, 242, 254, 0.65);
  --border-royal: rgba(37, 99, 235, 0.4);

  /* Glassmorphism */
  --glass-bg: rgba(7, 14, 34, 0.82);
  --glass-blur: blur(20px);
}
```

---

## 2. Typography System

- **Heading Font**: `Plus Jakarta Sans`, sans-serif (Weights: 600, 700, 800)
- **Body Font**: `Inter`, sans-serif (Weights: 400, 500, 600)
- **Data / Metrics Font**: `JetBrains Mono`, monospace (Weights: 500, 700)

```css
/* Typography Scale */
--text-display: clamp(2.5rem, 5.5vw + 1rem, 4.85rem); /* Hero headlines */
--text-h1: clamp(2rem, 3.8vw + 0.5rem, 3.3rem);       /* Major section headings */
--text-h2: clamp(1.5rem, 2.6vw + 0.25rem, 2.35rem);   /* Subsections */
--text-h3: clamp(1.25rem, 1.8vw + 0.2rem, 1.65rem);    /* Card titles */
--text-body: 1rem;                                   /* 16px baseline */
--text-sm: 0.875rem;                                /* 14px secondary */
--text-xs: 0.75rem;                                 /* 12px tags/badges */
```

---

## 3. High-Engagement & Hookable UX Components

### A. Interactive Growth & ROAS Simulator Engine
- **Location**: Hero Section (`index.html`)
- **Purpose**: Instantly hooks visitors with tangible, dynamic financial math rather than passive marketing copy.
- **Controls**:
  - Continuous ad spend slider: ₹50,000 → ₹25,00,000/month.
  - Strategic Model Toggle: **Hyper-Scale Mode** (4.8x blended ROAS, 15% CAC efficiency) vs **Maximum Margin Mode** (6.2x target ROAS, 28% net margin focus).
  - Dynamic Outputs: Projected Gross Revenue, Estimated Monthly Orders, Target Blended ROAS, Projected Monthly Net Profit.
  - Direct Action CTA: "Lock In This Strategy & Launch Sprint →", which transfers calculated parameters directly to the proposal form.

### B. Kinetic Rotating Border Beam (`.card-beam`)
- **Technology**: Animated CSS `conic-gradient` via pseudo-elements (`::before`) revolving continuously at 4s linear loop.
- **Visual**: A luminous streak of Neon Cyan & Royal Cobalt racing around the perimeter of featured cards and the simulator engine.

### C. Live Performance Telemetry Pill
- **Visual**: Glass pill with pulsing neon green/cyan active node indicator.
- **Ticker**: `● LIVE ENGINE: 14 ACTIVE CLIENT NODES SCALING | 4.8X AVG ROAS | ₹4.2 CR+ Q3 REVENUE ATTRIBUTED`.

### D. Ambient Cursor Light Orb
- Smooth `requestAnimationFrame` lerp following user cursor with Neon Cyan & Royal Cobalt radial gradients, illuminating card glass borders on proximity.

---

## 4. Component Standards

1. **Buttons**:
   - Primary: Electric Neon Cyan into Vivid Azure Cobalt gradient (`var(--cyan-gradient)`), deep obsidian text (`#030712`), 10px radius, hover `translateY(-2px)` with radiant cyan glow `0 10px 30px rgba(0, 242, 254, 0.45)`.
   - Secondary: Smoked royal glass (`background: rgba(255,255,255,0.04)`), 1px hairline cyan border (`rgba(0, 242, 254, 0.3)`), hover border `var(--cyan-primary)` with royal blue halo.
   - Touch Target: Minimum 44px × 44px on all devices.
2. **Cards**:
   - Background: `var(--glass-bg)` with `backdrop-filter: var(--glass-blur)`.
   - Border: 1px solid `var(--border-glass)`.
   - Hover: Border glows to `var(--cyan-primary)`, box-shadow emits radiant royal cobalt aura, `translateY(-4px)` with interactive 3D perspective tilt.
4. **Icons**:
   - 100% Vector SVG inline icons in 2px consistent stroke with cyan and royal cobalt accent highlights.
   - No emoji used as structural controls.
5. **Accessibility (WCAG 2.1 AA)**:
   - All body text maintains ≥ 4.5:1 contrast against dark backgrounds.
   - `:focus-visible` styling with 2px gold outline and 2px offset.
   - Form fields have explicit labels and aria attributes.
