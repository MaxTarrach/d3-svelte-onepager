<script>
  import * as d3 from "d3";
  import { axis } from "../axis.js";

  // shape: { series: string, points: { x: number, y: number }[], featured: boolean }[]
  // `featured` series get a fixed categorical hue + a direct end label; the rest
  // render muted (identity stays reachable through hover, per the many-series
  // "emphasis" pattern — a distinct hue per series doesn't scale past ~8).
  export let data = [];

  const margin = { top: 24, right: 118, bottom: 32, left: 40 };
  const height = 680;
  // featuredSeries is ascending by latest value, so index 3 is the top
  // emitter — the subject of the figure, so it's the only line that gets
  // the magenta. The other three featured lines recede into a dark-to-mid
  // slate ramp; unfeatured lines get the palest neutral.
  const seriesColor = [
    "var(--s-800)",
    "var(--s-600)",
    "var(--s-500)",
    "var(--magenta)",
  ];
  const mutedColor = "var(--s-300)";

  let width = 600;
  let svgEl;

  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  $: allPoints = data.flatMap((s) => s.points);
  $: featuredSeries = data.filter((s) => s.featured);
  $: mutedCount = data.length - featuredSeries.length;

  function colorOf(s) {
    if (!s.featured) return mutedColor;
    const idx = featuredSeries.indexOf(s);
    return seriesColor[idx % seriesColor.length];
  }

  $: xScale = d3
    .scaleLinear()
    .domain(d3.extent(allPoints, (d) => d.x))
    .range([0, innerWidth]);

  $: yScale = d3
    .scaleLinear()
    .domain([0, d3.max(allPoints, (d) => d.y) * 1.1])
    .range([innerHeight, 0])
    .nice();

  $: lineGen = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);

  $: bisect = d3.bisector((d) => d.x).left;

  // End labels can collide when several featured series end at similar values
  // (e.g. Fiji/French Polynesia in 2024) — nudge apart, keep the end-dot at
  // the true value so only the text label moves.
  const LABEL_GAP = 14;
  $: labelY = (() => {
    const items = featuredSeries
      .map((s) => ({ s, y: yScale(s.points[s.points.length - 1].y) }))
      .sort((a, b) => a.y - b.y);
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < LABEL_GAP) {
        items[i].y = items[i - 1].y + LABEL_GAP;
      }
    }
    for (let i = items.length - 2; i >= 0; i--) {
      if (items[i + 1].y - items[i].y < LABEL_GAP) {
        items[i].y = items[i + 1].y - LABEL_GAP;
      }
    }
    return new Map(items.map(({ s, y }) => [s, y]));
  })();

  let hoverIndex = null;
  let hoverSeries = null;

  // Painted in `data` order by default (top emitters land last -> on top);
  // whichever series is hovered is reordered to the end so it always wins.
  $: renderOrder =
    hoverSeries === null
      ? data
      : [...data.slice(0, hoverSeries), ...data.slice(hoverSeries + 1), data[hoverSeries]];

  function handleMove(event) {
    const [mx, my] = d3.pointer(event, svgEl);
    const xInner = mx - margin.left;
    const yInner = my - margin.top;
    const xValue = xScale.invert(xInner);
    const ref = data[0]?.points ?? [];
    let i = bisect(ref, xValue);
    i = Math.max(0, Math.min(ref.length - 1, i));
    hoverIndex = i;

    let closest = null;
    let closestDist = Infinity;
    data.forEach((s, si) => {
      const p = s.points[i];
      if (!p) return;
      const dist = Math.abs(yScale(p.y) - yInner);
      if (dist < closestDist) {
        closestDist = dist;
        closest = si;
      }
    });
    hoverSeries = closest;
  }

  function handleLeave() {
    hoverIndex = null;
    hoverSeries = null;
  }

  $: hoveredPoint =
    hoverSeries !== null && hoverIndex !== null
      ? data[hoverSeries]?.points[hoverIndex]
      : null;
</script>

