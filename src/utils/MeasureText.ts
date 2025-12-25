import { PDFFont } from 'pdf-lib';

export class MeasureText {
  /**
   * Calculates the width of the text string at a given size for the specified font.
   */
  static getWidth(text: string, font: PDFFont, fontSize: number): number {
    return font.widthOfTextAtSize(text, fontSize);
  }

  /**
   * Calculates the height of the font at a given size.
   * This is a simplified height calculation based on the font's bounding box or standard height.
   */
  static getHeight(font: PDFFont, fontSize: number): number {
    return font.heightAtSize(fontSize);
  }

  /**
   * Splits text into lines that fit within a specific maxWidth.
   * Does simple word wrapping.
   */
  static wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const width = this.getWidth(testLine, font, fontSize);

      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
}
