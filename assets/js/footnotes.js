/**
 * Footnotes.js
 * Handles footnote hover and display functionality
 */
const Footnotes = {
  timeout: false,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

  // Initialize footnote events
  init: function() {
    document.querySelectorAll(".footnote").forEach(link => {
      if (this.isMobile) {
        link.addEventListener('click', this.handleMobileClick);
      } else {
        link.addEventListener('mouseover', this.handleMouseOver);
        link.addEventListener('mouseout', this.handleMouseOut);
      }
    });
  },

  // Handle desktop mouseover event
  handleMouseOver: function(event) {
    event.preventDefault();
    clearTimeout(Footnotes.timeout);
    Footnotes.createTooltip(this);
  },

  // Handle mobile click event
  handleMobileClick: function(event) {
    event.preventDefault();
    const id = this.getAttribute('href').substr(1);
    const footnote = document.getElementById(id);
    if (footnote) {
      footnote.scrollIntoView({ behavior: 'auto' });
    }
  },

  // Create tooltip with footnote content
  createTooltip: function(element) {
    // Remove existing tooltip if present
    document.getElementById('footnotediv')?.remove();
    
    // Get footnote content
    const id = element.getAttribute('href').substr(1);
    const content = document.getElementById(id);
    if (!content) return;

    // Create tooltip div
    const div = document.createElement('div');
    div.id = 'footnotediv';
    div.innerHTML = content.innerHTML.replace(/<a\s+href="#fnref[^"]*"[^>]*>↩<\/a>/, '').trim();
    div.style.cssText = 'position:fixed; max-width:400px; width:max-content;';
    
    document.body.appendChild(div);
    Footnotes.positionTooltip(element, div);

    // Add event listeners
    div.addEventListener('mouseover', () => clearTimeout(Footnotes.timeout));
    div.addEventListener('mouseout', Footnotes.handleMouseOut);
  },

  // Position tooltip near the footnote reference
  positionTooltip: function(element, div) {
    const elementRect = element.getBoundingClientRect();
    const divRect = div.getBoundingClientRect();
    
    // Default position
    let left = elementRect.left + 10;
    let top = elementRect.bottom + 5;

    // Adjust if tooltip would go off-screen
    if (left + divRect.width > window.innerWidth - 10) {
      left = window.innerWidth - divRect.width - 10;
    }

    if (top + divRect.height > window.innerHeight - 10) {
      top = elementRect.top - divRect.height - 5;
    }

    // Ensure tooltip isn't off the left edge
    left = Math.max(10, left);

    div.style.left = left + 'px';
    div.style.top = top + 'px';
  },

  // Handle mouseout event
  handleMouseOut: function() {
    Footnotes.timeout = setTimeout(() => {
      document.getElementById('footnotediv')?.remove();
    }, 100);
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => Footnotes.init());