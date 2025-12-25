import { Color } from 'pdf-lib';
export declare class ColorUtils {
    private static nameMap;
    /**
     * Parses a color string (hex or name) into a pdf-lib Color object.
     * Defaults to black if invalid.
     */
    static parse(colorStr?: string): Color;
}
