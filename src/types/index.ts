import { PDFDocument, PDFPage, PDFFont } from 'pdf-lib';

/**
 * Options meant for the public API user to configure the output PDF.
 */
export interface GeneratePdfOptions {
  /**
   * The raw HTML string to be rendered.
   * If `data` is provided, this HTML is treated as a Handlebars template.
   */
  html: string;

  /**
   * Optional data object for Handlebars templating.
   */
  data?: Record<string, any>;

  /**
   * Optional CSS stylesheet string. Supports tag, .class, #id selectors.
   * Applied during parsing before inline styles (CSS cascade).
   */
  css?: string;

  /**
   * Page layout configuration.
   */
  layout?: {
    /**
     * Page size tuple [width, height].
     * Default: [595.28, 841.89] (A4).
     */
    pageSize?: [number, number];

    /**
     * Margins for the document in points.
     * Default: { top: 50, right: 50, bottom: 50, left: 50 }
     */
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
  };

  /**
   * Font configuration.
   * Currently supports standard fonts. Custom fonts to be added.
   */
  fonts?: {
    /** Map of font usage (e.g., 'body' -> 'Helvetica'). */
    body?: string;
    heading?: string;
  };
}

/**
 * Internal context passed around during the layout and rendering process.
 */
export interface LayoutContext {
  pdfDoc: PDFDocument;
  currentPage: PDFPage;

  // Available fonts loaded in the doc
  fonts: Record<string, PDFFont>;

  // Layout state
  cursorX: number;
  cursorY: number;

  // Page constraints
  pageWidth: number;
  pageHeight: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  // Helper to add a new page if we run out of space
  addPage: () => void;
}

/**
 * Represents a styled renderable node from the parse tree.
 */
export interface RenderNode {
  type: 'text' | 'image' | 'block' | 'break' | 'table' | 'row' | 'cell';

  // Computed styles
  styles: {
    fontFamily: string; // 'body' | 'heading'
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    color: string; // Hex or known color name

    // Spacing
    marginTop: number;
    marginBottom: number;
    padding?: number;

    // Alignment
    textAlign: 'left' | 'center' | 'right';

    // Sizing
    width?: string | number;
    backgroundColor?: string;
    borderBottom?: string;
  };

  // Content
  text?: string;
  src?: string; // For images

  // Children for block elements
  children?: RenderNode[];
}
