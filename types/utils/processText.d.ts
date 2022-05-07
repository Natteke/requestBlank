/// <reference types="node" />
import sharp from 'sharp';
import { GenerationOptions } from 'text-to-svg';
import { FontFamilyType } from '../types';
export declare const TTSVG: {
    medium: any;
    semibold: any;
    bold: any;
};
declare type ProcessResponse = {
    image: sharp.Sharp;
    buffer: Buffer;
    meta: sharp.Metadata;
};
declare type Options = {
    svgOptions?: GenerationOptions;
    fontFamily?: FontFamilyType;
    multiline?: {
        maxWidth?: number;
    };
};
export declare const processText: (text?: string, options?: Options) => Promise<ProcessResponse>;
export {};
//# sourceMappingURL=processText.d.ts.map