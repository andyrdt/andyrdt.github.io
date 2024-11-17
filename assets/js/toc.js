document.addEventListener('DOMContentLoaded', function() {
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    const tocLinks = document.querySelectorAll('.toc-sidebar a');
    const offset = 100; // Adjust this value based on your header height or desired offset

    // Map headings by their IDs for quick access
    const headingMap = {};
    headings.forEach(heading => {
        headingMap[heading.id] = heading;
    });

    // Function to update the active ToC link
    const updateToc = () => {
        let currentHeadingId = null;

        // Find the heading closest to the top of the viewport
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top - offset <= 0) {
                currentHeadingId = heading.id;
            }
        });

        // Update TOC links
        tocLinks.forEach(link => {
            if (!link.classList.contains('toc-title-link')) {
                if (link.getAttribute('href') === '#' + currentHeadingId) {
                    link.classList.add('active-toc-link');
                } else {
                    link.classList.remove('active-toc-link');
                }
            }
        });
    };

    // Throttle the scroll event handler for performance
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateToc();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    // Initial update on page load
    updateToc();
});