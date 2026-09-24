import { readFileSync, writeFileSync } from "node:fs"
import { defineConfig } from "tsup"

// esbuild drops a banner that looks like a directive when bundling
// multiple "use client" source files together, so the directive is
// prepended manually after the build instead of via `banner`.
function prependUseClient(file: string) {
  const contents = readFileSync(file, "utf8")
  if (contents.startsWith('"use client"')) return
  writeFileSync(file, `"use client";\n${contents}`)
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom", "next", "next/link"],
  onSuccess: async () => {
    prependUseClient("dist/index.js")
    prependUseClient("dist/index.cjs")
  },
})
