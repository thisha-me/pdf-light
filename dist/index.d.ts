import { GeneratePdfOptions } from './types';
export { GeneratePdfOptions } from './types';
/**
 * Generates a PDF from the provided HTML and options.
 * @param options Configuration options for PDF generation
 * @returns Promise resolving to the PDF Buffer
 */
export declare function generatePDF(options: GeneratePdfOptions): Promise<Buffer>;
