<script>
  import * as d3 from "d3";

  // shape: { label, value, delta, trend: number[] }[]
  export let stats = [];

  const sparkWidth = 96;
  const sparkHeight = 28;

  function sparkPath(trend) {
    const x = d3.scaleLinear().domain([0, trend.length - 1]).range([1, sparkWidth - 1]);
    const y = d3.scaleLinear().domain(d3.extent(trend)).range([sparkHeight - 4, 4]);
    const line = d3.line()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);
    return line(trend);
  }
</script>

<div class="stat-row">
  {#each stats as stat}
    <div class="tile">
      <p class="label">{stat.label}</p>
      <p class="value">{stat.value}</p>
      <p
        class="delta"
        class:good={stat.delta >= 0}
        class:bad={stat.delta < 0}
      >
        {stat.delta >= 0 ? "▲" : "▼"} {Math.abs(stat.delta)}% vs last period
      </p>
      <svg
        class="spark"
        viewBox="0 0 {sparkWidth} {sparkHeight}"
        preserveAspectRatio="none"
      >
        <path d={sparkPath(stat.trend)} class="spark-line" />
      </svg>
    </div>
  {/each}
</div>

<style>
  .stat-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1px;
    background: var(--stroke-hairline);
    border: 1px solid var(--stroke-hairline);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .tile {
    background: var(--field);
    padding: 1.25rem 1.5rem;
  }

  .label {
    margin: 0 0 0.4rem;
    font-size: 0.85rem;
    color: var(--ink-muted);
  }

  .value {
    margin: 0 0 0.35rem;
    font-size: 1.9rem;
    font-weight: 600;
    color: var(--ink);
    font-variant-numeric: tabular-nums lining-nums;
  }

  .delta {
    margin: 0 0 0.6rem;
    font-size: 0.8rem;
  }

  .delta.good {
    color: var(--ink-muted);
  }

  .delta.bad {
    color: var(--magenta-ink);
  }

  .spark {
    width: 96px;
    height: 28px;
    display: block;
  }

  .spark-line {
    fill: none;
    stroke: var(--text-muted);
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
