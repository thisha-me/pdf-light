import { RenderNode, LayoutContext } from '../types';
import { TextRenderer } from '../renderer/TextRenderer';
import { ImageRenderer } from '../renderer/ImageRenderer';

export class NodeWalker {

  constructor(private context: LayoutContext) { }

  async walk(nodes: RenderNode[]) {
    for (const node of nodes) {
      await this.visit(node);
    }
  }

  private async visit(node: RenderNode) {
    // Apply margins before element (block only for now)
    if (node.type !== 'cell' && node.type !== 'row' && node.type !== 'table') {
      if (node.styles.marginTop > 0) {
        this.context.cursorY -= node.styles.marginTop;
      }
    }

    switch (node.type) {
      case 'text':
        await TextRenderer.render(node, this.context);
        break;
      case 'block':
      case 'table': // Tables act like blocks in vertical flow
        if (node.children) {
          await this.walk(node.children);
        }
        break;
      case 'row':
        await this.renderRow(node);
        break;
      case 'break':
        this.context.cursorY -= node.styles.fontSize;
        this.context.cursorX = this.context.margins.left;
        break;
      case 'image':
        await ImageRenderer.render(node, this.context);
        break;
    }

    // Apply margins after element
    if (node.type !== 'cell' && node.type !== 'row') {
      if (node.styles.marginBottom > 0) {
        this.context.cursorY -= node.styles.marginBottom;
      }
    }

    // Reset X after blocks (but not after cells in a row)
    if (node.type === 'block' || node.type === 'table' || node.type === 'image' || node.type === 'break') {
      this.context.cursorX = this.context.margins.left;
    }
  }

  private async renderRow(row: RenderNode) {
    if (!row.children || row.children.length === 0) return;

    const startX = this.context.margins.left;
    const startY = this.context.cursorY;
    const pageWidth = this.context.pageWidth - this.context.margins.left - this.context.margins.right;

    // Determine column widths
    // Simple logic: equal distribution if no width specified, or try to parse
    // We will assume 2 columns in the example: width="100%" usually means full.
    // If we have 2 cells, and one is 'right' aligned, we might guess.
    // Better heuristic:
    // Count cells. Divide width by cells?
    // Example uses: 2 columns. 
    // First column: <h1>...
    // Second column: <p align="right">...

    const cells = row.children.filter(c => c.type === 'cell');
    const colWidth = pageWidth / cells.length; // Naive equal width

    let currentX = startX;
    let maxHeightUsed = 0;

    for (const cell of cells) {
      // Set constraints for this cell
      // We need a way to tell TextRenderer 'maxWidth'.
      // Currently TextRenderer calculates availableWidth based on Page - Margins.
      // We need to locally override cursorX and available width.
      // But TextRenderer logic is: `availableWidth = context.pageWidth - ...`
      // We might need to trick it or update TextRenderer to accept a width override.
      // For now, let's implement a 'scoped' render.

      this.context.cursorX = currentX;
      this.context.cursorY = startY; // All cells start at same Y

      const initialY = this.context.cursorY;

      // Temporary override or pass width down?
      // Since render functions take 'context', we can mutate it, but 'pageWidth' is fixed.
      // We need to update TextRenderer to respect a "maxLimit".
      // Or we can cheat by changing right margin?

      const originalRightMargin = this.context.margins.right;
      // New Right Boundary = PageWidth - (CurrentX + ColWidth)
      const newRightMargin = this.context.pageWidth - (currentX + colWidth);
      this.context.margins.right = newRightMargin;

      // Update cursorX to 'padding' if any (cellpadding)
      if (cell.styles.padding) {
        this.context.cursorX += cell.styles.padding;
        this.context.cursorY -= cell.styles.padding;
      }

      // Render cell content
      if (cell.children) {
        // We need a recursive walker for cell children?
        // Yes, cells can contain blocks.
        // We can reuse 'walk' but we need to stop it from resetting X globaly.
        // Actually 'walk' resets X to margin.left.
        // If we change margin.left temporarily?

        const originalLeftMargin = this.context.margins.left;
        this.context.margins.left = currentX + (cell.styles.padding || 0);

        // We need to handle 'textAlign' from cell to children?
        // If cell has text-align, children should inherit if they don't override.
        if (cell.styles.textAlign) {
          cell.children.forEach(c => {
            if (!c.styles.textAlign) c.styles.textAlign = cell.styles.textAlign;
          });
        }

        // Use a fresh node walker for the cell content to avoid side-effects?
        // The main issue is 'walk' calls 'visit' which resets X to 'margins.left'.
        // So updating margins.left is the correct way to "scope" the column.

        // Helper to walk without full reset?
        // We can just call this.walk(cell.children).

        const subWalker = new NodeWalker(this.context);
        await subWalker.walk(cell.children);

        // Measure height used
        const heightUsed = initialY - this.context.cursorY + (cell.styles.padding || 0);
        if (heightUsed > maxHeightUsed) maxHeightUsed = heightUsed;

        // Restore margins
        this.context.margins.left = originalLeftMargin;
      }

      this.context.margins.right = originalRightMargin;

      // Move to next column
      currentX += colWidth;
    }

    // After row, move Y down by max height
    this.context.cursorY = startY - maxHeightUsed;
    // Reset X
    this.context.cursorX = this.context.margins.left;

    // Draw border bottom if needed
    // (Simplified)
  }
}
