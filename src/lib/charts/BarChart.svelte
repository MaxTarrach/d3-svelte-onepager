<script>
  import * as d3 from "d3";
  import { axis } from "../axis.js";

  // shape: { label: string, value: number }[]
  export let data = [];

  const margin = { top: 24, right: 16, bottom: 32, left: 40 };
  const height = 320;
  const barCap = 24; // mark spec: bars never exceed 24px thick

  let width = 600;

  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  $: xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerWidth])
    .padding(0.35);

  $: yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) * 1.15])
    .range([innerHeight, 0])
    .nice();

  let hovered = null;
</script>

<div class="chart" bind:clientWidth={width}>
  <svg {width} {height} role="img" aria-label="Bar chart">
    <g transform="translate({margin.left},{margin.top})">
      <g
        class="grid"
        use:axis={{ scale: yScale, side: "left", ticks: 4, tickSize: -innerWidth }}
      />

      {#each data as d (d.label)}
        {@const barWidth = Math.min(xScale.bandwidth(), barCap)}
        {@const x = xScale(d.label) + (xScale.bandwidth() - barWidth) / 2}
        {@const y = yScale(d.value)}
        {@const h = innerHeight - y}
        <g
          class="bar-group"
          role="presentation"
          on:mouseenter={() => (hovered = d.label)}
          on:mouseleave={() => (hovered = null)}
        >
          <!-- generous invisible hit target, wider than the visible bar -->
          <rect
            x={xScale(d.label)}
            y="0"
            width={xScale.bandwidth()}
            height={innerHeight}
            fill="transparent"
          />
          <rect
            {x}
            {y}
            width={barWidth}
            height={h}
            class="bar"
            class:dimmed={hovered !== null && hovered !== d.label}
          />
          {#if hovered === d.label}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              text-anchor="middle"
              class="value-label"
            >
              {d.value}
            </text>
          {/if}
        </g>
      {/each}

      <g
        class="x-axis"
        transform="translate(0,{innerHeight})"
        use:axis={{ scale: xScale, side: "bottom" }}
      />
    </g>
  </svg>
</div>

<style>
  .chart {
    width: 100%;
  }

  .bar {
    fill: var(--magenta);
    transition: opacity 0.15s ease;
  }

  .bar.dimmed {
    opacity: 0.35;
  }

  .value-label {
    fill: var(--magenta-ink);
    font-size: 0.75rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums lining-nums;
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
