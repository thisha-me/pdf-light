import { LayoutContext, RenderNode } from '../types';
export declare class ImageRenderer {
    static render(node: RenderNode, context: LayoutContext): Promise<void>;
    private static fetchImage;
}
