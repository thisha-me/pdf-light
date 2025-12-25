import { RenderNode } from '../types';
export declare class HtmlParser {
    /**
     * Parses raw HTML string into a tree of RenderNodes.
     */
    static parse(html: string): RenderNode[];
    private static isVoidElement;
    private static createNode;
    private static parseStyles;
    private static getUserAgentStyles;
}
