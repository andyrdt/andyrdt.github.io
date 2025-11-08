---
layout: default
permalink: /notes
title: "Notes"
show_in_nav: false
---

## Notes
*This is a rough collection of notes on various technical topics.*
*These notes will always be incomplete, and a work in progress.*
*Additionally, many of these notes are just my reformulation of existing work - see the "Sources" section in each note to see the original source of the material.*

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
          {% assign rendered_content = note.content | markdownify %}
          {% include note-sections.html html=rendered_content note_url=note.url %}
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
          {% assign rendered_content = note.content | markdownify %}
          {% include note-sections.html html=rendered_content note_url=note.url %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endif %}