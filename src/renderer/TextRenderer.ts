import { LayoutContext, RenderNode } from '../types';
import { ColorUtils } from '../utils/ColorUtils';
import { MeasureText } from '../utils/MeasureText';

export class TextRenderer {
  static async render(node: RenderNode, context: LayoutContext) {
    if (!node.text) return;

    const { styles } = node;
    const fontKey = styles.fontFamily || 'body';
    const font = context.fonts[fontKey] || context.fonts['body'];
    const fontSize = styles.fontSize;
    const color = ColorUtils.parse(styles.color);
    const lineHeight = fontSize * 1.2;

    const availableWidth = context.pageWidth - context.margins.left - context.margins.right;

    // Split text into wrapped lines
    const lines = MeasureText.wrapText(node.text, font, fontSize, availableWidth);

    for (const line of lines) {
      // Check for page break
      if (context.cursorY - lineHeight < context.margins.bottom) {
        context.addPage();
      }

      // Calculate X alignment
      let x = context.cursorX;
      if (node.styles.textAlign === 'center') {
        const lineWidth = MeasureText.getWidth(line, font, fontSize);
        x = context.margins.left + (availableWidth - lineWidth) / 2;
      } else if (node.styles.textAlign === 'right') {
        const lineWidth = MeasureText.getWidth(line, font, fontSize);
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
