import { Int2 } from "./block-pos.Module";

export interface SingleBlockData {
    value: number;
    index: number;
    pos2d: Int2;
    xPos: number;
    yPos: number;
    shouldShow: boolean;
    isMerge: boolean;
}