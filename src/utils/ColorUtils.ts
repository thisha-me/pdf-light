import { Color, rgb } from 'pdf-lib';

export class ColorUtils {

  private static nameMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#FF0000',
    green: '#008000',
    blue: '#0000FF',
    gray: '#808080',
    grey: '#808080',
  };

  /**
   * Parses a color string (hex or name) into a pdf-lib Color object.
   * Defaults to black if invalid.
   */
  static parse(colorStr: string = '#000000'): Color {
    let hex = colorStr.trim().toLowerCase();

    if (this.nameMap[hex]) {
      hex = this.nameMap[hex];
    }

    // Basic Hex parsing support #RRGGBB
    if (hex.startsWith('#') && hex.length === 7) {
      const r = parseInt(hex.substring(1, 3), 16) / 255;
      const g = parseInt(hex.substring(3, 5), 16) / 255;
      const b = parseInt(hex.substring(5, 7), 16) / 255;
      return rgb(r, g, b);
    }

    // Default to black
    return rgb(0, 0, 0);
  }
}
