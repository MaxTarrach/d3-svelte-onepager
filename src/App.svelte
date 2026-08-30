<script>
  import { onMount } from "svelte";
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

  let progress = 0;

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  }

  onMount(() => {
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  });
</script>

<div class="progress-bar" style="width: {progress}%" role="presentation" />

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

  <Section eyebrow="Composition" title="Why Visitors Come To Palau">
    <span slot="deck">
      Nine in ten arrivals are on vacation: diving, snorkeling, and the
      Rock Islands. The rest split between military-related visits and
      residents' friends and family.
    </span>
    <DonutChart data={donutData} />
    <span slot="citation">
      Source: <a href="https://islandtimes.org/palau-closes-2025-strong-january-2026-arrivals-jump-13-as-japan-and-australia-surge/" target="_blank" rel="noopener">Island Times, "Palau Closes 2025 Strong; January 2026 Arrivals Jump 13% as Japan and Australia Surge"</a>
    </span>
  </Section>

  <Section
    eyebrow="Origins of tourists"
    title="East Asia Drives Palau's Island Tourism"
  >
    <span slot="deck">
      Palau's tourism is an East Asian story. China, Japan, Taiwan and South Korea account for roughly nine in ten arrivals, with China alone supplying more than half. Everything else is small by comparison: the US and Canada together, then Europe, then Australia at under 1%. A visitor economy resting this heavily on one source market inherits that market's politics, currency and flight schedules and so does Palau's grid.
    </span>
    <MovementMap data={movementData} destination={palau} />
    <span slot="citation">
      Source: <a href="https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.TRSM_ARR.&pd=,&to[TIME_PERIOD]=false" target="_blank" rel="noopener">SPC Pacific Data Hub, Climate Change Indicators — international visitor arrivals (TRSM_ARR)</a>;
      <a href="https://www.palaugov.pw/executive-branch/ministries/finance/budgetandplanning/immigration-tourism-statistics/" target="_blank" rel="noopener">Palau Bureau of Budget & Planning, Immigration & Tourism Statistics</a>
    </span>
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
    <span slot="citation">
      Source: <a href="https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.TRSM_ARR.&pd=,&to[TIME_PERIOD]=false" target="_blank" rel="noopener">SPC Pacific Data Hub, Climate Change Indicators — international visitor arrivals (TRSM_ARR)</a>;
      <a href="https://www.palaugov.pw/executive-branch/ministries/finance/budgetandplanning/immigration-tourism-statistics/" target="_blank" rel="noopener">Palau Bureau of Budget & Planning, Immigration & Tourism Statistics</a>
    </span>
  </Section>

  <Section eyebrow="" title="How Green Is Palau's Energy Mix?">
    <span slot="deck">
      Before you scroll on: what share of Palau's electricity do you think comes from renewables? Take a guess.
    </span>
    <GuessSlider
      answerValue={renewableShareValue}
      answerYear={renewableShareYear}
    />
    <span slot="citation">
      Source: <a href="https://stats.pacificdata.org/vis?fs[0]=Development%20indicators,0%7CSustainable%20Development%20Goals%23SDG%23&pg=0&fc=Development%20indicators&bp=true&snb=18&df[ds]=ds%3ASPC2&df[id]=DF_SDG&df[ag]=SPC&df[vs]=3.0&dq=A.EG_FEC_RNEW.._T._T._T._T._T._T._Z._T&pd=,&to[TIME_PERIOD]=false" target="_blank" rel="noopener">SPC Pacific Data Hub, SDG Indicators — renewable share of total final energy consumption (EG_FEC_RNEW)</a>
    </span>
  </Section>

  <Section
    eyebrow="A Pacific Outlier"
    title="GHG Emissions Per Capita"
  >
    <span slot="deck">
      Palau sits in a band of its own, emitting several times more greenhouse gas per resident than any other Pacific territory: the arithmetic of a diesel grid serving nine visitors for every person counted in the denominator.
    </span>
    <LineChart data={lineData} />
    <span slot="citation">
      Source: <a href="https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.GHG_EMI_CAPITA.&pd=,&to[TIME_PERIOD]=false" target="_blank" rel="noopener">SPC Pacific Data Hub, Climate Change Indicators — GHG emissions per capita (GHG_EMI_CAPITA)</a>
    </span>
  </Section>

  <Section eyebrow="Future Projection" title="Palau's Path Off Fossil Fuels">
    <span slot="deck">
      Non-renewable energy consumption, 2000&ndash;2050, in terajoules. Each
      ring is one year: 2000 draws a nearly full circle of fossil
      dependence, and every later year paints a smaller disc over it, so the
      shrinking band is the actual ground still to cover before the 2045
      target collapses to a single point.
    </span>
    <TransitionRings data={renewableTransitionData} totalTFEC_TJ={assumedTotalTFEC_TJ} />
    <span slot="citation">
      Source: <a href="https://stats.pacificdata.org/vis?fs[0]=Development%20indicators,0%7CSustainable%20Development%20Goals%23SDG%23&pg=0&fc=Development%20indicators&bp=true&snb=18&df[ds]=ds%3ASPC2&df[id]=DF_SDG&df[ag]=SPC&df[vs]=3.0&dq=A.EG_FEC_RNEW.._T._T._T._T._T._T._Z._T&pd=,&to[TIME_PERIOD]=false" target="_blank" rel="noopener">SPC Pacific Data Hub, SDG Indicators — renewable share of total final energy consumption (EG_FEC_RNEW)</a>;
      <a href="https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2022/Jun/IRENA_Palau_RE_Roadmap_2022.pdf" target="_blank" rel="noopener">IRENA, Palau Renewable Energy Roadmap (2022)</a>
    </span>
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
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--magenta);
    z-index: 20;
  }

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
