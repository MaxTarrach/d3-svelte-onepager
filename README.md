# D3 + Svelte one-page template

A single scrolling page, one chart per section.

## Run it

```
npm install
npm run dev
```

## Layout

```
src/
  App.svelte             assembles the page: header + one <Section> per chart
  app.css                 palette tokens (light/dark), reused by every chart
  lib/
    Section.svelte        heading + deck text + chart card wrapper
    StatRow.svelte         hero stat tiles with sparklines
    axis.js                shared Svelte action that draws a D3 axis
    data.js                placeholder datasets — swap these for real data
    charts/
      BarChart.svelte
      LineChart.svelte
      AreaChart.svelte
      ScatterChart.svelte
      DonutChart.svelte
```

Each chart component is self-contained: it takes a `data` prop, is
responsive (`bind:clientWidth`), and reads all color from the CSS custom
properties defined in `app.css` — so re-theming means editing one file, not
five. Add a new section by importing a chart, adding real data to
`data.js`, and dropping both into a new `<Section>` in `App.svelte`.

The header's theme button cycles `auto → light → dark` to demonstrate the
color system in both modes.
