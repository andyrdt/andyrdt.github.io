var Footnotes = {
  footnotetimeout: false,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

  setup: function() {
      document.querySelectorAll(".footnote").forEach(function(link) {
          if (!Footnotes.isMobile) {
              link.addEventListener('mouseover', Footnotes.footnoteover);
              link.addEventListener('mouseout', Footnotes.footnoteoout);
          } else {
              link.addEventListener('click', Footnotes.footnoteclickMobile);
          }
      });
  },

  footnoteover: function(event) {
      event.preventDefault();
      clearTimeout(Footnotes.footnotetimeout);
      Footnotes.createFootnoteDiv(this);
  },

  footnoteclickMobile: function(event) {
      event.preventDefault();
      var id = this.getAttribute('href').substr(1);
      var footnote = document.getElementById(id);
      if (footnote) {
          footnote.scrollIntoView({ behavior: 'auto' });
      }
  },

  createFootnoteDiv: function(element) {
      document.getElementById('footnotediv')?.remove();
      
      var id = element.getAttribute('href').substr(1);
      var content = document.getElementById(id);
      if (!content) return;

      var contentHtml = content.innerHTML.replace(/<a\s+href="#fnref[^"]*"[^>]*>↩<\/a>/, '').trim();
      
      var div = document.createElement('div');
      div.id = 'footnotediv';
      div.innerHTML = contentHtml;
      div.style.cssText = 'position:fixed; max-width:400px; width:max-content;';
      
      document.body.appendChild(div);

      Footnotes.positionFootnoteDiv(element, div);

      div.addEventListener('mouseover', Footnotes.divover);
      div.addEventListener('mouseout', Footnotes.footnoteoout);
  },
  positionFootnoteDiv: function(element, div) {
    var rect = element.getBoundingClientRect();
    var divRect = div.getBoundingClientRect();
    
    // Position the top-left corner of the box near the footnote link
    var left = rect.left + 10; // 10px offset from the left edge of the footnote
    var top = rect.bottom + 5; // 5px below the footnote

    // Adjust if too close to the right edge
    if (left + divRect.width > window.innerWidth - 10) {
        left = window.innerWidth - divRect.width - 10;
    }

    // Adjust if too close to the bottom edge
    if (top + divRect.height > window.innerHeight - 10) {
        top = rect.top - divRect.height - 5; // Place above the footnote
    }

    // Ensure it doesn't go off the left edge
    left = Math.max(10, left);

    div.style.left = left + 'px';
    div.style.top = top + 'px';
  },

  footnoteoout: function() {
      Footnotes.footnotetimeout = setTimeout(function() {
          document.getElementById('footnotediv')?.remove();
      }, 100);
  },

  divover: function() {
      clearTimeout(Footnotes.footnotetimeout);
  }
};

document.addEventListener('DOMContentLoaded', Footnotes.setup);