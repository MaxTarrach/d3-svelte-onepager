<script>
  import * as d3 from "d3";

  // shape: { year, share, nonRenewable, nonRenewableAbsTJ, type, milestone }[]
  // — nonRenewableAbsTJ (modeled: each year's renewable-share reading
  // applied to a fixed ~3,050 TJ total-consumption baseline, see data.js)
  // drives the geometry: 2000 is a near-full disc of fossil dependence,
  // each later year draws a smaller disc on top, so the visible rings are
  // literally the years still left to close out. The 2045 target (0 TJ
  // non-renewable) collapses to a single dot at the centre.
  export let data = [];
  export let totalTFEC_TJ = 0; // domain ceiling — the assumed total consumption used to model every year's absolute value

  const margin = { top: 20, right: 20, bottom: 52, left: 20 };
  const DOT_R = 4; // smallest ring never fully vanishes — stays a visible dot

  // Magenta ramp, pale -> strong, matching the ramp used everywhere else —
  // the milestone dot alone gets m-700, one step past the ramp's own max,
  // so it always reads as the single most intense mark in the figure.
  const rampPale = "#FDF1F7"; // m-50
  const rampStrong = "#C4006B"; // m-600
  const milestoneColor = "#8A0049"; // m-700
  const colorInterp = d3.interpolateRgb(rampPale, rampStrong);
  $: colorFor = (abs) => colorInterp(abs / totalTFEC_TJ);

  let width = 600;

  $: plotSize = Math.max(width - margin.left - margin.right, 0);
  $: height = plotSize + margin.top + margin.bottom;
  $: cx = margin.left + plotSize / 2;
  $: cy = margin.top + plotSize / 2;
  $: outerRadius = Math.max(plotSize / 2 - 6, DOT_R);

  $: radiusScale = d3
    .scaleLinear()
    .domain([0, totalTFEC_TJ])
    .range([DOT_R, outerRadius]);

  $: targetRow = data.reduce(
    (best, d) => (d.nonRenewableAbsTJ < best.nonRenewableAbsTJ ? d : best),
    data[0] ?? null
  );

  // Largest disc first (drawn on the bottom), so every later, smaller disc
  // paints over its centre and leaves only a ring of the earlier colour —
  // sorted by value, not by year, so any small non-monotonic noise in the
  // historical readings (e.g. 2010 vs. 2015) can't produce a rendering
  // glitch. Years that land on the same visible radius (2045 and 2050 both
  // read 0 TJ non-renewable) are collapsed to one disc, so a later duplicate
  // can't paint over and hide the milestone dot underneath it.
  $: ringsDesc = (() => {
    const sorted = [...data].sort(
      (a, b) => b.nonRenewableAbsTJ - a.nonRenewableAbsTJ || a.year - b.year
    );
    const dedupeGapTJ = totalTFEC_TJ * 0.0005; // same relative tolerance as the old 0.05-percentage-point threshold
    const out = [];
    for (const d of sorted) {
      const prev = out[out.length - 1];
      if (prev && Math.abs(prev.nonRenewableAbsTJ - d.nonRenewableAbsTJ) < dedupeGapTJ) {
        if (targetRow && d.year === targetRow.year) out[out.length - 1] = d;
        continue;
      }
      out.push(d);
    }
    return out;
  })();

  // Both rulers (year above, value below) key off the same set of points —
  // the same radius that places a year on the year line places its TJ value
  // on the value line directly below it. ringsDesc (largest disc first) is
  // already in ascending-x order — the biggest, oldest disc sits furthest
  // left, the milestone dot sits nearest cx — so a single left-to-right pass
  // with a minimum pixel gap is enough to declutter; the first point and the
  // milestone are always kept regardless of how close their neighbours land.
  const MIN_LABEL_GAP = 30;
  $: labelPoints = (() => {
    const kept = [];
    let lastX = -Infinity;
    ringsDesc.forEach((d, i) => {
      const x = cx - radiusScale(d.nonRenewableAbsTJ);
      const isMilestone = targetRow && d.year === targetRow.year;
      const isFirst = i === 0;
      if (isFirst || isMilestone || x - lastX >= MIN_LABEL_GAP) {
        kept.push({ ...d, x });
        lastX = x;
      }
    });
    return kept;
  })();

  let hovered = null;
  $: hoveredRing = hovered !== null ? data.find((d) => d.year === hovered) : null;
</script>

