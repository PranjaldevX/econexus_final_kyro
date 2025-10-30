# Design Guidelines: Circular Economy Platform

## Design Approach

**Selected System:** Material Design 3 with sustainability-focused customization

**Justification:** This platform is utility-focused with information-dense dashboards requiring clear data hierarchy, efficient workflows, and mobile-first scanning capabilities. Material Design provides robust patterns for tables, forms, and mobile interactions while maintaining professional credibility for B2B users.

**Core Principles:**
1. **Clarity Over Cleverness** - Data legibility and workflow efficiency trump decorative elements
2. **Sustainable Aesthetics** - Visual language reflects environmental mission through natural, earthy tones
3. **Role-Appropriate Complexity** - Admin views can be denser; customer views stay simple
4. **Scan-First Mobile** - Camera/scanning interface is hero feature on mobile

---

## Color Palette

### Light Mode
- **Primary:** 142 71% 45% (Forest green - sustainability focus)
- **Primary Container:** 142 40% 90%
- **Secondary:** 200 18% 46% (Slate blue - professional, tech-forward)
- **Secondary Container:** 200 18% 95%
- **Surface:** 0 0% 99%
- **Surface Variant:** 0 0% 96%
- **Error:** 0 72% 51%
- **Success:** 142 76% 36% (deeper green for confirmed states)

### Dark Mode
- **Primary:** 142 60% 70%
- **Primary Container:** 142 71% 25%
- **Secondary:** 200 15% 70%
- **Secondary Container:** 200 18% 20%
- **Surface:** 0 0% 10%
- **Surface Variant:** 0 0% 17%
- **Background:** 0 0% 6%
- **Error:** 0 72% 60%
- **Success:** 142 70% 50%

**Accent:** 35 85% 55% (Warm amber - use only for rewards/payment indicators)

---

## Typography

**Font Family:** 
- Primary: 'Inter' (Google Fonts) - excellent readability for data tables
- Monospace: 'JetBrains Mono' - for product codes, transaction IDs, hashes

**Scale:**
- Display (Hero): 3.5rem / 700 weight
- H1 (Dashboard Headers): 2.5rem / 700 weight  
- H2 (Section Titles): 1.875rem / 600 weight
- H3 (Card Headers): 1.25rem / 600 weight
- Body Large: 1rem / 400 weight (line-height: 1.6)
- Body: 0.875rem / 400 weight (line-height: 1.5)
- Caption (Metadata): 0.75rem / 400 weight
- Code (Product IDs): 0.875rem / 500 weight (monospace)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Micro spacing (within components): 2, 4
- Component internal padding: 4, 6, 8
- Section spacing: 8, 12, 16
- Page margins: 8, 12, 16

**Grid System:**
- Dashboard layouts: 12-column grid with 6-unit gaps
- Card grids: 1-2-3 responsive columns (mobile-tablet-desktop)
- Data tables: Full-width with horizontal scroll on mobile

**Container Widths:**
- Max content width: max-w-7xl (dashboards)
- Forms/detail views: max-w-4xl
- Mobile scan interface: Full viewport

---

## Component Library

### Navigation
- **Top App Bar:** Fixed position with role indicator, user menu, notifications bell
- **Side Navigation (Desktop):** Persistent drawer for dashboard sections (80-unit width)
- **Bottom Nav (Mobile):** 4-5 primary actions for customer app
- **Breadcrumbs:** For deep navigation (admin workflows)

### Data Display
- **Data Tables:** Elevated cards with striped rows, sortable headers, pagination, row actions menu
- **Product Cards:** Medium elevation, image thumbnail, product code, status badge, quick actions
- **Transaction Timeline:** Vertical stepper showing blockchain-like chain with hash values
- **Status Badges:** Pill-shaped with role-based colors (manufactured=neutral, collected=primary, recycled=success)
- **Stats Cards:** Large numbers with icons, small trend indicators

### Forms
- **Input Fields:** Outlined style (Material), floating labels, helper text below
- **File Upload:** Drag-drop zone with CSV/Excel preview table
- **Scan Interface:** Full-screen camera view with centered reticle guide, manual entry fallback
- **Bulk Actions:** Checkbox selection with floating action bar

