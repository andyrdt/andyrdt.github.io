---
layout: default
permalink: /posts
title: "Posts"
show_in_nav: true
---

## Blog posts
{%- if site.posts.size > 0 -%}
  <ul class="post-list">
    {%- for post in site.posts -%}
    <li>
      {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
      <span class="post-meta">{{ post.date | date: date_format }}</span>
      <h3>
        {%- if post.external_url -%}
          <a class="post-link" href="{{ post.external_url | relative_url }}">
            <img src="{{ post.external_site_logo_path }}" class="external-site-logo"> {{ post.title | escape }}
          </a>
        {% else %}
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        {%- endif -%}
      </h3>
      {%- if site.show_excerpts -%}
        {{ post.excerpt }}
      {%- endif -%}
    </li>
    {%- endfor -%}
  </ul>
{%- endif -%}