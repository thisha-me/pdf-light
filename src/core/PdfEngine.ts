import { PDFDocument, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { GeneratePdfOptions } from '../types';
import { HtmlParser } from '../parser/HtmlParser';
import { PageManager } from '../core/PageManager';
import { NodeWalker } from '../parser/NodeWalker';
import { HandlebarsRenderer } from '../template/HandlebarsRenderer';

export class PdfEngine {

  static async generate(options: GeneratePdfOptions): Promise<Buffer> {

    // 1. Template Rendering
    const html = HandlebarsRenderer.render(options.html, options.data);

    // 2. Parse HTML
    const renderTree = HtmlParser.parse(html, options.css);

    // 3. Initialize PDF
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);

    // 4. Load Fonts (Basic Standard Fonts for now)
    // In a real app, this would interpret options.fonts to load custom fonts
    const fontBody = await doc.embedFont(StandardFonts.Helvetica);
    const fontHeading = await doc.embedFont(StandardFonts.HelveticaBold);

    const fonts = {
      'body': fontBody,
      'heading': fontHeading
    };

    // 5. Setup Page Manager & Context
    const pageManager = new PageManager(doc, options);
    const initialPage = doc.addPage(options.layout?.pageSize);
    const context = pageManager.createContext(initialPage, fonts);

    // 6. Walk the layout
    const walker = new NodeWalker(context);
    await walker.walk(renderTree);

    // 7. Serialize
    const uint8Array = await doc.save();
    return Buffer.from(uint8Array);
  }
}
