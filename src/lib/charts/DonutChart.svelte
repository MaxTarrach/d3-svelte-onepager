<script>
  import * as d3 from "d3";

  // shape: { label: string, value: number }[]
  // keep to <= 6 slices; fold smaller categories into "Other" beyond that.
  export let data = [];

  const size = 320;
  const radius = size / 2;
  const innerRadius = radius * 0.62;
  // direct-label a slice only once it reads clearly on its own — small
  // slivers fall back to the legend + tooltip instead of a squeezed label.
  const directLabelThreshold = 0.08;

  $: total = d3.sum(data, (d) => d.value);

  $: pieGen = d3.pie().value((d) => d.value).sort(null);
  $: arcs = pieGen(data);

  $: arcGen = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius - 4)
    .cornerRadius(2)
    .padAngle(0.012);

  $: labelArc = d3.arc().innerRadius(radius * 0.82).outerRadius(radius * 0.82);

  // Atlas categorical rule: the subject (here, the largest slice) is the one
  // slot that gets magenta; every other slice is a neutral slate tint, in
  // the same light-to-dark family as the rest of the page. Slot position is
  // fixed to data order, not re-sorted by value.
  const palette = ["#E5007D", "#7599AF", "#B7C9D5", "#CCD9E2", "#D9E3E9", "#E5EDF0", "#EFF3F4"];

  // in-fill labels are the one case that breaks "text never wears the data
  // color" — pick ink by each fill's own luminance so the label stays
  // readable against both the magenta slot and the pale neutral slots.
  function relativeLuminance(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }
  $: labelInk = data.map((_, i) =>
    relativeLuminance(palette[i % palette.length]) > 0.45 ? "#161A1D" : "#FFFFFF"
  );

  let hovered = null;
</script>

<div class="wrap">
  <svg width={size} height={size} role="img" aria-label="Donut chart">
    <g transform="translate({radius},{radius})">
      {#each arcs as a, i (data[i].label)}
        <path
          d={arcGen(a)}
          class="slice"
          class:active={hovered === i}
          role="presentation"
          style="fill: {palette[i % palette.length]}"
          on:mouseenter={() => (hovered = i)}
          on:mouseleave={() => (hovered = null)}
        />
        {#if a.value / total >= directLabelThreshold}
          {@const [lx, ly] = labelArc.centroid(a)}
          <text
            x={lx}
            y={ly}
            class="slice-label"
            style="fill: {labelInk[i]}"
            text-anchor="middle"
          >
            {Math.round((a.value / total) * 100)}%
          </text>
        {/if}
      {/each}

      <text class="center-value" y="-6" text-anchor="middle">
        {hovered !== null ? data[hovered].value : total}
      </text>
      <text class="center-label" y="16" text-anchor="middle">
        {hovered !== null ? data[hovered].label : "Total"}
      </text>
    </g>
  </svg>

  <ul class="legend">
    {#each data as d, i}
      <li
        class="legend-item"
        class:active={hovered === i}
        role="presentation"
        on:mouseenter={() => (hovered = i)}
        on:mouseleave={() => (hovered = null)}
      >
        <span class="swatch" style="background: {palette[i % palette.length]}" />
        <span class="legend-label">{d.label}</span>
        <span class="legend-value">{Math.round((d.value / total) * 100)}%</span>
      </li>
    {/each}
  </ul>
</div>

<p class="detail" aria-live="polite">
  {hovered !== null ? data[hovered].detail ?? "" : ""}
</p>

<style>
  .wrap {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    flex-wrap: wrap;
  }

  .slice {
    stroke: none;
    opacity: 1;
    transition: opacity 0.15s ease;
  }

  .slice.active {
    opacity: 0.8;
  }

  .slice-label {
    font-size: 0.7rem;
    font-weight: 600;
  }

  .center-value {
    fill: var(--ink);
    font-size: 1.5rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums lining-nums;
  }

  .center-label {
    fill: var(--ink-muted);
    font-size: 0.75rem;
  }

  .legend {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    min-width: 160px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--ink-muted);
    cursor: pointer;
    padding: 0.2rem 0.3rem;
  }

  .legend-item.active {
    background: var(--stroke-grid);
    color: var(--ink);
  }

  .swatch {
    width: 9px;
    height: 9px;
    flex-shrink: 0;
  }

  .legend-label {
    flex: 1;
  }

  .legend-value {
    font-variant-numeric: tabular-nums lining-nums;
    color: var(--ink);
    font-weight: 600;
  }

  .detail {
    margin: 1rem 0 0;
    min-height: 1.2em;
    font-size: 0.8rem;
    color: var(--ink-muted);
    line-height: 1.4;
  }
</style>
