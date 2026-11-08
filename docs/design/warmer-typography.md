# Warmer typography and simpler Home

Updated November 8, 2026.

Removed the recommended-position overlay from the hero photo and its controller/CSS references. Search, interest links, and the recommended list below the photo remain.

Researched Figtree and Source Sans 3 from their designers' repositories. Selected Figtree for its friendly shapes and used weight 600 for page/hero headings to replace the thin serif treatment. Body and interface text share the same family. The font is self-hosted, with the original OFL license, and preloaded in place of Source Serif 4. CWRU Blue and the single-column browse layout are unchanged.

Source and licensing details are in branding-assets.md.

Verification: JavaScript syntax checks passed. Code review identified an obsolete preload, which was corrected; no stale overlay DOM references remain. Browser confirmed Figtree loaded at heading weight 600, the overlay was absent, and Home search still returned the expected genetics role. Desktop Home and mobile Home/Jobs had no horizontal document overflow. Previews are artifacts/showcase/figtree-home.png and artifacts/showcase/figtree-home-mobile.png.
