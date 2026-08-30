<script>
  export let eyebrow = "";
</script>

<!--
  A prose-only beat between charts — same rhythm as <Section> (760px column,
  hairline top rule) but no chart-slot chrome, since there's no figure here.
-->
<section class="text-block">
  {#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
  <p class="lead">
    <slot>Placeholder text — replace with the real copy.</slot>
  </p>
</section>

<style>
  .text-block {
    max-width: 760px;
    margin: 0 auto;
    padding: 5rem 1.5rem;
    border-top: 1px solid var(--stroke-hairline);
  }

  .eyebrow {
    margin: 0 0 0.5rem;
    font-size: var(--t-label);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  .lead {
    margin: 0;
    max-width: 60ch;
    font-size: var(--t-lead);
    color: var(--ink);
    line-height: 1.5;
  }
</style>
