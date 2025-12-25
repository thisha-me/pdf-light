import { PdfEngine } from './core/PdfEngine';
import { GeneratePdfOptions } from './types';

export { GeneratePdfOptions } from './types';

/**
 * Generates a PDF from the provided HTML and options.
 * @param options Configuration options for PDF generation
 * @returns Promise resolving to the PDF Buffer
 */
export async function generatePDF(options: GeneratePdfOptions): Promise<Buffer> {
  return PdfEngine.generate(options);
}
