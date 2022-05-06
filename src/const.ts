import path from 'path'

export const BLANK_SIZE_Y = 3508
export const BLANK_SIZE_X = 2480
export const BLANK_PADDING = 100

export const RIGHT_EDGE = BLANK_SIZE_X - BLANK_PADDING
export const TOP_EDGE = BLANK_PADDING
export const LEFT_EDGE = BLANK_PADDING
export const BOTTOM_EDGE = BLANK_SIZE_Y - BLANK_PADDING

export const BLANK_COLOR = '#f2f2f2'
export const TEXT_COLOR = '#191b23'

export const FONT_TYPE_MEDIUM = 'medium'
export const FONT_TYPE_SEMIBOLD = 'semibold'
export const FONT_TYPE_BOLD = 'bold'

export const ASSETS_DIR = path.resolve(__dirname, 'assets')
