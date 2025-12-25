/**
 * @license ISC
 * Copyright (c) 2025 Dhanuja Thishakya Samaranayake
 */
import { GeneratePdfOptions } from './types';
export { GeneratePdfOptions } from './types';
/**
 * Generates a PDF from the provided HTML and options.
 * @param options Configuration options for PDF generation
 * @returns Promise resolving to the PDF Buffer
 */
export declare function generatePDF(options: GeneratePdfOptions): Promise<Buffer>;
