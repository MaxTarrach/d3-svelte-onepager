<script>
  import * as d3 from "d3";
  import { axis } from "../axis.js";

  // shape: { x: number, y: number }[] — single series, no legend needed.
  export let data = [];

  const margin = { top: 24, right: 16, bottom: 32, left: 40 };
  const height = 320;

  let width = 600;
  let svgEl;

  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  $: xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x))
    .range([0, innerWidth]);

  $: yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y) * 1.15])
    .range([innerHeight, 0])
    .nice();

  $: areaGen = d3
    .area()
    .x((d) => xScale(d.x))
    .y0(innerHeight)
    .y1((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);

  $: lineGen = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);

  $: bisect = d3.bisector((d) => d.x).left;

  let hoverIndex = null;

  function handleMove(event) {
    const [mx] = d3.pointer(event, svgEl);
    const xValue = xScale.invert(mx - margin.left);
    let i = bisect(data, xValue);
    i = Math.max(0, Math.min(data.length - 1, i));
    hoverIndex = i;
  }

  function handleLeave() {
    hoverIndex = null;
  }
</script>

<div class="chart" bind:clientWidth={width}>
  <svg
    {width}
    {height}
    role="img"
    aria-label="Area chart"
    bind:this={svgEl}
    on:mousemove={handleMove}
    on:mouseleave={handleLeave}
  >
    <g transform="translate({margin.left},{margin.top})">
      <g
        class="grid"
        use:axis={{ scale: yScale, side: "left", ticks: 4, tickSize: -innerWidth }}
      />

      <path d={areaGen(data)} class="area" />
      <path d={lineGen(data)} class="line" />

      {#if hoverIndex !== null}
        {@const p = data[hoverIndex]}
        {@const hx = xScale(p.x)}
        <line x1={hx} x2={hx} y1="0" y2={innerHeight} class="crosshair" />
        <circle cx={hx} cy={yScale(p.y)} r="5" class="hover-dot" />

        <foreignObject
          x={Math.min(hx + 12, innerWidth - 90)}
          y="8"
          width="90"
          height="34"
        >
          <div class="tooltip">{p.y.toFixed(1)}</div>
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

  .area {
    fill: var(--magenta);
    opacity: 0.1;
  }

  .line {
    fill: none;
    stroke: var(--magenta);
    stroke-width: 2px;
  }

  .hover-dot {
    fill: var(--magenta);
    stroke: var(--field);
    stroke-width: 2px;
  }

  .crosshair {
    stroke: var(--stroke-axis);
    stroke-width: 1px;
  }

  .tooltip {
    background: var(--field);
    border: 1px solid var(--stroke-hairline);
    border-radius: var(--radius);
    padding: 0.3rem 0.55rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--magenta-ink);
    font-variant-numeric: tabular-nums lining-nums;
    box-shadow: none;
    width: fit-content;
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
