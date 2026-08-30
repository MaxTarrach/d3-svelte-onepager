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

  <TextPlaceholder eyebrow="Many reasons to travel to Palau">
    Palau is roughly the size of New York City, scattered across 340 islands, and home to fewer than 20,000 people. It is also one of the most photographed places on Earth. The limestone domes of the Rock Islands, the sheer drop of the Blue Corner reef wall, the stingless jellyfish that swarm a landlocked marine lake; these images travel far better than the country's own electricity grid does.

That grid still runs largely on fuel arriving by tanker, and the visitors drawn by Palau's environmental reputation are the ones drawing hardest on it. Air-conditioned rooms, desalinated water, and dive boat compressors all trace back to the same imported barrel. As arrivals climb back toward pre-pandemic levels, this piece looks at where Palau stands today: how much energy tourism consumes, where it comes from, and how far the country still is from the sustainability it sells.
  </TextPlaceholder>

  <Section eyebrow="Composition" title="Traffic by channel">
    <span slot="deck">
      A donut shows part-to-whole composition. Larger slices carry a direct
      percentage label; smaller ones fall back to the legend.
    </span>
    <DonutChart data={donutData} />
  </Section>

  <Section
    eyebrow="Origins of tourists"
    title="East Asia Drives Palau's Island Tourism"
  >
    <span slot="deck">
      Palau's tourism is an East Asian story. China, Japan, Taiwan and South Korea account for roughly nine in ten arrivals, with China alone supplying more than half. Everything else is small by comparison: the US and Canada together, then Europe, then Australia at under 1%. A visitor economy resting this heavily on one source market inherits that market's politics, currency and flight schedules and so does Palau's grid.
    </span>
    <MovementMap data={movementData} destination={palau} />
  </Section>

  <Section eyebrow="Comparison" title="A Pristine Paradise Where Tourists Outnumber The Remaning Locals">
    <span slot="deck">
      Seventeen figures stand for everyone who lives in Palau. A hundred and sixty stand for the people who arrived in a single year. The two symbols are deliberately the same height, on the same baseline, differing only by a mask, a snorkel and a pair of fins, because a visitor is not a smaller or larger kind of person, only a temporary one. What changes is the count. Nine visitors for every resident, all drawing on the same reefs, the same water, the same imported fuel.
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

  <TextPlaceholder eyebrow="A future beacon of environmentally friendly travel">
    What makes Palau worth watching is not that it has solved this. It hasn't. The gap between the pledge stamped into every visitor's passport and the diesel burning behind every hotel lobby is still wide. But Palau is running the experiment at a scale where the results are visible. A country of fewer than 20,000 people can see exactly what a new solar array does to its fuel bill, exactly what an extra ten thousand visitors do to its grid. Larger nations lose those numbers in the noise.

That legibility is the export. Palau has already been early on things the rest of the world arrived at later: the marine sanctuary, the sunscreen ban, the visitor pledge. Its energy transition is now the harder version of the same test, because it asks whether a place can keep selling its own beauty without consuming it. If Palau finds the answer, it will not be because the problem was small there. It will be because it was impossible to ignore.
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
