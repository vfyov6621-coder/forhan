---
Task ID: 1
Agent: Main Agent
Task: UI overhaul to match X.com's design for the Forhan social network

Work Log:
- Analyzed 3 user screenshots: current Forhan site, итд.com reference, and actual X.com
- Read all existing component files to understand current UI structure
- Redesigned globals.css with X.com-perfect color variables, scrollbar styling, tab underline animations, post-action hover classes
- Redesigned left-sidebar.tsx with custom SVG icons matching X.com's nav icons, added more nav items (notifications, messages, bookmarks), X.com style logo (X-like F)
- Redesigned right-panel.tsx with Subscribe/Premium banner, proper trending topics section, Who to follow section, X.com footer links
- Updated page.tsx main layout with proper 3-column structure (sidebar + bordered main + right panel)
- Updated home-page.tsx with backdrop-blur header, proper X.com tab underline animation
- Updated post-composer.tsx with show-on-focus action bar, X.com-style outlined post button when empty
- Updated post-card.tsx with custom SVG action icons (comment bubble, repost arrows, heart, share), X.com hover effects
- Updated login-page.tsx with centered single-column design matching X.com's login
- Updated register-page.tsx with matching centered design
- Updated mobile-nav.tsx with X.com slide-out drawer, proper bottom nav with icons only
- Updated profile-page.tsx with backdrop-blur sticky headers, X.com gradient banner
- Updated settings-page.tsx with consistent X.com hover and color styling
- Updated search-page.tsx with rounded search input and consistent styling
- Updated post-detail-page.tsx with consistent comment styling
- Updated admin-page.tsx with consistent card styling and hover effects

Stage Summary:
- All components now use CSS variables (var(--fg), var(--bg-primary), etc.) for theming
- Hover effects use inline onMouseOver/onMouseOut for smooth X.com-like transitions
- The F logo is styled similar to X.com's X logo (using the same SVG path structure)
- Colors match X.com dark mode exactly: #000000 bg, #16181c card, #1D9BF0 accent, #E7E9EA text, #71767B secondary
- All rounded corners, font sizes, spacing match X.com's actual design
- Build successful, server running on port 3000
