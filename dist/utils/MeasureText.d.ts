import { PDFFont } from 'pdf-lib';
export declare class MeasureText {
    /**
     * Calculates the width of the text string at a given size for the specified font.
     */
    static getWidth(text: string, font: PDFFont, fontSize: number): number;
    /**
     * Calculates the height of the font at a given size.
     * This is a simplified height calculation based on the font's bounding box or standard height.
     */
    static getHeight(font: PDFFont, fontSize: number): number;
    /**
     * Splits text into lines that fit within a specific maxWidth.
     * Does simple word wrapping.
     */
    static wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[];
}
