import path from 'path';
import { dirname } from 'path';

export const BLANK_SIZE_Y = 3508;
export const BLANK_SIZE_X = 2480;
export const BLANK_PADDING = 100;

export const RIGHT_EDGE = BLANK_SIZE_X - BLANK_PADDING;
export const TOP_EDGE = BLANK_PADDING;
export const LEFT_EDGE = BLANK_PADDING;
export const BOTTOM_EDGE = BLANK_SIZE_Y - BLANK_PADDING;

export const BLANK_COLOR = "#f2f2f2";
export const TEXT_COLOR = "#191b23";

export const FONT_TYPE_MEDIUM = "medium";
export const FONT_TYPE_SEMIBOLD = "semibold";
export const FONT_TYPE_BOLD = "bold";

export const ROOT_DIR = path.resolve(__filename, '..');
export const ASSETS_DIR = path.resolve(ROOT_DIR, 'assets');

'-------- request blank dir logs ---------'
console.log('__dirname', __dirname);
console.log('__filename', __filename);
console.log('ROOT_DIR', ROOT_DIR);
console.log('ASSETS_DIR', ASSETS_DIR);
