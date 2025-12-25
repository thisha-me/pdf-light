# pdf-light

[![CI](https://github.com/thisha-me/pdf-light/actions/workflows/ci.yml/badge.svg)](https://github.com/thisha-me/pdf-light/actions/workflows/ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/pdf-light.svg?style=flat)](https://www.npmjs.com/package/pdf-light)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

An enterprise-grade, lightweight Node.js library to generate PDFs from HTML/Handlebars templates efficiently without using Puppeteer, Chromium, or any headless browser.

## 🚀 Why pdf-light?

-   **Zero Headless Browser**: Drop the 300MB+ Chrome binary. Run on Lambda/Alpine effortlessly.
-   **Blazing Fast**: Startup time is milliseconds, not seconds.
-   **Pure TypeScript**: Type-safe and developer-friendly.
-   **Pixel Perfect Layouts**: Use your specialized cursor layout engine for precise invoice generation.

## Features

- **Pure Node.js**: No system dependencies, no browser installation required.
- **Lightweight**: Optimized for serverless (AWS Lambda, Google Cloud Functions) and containers.
- **TypeScript**: Written in strict TypeScript with full type definitions.
- **HTML + CSS Subset**: Support for common tags (`div`, `p`, `h1-h6`, `img`, `span`) and tables (`table`, `tr`, `td`).
- **Handlebars Support**: Built-in template rendering for dynamic data.
- **Advanced Layout**:
  - Automatic page breaks
  - Word wrapping
  - Margins and padding
  - Image embedding (JPG, PNG)

## Installation

```bash
npm install pdf-light
```

## Usage

```typescript
import { generatePDF } from 'pdf-light';
import * as fs from 'fs';

const template = `
  <h1>Hello {{name}}!</h1>
  <p>This is a PDF generated without Chrome.</p>
`;

async function main() {
  const pdfBuffer = await generatePDF({
    html: template,
    data: { name: 'World' },
    layout: {
      pageSize: [595.28, 841.89], // A4
      marginTop: 50,
      marginBottom: 50,
      marginLeft: 50,
      marginRight: 50
    }
  });

  fs.writeFileSync('output.pdf', pdfBuffer);
}

main();
```

## Supported HTML/CSS

**Tags**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `div`, `span`, `img`, `br`, `strong`, `b`.
**Tables**: `table`, `thead`, `tbody`, `tr`, `td`, `th`.

**CSS Properties**:
- `font-size`
- `color` (Hex or names like 'red', 'blue')
- `text-align` ('left', 'center', 'right')
- `font-weight` ('bold', 'normal')
- `margin`, `margin-top`, `margin-bottom`
- `width` (for tables/cells)
- `padding`, `background-color`, `border-bottom`

## Performance

Compared to Puppeteer:
- **Startup Time**: < 50ms vs ~1000ms+
- **Memory Usage**: ~20MB vs ~1GB+
- **Package Size**: ~10MB vs ~300MB+

## Limitations

- No flexbox or grid layout support yet.
- Limited CSS subset (no cascading stylesheets, mostly inline or basic tag defaults).
- Basic font support (Standard Fonts), custom font loading coming soon.

## 🤝 Contributing

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

-   Reporting a bug
-   Discussing the current state of the code
-   Submitting a fix
-   Proposing new features

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Code of Conduct

We have adopted the [Contributor Covenant](CODE_OF_CONDUCT.md) as our Code of Conduct, and we expect project participants to adhere to it. Please read the [full text](CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## License

[ISC](LICENSE) © 2025 Dhanuja Thishakya Samaranayake

