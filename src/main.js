import "./lib/styles/atlas-tokens.css";
import "./lib/styles/atlas-compat.css";
import "./app.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
