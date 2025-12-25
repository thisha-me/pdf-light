"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextRenderer = void 0;
const ColorUtils_1 = require("../utils/ColorUtils");
const MeasureText_1 = require("../utils/MeasureText");
class TextRenderer {
    static async render(node, context) {
        if (!node.text)
            return;
        const { styles } = node;
        const fontKey = styles.fontFamily || 'body';
        const font = context.fonts[fontKey] || context.fonts['body'];
        const fontSize = styles.fontSize;
        const color = ColorUtils_1.ColorUtils.parse(styles.color);
        const lineHeight = fontSize * 1.2;
        const availableWidth = context.pageWidth - context.margins.left - context.margins.right;
        // Split text into wrapped lines
        const lines = MeasureText_1.MeasureText.wrapText(node.text, font, fontSize, availableWidth);
        for (const line of lines) {
            // Check for page break
            if (context.cursorY - lineHeight < context.margins.bottom) {
                context.addPage();
            }
            // Calculate X alignment
            let x = context.cursorX;
            if (node.styles.textAlign === 'center') {
                const lineWidth = MeasureText_1.MeasureText.getWidth(line, font, fontSize);
                x = context.margins.left + (availableWidth - lineWidth) / 2;
            }
            else if (node.styles.textAlign === 'right') {
                const lineWidth = MeasureText_1.MeasureText.getWidth(line, font, fontSize);
                x = context.margins.left + (availableWidth - lineWidth);
            }
            context.currentPage.drawText(line, {
                x: x,
                y: context.cursorY,
                size: fontSize,
                font: font,
                color: color,
            });
            // Move cursor down
            context.cursorY -= lineHeight;
        }
    }
}
exports.TextRenderer = TextRenderer;
