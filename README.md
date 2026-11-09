# Dreem Sabiniano: Motion portfolio website

Static site: HTML, CSS and vanilla JavaScript. No framework, no build step.

## Files
- `index.html`: responsive page structure
- `styles.css`: cream, charcoal and rose visual theme, layout, motion, `prefers-reduced-motion` support
- `content.js`: ALL editable copy, links, project data and image paths
- `script.js`: renders the page, interactive "Do you need a VA?" checklist, case-study details, tool marquee and scroll motion
- `project-*.png/svg`: poster images (fallback when a live preview can't load)

## Fill in before publishing (content.js)
- `links.calendly`: replace `[CALENDLY_LINK]`
- `availability.status`: adjust the availability wording to match your current schedule
- `availability.hours`: adjust your working hours if needed (currently Manila time, UTC+8)

The two Notion workspaces are listed first and marked as fictional-data portfolio samples. The case-study Problem, Findings and Result text describes the sample artifacts; it does not claim client outcomes.

## Add a project
Add an object to `projects.items` (title, category, description, problem, findings, result, poster, alt, url, preview). Set `sample: true` for portfolio samples.

## Publish with GitHub Pages
Upload everything to a repository root, then Settings > Pages > Deploy from branch (main, / root).
