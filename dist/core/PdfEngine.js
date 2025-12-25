"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfEngine = void 0;
const pdf_lib_1 = require("pdf-lib");
const fontkit_1 = __importDefault(require("@pdf-lib/fontkit"));
const HtmlParser_1 = require("../parser/HtmlParser");
const PageManager_1 = require("../core/PageManager");
const NodeWalker_1 = require("../parser/NodeWalker");
const HandlebarsRenderer_1 = require("../template/HandlebarsRenderer");
class PdfEngine {
    static async generate(options) {
        // 1. Template Rendering
        const html = HandlebarsRenderer_1.HandlebarsRenderer.render(options.html, options.data);
        // 2. Parse HTML
        const renderTree = HtmlParser_1.HtmlParser.parse(html);
        // 3. Initialize PDF
        const doc = await pdf_lib_1.PDFDocument.create();
        doc.registerFontkit(fontkit_1.default);
        // 4. Load Fonts (Basic Standard Fonts for now)
        // In a real app, this would interpret options.fonts to load custom fonts
        const fontBody = await doc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const fontHeading = await doc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const fonts = {
            'body': fontBody,
            'heading': fontHeading
        };
        // 5. Setup Page Manager & Context
        const pageManager = new PageManager_1.PageManager(doc, options);
        const initialPage = doc.addPage(options.layout?.pageSize);
        const context = pageManager.createContext(initialPage, fonts);
        // 6. Walk the layout
        const walker = new NodeWalker_1.NodeWalker(context);
        await walker.walk(renderTree);
        // 7. Serialize
        const uint8Array = await doc.save();
        return Buffer.from(uint8Array);
    }
}
exports.PdfEngine = PdfEngine;
