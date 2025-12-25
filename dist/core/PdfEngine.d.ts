import { GeneratePdfOptions } from '../types';
export declare class PdfEngine {
    static generate(options: GeneratePdfOptions): Promise<Buffer>;
}
