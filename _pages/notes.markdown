---
layout: default
permalink: /notes
title: "Notes"
show_in_nav: true
---

## Notes
*This is a rough collection of notes on various technical topics, inspired by Victor Lecomte's [notes](https://victorlecomte.com/notes/).*
*These notes will always be incomplete, and a work in progress.*
*Additionally, many of these notes are just my reformulation of existing work - see the "Sources" section in each note to see the original source of the material.*

<!-- ### Linear Algebra
{% assign linear_algebra_notes = site.notes | where: "category", "linear_algebra" %}
{% if linear_algebra_notes.size > 0 %}
  <ul class="note-list">
    {% for note in linear_algebra_notes %}
      {% if note.display != false %}
        <li>
          <h3>
            <a class="note-link" href="{{ note.url | relative_url }}">
              {{ note.title | escape }}
            </a>
          </h3>
          {% if site.show_excerpts %}
            {{ note.excerpt }}
          {% endif %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endif %} -->

### Probability
{% assign probability_notes = site.notes | where: "category", "probability" %}
{% if probability_notes.size > 0 %}
  <ul class="note-list">
    {% for note in probability_notes %}
      {% if note.display != false %}
        <li>
          <h3>
            <a class="note-link" href="{{ note.url | relative_url }}">
              {{ note.title | escape }}
            </a>
          </h3>
          {% if site.show_excerpts %}
            {{ note.excerpt }}
          {% endif %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endif %}

### AI / ML
{% assign ai_notes = site.notes | where: "category", "ai" %}
{% if ai_notes.size > 0 %}
  <ul class="note-list">
    {% for note in ai_notes %}
      {% if note.display != false %}
        <li>
          <h3>
            <a class="note-link" href="{{ note.url | relative_url }}">
              {{ note.title | escape }}
            </a>
          </h3>
          {% if site.show_excerpts %}
            {{ note.excerpt }}
          {% endif %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endif %}

<!-- ### Other Notes
<ul class="note-list">
  {% for note in site.notes %}
    {% if note.display != false %}
      {% if note.category != "linear_algebra" and note.category != "probability" and note.category != "ai"%}
        <li>
          <h3>
            <a class="note-link" href="{{ note.url | relative_url }}">
              {{ note.title | escape }}
            </a>
          </h3>
          {% if site.show_excerpts %}
            {{ note.excerpt }}
          {% endif %}
        </li>
      {% endif %}
    {% endif %}
  {% endfor %}
</ul> -->