<script>
  export let eyebrow = "";
  export let title = "";
  export let id = undefined;
</script>

<!--
  One page = one <Section> per chart, stacked vertically. Drop this file
  around any chart component to get consistent spacing, heading, and copy.
-->
<section class="section" {id}>
  <div class="section-head">
    {#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
    <h2>{title}</h2>
    <p class="deck"><slot name="deck" /></p>
  </div>

  <div class="chart-slot">
    <slot />
  </div>

  <p class="citation">
    <slot name="citation">Source: placeholder citation — replace with the real source.</slot>
  </p>
</section>

<style>
  .section {
    max-width: 760px;
    margin: 0 auto;
    padding: 5rem 1.5rem;
    border-top: 1px solid var(--stroke-hairline);
  }

  .section:first-of-type {
    border-top: none;
  }

  .section-head {
    margin-bottom: 2rem;
  }

  .eyebrow {
    margin: 0 0 0.5rem;
    font-size: var(--t-label);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: var(--t-title);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--ink);
  }

  .deck {
    margin: 0;
    max-width: 60ch;
    font-size: var(--t-body);
    color: var(--ink-muted);
    line-height: 1.5;
  }

  .chart-slot {
    background: var(--field);
    border: 1px solid var(--stroke-hairline);
    border-radius: var(--radius);
    padding: 1.5rem;
  }

  .citation {
    margin: 0.6rem 0 0;
    font-size: var(--t-micro);
    color: var(--ink-muted);
    line-height: 1.4;
  }
</style>
