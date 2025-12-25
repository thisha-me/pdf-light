import { PDFDocument, PDFPage, PageSizes } from 'pdf-lib';
import { LayoutContext } from '../types';

export class PageManager {

  constructor(private doc: PDFDocument, private options: any) { }

  createContext(initialPage: PDFPage, fonts: any): LayoutContext {
    const pageSize = this.options.layout?.pageSize || PageSizes.A4;
    const margins = {
      top: this.options.layout?.marginTop || 50,
      right: this.options.layout?.marginRight || 50,
      bottom: this.options.layout?.marginBottom || 50,
      left: this.options.layout?.marginLeft || 50,
    };

    const context: LayoutContext = {
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
