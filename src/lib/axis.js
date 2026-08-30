import * as d3 from "d3";

// Svelte action that renders (and re-renders) a D3 axis into a <g> node.
// Usage: <g use:axis={{ scale, side: "bottom", ticks: 6 }} />
export function axis(node, { scale, side, ticks = 5, format, tickSize = 0 }) {
  const build = () => {
    const gen =
      side === "bottom"
        ? d3.axisBottom(scale)
        : side === "left"
        ? d3.axisLeft(scale)
        : d3.axisRight(scale);

    gen.ticks(ticks).tickSize(tickSize).tickPadding(8);
    if (format) gen.tickFormat(format);

    d3.select(node).call(gen);
    d3.select(node).select(".domain").remove();
  };

  build();

  return {
    update(next) {
      scale = next.scale;
      side = next.side;
      ticks = next.ticks ?? 5;
      format = next.format;
      tickSize = next.tickSize ?? 0;
      build();
    },
  };
}