<div class="chart" bind:clientWidth={width}>
  <svg
    {width}
    {height}
    role="img"
    aria-label="Concentric-ring chart of Palau's non-renewable energy consumption in terajoules from 2000 to 2050, shrinking from a near-full circle to a single point at the 2045 target"
  >
    <g>
      {#each ringsDesc as d (d.year)}
        {@const r = radiusScale(d.nonRenewableAbsTJ)}
        {@const isMilestone = targetRow && d.year === targetRow.year}
        <circle
          {cx}
          {cy}
          {r}
          class="ring"
          class:projected={d.type !== "historical"}
          class:hovered={hovered === d.year}
          role="presentation"
          fill={isMilestone ? milestoneColor : colorFor(d.nonRenewableAbsTJ)}
          on:mouseenter={() => (hovered = d.year)}
          on:mouseleave={() => (hovered = null)}
        />
      {/each}

      <circle
        {cx}
        {cy}
        r={outerRadius}
        class="frame"
        fill="none"
      />

      <!-- year ruler: runs through the vertical centre, left edge to the milestone dot -->
      <line
        x1={cx - outerRadius}
        x2={cx}
        y1={cy}
        y2={cy}
        class="ruler-line"
      />
      {#each labelPoints as l (l.year + '-year')}
        <line x1={l.x} x2={l.x} y1={cy - 4} y2={cy + 4} class="ruler-tick" />
        <text x={l.x} y={cy - 9} text-anchor="middle" class="ruler-label">
          {l.year}
        </text>
      {/each}

      <!-- value ruler: same x-positions, in the margin below the circle -->
      <line
        x1={cx - outerRadius}
        x2={cx}
        y1={margin.top + plotSize + 20}
        y2={margin.top + plotSize + 20}
        class="ruler-line"
      />
      {#each labelPoints as l (l.year + '-value')}
        {@const y = margin.top + plotSize + 20}
        {@const isMilestone = targetRow && l.year === targetRow.year}
        <line x1={l.x} x2={l.x} y1={y - 4} y2={y + 4} class="ruler-tick" />
        <text
          x={l.x}
          y={y + 16}
          text-anchor="middle"
          class="ruler-label"
          class:ruler-label--hi={isMilestone}
        >
          {Math.round(l.nonRenewableAbsTJ)}{l.year === labelPoints[0].year ? " TJ" : ""}
        </text>
        {#if isMilestone}
          <text
            x={l.x}
            y={y + 16}
            dx="0.9em"
            text-anchor="start"
            class="ruler-label ruler-label--hi"
          >
            = fully renewable
          </text>
        {/if}
      {/each}
    </g>
  </svg>

  <div class="readout" aria-live="polite">
    {#if hoveredRing}
      <span class="readout-year">{hoveredRing.year}</span>
      <span class="readout-value">{Math.round(hoveredRing.nonRenewableAbsTJ)} TJ non-renewable</span>
      {#if hoveredRing.milestone}
        <span class="readout-milestone">{hoveredRing.milestone}</span>
      {/if}
    {:else}
      <span class="readout-hint">Hover a ring for the year and its non-renewable energy use.</span>
    {/if}
  </div>

  <div class="legend">
    <span class="legend-item"><span class="swatch swatch-solid" /> Historical</span>
    <span class="legend-item"><span class="swatch swatch-dashed" /> Target / projection</span>
  </div>
</div>

<style>
  .chart {
    width: 100%;
    position: relative;
  }

  .caption {
    margin: 0 0 1.25rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--ink-muted);
    max-width: 56em;
  }

  .ring {
    transition: opacity 0.15s ease;
  }

  .ring.projected {
    stroke: var(--magenta-ink);
    stroke-width: 1px;
    stroke-dasharray: 3 2;
  }

  .ring.hovered {
    opacity: 0.85;
  }

  .frame {
    stroke: var(--stroke-hairline);
    stroke-width: 1px;
  }

  .ruler-line {
    stroke: var(--stroke-axis);
    stroke-width: 1px;
  }

  .ruler-tick {
    stroke: var(--stroke-axis);
    stroke-width: 1px;
  }

  .ruler-label {
    font-size: 0.7rem;
    font-weight: 600;
    fill: var(--ink);
    paint-order: stroke;
    stroke: var(--field);
    stroke-width: 3px;
    font-variant-numeric: tabular-nums lining-nums;
  }

  .ruler-label--hi {
    fill: var(--magenta-ink);
  }

  .readout {
    margin-top: 0.75rem;
    min-height: 1.4em;
    font-size: 0.8rem;
    color: var(--ink-muted);
  }

  .readout-year {
    font-weight: 600;
    color: var(--ink);
    margin-right: 0.5rem;
  }

  .readout-value {
    color: var(--magenta-ink);
    font-weight: 600;
    font-variant-numeric: tabular-nums lining-nums;
  }

  .readout-milestone {
    margin-left: 0.5rem;
    color: var(--ink-muted);
  }

  .readout-hint {
    color: var(--ink-muted);
  }

  .legend {
    display: flex;
    gap: 1.25rem;
    margin-top: 0.6rem;
    font-size: 0.75rem;
    color: var(--ink-muted);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .swatch-solid {
    background: var(--magenta);
  }

  .swatch-dashed {
    background: var(--field);
    border: 1.5px dashed var(--magenta-ink);
  }
</style>
