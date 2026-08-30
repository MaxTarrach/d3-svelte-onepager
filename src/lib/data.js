// Placeholder datasets for the template. Swap each generator for a real
// fetch/import — every chart only cares about the shape documented above it.

import * as d3 from "d3";
import co2CsvRaw from "./datafiles/CO2PerCapitaPacific.csv?raw";
import tabCyRaw from "./datafiles/TabCY-Table 1.csv?raw";
import sdgCsvRaw from "./datafiles/SPC,DF_SDG,3.0,filtered,2026-08-14 21-29-05.csv?raw";
import renewableTransitionRaw from "./datafiles/palau-renewable-share.csv?raw";

// Deterministic PRNG so the placeholder charts look the same on every reload.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

// BarChart: single series, one bar per category.
// shape: { label: string, value: number }[]
export const barData = [
  { label: "Jan", value: 42 },
  { label: "Feb", value: 58 },
  { label: "Mar", value: 51 },
  { label: "Apr", value: 67 },
  { label: "May", value: 73 },
  { label: "Jun", value: 61 },
  { label: "Jul", value: 84 },
];

// LineChart: GHG emissions per capita, Pacific Island countries & territories, 1970-2024.
// Source: SPC Climate Change Indicators (GHG_EMI_CAPITA). 17 series is far past the
// 8-hue categorical budget, so only the 4 largest latest-year emitters get a fixed
// hue + direct end label; the rest render muted and stay identifiable via hover.
// shape: { series: string, points: { x: number, y: number }[], featured: boolean }[]
const FEATURED_COUNT = 4;

const co2Rows = d3.csvParse(co2CsvRaw, (d) => ({
  country: d["Pacific Island Countries and territories"],
  year: +d.TIME_PERIOD,
  value: +d.OBS_VALUE,
}));

const co2LatestYear = d3.max(co2Rows, (d) => d.year);

const co2Countries = Array.from(
  d3.group(co2Rows, (d) => d.country),
  ([country, rows]) => {
    const points = rows
      .slice()
      .sort((a, b) => a.year - b.year)
      .map((d) => ({ x: d.year, y: d.value }));
    const latest = points.find((p) => p.x === co2LatestYear)?.y ?? 0;
    return { series: country, points, latest };
  }
  // ascending by latest value: top emitters land last, so they paint on top by default.
).sort((a, b) => a.latest - b.latest);

export const lineData = co2Countries.map((c, i) => ({
  series: c.series,
  points: c.points,
  featured: i >= co2Countries.length - FEATURED_COUNT,
}));

// AreaChart: single series over time.
// shape: { x: number, y: number }[]
export const areaData = Array.from({ length: 20 }, (_, i) => ({
  x: i,
  y: 15 + Math.sin(i / 3) * 8 + i * 1.4 + rand() * 4,
}));

// ScatterChart: up to 3 categorical groups (all-pairs series cap, see palette.md).
// shape: { group: string, x: number, y: number }[]
export const scatterData = ["Group A", "Group B", "Group C"].flatMap(
  (group, gi) =>
    Array.from({ length: 18 }, () => ({
      group,
      x: rand() * 100,
      y: rand() * 100 + gi * 15,
    }))
);

// DonutChart: categorical composition, ideally <= 6 slices before folding to "Other".
// shape: { label: string, value: number, detail?: string }[]
// Visitor purpose of travel to Palau. Source: Island Times
// (https://islandtimes.org/palau-closes-2025-strong-january-2026-arrivals-jump-13-as-japan-and-australia-surge/),
// based on entry and border data statistics.
export const donutData = [
  {
    label: "Leisure / Vacation",
    value: 92.4,
    detail: "Scuba diving, snorkeling, Rock Islands sightseeing, marine life, eco-tourism",
  },
  {
    label: "Military-Related",
    value: 4.5,
    detail: "Official military visits, regional defense cooperation, and historical WWII wreck site tours",
  },
  {
    label: "Visiting Friends & Relatives",
    value: 3.1,
    detail: "Family reunions, community ties, and local resident hosting",
  },
];

