import { PDFDocument, PDFPage } from 'pdf-lib';
import { LayoutContext } from '../types';
export declare class PageManager {
    private doc;
    private options;
    constructor(doc: PDFDocument, options: any);
    createContext(initialPage: PDFPage, fonts: any): LayoutContext;
}
