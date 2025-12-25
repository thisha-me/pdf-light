"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageManager = void 0;
const pdf_lib_1 = require("pdf-lib");
class PageManager {
    constructor(doc, options) {
        this.doc = doc;
        this.options = options;
    }
    createContext(initialPage, fonts) {
        const pageSize = this.options.layout?.pageSize || pdf_lib_1.PageSizes.A4;
        const margins = {
            top: this.options.layout?.marginTop || 50,
            right: this.options.layout?.marginRight || 50,
            bottom: this.options.layout?.marginBottom || 50,
            left: this.options.layout?.marginLeft || 50,
        };
        const context = {
            pdfDoc: this.doc,
            currentPage: initialPage,
            fonts: fonts,
            cursorX: margins.left,
            cursorY: pageSize[1] - margins.top, // Start from top
            pageWidth: pageSize[0],
            pageHeight: pageSize[1],
            margins: margins,
            addPage: () => {
                const newPage = this.doc.addPage(pageSize);
                context.currentPage = newPage;
                context.cursorX = margins.left;
                context.cursorY = pageSize[1] - margins.top;
            }
        };
        return context;
    }
}
exports.PageManager = PageManager;
