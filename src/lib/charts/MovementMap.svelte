<script>
  import * as d3 from "d3";
  import { feature } from "topojson-client";
  import landTopology from "world-atlas/land-110m.json";

  // shape: { origin: string, lat: number, lon: number, value: number }[]
  export let data = [];
  export let destination; // { name: string, lat: number, lon: number }

  const height = 460;
  const margin = 44;
  let width = 600;

  // Land basemap is fixed data — convert once, not on every reactive pass.
  const land = feature(landTopology, landTopology.objects.land);
  const graticule = d3.geoGraticule().step([20, 20])();

  // Magenta ramp (magnitude), pale -> full-strength — every route, traveling
  // dot, and origin bubble is magenta, just less of it for smaller markets.
  // Palau itself sits one step further up the ramp (m-700) than the
  // strongest route (m-500), so it always reads as the single most intense
  // mark on the map.
  const seqSteps = [
    "var(--m-100)",
    "var(--m-200)",
    "var(--m-300)",
    "var(--m-400)",
    "var(--m-500)",
  ];

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  $: maxValue = d3.max(data, (d) => d.value) ?? 0;
  $: shownTotal = d3.sum(data, (d) => d.value);

  $: colorScale = d3.scaleQuantize().domain([0, maxValue]).range(seqSteps);
  $: radiusScale = d3.scaleSqrt().domain([0, maxValue]).range([4, 14]);
  $: strokeScale = d3.scaleSqrt().domain([0, maxValue]).range([1.25, 5]);
  $: dotCountScale = d3
    .scaleQuantize()
    .domain([0, maxValue])
    .range([1, 2, 3, 4]);
  $: durationScale = d3.scaleLinear().domain([0, maxValue]).range([10, 3.5]);

  // Fit to the markets actually on the map (not the whole globe) so the
  // Antarctic/high-Arctic gap doesn't eat vertical space, and rotate so the
  // antimeridian split falls in the Atlantic — Asia, the Pacific, and the
  // Americas all land in one continuous sweep instead of splitting at the edges.
  $: focusPoints = {
    type: "MultiPoint",
    coordinates: [
      ...data.map((d) => [d.lon, d.lat]),
      [destination.lon, destination.lat],
    ],
  };

  $: projection = d3
    .geoNaturalEarth1()
    .rotate([-160, 0])
    .fitExtent(
      [
        [margin, margin],
        [width - margin, height - margin],
      ],
      focusPoints
    );

  $: path = d3.geoPath(projection);
  $: landPath = path(land);
  $: graticulePath = path(graticule);
  $: destXY = projection([destination.lon, destination.lat]);

  // geoPath resamples a 2-point LineString along the geodesic, so this
  // renders as a true great-circle bow, not a straight rhumb line.
  $: arcs = data.map((d, i) => ({
    ...d,
    id: `route-${i}`,
    d: path({
      type: "LineString",
      coordinates: [
        [d.lon, d.lat],
        [destination.lon, destination.lat],
      ],
    }),
    xy: projection([d.lon, d.lat]),
  }));

  // East Asian markets (plus Palau itself) sit close together at this map's
  // zoom level, so default "label above the bubble" positions collide. Nudge
  // overlapping labels apart in a few passes — same idea as LineChart's
  // end-label collision avoidance, extended to 2D — and draw a leader line
  // back to the bubble whenever a label ends up somewhere other than "above".
  const LABEL_W = 64;
  const LABEL_H = 15;
  function declutter(points) {
    const labels = points.map((p) => ({ ...p, lx: p.x, ly: p.y - p.r - 9 }));
    for (let iter = 0; iter < 60; iter++) {
      let moved = false;
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i];
          const b = labels[j];
          const dx = b.lx - a.lx;
          const dy = b.ly - a.ly;
          const overlapX = LABEL_W - Math.abs(dx);
          const overlapY = LABEL_H - Math.abs(dy);
          if (overlapX > 0 && overlapY > 0) {
            const pushY = overlapY / 2 + 0.6;
            if (dy >= 0) {
              a.ly -= pushY;
              b.ly += pushY;
            } else {
              a.ly += pushY;
              b.ly -= pushY;
            }
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return labels.map((l) => ({
      ...l,
      leader: Math.abs(l.ly - (l.y - l.r - 9)) > 3 || Math.abs(l.lx - l.x) > 3,
    }));
  }

  $: labelPoints = declutter([
    ...arcs.map((a) => ({
      id: a.id,
      x: a.xy[0],
      y: a.xy[1],
      r: radiusScale(a.value),
      text: a.origin,
      dest: false,
    })),
    {
      id: "dest",
      x: destXY[0],
      y: destXY[1],
      r: 7,
      text: destination.name,
      dest: true,
    },
  ]);

  const fmt = d3.format(",");
  let hovered = null;

  $: hoveredArc = arcs.find((a) => a.id === hovered) ?? null;
</script>

<p class="caption">
  Each arc is one source market's great-circle route into Palau; width, fill
  depth, and traveling-dot count all scale with CY2015 arrivals from that
  market — heavier routes carry more, faster dots. "Others", the CSV's
  catch-all for smaller markets, and the "Total" row aren't real places, so
  they're excluded from the map (kept in the table below).
</p>

<div class="chart" bind:clientWidth={width}>
  <svg
    {width}
    {height}
    role="img"
    aria-label="Map of visitor arrivals into Palau by source market in CY2015, with routes weighted by arrival volume"
  >
    <rect class="ocean" x="0" y="0" {width} {height} />
    <path class="graticule" d={graticulePath} />
    <path class="land" d={landPath} />

    {#each arcs as a (a.id)}
      {@const active = hovered === a.id}
      <path
        id={a.id}
        d={a.d}
        class="route"
        class:active
        style="stroke: {colorScale(a.value)}; stroke-width: {strokeScale(
          a.value
        )}px"
      />
    {/each}

    {#each arcs as a (a.id + '-dots')}
      {#if !reducedMotion}
        {#each Array(dotCountScale(a.value)) as _, i}
          <circle r="2.6" class="traveler" style="fill: {colorScale(a.value)}">
            <animateMotion
              dur="{durationScale(a.value)}s"
              begin="{(i * durationScale(a.value)) / dotCountScale(a.value)}s"
              repeatCount="indefinite"
            >
              <mpath href="#{a.id}" xlink:href="#{a.id}" />
            </animateMotion>
          </circle>
        {/each}
      {/if}
    {/each}

    {#each arcs as a (a.id + '-bubble')}
      {@const active = hovered === a.id}
      <g
        role="presentation"
        on:mouseenter={() => (hovered = a.id)}
        on:mouseleave={() => (hovered = null)}
      >
        <circle
          cx={a.xy[0]}
          cy={a.xy[1]}
          r={radiusScale(a.value) + 6}
          fill="transparent"
        />
        <circle
          cx={a.xy[0]}
          cy={a.xy[1]}
          r={radiusScale(a.value)}
          class="origin-dot"
          class:active
          style="fill: {colorScale(a.value)}"
        />
      </g>
    {/each}

    <circle class="dest-halo" cx={destXY[0]} cy={destXY[1]} r="18" />
    <circle class="dest-dot" cx={destXY[0]} cy={destXY[1]} r="7" />

    {#each labelPoints as l (l.id)}
      {#if l.leader}
        <line
          x1={l.x}
          y1={l.y - l.r - 2}
          x2={l.lx}
          y2={l.ly + 3}
          class="leader"
        />
      {/if}
      <text
        x={l.lx}
        y={l.ly}
        text-anchor="middle"
        class="origin-label"
        class:dest-label={l.dest}
      >
        {l.text}
      </text>
    {/each}

    {#if hoveredArc}
      {@const boxW = 150}
      {@const r = radiusScale(hoveredArc.value)}
      <foreignObject
        x={Math.min(Math.max(hoveredArc.xy[0] - boxW / 2, 4), width - boxW - 4)}
        y={Math.max(hoveredArc.xy[1] - r - 54, 4)}
        width={boxW}
        height="46"
      >
        <div class="tooltip">
          <div class="tooltip-value">
            <span
              class="keyline"
              style="background: {colorScale(hoveredArc.value)}"
            />
            {fmt(hoveredArc.value)} visitors
          </div>
          <div class="tooltip-label">{hoveredArc.origin} &middot; CY2015</div>
        </div>
      </foreignObject>
    {/if}
  </svg>

  <div class="legend">
    <span class="legend-label">CY2015 arrivals</span>
    <svg class="ramp" width="140" height="14" aria-hidden="true">
      <defs>
        <linearGradient id="movement-ramp" x1="0" x2="1" y1="0" y2="0">
          {#each seqSteps as step, i}
            <stop offset="{(i / (seqSteps.length - 1)) * 100}%" stop-color={step} />
          {/each}
        </linearGradient>
      </defs>
      <rect width="140" height="10" y="2" rx="3" fill="url(#movement-ramp)" />
    </svg>
    <span class="legend-range">0 &ndash; {fmt(maxValue)}</span>
  </div>
</div>

<ul class="table-view">
  {#each [...data].sort((a, b) => b.value - a.value) as d (d.origin)}
    <li>
      <span class="swatch" style="background: {colorScale(d.value)}" />
      <span class="row-label">{d.origin}</span>
      <span class="row-value">{fmt(d.value)}</span>
    </li>
  {/each}
  <li class="table-total">
    <span class="row-label">Total shown</span>
    <span class="row-value">{fmt(shownTotal)}</span>
  </li>
</ul>

<style>
  .chart {
    width: 100%;
    position: relative;
  }

  /* This figure is a boxed map, not an axis chart — unlike the other
     figures, nothing here (halo pulse, edge labels, edge bubbles) is
     meant to hang outside its frame, so it overrides the app-wide
     `svg { overflow: visible }` rule that keeps axis tick labels unclipped. */
  .chart svg {
    overflow: hidden;
  }

  .caption {
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--ink-muted);
    max-width: 56em;
  }

  .ocean {
    fill: var(--field);
    stroke: var(--stroke-hairline);
  }

  .graticule {
    fill: none;
    stroke: var(--stroke-grid);
    stroke-width: 0.6px;
  }

  .land {
    fill: var(--s-300);
    stroke: var(--s-400);
    stroke-width: 0.5px;
  }

  .route {
    fill: none;
    stroke-linecap: round;
    opacity: 0.75;
    transition: opacity 0.15s ease, stroke-width 0.15s ease;
  }

  .route.active {
    opacity: 1;
    stroke-width: 7px !important;
  }

  .traveler {
    stroke: var(--field);
    stroke-width: 1px;
  }

  .origin-dot {
    stroke: var(--field);
    stroke-width: 2px;
    cursor: pointer;
    transition: r 0.1s ease;
  }

  .origin-dot.active {
    stroke-width: 2.5px;
  }

  .origin-label {
    fill: var(--ink-muted);
    font-size: 0.7rem;
    font-weight: 600;
    paint-order: stroke;
    stroke: var(--field);
    stroke-width: 3px;
  }

  .leader {
    stroke: var(--stroke-axis);
    stroke-width: 1px;
  }

  .dest-halo {
    fill: var(--m-700);
    opacity: 0.22;
    animation: pulse 2.2s ease-out infinite;
  }

  .dest-dot {
    fill: var(--m-700);
    stroke: var(--field);
    stroke-width: 2px;
  }

  .dest-label {
    fill: var(--magenta-ink);
    font-size: 0.8rem;
    font-weight: 700;
    paint-order: stroke;
    stroke: var(--field);
    stroke-width: 3px;
  }

  @keyframes pulse {
    0% {
      r: 8px;
      opacity: 0.35;
    }
    100% {
      r: 22px;
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dest-halo {
      animation: none;
      opacity: 0.18;
    }
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

  .tooltip-value {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .tooltip-label {
    margin-top: 0.15rem;
    color: var(--ink-muted);
    white-space: nowrap;
  }

  .keyline {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.6rem;
    font-size: 0.75rem;
    color: var(--ink-muted);
  }

  .legend-range {
    font-variant-numeric: tabular-nums;
  }

  .table-view {
    list-style: none;
    margin: 1.25rem 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.4rem 1.5rem;
    max-width: 56em;
  }

  .table-view li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--ink-muted);
    padding: 0.15rem 0;
    border-bottom: 1px solid var(--stroke-grid);
  }

  .table-total {
    border-bottom: none !important;
    font-weight: 600;
    color: var(--ink) !important;
  }

  .swatch {
    width: 9px;
    height: 9px;
    flex-shrink: 0;
  }

  .row-label {
    flex: 1;
  }

  .row-value {
    font-variant-numeric: tabular-nums lining-nums;
    color: var(--ink);
    font-weight: 600;
  }
</style>
