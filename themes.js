/* ================================================
   DesignForge AI — Theme Definitions
   12+ curated design themes with metadata
   ================================================ */

const THEMES = [
    {
        id: 'dark-luxury',
        emoji: '🌙',
        name: 'Dark Luxury',
        description: 'Deep blacks, gold accents, serif typography, premium feel',
        gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        accentBar: 'linear-gradient(90deg, #c9a84c, #f0d78c)',
        prompt: `Design theme: DARK LUXURY. Use a deep dark color palette (#0a0a0f, #111118, #1a1a28) with luxurious gold/champagne accents (#c9a84c, #f0d78c). Typography: Use elegant serif fonts like Georgia or Playfair Display for headings, paired with a clean sans-serif for body text. Spacing should be generous and elegant. Add subtle gold gradient borders, refined hover effects with gold glows. Premium card designs with dark glass surfaces. Minimal but impactful animations. Think: high-end fashion brand or luxury hotel website.`
    },
    {
        id: 'glassmorphism',
        emoji: '🔮',
        name: 'Glassmorphism',
        description: 'Frosted panels, blur effects, translucent layers',
        gradient: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        accentBar: 'linear-gradient(90deg, #818cf8, #a78bfa)',
        prompt: `Design theme: GLASSMORPHISM. Create frosted glass panels using backdrop-filter: blur(16px) with semi-transparent backgrounds (rgba(255,255,255,0.05) to rgba(255,255,255,0.1)). Use subtle 1px borders with rgba(255,255,255,0.1). Background should have vivid gradient blobs/orbs floating behind the glass panels. Color palette: deep indigo/violet backgrounds with light purple and pink accents. Use Inter or similar modern sans-serif. Add smooth hover transitions where glass becomes slightly more opaque. Think: Apple Vision Pro UI or modern dashboard design.`
    },
    {
        id: 'ocean-gradient',
        emoji: '🌊',
        name: 'Ocean Flow',
        description: 'Blue-green gradients, wave animations, fluid design',
        gradient: 'linear-gradient(135deg, #0c4a6e, #155e75)',
        accentBar: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
        prompt: `Design theme: OCEAN FLOW. Use a palette inspired by the ocean: deep navy (#0c1445), teal (#0d9488), cyan (#06b6d4), aquamarine (#2dd4bf). Create flowing, organic shapes using CSS border-radius and clip-path. Add subtle wave-like animations using CSS keyframes. Backgrounds should feature gradient waves or undulating shapes. Typography should be clean and modern. Use soft box-shadows with blue tints. Cards should have rounded corners and subtle blue glows on hover. Think: marine biology website or tropical resort.`
    },
    {
        id: 'neon-cyberpunk',
        emoji: '🔥',
        name: 'Neon Cyberpunk',
        description: 'Electric colors, glitch effects, monospace font',
        gradient: 'linear-gradient(135deg, #0f0f23, #1a0a2e)',
        accentBar: 'linear-gradient(90deg, #f43f5e, #fb7185, #e879f9)',
        prompt: `Design theme: NEON CYBERPUNK. Ultra-dark background (#0a0a0f, #0f0f1a) with VIVID neon accents in hot pink (#f43f5e), electric purple (#c026d3), neon green (#22c55e), and cyan (#06b6d4). Use monospace fonts like JetBrains Mono or Fira Code for a hacker aesthetic. Add glowing text-shadow effects for headings with neon colors. Use sharp, geometric shapes with hard borders. Implement scanline or glitch CSS effects. Neon-glow box-shadows on hover. Add a subtle grid/matrix background pattern. Think: cyberpunk game UI or hacker terminal.`
    },
    {
        id: 'natural-organic',
        emoji: '🌿',
        name: 'Natural Organic',
        description: 'Earth tones, soft curves, handwritten accents',
        gradient: 'linear-gradient(135deg, #1a2e1a, #2d3b2d)',
        accentBar: 'linear-gradient(90deg, #4ade80, #86efac)',
        prompt: `Design theme: NATURAL ORGANIC. Warm, earthy color palette: cream/beige backgrounds (#faf7f2, #f5f0e8), forest green (#166534, #15803d), terracotta (#c2410c), warm browns. Use soft, organic shapes with large border-radius values. Typography: a humanist sans-serif like Nunito or a gentle serif for headings. Include nature-inspired decorative elements (leaf shapes via CSS, organic blob shapes). Warm, inviting spacing. Subtle texture backgrounds. Cards with soft shadows and rounded edges. Think: organic food brand or wellness retreat.`
    },
    {
        id: 'corporate-clean',
        emoji: '🏢',
        name: 'Corporate Clean',
        description: 'Professional whitespace, structured grids, trustworthy',
        gradient: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        accentBar: 'linear-gradient(90deg, #2563eb, #3b82f6)',
        prompt: `Design theme: CORPORATE CLEAN. Professional, trustworthy design with a white/light gray background (#ffffff, #f8fafc, #f1f5f9). Primary accent: professional blue (#2563eb). Use a structured grid system with consistent spacing (multiples of 8px). Typography: Inter or Roboto with clear hierarchy. Clean card designs with subtle borders and small box-shadows. Navigation should be conventional and easy to scan. Include trust elements: clean CTAs, organized sections, professional iconography using clean SVG icons. Minimize decorative elements. Think: Microsoft, Stripe, or enterprise SaaS.`
    },
    {
        id: 'creative-agency',
        emoji: '🎨',
        name: 'Creative Agency',
        description: 'Bold typography, asymmetric layouts, experimental',
        gradient: 'linear-gradient(135deg, #fef08a, #fbbf24)',
        accentBar: 'linear-gradient(90deg, #f43f5e, #fbbf24, #34d399)',
        prompt: `Design theme: CREATIVE AGENCY. Bold, unconventional design with oversized typography, asymmetric layouts, and unexpected color combinations. Use a vibrant palette mixing warm and cool tones. Extra-large headings with mix-blend-mode effects. Unconventional grid layouts with overlapping elements. Strong visual hierarchy through scale contrast. Add creative hover effects and cursor interactions via CSS. Use bold font weights (800, 900). Experiment with CSS transforms for tilted/rotated elements. Think: award-winning design agency or art gallery.`
    },
    {
        id: 'music-audio',
        emoji: '🎵',
        name: 'Music / Audio',
        description: 'Waveforms, equalizer elements, dark with neon accent',
        gradient: 'linear-gradient(135deg, #0f0f1a, #1a0a2e)',
        accentBar: 'linear-gradient(90deg, #a855f7, #7c3aed)',
        prompt: `Design theme: MUSIC / AUDIO. Dark background (#0a0a10, #111118) with vibrant accent colors — electric purple (#a855f7), hot pink (#ec4899), or neon blue (#3b82f6). Include music-related visual elements: CSS-animated equalizer bars, waveform-style decorative borders, circular album-art-style components. Use modern sans-serif fonts. Audio player-inspired UI elements with progress bars, play buttons. Genre badges with pill-shaped tags. Grid layouts for beat/track cards with hover animations. Think: Spotify, SoundCloud, or BeatStars premium.`
    },
    {
        id: 'minimalist-premium',
        emoji: '💎',
        name: 'Minimalist Premium',
        description: 'Swiss design, extreme whitespace, type-focused',
        gradient: 'linear-gradient(135deg, #fafafa, #e5e5e5)',
        accentBar: 'linear-gradient(90deg, #18181b, #3f3f46)',
        prompt: `Design theme: MINIMALIST PREMIUM. Ultra-clean Swiss-inspired design. White background with vast negative space. Monochrome palette — pure white (#ffffff), warm gray (#fafafa), charcoal (#18181b), with ONE subtle accent color used very sparingly. Large, confident typography with extreme size contrast between headings and body. Minimal borders (use spacing instead). No shadows or very subtle ones. Precise grid alignment. Content-first approach. Refined micro-interactions: subtle underline animations, opacity transitions. Think: Apple product pages or high-end furniture brand.`
    },
    {
        id: 'saas-modern',
        emoji: '🚀',
        name: 'SaaS Modern',
        description: 'Gradient CTAs, feature cards, testimonials, dashboards',
        gradient: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        accentBar: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        prompt: `Design theme: SAAS MODERN. Contemporary SaaS landing page design. Light or dark mode with a vibrant indigo/violet accent gradient (#6366f1 to #8b5cf6). Include common SaaS patterns: hero with gradient CTA button, feature grid with icon cards, pricing table with highlighted "popular" tier, testimonial carousel, FAQ accordion, newsletter signup. Use subtle gradients, rounded corners (12-16px), soft shadows. Trust badges and social proof elements. Responsive grid layouts. Smooth scroll animations. Think: Vercel, Linear, or Notion marketing pages.`
    },
    {
        id: 'photography',
        emoji: '📸',
        name: 'Photography',
        description: 'Full-bleed images, gallery grids, cinematic overlays',
        gradient: 'linear-gradient(135deg, #18181b, #27272a)',
        accentBar: 'linear-gradient(90deg, #fafafa, #a1a1aa)',
        prompt: `Design theme: PHOTOGRAPHY. Image-centric design with full-bleed hero images, masonry/grid gallery layouts, and cinematic text overlays. Very dark background (#0a0a0a) to make images pop. Minimal UI — let the photos be the hero. Use subtle white or light gray text with text-shadow for readability over images. Lightbox-style interactions. Elegant, thin typography (font-weight: 300). Add CSS filter effects on hover (brightness, grayscale transitions). Image captions with overlays that slide in on hover. Think: National Geographic or professional photographer portfolio.`
    },
    {
        id: 'ecommerce',
        emoji: '🛒',
        name: 'E-Commerce',
        description: 'Product cards, trust badges, conversion-focused',
        gradient: 'linear-gradient(135deg, #fefce8, #fef9c3)',
        accentBar: 'linear-gradient(90deg, #ea580c, #f97316)',
        prompt: `Design theme: E-COMMERCE. Conversion-optimized design with clean product card layouts, prominent CTAs (orange/green for "Buy" buttons), trust badges, star ratings, and price displays. White or very light background for product visibility. Structured grid for product listings. Include shopping-specific UI: sale banners, "Add to Cart" buttons with microinteractions, breadcrumbs, filter sidebars, comparison features. Use urgency elements (limited stock indicators, countdown timers with CSS animations). Think: Shopify store or Amazon-quality product pages.`
    }
];

// Make themes available globally
window.THEMES = THEMES;
