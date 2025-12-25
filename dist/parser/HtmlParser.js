"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlParser = void 0;
const htmlparser2 = __importStar(require("htmlparser2"));
class HtmlParser {
    /**
     * Parses raw HTML string into a tree of RenderNodes.
     */
    static parse(html) {
        const rootNodes = [];
        const stack = [];
        const parser = new htmlparser2.Parser({
            onopentag(name, attribs) {
                const node = HtmlParser.createNode(name, attribs);
                if (!node)
                    return; // Skip unsupported tags
                if (stack.length > 0) {
                    const parent = stack[stack.length - 1];
                    if (!parent.children)
                        parent.children = [];
                    parent.children.push(node);
                }
                else {
                    rootNodes.push(node);
                }
                // Self-closing tags like <br/> or <img> might not need to stay on stack if we handle them differently,
                // but for simplicity in this recursive structure, we can push them check closing later or just manage logic here.
                // For now, let's treat everything as needing a close unless void.
                if (!HtmlParser.isVoidElement(name)) {
                    stack.push(node);
                }
            },
            ontext(text) {
                if (stack.length > 0) {
                    const parent = stack[stack.length - 1];
                    // If the parent can hold text (like p, span, div, h1...)
                    // We create a text node child.
                    // HTML whitespace collapsing: replace all whitespace seq with single space
                    const cleanText = text.replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ');
                    if (cleanText.trim().length > 0) {
                        const textNode = {
                            type: 'text',
                            text: cleanText,
                            styles: { ...parent.styles } // Inherit styles
                        };
                        if (!parent.children)
                            parent.children = [];
                        parent.children.push(textNode);
                    }
                }
            },
            onclosetag(name) {
                if (!HtmlParser.isVoidElement(name)) {
                    stack.pop();
                }
            }
        }, { decodeEntities: true });
        parser.write(html);
        parser.end();
        return rootNodes;
    }
    static isVoidElement(tagName) {
        return ['img', 'br', 'hr', 'input'].includes(tagName);
    }
    static createNode(tagName, attribs) {
        const styles = HtmlParser.parseStyles(attribs.style);
        // Default styles based on tag
        const baseStyles = HtmlParser.getUserAgentStyles(tagName);
        // Merge styles: Base < Inline
        const finalStyles = { ...baseStyles, ...styles };
        if (tagName === 'br') {
            return { type: 'break', styles: finalStyles }; // Special break node
        }
        if (tagName === 'img') {
            return {
                type: 'image',
                src: attribs.src,
                styles: finalStyles
            };
        }
        // Table Support
        if (tagName === 'table') {
            if (attribs.width)
                finalStyles.width = attribs.width;
            if (attribs.cellpadding)
                finalStyles.padding = parseFloat(attribs.cellpadding);
            return { type: 'table', styles: finalStyles, children: [] };
        }
        if (tagName === 'thead' || tagName === 'tbody') {
            return { type: 'block', styles: finalStyles, children: [] }; // Container
        }
        if (tagName === 'tr') {
            return { type: 'row', styles: finalStyles, children: [] };
        }
        if (tagName === 'td' || tagName === 'th') {
            if (attribs.align)
                finalStyles.textAlign = attribs.align;
            if (attribs.width)
                finalStyles.width = attribs.width; // e.g. "100%" or "50px"
            return { type: 'cell', styles: finalStyles, children: [] };
        }
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].includes(tagName)) {
            return {
                type: 'block',
                styles: finalStyles,
                children: []
            };
        }
        if (['span', 'strong', 'b', 'em', 'i'].includes(tagName)) {
            // Adjust styles for semantic tags
            if (tagName === 'strong' || tagName === 'b')
                finalStyles.fontWeight = 'bold';
            // TODO: Italic support needs font handling
            return {
                type: 'block',
                styles: finalStyles,
                children: []
            };
        }
        return null; // Skip unknown
    }
    static parseStyles(styleStr) {
        if (!styleStr)
            return {};
        const styles = {};
        styleStr.split(';').forEach(rule => {
            const [key, value] = rule.split(':').map(s => s.trim());
            if (!key || !value)
                return;
            if (key === 'font-size')
                styles.fontSize = parseFloat(value);
            if (key === 'color')
                styles.color = value;
            if (key === 'text-align')
                styles.textAlign = value;
            if (key === 'font-weight')
                styles.fontWeight = value === 'bold' ? 'bold' : 'normal';
            if (key === 'margin-top')
                styles.marginTop = parseFloat(value);
            if (key === 'margin-bottom')
                styles.marginBottom = parseFloat(value);
            if (key === 'margin') {
                const val = parseFloat(value);
                styles.marginTop = val;
                styles.marginBottom = val;
            }
            if (key === 'background-color')
                styles.backgroundColor = value;
            if (key === 'border-bottom')
                styles.borderBottom = value;
            if (key === 'padding')
                styles.padding = parseFloat(value);
            if (key === 'width')
                styles.width = value;
        });
        return styles;
    }
    static getUserAgentStyles(tagName) {
        // Default baseline styles
        const s = {
            fontSize: 12,
            fontFamily: 'body',
            fontWeight: 'normal',
            color: '#000000',
            textAlign: 'left',
            marginTop: 0,
            marginBottom: 0
        };
        switch (tagName) {
            case 'h1':
                s.fontSize = 24;
                s.fontWeight = 'bold';
                s.marginBottom = 10;
                break;
            case 'h2':
                s.fontSize = 20;
                s.fontWeight = 'bold';
                s.marginBottom = 10;
                break;
            case 'h3':
                s.fontSize = 18;
                s.fontWeight = 'bold';
                s.marginBottom = 8;
                break;
            case 'p':
                s.marginBottom = 10;
                break;
        }
        return s;
    }
}
exports.HtmlParser = HtmlParser;
