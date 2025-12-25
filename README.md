# pdf-light

An enterprise-grade, lightweight Node.js library to generate PDFs from HTML/Handlebars templates efficiently without using Puppeteer, Chromium, or any headless browser.

## Features

- **Pure Node.js**: No system dependencies, no browser installation required.
- **Lightweight**: Optimized for serverless (AWS Lambda, Google Cloud Functions) and containers.
- **TypeScript**: Written in strict TypeScript with full type definitions.
- **HTML + CSS Subset**: Support for common tags (`div`, `p`, `h1-h6`, `img`, `span`) and styling.
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

**CSS Properties**:
- `font-size`
- `color` (Hex or names like 'red', 'blue')
- `text-align` ('left', 'center', 'right')
- `font-weight` ('bold', 'normal')
- `margin`, `margin-top`, `margin-bottom`

## Performance

Compared to Puppeteer:
- **Startup Time**: < 50ms vs ~1000ms+
- **Memory Usage**: ~20MB vs ~1GB+
- **Package Size**: ~10MB vs ~300MB+

## Limitations

- No flexbox or grid layout support yet.
- Limited CSS subset (no cascading stylesheets, mostly inline or basic tag defaults).
- Basic font support (Standard Fonts), custom font loading coming soon.

## License

[ISC](LICENSE) © 2025 Dhanuja Thishakya Samaranayake

