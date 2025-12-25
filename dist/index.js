"use strict";
/**
 * @license ISC
 * Copyright (c) 2025 Dhanuja Thishakya Samaranayake
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = generatePDF;
const PdfEngine_1 = require("./core/PdfEngine");
/**
 * Generates a PDF from the provided HTML and options.
 * @param options Configuration options for PDF generation
 * @returns Promise resolving to the PDF Buffer
 */
async function generatePDF(options) {
    return PdfEngine_1.PdfEngine.generate(options);
}
