<script>
  import * as d3 from "d3";
  import { axis } from "../axis.js";

  // shape: { group: string, x: number, y: number }[]
  // capped at 3 groups — the categorical palette only validates all-pairs
  // (scatter/bubble) contexts for its first three slots, see palette.md.
  export let data = [];

  const margin = { top: 24, right: 16, bottom: 32, left: 40 };
  const height = 360;
  const seriesColor = {};

  let width = 600;

  $: groups = [...new Set(data.map((d) => d.group))];
  $: groups.forEach((g, i) => {
    seriesColor[g] = `var(--series-${i + 1})`;
  });

  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  $: xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x))
    .range([0, innerWidth])
    .nice();

  $: yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.y))
    .range([innerHeight, 0])
    .nice();

  let hovered = null;
</script>

<div class="legend">
  {#each groups as g, i}
    <span class="legend-item">
      <span class="swatch" style="background: var(--series-{i + 1})" />
      {g}
    </span>
  {/each}
</div>

<div class="chart" bind:clientWidth={width}>
  <svg {width} {height} role="img" aria-label="Scatter plot">
    <g transform="translate({margin.left},{margin.top})">
      <g
        class="grid"
        use:axis={{ scale: yScale, side: "left", ticks: 5, tickSize: -innerWidth }}
      />

      {#each data as d, i (i)}
        <circle
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          r={hovered === i ? 7 : 5}
          class="dot"
          role="presentation"
          style="fill: {seriesColor[d.group]}"
          on:mouseenter={() => (hovered = i)}
          on:mouseleave={() => (hovered = null)}
        />
      {/each}

      {#if hovered !== null}
        {@const d = data[hovered]}
        <foreignObject
          x={Math.min(xScale(d.x) + 12, innerWidth - 120)}
          y={Math.max(yScale(d.y) - 40, 0)}
          width="120"
          height="46"
        >
          <div class="tooltip">
            <div class="tooltip-row">
              <span class="swatch" style="background: {seriesColor[d.group]}" />
              {d.group}
            </div>
            <div>x: {d.x.toFixed(1)}, y: {d.y.toFixed(1)}</div>
          </div>
        </foreignObject>
      {/if}

      <g
        class="x-axis"
        transform="translate(0,{innerHeight})"
        use:axis={{ scale: xScale, side: "bottom", ticks: 6 }}
      />
    </g>
  </svg>
</div>

<style>
  .chart {
    width: 100%;
  }

  .legend {
    display: flex;
    gap: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: var(--ink-muted);
  }

  .swatch {
    width: 9px;
    height: 9px;
    display: inline-block;
    flex-shrink: 0;
  }

  .dot {
    stroke: var(--field);
    stroke-width: 2px;
    cursor: pointer;
    transition: r 0.1s ease;
  }

  .tooltip {
    background: var(--field);
    border: 1px solid var(--stroke-hairline);
    border-radius: var(--radius);
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    color: var(--ink);
    font-variant-numeric: tabular-nums lining-nums;
    box-shadow: none;
  }

  .tooltip-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.2rem;
  }

  :global(.grid .tick line) {
    stroke: var(--stroke-grid);
    stroke-width: 1px;
  }

  :global(.grid .tick text) {
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
