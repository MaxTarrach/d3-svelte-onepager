<script>
  // Isotype specimen sheet, after Otto and Marie Neurath / Gerd Arntz:
  // a resident and a visitor pictogram sharing one 120x200 grid, baseline,
  // and body — the visitor differs only by three added attributes (mask,
  // snorkel, fins). Magnitude is shown purely by repeating the fixed-size
  // figure; nothing is ever scaled to encode value.
  export let residentTotal = 17000;
  export let visitorTotal = 89000;
  export let unit = 1000; // quantity represented by one figure

  const fmt = (n) => n.toLocaleString("en-US");

  $: residentCount = Math.round(residentTotal / unit);
  $: visitorCount = Math.round(visitorTotal / unit);

  const ICON_W = 14;
  const ICON_H = 23;
  const GAP_X = 3;
  const GAP_Y = 4;
</script>

<p class="caption">
  Two pictograms built on the same grid — a resident and a snorkelling
  visitor. Every figure below is drawn at this same fixed size; a market's
  weight is read only by counting figures, {fmt(unit)} people each, never by
  a figure changing size.
</p>

<svg width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <symbol id="isotype-resident" viewBox="0 0 120 200">
      <path d="M44 48V28a16 16 0 0 1 32 0v20Z" />
      <path d="M54 44h12v16H54Z" />
      <path d="M40 58h40a8 8 0 0 1 8 8v6H32v-6a8 8 0 0 1 8-8Z" />
      <path d="M46 72h28v60H46Z" />
      <path d="M32 72h11v46.5a5.5 5.5 0 0 1-11 0Z" />
      <path d="M77 72h11v46.5a5.5 5.5 0 0 1-11 0Z" />
      <path
        d="M46 126h28v70H62.5v-56a2.5 2.5 0 0 0-5 0v56H46Z"
      />
    </symbol>

    <symbol id="isotype-tourist" viewBox="0 0 120 200">
      <path
        fill-rule="evenodd"
        d="M44 48V28a16 16 0 0 1 32 0v20Z
           M50 24h20a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H50a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3Z"
      />
      <path d="M79 34V16a3 3 0 0 1 6 0v24H74v-6Z" />
      <path d="M54 44h12v16H54Z" />
      <path d="M40 58h40a8 8 0 0 1 8 8v6H32v-6a8 8 0 0 1 8-8Z" />
      <path d="M46 72h28v60H46Z" />
      <path d="M32 72h11v46.5a5.5 5.5 0 0 1-11 0Z" />
      <path d="M77 72h11v46.5a5.5 5.5 0 0 1-11 0Z" />
      <path d="M46 126h28v58H62.5v-44a2.5 2.5 0 0 0-5 0v44H46Z" />
      <path d="M57.5 182v14H32a6 6 0 0 1 0-12L57.5 182Z" />
      <path d="M62.5 182v14H88a6 6 0 0 0 0-12L62.5 182Z" />
    </symbol>
  </defs>
</svg>

<div class="key">
  <div class="key-figure">
    <svg
      class="specimen specimen-resident"
      width="72"
      height="120"
      viewBox="0 0 120 200"
      role="img"
      aria-label="Resident pictogram"
    >
      <use href="#isotype-resident" xlink:href="#isotype-resident" />
    </svg>
    <span class="key-label">Resident</span>
  </div>

  <div class="key-figure">
    <svg
      class="specimen specimen-tourist"
      width="72"
      height="120"
      viewBox="0 0 120 200"
      role="img"
      aria-label="Visitor pictogram"
    >
      <use href="#isotype-tourist" xlink:href="#isotype-tourist" />
    </svg>
    <span class="key-label key-label-tourist">Visitor</span>
  </div>

  <ul class="key-notes">
    <li>Same body, same height, same baseline.</li>
    <li>The visitor differs by three added attributes: mask, snorkel, fins.</li>
    <li>More people = more symbols, never a bigger symbol.</li>
  </ul>
</div>

<div class="divider" role="separator" />

<div class="arrangement">
  <div class="group">
    <div class="group-label">
      Residents <span class="group-value">{fmt(residentTotal)} people</span>
    </div>
    <div
      class="icon-grid"
      style="grid-template-columns: repeat(auto-fill, {ICON_W}px); gap: {GAP_Y}px {GAP_X}px;"
      role="img"
      aria-label="{fmt(residentTotal)} residents, shown as {residentCount} figures of {fmt(
        unit
      )} each"
    >
      {#each Array(residentCount) as _, i (i)}
        <svg
          class="figure figure-resident"
          width={ICON_W}
          height={ICON_H}
          viewBox="0 0 120 200"
          aria-hidden="true"
        >
          <use href="#isotype-resident" xlink:href="#isotype-resident" />
        </svg>
      {/each}
    </div>
  </div>

  <div class="group">
    <div class="group-label group-label-tourist">
      Visitors <span class="group-value">{fmt(visitorTotal)} people</span>
    </div>
    <div
      class="icon-grid"
      style="grid-template-columns: repeat(auto-fill, {ICON_W}px); gap: {GAP_Y}px {GAP_X}px;"
      role="img"
      aria-label="{fmt(visitorTotal)} visitors, shown as {visitorCount} figures of {fmt(
        unit
      )} each"
    >
      {#each Array(visitorCount) as _, i (i)}
        <svg
          class="figure figure-tourist"
          width={ICON_W}
          height={ICON_H}
          viewBox="0 0 120 200"
          aria-hidden="true"
        >
          <use href="#isotype-tourist" xlink:href="#isotype-tourist" />
        </svg>
      {/each}
    </div>
  </div>
</div>

<p class="unit-note">1 symbol = {fmt(unit)} people</p>

<style>
  .caption {
    margin: 0 0 1.5rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--ink-muted);
    max-width: 56em;
  }

  .key {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .key-figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  /* <use> clones the <symbol> into a shadow instance that descendant
     selectors can't reach — only inherited properties (like fill) cross
     that boundary, so color is set on the wrapping <svg>, not the paths. */
  .specimen-resident,
  .figure-resident {
    fill: var(--ink);
  }

  .specimen-tourist,
  .figure-tourist {
    fill: var(--magenta);
  }

  .key-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .key-label-tourist {
    color: var(--magenta-ink);
  }

  .key-notes {
    list-style: none;
    margin: 0.35rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.8rem;
    line-height: 1.4;
    color: var(--ink-muted);
    max-width: 32em;
  }

  .key-notes li {
    padding-left: 0.9rem;
    position: relative;
  }

  .key-notes li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: var(--ink-muted);
  }

  .divider {
    border: none;
    border-top: 1px solid var(--stroke-grid);
    margin: 2rem 0;
  }

  .arrangement {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .group {
    flex: 1 1 220px;
    min-width: 0;
  }

  .group + .group {
    padding-left: 1.5rem;
    border-left: 1px solid var(--stroke-grid);
  }

  @media (max-width: 560px) {
    .group + .group {
      padding-left: 0;
      border-left: none;
    }
  }

  .group-label {
    margin-bottom: 0.6rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .group-label-tourist {
    color: var(--magenta-ink);
  }

  .group-value {
    font-weight: 400;
    text-transform: none;
    letter-spacing: normal;
    color: var(--ink-muted);
  }

  .icon-grid {
    display: grid;
    align-content: start;
    justify-content: start;
  }

  .figure {
    flex-shrink: 0;
  }

  .unit-note {
    margin: 1.75rem 0 0;
    font-size: 0.75rem;
    color: var(--ink-muted);
  }
</style>
