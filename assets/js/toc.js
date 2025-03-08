/**
 * Table of Contents (TOC) Highlighter
 * Tracks scroll position and highlights the current section in the TOC
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    const tocLinks = document.querySelectorAll('.toc-sidebar a');
    const SCROLL_OFFSET = 100; // Adjust based on header height
    
    // Skip if no headings or TOC
    if (headings.length === 0 || tocLinks.length === 0) return;

    // Update active link in TOC based on scroll position
    const updateActiveTocLink = () => {
        // Find the heading that's currently in view
        let activeHeadingId = null;
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top - SCROLL_OFFSET <= 0) {
                activeHeadingId = heading.id;
            }
        });
        
        // Update active state in TOC
        tocLinks.forEach(link => {
            if (!link.classList.contains('toc-title-link')) {
                const isActive = link.getAttribute('href') === '#' + activeHeadingId;
                link.classList.toggle('active-toc-link', isActive);
            }
        });
    };
    
    // Throttle scroll event for performance
    let isThrottled = false;
    const handleScroll = () => {
        if (!isThrottled) {
            window.requestAnimationFrame(() => {
                updateActiveTocLink();
                isThrottled = false;
            });
            isThrottled = true;
        }
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial update
    updateActiveTocLink();
});