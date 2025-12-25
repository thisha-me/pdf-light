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
    fonts: Record<string, PDFFont>;
    cursorX: number;
    cursorY: number;
    pageWidth: number;
    pageHeight: number;
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    addPage: () => void;
}
/**
 * Represents a styled renderable node from the parse tree.
 */
export interface RenderNode {
    type: 'text' | 'image' | 'block' | 'break' | 'table' | 'row' | 'cell';
    styles: {
        fontFamily: string;
        fontSize: number;
        fontWeight: 'normal' | 'bold';
        color: string;
        marginTop: number;
        marginBottom: number;
        padding?: number;
        textAlign: 'left' | 'center' | 'right';
        width?: string | number;
        backgroundColor?: string;
        borderBottom?: string;
    };
    text?: string;
    src?: string;
    children?: RenderNode[];
}
