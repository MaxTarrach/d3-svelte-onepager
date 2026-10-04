# Overtourism in Palau – From Dependence to Future Pioneer

**Live site:** https://maxtarrach.github.io/d3-svelte-onepager/

A scrolling, single-page data story about Palau, a Pacific island nation that lives from the very visitors whose footprint threatens what they come to see.

---

## Introduction

Palau is roughly the size of New York City, spread across some 340 islands and home to fewer than 20,000 people. Its limestone Rock Islands, reef walls and jellyfish lakes make it one of the most photographed places on Earth, and tourism is the backbone of its economy.

That creates a difficult relationship. Palau needs tourists, yet every visitor adds to the strain on reefs, fresh water and, above all, an energy system that runs on imported fuel. Air-conditioned hotel rooms, desalinated water and dive-boat compressors all trace back to the same barrel of oil arriving by tanker.

This project brings together a variety of data sources — visitor statistics, emissions data, SDG energy indicators and national energy roadmaps — to show both sides of this dependence: how much Palau relies on tourism, how much that tourism costs the environment, and how far the country still has to go to deliver the sustainability it promises its visitors.

The page is structured in six chapters:

1. **Why visitors come to Palau** – purpose of travel (donut chart)
2. **East Asia drives Palau's tourism** – visitor flows by source market (animated movement map)
3. **Tourists outnumber locals** – residents vs. visitors as Isotype pictograms
4. **How green is the energy mix?** – an interactive "guess the number" slider
5. **GHG emissions per capita** – Palau compared with other Pacific countries and territories (line chart)
6. **Palau's path off fossil fuels** – historical renewable share and roadmap targets to 2050 (transition rings)

---

## Data Sources

| Topic | Source | Used in |
|---|---|---|
| Purpose of travel | [Island Times – "Palau Closes 2025 Strong; January 2026 Arrivals Jump 13% as Japan and Australia Surge"](https://islandtimes.org/palau-closes-2025-strong-january-2026-arrivals-jump-13-as-japan-and-australia-surge/) | Donut chart |
| International visitor arrivals | [SPC Pacific Data Hub – Climate Change Indicators (TRSM_ARR)](https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.TRSM_ARR.&pd=,&to[TIME_PERIOD]=false) | Movement map, Isotype chart |
| Visitor arrivals by country group, CY2008–CY2025 | [Palau Bureau of Budget & Planning – Immigration & Tourism Statistics](https://www.palaugov.pw/executive-branch/ministries/finance/budgetandplanning/immigration-tourism-statistics/) (`TabCY-Table 1.csv`) | Movement map, Isotype chart |
| Renewable share of total final energy consumption (SDG 7.2.1) | [SPC Pacific Data Hub – SDG Indicators (EG_FEC_RNEW)](https://stats.pacificdata.org/vis?fs[0]=Development%20indicators,0%7CSustainable%20Development%20Goals%23SDG%23&pg=0&fc=Development%20indicators&bp=true&snb=18&df[ds]=ds%3ASPC2&df[id]=DF_SDG&df[ag]=SPC&df[vs]=3.0&dq=A.EG_FEC_RNEW.._T._T._T._T._T._T._Z._T&pd=,&to[TIME_PERIOD]=false) | Guess slider, transition rings |
| Greenhouse gas emissions per capita, 1970–2024 | [SPC Pacific Data Hub – Climate Change Indicators (GHG_EMI_CAPITA)](https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.GHG_EMI_CAPITA.&pd=,&to[TIME_PERIOD]=false) (`CO2PerCapitaPacific.csv`) | Line chart |
| Renewable energy roadmap & total energy supply | [IRENA – Palau Renewable Energy Roadmap (2022)](https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2022/Jun/IRENA_Palau_RE_Roadmap_2022.pdf); IRENA energy statistics (2,996 TJ in 2017, 3,102 TJ in 2022) | Transition rings |
| Historical renewable share & targets | IndexMundi, EBSCO Power and Energy, Macrotrends, Palau Intended NDC, Palau Energy Roadmap 2030, Blue Planet Alliance, Palau NDC 3.0 / UNFCCC (`palau-renewable-share.csv`) | Transition rings |

All raw data files live in `src/lib/datafiles/` and are parsed in `src/lib/data.js`.

> **Note on modelled values:** Palau publishes its renewable targets only as percentages. The absolute non-renewable energy figures in the transition-rings chart are therefore estimates, calculated by applying each year's share to the average of IRENA's two measured totals (≈ 3,049 TJ).

---

## Palau Has an Overtourism Issue

Palau's tourism is large relative to its population and highly concentrated:

- **Tourists outnumber residents roughly 9 to 1.** In 2015, about 160,000 visitors arrived in a country of around 17,000 residents. The Isotype chart makes this tangible: 17 figures for residents, 160 for visitors — the same figure, just with a mask, snorkel and fins.
- **Nearly everyone comes for nature.** More than 92% of arrivals travel for leisure — diving, snorkeling, the Rock Islands and marine life — putting direct pressure on the reefs and lagoons that define the country.
- **One region dominates.** China, Japan, Taiwan and South Korea account for roughly nine in ten arrivals. An economy resting this heavily on a few source markets inherits their politics, currencies and flight schedules, as the collapse to around 5,000 arrivals in 2021 showed.
- **Arrivals are climbing again.** After the pandemic, visitor numbers recovered to more than 71,000 in 2025 and continue to rise.

---

## Palau's Energy Supply Is Almost Completely Based on Fossil Fuels

The visitors drawn by Palau's green image are powered by a grid that is anything but:

- **Under 1% renewable.** According to SDG indicator 7.2.1, renewables covered only about 0.58% of Palau's total final energy consumption in 2022. The interactive slider asks readers to guess this number first — most guess far too high.
- **A Pacific outlier in emissions.** Palau emits several times more greenhouse gas per resident than any other Pacific country or territory — around 87 tonnes per capita in 2024. Part of that is the arithmetic of a diesel grid serving many visitors per resident.
- **Ambitious targets, long road.** Palau's roadmaps aim for 70% renewables by 2030 and 100% by 2045–2050. The transition-rings chart shows each year's remaining fossil dependence as a shrinking disc, making visible how much ground is still to cover.

Palau has been early before — with its marine sanctuary, reef-safe sunscreen ban and the Palau Pledge stamped into every visitor's passport. Its energy transition is the harder test: whether a place can keep selling its beauty without consuming it.

---

## Built with Svelte and D3.js for the Pacific Dataviz Challenge

Created by **Maximilian Tarrach** for the **Pacific Dataviz Challenge 2026**.