### Actions
- **Primary Buttons:** Filled with primary color (pickup, register, verify)
- **Secondary Buttons:** Outlined (cancel, back)
- **Icon Buttons:** Ghost style for row actions, filters
- **FAB (Mobile):** Bottom-right for primary action per screen (scan product, add item)

### Feedback
- **Snackbars:** Bottom-aligned notifications with action buttons
- **Dialogs:** Centered modals for confirmations, forms
- **Progress:** Linear for uploads, circular for loading states
- **Empty States:** Illustration + message + CTA for zero-data views

### Overlays
- **Modal Sheets:** Full-screen mobile, centered desktop for product details
- **Bottom Sheets (Mobile):** For filters, quick actions
- **Tooltips:** Minimal, only for icons or complex terms

---

## Role-Specific Dashboard Layouts

### Company Dashboard
- **Hero Stats Row:** 4 cards (total products, active, collected, revenue)
- **Quick Actions:** Upload single, bulk upload, view inventory
- **Recent Products Table:** Last 20 uploaded with status
- **Transaction History Chart:** Line graph showing collection trends

### Customer Dashboard  
- **Scan CTA Card:** Large, prominent with camera icon
- **Registered Items Grid:** Product cards with status and pickup options
- **Rewards Summary:** Accumulated points/payment with redemption CTA
- **Pickup Status:** Active requests with timeline

### Admin Dashboard
- **Metrics Overview:** 6-stat grid (pending verifications, active pickups, inventory count, batches sent, etc.)
- **Action Queue Tabs:** Companies to verify, pickups to assign, inventory to process
- **Map View (Optional):** Pickup locations visualization
- **Audit Log Table:** Chronological system events with filters

---

## Scanning Experience

**Mobile Camera Interface:**
- Full viewport camera feed
- Semi-transparent overlay with centered scanning reticle (rounded square)
- Top bar: Back button, flashlight toggle
- Bottom sheet: Manual entry option, scan history
- Success state: Green checkmark animation → slide up product details
- Error state: Red shake animation → retry or manual entry

**Product Validation Flow:**
1. Scan → Loading spinner (2s max)
2. Match found → Product card slides up with details + "Register for Collection" CTA
3. No match → Error message with "Try Again" or "Manual Entry" options

---

## Animations

**Minimal and Purposeful:**
- Page transitions: Simple fade (150ms)
- Card hover: Subtle lift with shadow increase
- Status changes: Badge color morph (300ms)
- Success states: Single checkmark animation
- Loading: Material circular progress only

**NO complex scroll animations, parallax, or decorative motion**

---

## Images

### Where Images Appear:
- **Product thumbnails** in cards and tables (square, 1:1 ratio)
- **Company logos** in profile headers (rectangular)
- **Empty state illustrations** (simple line art, sustainability-themed)
- **No hero images** - dashboards are utility-first, not marketing pages

### Image Treatment:
- Rounded corners (8-unit border radius)
- Subtle border in light mode for definition
- Lazy loading for table thumbnails
- Fallback: Product category icon on colored background

---

## Accessibility

- WCAG AA contrast ratios for all text
- Keyboard navigation for all interactive elements
- Screen reader labels for icon buttons
- Focus indicators: 2px primary color outline
- Error states: Icon + color + text (not color alone)
- Form validation: Inline errors below fields
- Dark mode: Properly inverted with adjusted contrast

---

## Special Considerations

**Transaction Chain Visualization:**
Display blockchain-mimic as expandable accordion with:
- Transaction ID (monospace)
- Previous hash link (truncated with copy button)
- Timestamp, actor, status
- Computed hash (collapsible)
- Visual connecting lines between transactions

**Bulk Upload Flow:**
1. Upload zone with CSV template download
2. Parsing progress bar
3. Preview table (editable) with validation errors highlighted
4. Confirm → Success summary with product count

**Inventory Batch Interface:**
- Multi-select product table with photos
- "Create Batch" action groups selected items
- Batch detail view shows all products, total quantity
- "Send to Recycling" button with confirmation dialog

This design system prioritizes clarity, efficiency, and sustainability aesthetics while providing robust patterns for complex data workflows across three distinct user roles.