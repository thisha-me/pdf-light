"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureText = void 0;
class MeasureText {
    /**
     * Calculates the width of the text string at a given size for the specified font.
     */
    static getWidth(text, font, fontSize) {
        return font.widthOfTextAtSize(text, fontSize);
    }
    /**
     * Calculates the height of the font at a given size.
     * This is a simplified height calculation based on the font's bounding box or standard height.
     */
    static getHeight(font, fontSize) {
        return font.heightAtSize(fontSize);
    }
    /**
     * Splits text into lines that fit within a specific maxWidth.
     * Does simple word wrapping.
     */
    static wrapText(text, font, fontSize, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + ' ' + word;
            const width = this.getWidth(testLine, font, fontSize);
            if (width < maxWidth) {
                currentLine = testLine;
            }
            else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}
exports.MeasureText = MeasureText;