{#if featuredSeries.length > 0}
  <p class="caption">
    {#each featuredSeries as s}<span class="caption-name" style="color: {colorOf(s)}"
      >{s.series}</span
    >{/each} led 2024 per-capita emissions &mdash; each line is labeled in its
    own color, so there is nothing else to decode.
    {#if mutedCount > 0}
      {mutedCount} further territories sit in gray; hover any line to read it.
    {/if}
  </p>
{/if}

<div class="chart" bind:clientWidth={width}>
  <svg
    {width}
    {height}
    role="img"
    aria-label="Line chart of greenhouse gas emissions per capita by Pacific Island country and territory, 1970 to 2024"
    bind:this={svgEl}
    on:mousemove={handleMove}
    on:mouseleave={handleLeave}
  >
    <g transform="translate({margin.left},{margin.top})">
      <g
        class="y-axis"
        use:axis={{ scale: yScale, side: "left", ticks: 3, tickSize: 5 }}
      />

      {#each renderOrder as s (s.series)}
        {@const isHovered = hoverSeries !== null && data[hoverSeries] === s}
        {@const dimmed = hoverSeries !== null && !isHovered}
        <path
          d={lineGen(s.points)}
          class="line"
          class:muted={!s.featured}
          class:hovered={isHovered}
          style="stroke: {colorOf(s)}; opacity: {dimmed ? (s.featured ? 0.35 : 0.15) : 1}"
        />

        {#if s.featured}
          {@const last = s.points[s.points.length - 1]}
          {@const trueY = yScale(last.y)}
          {@const textY = labelY.get(s)}
          <circle
            cx={xScale(last.x)}
            cy={trueY}
            r="4"
            class="end-dot"
            style="fill: {colorOf(s)}; opacity: {dimmed ? 0.35 : 1}"
          />
          {#if Math.abs(textY - trueY) > 2}
            <line
              x1={xScale(last.x) + 4}
              x2={xScale(last.x) + 10}
              y1={trueY}
              y2={textY}
              class="leader"
              style="stroke: {colorOf(s)}; opacity: {dimmed ? 0.35 : 1}"
            />
          {/if}
          <text
            x={xScale(last.x) + 10}
            y={textY + 4}
            class="end-label"
            style="fill: {colorOf(s)}; opacity: {dimmed ? 0.5 : 1}"
          >
            {s.series}
          </text>
        {/if}
      {/each}

      {#if hoveredPoint}
        <line
          x1={xScale(hoveredPoint.x)}
          x2={xScale(hoveredPoint.x)}
          y1="0"
          y2={innerHeight}
          class="crosshair"
        />
        <circle
          cx={xScale(hoveredPoint.x)}
          cy={yScale(hoveredPoint.y)}
          r="5"
          class="hover-dot"
          style="fill: {colorOf(data[hoverSeries])}"
        />

        {@const hx = xScale(hoveredPoint.x)}
        <foreignObject
          x={Math.min(hx + 12, innerWidth - 160)}
          y="4"
          width="160"
          height="52"
        >
          <div class="tooltip">
            <div class="tooltip-value">
              <span class="keyline" style="background: {colorOf(data[hoverSeries])}" />
              {hoveredPoint.y.toFixed(1)} t
            </div>
            <div class="tooltip-label">
              {data[hoverSeries].series} &middot; {hoveredPoint.x}
            </div>
          </div>
        </foreignObject>
      {/if}

      <g
        class="x-axis"
        transform="translate(0,{innerHeight})"
        use:axis={{ scale: xScale, side: "bottom", ticks: 6, format: d3.format("d") }}
      />
    </g>
  </svg>
</div>

<style>
  .chart {
    width: 100%;
  }

  .caption {
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--ink-muted);
    max-width: 56em;
  }

  .caption-name {
    font-weight: 600;
  }

  .caption-name:not(:last-child)::after {
    content: ", ";
    color: var(--ink-muted);
    font-weight: 400;
  }

  .keyline {
    width: 10px;
    height: 2px;
    display: inline-block;
    flex-shrink: 0;
  }

  .line {
    fill: none;
    stroke-width: 2px;
    transition: opacity 0.15s ease;
  }

  .line.muted {
    stroke-width: 1.5px;
  }

  .line.hovered {
    stroke-width: 3px;
  }

  .end-dot,
  .hover-dot {
    stroke: var(--field);
    stroke-width: 2px;
  }

  .end-label {
    font-size: 0.75rem;
    font-weight: 600;
  }

  .leader {
    stroke-width: 1px;
  }

  .crosshair {
    stroke: var(--stroke-axis);
    stroke-width: 1px;
  }

  .tooltip {
    background: var(--field);
    border: 1px solid var(--stroke-hairline);
    border-radius: var(--radius);
    padding: 0.35rem 0.55rem;
    font-size: 0.75rem;
    color: var(--ink);
    font-variant-numeric: tabular-nums lining-nums;
  }

  .tooltip-value {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
    color: var(--magenta-ink);
    white-space: nowrap;
  }

  .tooltip-label {
    margin-top: 0.15rem;
    color: var(--ink-muted);
    white-space: nowrap;
  }

  /* Range-frame y-axis: short ticks marking the actual value range,
     no gridlines running across the plot — the lines are the data. */
  :global(.y-axis .tick line) {
    stroke: var(--stroke-axis);
    stroke-width: 1px;
  }

  :global(.y-axis .tick text) {
    fill: var(--ink-muted);
    font-size: 0.7rem;
  }

  :global(.x-axis .tick line) {
    display: none;
  }

  :global(.x-axis .tick text) {
    fill: var(--ink-muted);
    font-size: 0.75rem;
  }
</style>