// MovementMap: visitor arrivals in Palau by source market, CY2015.
// Source: Palau Visitor Information Program, "Visitor arrivals by Country
// Group" (TabCY). Values are grouping-formatted ("31.191" = 31,191 people) —
// strip everything but digits before parsing. The sheet's first line is a
// free-text title, not the header row, so it's dropped before the ";"-delimited
// parse (the source file uses semicolons, not commas).
// shape: { origin: string, lat: number, lon: number, value: number }[]
function parseVisitorCount(raw) {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// Representative coordinates: each row is either a single country (its
// capital/largest city) or an aggregated region (its most common travel
// gateway), since the source groups some markets together.
const SOURCE_MARKETS = {
  JAPAN: { origin: "Japan", lat: 35.6895, lon: 139.6917 },
  "SOUTH KOREA": { origin: "South Korea", lat: 37.5665, lon: 126.978 },
  TAIWAN: { origin: "Taiwan", lat: 25.033, lon: 121.5654 },
  CHINA: { origin: "China", lat: 39.9042, lon: 116.4074 },
  "USA/CANADA": { origin: "USA / Canada", lat: 34.0522, lon: -118.2437 },
  EUROPE: { origin: "Europe", lat: 50.1109, lon: 8.6821 },
  AUSTRALIA: { origin: "Australia", lat: -33.8688, lon: 151.2093 },
  // "OTHERS" and "Total" rows are excluded — neither names a real place to plot.
};

const tabCyBody = tabCyRaw.split("\n").slice(1).join("\n");
const tabCyRows = d3.dsvFormat(";").parse(tabCyBody);

export const palau = { name: "Palau", lat: 7.515, lon: 134.5825 };

export const movementData = tabCyRows
  .map((d) => {
    const market = SOURCE_MARKETS[d["Country Group"]?.trim().toUpperCase()];
    if (!market) return null;
    return { ...market, value: parseVisitorCount(d["CY2015"]) };
  })
  .filter(Boolean)
  .sort((a, b) => b.value - a.value);

// IsotypeChart: Palau residents vs. visiting tourists, as Neurath/Arntz-style
// pictograms — a fixed-size figure repeated, never resized, to show
// magnitude.
export const isotypeUnit = 1000; // 1 figure = 1,000 people
export const isotypeResidentPopulation = 17000; // Palau, resident population
// Same CY2015 multi-market sum MovementMap plots (~160k) — the real total,
// not a rounded stand-in.
export const isotypeVisitorTotal = d3.sum(movementData, (d) => d.value);

// GuessSlider: Palau's renewable-energy share of total final energy
// consumption, most recent reporting year. SDG indicator 7.2.1
// (EG_FEC_RNEW), SPC SDG Data Explorer. Standard comma CSV — unlike TabCY,
// no manual delimiter/header handling needed, d3.csvParse reads it as-is.
const sdgRows = d3.csvParse(sdgCsvRaw);

const palauRenewableRows = sdgRows
  .filter(
    (d) =>
      d.GEO_PICT === "PW" && d.INDICATOR === "EG_FEC_RNEW" && d.OBS_VALUE !== ""
  )
  .map((d) => ({ year: +d.TIME_PERIOD, value: +d.OBS_VALUE }))
  .sort((a, b) => a.year - b.year);

const palauRenewableLatest = palauRenewableRows[palauRenewableRows.length - 1];

export const renewableShareYear = palauRenewableLatest.year; // 2022
export const renewableShareValue = palauRenewableLatest.value; // 0.58 (percent)

// StatRow: hero stat tiles.
// shape: { label: string, value: string, delta: number, trend: number[] }[]
export const statData = [
  {
    label: "Total sessions",
    value: "12.9K",
    delta: 8.2,
    trend: Array.from({ length: 12 }, (_, i) => 40 + i * 2 + rand() * 6),
  },
  {
    label: "Conversion rate",
    value: "4.3%",
    delta: -1.1,
    trend: Array.from({ length: 12 }, (_, i) => 30 - i * 0.5 + rand() * 6),
  },
  {
    label: "Avg. order value",
    value: "$68.40",
    delta: 3.4,
    trend: Array.from({ length: 12 }, (_, i) => 25 + i * 1.2 + rand() * 5),
  },
];

// TransitionRings: Palau's fossil-fuel share, 2000-2050 — historical readings
// plus the government's own roadmap targets/projections beyond 2021.
// shape: { year, share, nonRenewable, nonRenewableAbsTJ, type, milestone }[]
const renewableTransitionRows = d3.csvParse(renewableTransitionRaw, (d) => ({
  year: +d.year,
  share: +d.share, // renewable share, percent
  type: d.type, // "historical" | "target" | "projection"
  milestone: d.milestone || null,
}));

// Palau's roadmap and NDC publish renewable-share *targets* only as
// percentages — there is no published absolute-energy target for 2025-2050.
// The only real absolute readings available are IRENA's Total Energy Supply
// figures (Palau_Oceania_RE_SP.pdf, IRENA statistics, data updated
// 22 Sep 2025): 2,996 TJ total in 2017, 3,102 TJ total in 2022. TFEC has
// been essentially flat over that measured span (+3.5% across five years),
// so every year's absolute non-renewable draw below is modeled as that
// year's measured/target renewable share applied to the average of the two
// real IRENA totals — i.e. an estimate, not a per-year measurement.
export const assumedTotalTFEC_TJ = (2996 + 3102) / 2; // 3,049 TJ

export const renewableTransitionData = renewableTransitionRows
  .map((d) => ({
    ...d,
    nonRenewable: 100 - d.share,
    nonRenewableAbsTJ: ((100 - d.share) / 100) * assumedTotalTFEC_TJ,
  }))
  .sort((a, b) => a.year - b.year);
