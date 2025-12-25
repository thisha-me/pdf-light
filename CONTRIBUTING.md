# Contributing to pdf-light

First off, thanks for taking the time to contribute! 🎉

The goal of `pdf-light` is to provide a robust, lightweight PDF generation library for the Node.js ecosystem that relies purely on JavaScript/TypeScript, avoiding heavy binary dependencies like Chromium.

## How Can I Contribute?

### Reporting Bugs

-   **Check existing issues** to see if the bug has already been reported.
-   **Use the Bug Report template** to provide detailed reproduction steps.
-   Provide a minimal code example that demonstrates the issue.

### Suggesting Features

We welcome new features! Please open an issue using the **Feature Request template** to discuss your idea before diving into code.

### Your First Code Contribution

1.  **Fork the repository** and clone it locally.
2.  Install dependencies: `npm install`.
3.  Create a branch for your feature: `git checkout -b feat/my-new-feature`.
4.  Implement your changes.
    -   Run the build: `npm run build`.
    -   Run tests (currently `npm run build` serves as a basic check, or run the example script).
5.  Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/):
    -   `feat: add new font support`
    -   `fix: resolve layout bug in tables`
6.  Push to your fork and submit a **Pull Request**.

## Development Workflow

This project uses **TypeScript**. Please ensure:

-   No usage of `any` types where possible.
-   Code is formatted cleanly.
-   New features have corresponding tests or example usage updates.

### Running Examples

To test your changes against the `invoice` example:

```bash
npm run build
npx ts-node examples/generate_invoice.ts
```

## Community

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
