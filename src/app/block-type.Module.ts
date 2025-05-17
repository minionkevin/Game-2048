import { Int2 } from "./block-pos.Module";

export interface SingleBlockData {
    value: number;
    index: number;
    xPos: number;
    yPos: number;
    shouldShow: boolean;
    isMerge: boolean;
    size: number | 0;
    hasValue: boolean;
    targetIndex?: number;
}