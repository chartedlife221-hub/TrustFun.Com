// Bundles the backend to a single dist/index.js. Real npm dependencies stay
// external (Prisma Client in particular needs to resolve its generated
// query engine relative to node_modules — bundling it breaks that). The
// one package NOT marked external is @trustfun/shared: it has no build
// step of its own, so esbuild inlines its TS source directly here. That's
// deliberate — it's what keeps this workspace immune to the stale
// compiled-artifact trap this session already hit once with hand-copied
// frontend/backend types.
import { build } from "esbuild";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));
const external = Object.keys(pkg.dependencies ?? {}).filter((name) => name !== "@trustfun/shared");

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  external,
  sourcemap: true,
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});

console.log("Backend bundled to dist/index.js");
