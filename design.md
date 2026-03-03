## Header Design (Universal Component)
- **Layout Adjustments**: Navigation links are grouped to the right alongside the Call-to-Action button.
- **Styling**: `sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border/50 bg-background/80 backdrop-blur-md px-6 py-4 md:px-10 lg:px-40`.
- **Logo**: 
  - Text: **Sugam Pudasaini** (`text-xl font-bold leading-tight tracking-[-0.015em]`)
  - Icon: A **Bot** icon (`lucide-react`) sized at `size-8 text-primary`.
- **Navigation Links**: Home, About, Skills, Projects using precise Stitch typography classes `text-sm font-medium leading-normal hover:text-primary transition-colors`.
- **Call-to-Action**:
  - Button: **Hire Me** 
  - Color adjustment: Primary blue hover effect using exact Stitch classes (`bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold`).

## Hero Section Design
- **Layout**: Two-column layout (Text on left, Image/Graphic on right) with a flex container `max-w-[960px]`.
- **Left Column**:
  - Status Badge: Small pill with a green dot and text "AVAILABLE FOR WORK".
  - Headline: "I build intelligent UI and web applications" (with "UI" in a `bg-gradient-to-r from-primary to-blue-300` gradient).
  - Subheadline: "Hi, I'm Sugam. An AI & Software Engineer turning complex problems into scalable solutions through modern frameworks and agentic systems."
  - Buttons: "View Projects" (Primary Blue with shadow) and "Contact Me" (Outline bg-surface-dark).
  - **Animations**: Uses Framer Motion to slide text content in from the left (`x: -20` to `x: 0`).
- **Right Column**:
  - Main Visual: Exact extracted image URL serving as an `aspect-square bg-cover` background. Scaled down slightly based on user request.
  - Overlay Card: Small floating glassmorphic card showing "System Architecture".
  - **Animations**: Framer motion entrance scaling and a continuous floating `y: [0, -10, 0]` loop (`repeat: Infinity`).

## About Me Section Design
- **Section Title**: Centered small badge/header "About Me" flanked by subtle horizontal border lines (`h-px bg-border/50`).
- **Layout**: Two-column grid layout with exact padding/margins from Stitch HTML.
- **Left Column**:
  - Title: "From Nepal to Global Tech"
  - Bio Text: "I am a passionate developer originally from Nepal..." using `text-muted-foreground text-lg leading-relaxed`.
  - Links: Social icons wrapped in simplified hover transitions.
- **Right Column (Bento Box style grid)**:
  - Container: 2-column grid.
  - Cards: "Education", "Background", "Focus". Styled with `border-border/50 bg-surface-dark p-5 rounded-xl hover:border-primary/50`.
  - **Animations**: Staggered `whileInView` scroll entrance using Framer Motion `Variants`.

## Technical Expertise Section Design
- **Section Title**: Centered small badge/header "Technical Expertise" flanked by subtle horizontal border lines.
- **Layout**: Three-column grid using `grid-cols-1 md:grid-cols-3 gap-6`.
- **Card Styling Guidelines**:
  - Consistent dark background (`bg-surface-dark overflow-hidden`), precise border colors on top.
  - Hover states utilize matching neon glow effect (e.g., `hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-cyan-400/50`).
- **Category 1: Core Engineering**:
  - Top Border: `bg-gradient-to-r from-blue-500 to-cyan-400`
- **Category 2: AI & Agentic Dev**:
  - Top Border: `bg-gradient-to-r from-primary to-purple-500`
- **Category 3: AI Frameworks**:
  - Top Border: `bg-gradient-to-r from-purple-500 to-pink-500`
- **Animations**: Cards animate upwards sequentially (`y: 30` to `y: 0`, `staggerChildren: 0.15`) as they enter the viewport.

## Footer Design (Universal Component)
- **Styling**: `border-t border-border/50 bg-surface-dark/50 backdrop-blur-sm pt-12 pb-8` acting as a universal component.
- **Logo & Information**:
  - Logo: A **Bot** icon without a solid fill (matching Header).
  - Tagline: "Building intelligent systems and scalable software solutions."
- **Contact & Socials**:
  - Social Links: GitHub, LinkedIn, Twitter/X SVG icons.
  - Email: `hello@sugam.com`
- **Copyright & Bottom Bar**: 
  - Text: `© 2024 Sugam Pudasaini. All rights reserved.`
  - Integrated `Built with <Zap> intelligence` matching the Stitch DOM exactly.

## Screen Reference & IDs
| Page Title | Screen ID | Description |
| :--- | :--- | :--- |
| Portfolio Home & Skills | `36f702a1ed1748f199db31ec32f88cad` | Main landing page showcasing skills and overview. |
| Projects with Pagination | `c691bc0fec1a4d9ea1a452eb27187e99` | Projects Showcase page containing Filter Tabs, Featured Project, Project Grid and Bottom Pagination styling. |
| Blog with Search Bar | `70d2725a15d041bba6c60ec47badcf63` | Insights Blog Page containing a Shadcn Searchbar input, Topic Filtering, and a Grid mapping custom BlogCards. |
| Work Experience Empty State | `6ff635f3afe244c3a1a0be051afe5b64` | The "Open to Work" experience layout complete with a glowing rocket animation and tech-stack floating icons. |
| Contact Page | `a4bbb31a9b0f4cab8a0f9bd82189618a` | The main form containing "Get in Touch", Location bindings, and integrated shadcn Zod-checked interactive `<Form>`. |
