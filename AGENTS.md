# marked-gfm-alert

Marked extension for GitHub Flavored Markdown blockquote alerts (`> [!NOTE]`, `> [!TIP]`, etc.).

## Commands

- `bun test` — run tests
- `bun run lint` — check with Biome
- `bun run format` — auto-fix with Biome
- `bun run typecheck` — TypeScript type checking
- `bun run build` — build ESM + CJS via tsup

Always run `lint` then `typecheck` then `test` before considering work complete.

## Conventions

- Runtime: Bun (not Node). Use `bun` for all commands.
- Formatter/linter: Biome — tabs for indentation, double quotes for strings.
- Tests: `bun:test` — see `test/index.test.ts` for patterns.
- Exports: single entry `src/index.ts`, built to `dist/` (ESM + CJS + `.d.ts`).
- CSS: `alert.css` at root is shipped separately via `exports["./alert.css"]`.
- TypeScript: strict mode, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Peer dependency: `marked >=1.0.0` (dev uses ^15.0.0).
- Lint scope: `bun run lint` only checks `src/` (not tests).
