<script>
  import Section from "./lib/Section.svelte";
  import TextPlaceholder from "./lib/TextPlaceholder.svelte";
  import HeroImage from "./lib/HeroImage.svelte";
  import LineChart from "./lib/charts/LineChart.svelte";
  import DonutChart from "./lib/charts/DonutChart.svelte";
  import MovementMap from "./lib/charts/MovementMap.svelte";
  import IsotypeChart from "./lib/charts/IsotypeChart.svelte";
  import GuessSlider from "./lib/charts/GuessSlider.svelte";
  import TransitionRings from "./lib/charts/TransitionRings.svelte";
  import {
    lineData,
    donutData,
    movementData,
    palau,
    isotypeResidentPopulation,
    isotypeVisitorTotal,
    isotypeUnit,
    renewableShareYear,
    renewableShareValue,
    renewableTransitionData,
    assumedTotalTFEC_TJ,
  } from "./lib/data.js";
</script>

<header class="page-header">
  <div class="header-inner">
    <p class="brand">Overtourism in Palau</p>
  </div>
</header>

<main>
  <div class="hero-slot">
    <HeroImage />
  </div>

  <TextPlaceholder eyebrow="Intro">
    Placeholder text — replace with the real intro copy.
  </TextPlaceholder>

  <Section eyebrow="Composition" title="Traffic by channel">
    <span slot="deck">
      A donut shows part-to-whole composition. Larger slices carry a direct
      percentage label; smaller ones fall back to the legend.
    </span>
    <DonutChart data={donutData} />
  </Section>

  <Section
    eyebrow="Flow"
    title="Visitor arrivals into Palau by source market, CY2015"
  >
    <span slot="deck">
      Seven source markets from the Palau Visitor Information Program's
      "Visitor arrivals by Country Group" table, each routed to Palau along
      its great-circle path and animated to show relative traffic.
    </span>
    <MovementMap data={movementData} destination={palau} />
  </Section>

  <Section eyebrow="Scale" title="Palau residents against visiting tourists">
    <span slot="deck">
      A pictogram specimen sheet, after Otto and Marie Neurath / Gerd
      Arntz's Isotype method: a resident and a snorkelling visitor share
      one grid, one baseline, one body — the visitor differs by only three
      added attributes. Every figure below is drawn at a single fixed
      size; magnitude comes only from how many are drawn.
    </span>
    <IsotypeChart
      residentTotal={isotypeResidentPopulation}
      visitorTotal={isotypeVisitorTotal}
      unit={isotypeUnit}
    />
  </Section>

  <TextPlaceholder eyebrow="Energy">
    Placeholder text — replace with copy on where Palau's energy comes from.
  </TextPlaceholder>

  <Section eyebrow="Guess" title="How green is Palau's energy mix?">
    <span slot="deck">
      SDG indicator 7.2.1, renewable share of total final energy
      consumption (SPC SDG Data Explorer). Guess before you check.
    </span>
    <GuessSlider
      answerValue={renewableShareValue}
      answerYear={renewableShareYear}
    />
  </Section>

  <Section
    eyebrow="Change over time"
    title="GHG emissions per capita, Pacific Island countries & territories"
  >
    <span slot="deck">
      17 territories, 1970&ndash;2024 (SPC Climate Change Indicators). The four
      largest 2024 emitters get a fixed color and end label; the rest render
      muted — hover any line, featured or not, to trace its country and value.
    </span>
    <LineChart data={lineData} />
  </Section>

  <TextPlaceholder eyebrow="Example">
    Placeholder text — replace with copy on how Palau can serve as an example
    for efficient and effective change.
  </TextPlaceholder>

  <Section eyebrow="Countdown" title="Palau's path off fossil fuels">
    <span slot="deck">
      Non-renewable energy consumption, 2000&ndash;2050, in terajoules. Each
      ring is one year — 2000 draws a nearly full circle of fossil
      dependence, and every later year paints a smaller disc over it, so the
      shrinking band is the actual ground still to cover before the 2045
      target collapses to a single point.
    </span>
    <TransitionRings data={renewableTransitionData} totalTFEC_TJ={assumedTotalTFEC_TJ} />
  </Section>

  <TextPlaceholder eyebrow="Outro">
    Placeholder text — replace with the real outro copy.
  </TextPlaceholder>

  <footer class="page-footer">
    <p>
      Created by Maximilian Tarrach for the Pacific Dataviz Challenge 2026 using Svelte and d3.js.
    </p>
  </footer>
</main>

<style>
  .page-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--paper);
    border-bottom: 1px solid var(--stroke-hairline);
  }

  .hero-slot {
    max-width: 760px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 0;
  }

  .header-inner {
    max-width: 760px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
  }

  .brand {
    margin: 0;
    font-size: var(--t-label);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .page-footer {
    max-width: 760px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    color: var(--ink-muted);
    font-size: var(--t-label);
    border-top: 1px solid var(--stroke-hairline);
  }

  code {
    background: var(--s-100);
    padding: 0.1rem 0.35rem;
    font-size: 0.85em;
  }
</style>
