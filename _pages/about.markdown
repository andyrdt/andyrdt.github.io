---
layout: default
permalink: /about
title: "About"
show_in_nav: true
---
<style>
  .gallery-img:hover {
    transform: scale(1.03);
  }
</style>

## About

<div>
  <div style="display: flex; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 60%;">
      <p>
        I earned my bachelor's from Columbia University in 2018, where I studied computer science and mathematics.
        After graduating, I moved to Seattle to work as a software engineer at Microsoft.
        In 2020, I returned to Columbia University for my master's, focusing on theoretical computer science.
        During this period, I became interested in <a href="https://en.wikipedia.org/wiki/Zero-knowledge_proof">zero-knowledge cryptography</a>, and eventually went on to work for <a href="https://scroll.io">Scroll</a>, a startup applying this technology in the blockchain space.</p>
      <p>
        As of August 2023, I've shifted my focus towards <a href="https://distill.pub/2020/circuits/zoom-in/">AI interpretability</a>.
        Modern AI systems have become incredibly impressive, and yet their inner workings are still poorly understood.
        There is a lot of work to be done towards understanding the capabilities and limitations of these systems, and I want to try and contribute to this effort.
      </p>
      <p>
        Outside of work, I spend a lot of time across various hobbies.
        I love jazz music - I'm a decent tenor player, and a much worse piano player.
        Chess is a more recent hobby of mine, and I mostly play online.
        I like to run - I <a href="https://results.svetiming.com/Big-Sur/events/2023/Big-Sur-International-Marathon/3156/entrant/share">ran</a> my first marathon in April 2023.
        I'm also a big <a href="https://en.wikipedia.org/wiki/Fenerbah%C3%A7e_S.K._(football)">Fenerbahçe</a> fan.
      </p>

      <h2>Now</h2>
      <p><em>(Last updated: September 2025)</em></p>
      <p>I'm currently based in Boston, where I'm working on interpretability in the <a href="https://baulab.info/">Bau Lab</a>.</p>

      <h2><a href="https://youtu.be/JQvc-Gkwhow" class="hidden-link">My favorite things</a></h2>
      <ul>
        <li><a href="/favorites/quotes">Favorite quotes</a></li>
        <li><a href="/favorites/records">Favorite records</a></li>
      </ul>
    </div>
    <div id="image-gallery" style="max-width: 190px; margin-left: 40px; margin-top: 0px; flex-basis: content">
      <figure>
        <img  src="/assets/images/about/littlefish.jpg" data-fullsize="/assets/images/about/big_fish.jpg" class="gallery-img" style="border-radius: 3px; cursor: pointer; transition: transform 0.2s;">
          <figcaption class="image-caption">
            I am fond of this little fish.<br>
            [<a href="https://www.metmuseum.org/art/collection/search/338694" style="color: inherit; white-space: nowrap;"><i>Big Fish Eat Little Fish</i> - Pieter Bruegel</a>]
          </figcaption>
      </figure>
      <figure style="padding-top: 20px;">
        <img src="/assets/images/about/thinker.jpg" class="gallery-img" style="border-radius: 3px; cursor: pointer; transition: transform 0.2s;"/>
        <figcaption class="image-caption">
          I think so, but I'm not sure.<br>
          [<a href="https://www.metmuseum.org/art/collection/search/191811" style="color: inherit; white-space: nowrap;"><i>The Thinker</i> - Auguste Rodin</a>]
        </figcaption>
      </figure>
      <figure style="padding-top: 20px;">
        <img src="/assets/images/about/glasses.jpg" class="gallery-img" style="border-radius: 3px; cursor: pointer; transition: transform 0.2s;"/>
        <figcaption class="image-caption">
          I am always confused.<br>
          [<a href="https://frisson.site.seattleartmuseum.org/the-collection/francis-bacon-portrait-of-man-with-glasses-i-1963/" style="color: inherit; white-space: nowrap;"><i>Portrait of Man with Glasses I</i> - Francis Bacon</a>]
        </figcaption>
      </figure>
      <figure style="padding-top: 20px;">
        <img src="/assets/images/about/seated_man.jpg" class="gallery-img" style="border-radius: 3px; cursor: pointer; transition: transform 0.2s;"/>
        <figcaption class="image-caption">
          I like to sit with my legs crossed.<br>
          [<a href="https://www.tate.org.uk/art/artworks/giacometti-seated-man-n05909" style="color: inherit; white-space: nowrap;"><i>Seated Man</i> - Alberto Giacometti</a>]
        </figcaption>
      </figure>
    </div>
  </div>
</div>

<script>
  // Randomize image order on page load
  const gallery = document.getElementById('image-gallery');
  const figures = Array.from(gallery.children);
  figures.sort(() => Math.random() - 0.5);
  figures.forEach(fig => gallery.appendChild(fig));

  // Create lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:1000; cursor:default; align-items:center; justify-content:center;';
  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = 'max-width:90%; max-height:90%; object-fit:contain; cursor:default;';
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  // Add click handlers to images
  gallery.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.dataset.fullsize || img.src;
      lightbox.style.display = 'flex';
    });
  });

  // Close lightbox on click
  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  // Close lightbox on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      lightbox.style.display = 'none';
    }
  });
</script>

<!-- This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](https://jekyllrb.com/)

You can find the source code for Minima at GitHub:
[jekyll][jekyll-organization] /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at GitHub:
[jekyll][jekyll-organization] /
[jekyll](https://github.com/jekyll/jekyll)


[jekyll-organization]: https://github.com/jekyll -->
