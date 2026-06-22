# marked-gfm-alert

A [marked](https://github.com/markedjs/marked) extension that adds [GitHub Flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts) blockquote alert support. Renders `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]` into styled alert boxes with octicon icons.

## Installation

```bash
npm install marked-gfm-alert marked
```

Or with bun:

```bash
bun add marked-gfm-alert marked
```

## Quick Start

```ts
import { marked } from "marked";
import { gfmAlert } from "marked-gfm-alert";

marked.use(gfmAlert());

const html = marked.parse(`
> [!NOTE]
> Useful information that users should know, even when skimming content.
`);
```

Output:

```html
<div class="markdown-alert markdown-alert-note" dir="auto">
  <p class="markdown-alert-title" dir="auto">
    <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z..."></path>
    </svg>
    NOTE
  </p>
  <p>Useful information that users should know, even when skimming content.</p>
</div>
```

## Styling

Import the provided CSS to match GitHub's alert appearance:

```ts
import "marked-gfm-alert/alert.css";
```

Or add it to your HTML:

```html
<link rel="stylesheet" href="node_modules/marked-gfm-alert/alert.css" />
```

The CSS uses `prefers-color-scheme` to switch between light and dark themes automatically.

## Options

Pass an options object to `gfmAlert()` to customize behavior:

```ts
marked.use(gfmAlert({
  className: "my-custom-alert",
}));
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `className` | `string` | `""` | Extra CSS class names appended to the alert container. |

### Custom class example

```ts
marked.use(gfmAlert({ className: "shadow-lg rounded" }));
```

This produces:

```html
<div class="markdown-alert markdown-alert-note shadow-lg rounded" dir="auto">
  ...
</div>
```

## Supported Alert Types

| Syntax | Type | Color |
|--------|------|-------|
| `> [!NOTE]` | note | Blue |
| `> [!TIP]` | tip | Green |
| `> [!IMPORTANT]` | important | Purple |
| `> [!WARNING]` | warning | Yellow |
| `> [!CAUTION]` | caution | Red |

The syntax is case-insensitive: `> [!note]` and `> [!Note]` work the same as `> [!NOTE]`.

## TypeScript

This package exports types for type-safe usage:

```ts
import type { AlertType, GfmAlertOptions } from "marked-gfm-alert";
import { ALERT_TYPES } from "marked-gfm-alert";

// ALERT_TYPES = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"]
```

## Related

- [marked](https://github.com/markedjs/marked) — The markdown parser this extension targets
- [remark-github-blockquote-alert](https://github.com/jaywcjlove/remark-github-blockquote-alert) — The remark equivalent that inspired this project

## License

MIT
