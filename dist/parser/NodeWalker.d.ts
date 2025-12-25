import { RenderNode, LayoutContext } from '../types';
export declare class NodeWalker {
    private context;
    constructor(context: LayoutContext);
    walk(nodes: RenderNode[]): Promise<void>;
    private visit;
    private renderRow;
}
