import sharp, { OverlayOptions } from 'sharp'
import path from 'path'
import {
  ASSETS_DIR,
  FONT_TYPE_BOLD,
  FONT_TYPE_MEDIUM,
  FONT_TYPE_SEMIBOLD,
  TEXT_COLOR,
} from '../const'
import { GenerationOptions } from 'text-to-svg'
import { FontFamilyType } from '../types'
const TextToSVG = require('text-to-svg')

export const TTSVG = {
  [FONT_TYPE_MEDIUM]: TextToSVG.loadSync(
    path.resolve(ASSETS_DIR, 'fonts/OpenSans-Medium.ttf')
  ),
  [FONT_TYPE_SEMIBOLD]: TextToSVG.loadSync(
    path.resolve(ASSETS_DIR, 'fonts/OpenSans-SemiBold.ttf')
  ),
  [FONT_TYPE_BOLD]: TextToSVG.loadSync(
    path.resolve(ASSETS_DIR, 'fonts/OpenSans-Bold.ttf')
  ),
}

const attributes: GenerationOptions['attributes'] = {
  fill: TEXT_COLOR,
  stroke: 'transparent',
  kek: 'mek',
}

const defaultOptions: GenerationOptions = {
  x: 0,
  y: 0,
  fontSize: 80,
  anchor: 'top',
  attributes,
}

type ProcessResponse = {
  image: sharp.Sharp
  buffer: Buffer
  meta: sharp.Metadata
}

type Options = {
  svgOptions?: GenerationOptions
  fontFamily?: FontFamilyType
  multiline?: {
    maxWidth?: number
  }
}

const processMultilineString = (
  str: string,
  oneLineWidth: number,
  maxWidth: number
) => {
  let letterWidth = oneLineWidth / str.length
  let lettersPerLine = Math.floor(maxWidth / letterWidth) - 3 // 3 - погрешность на мелкие-крупные буквы
  let lines: string[] = []
  let words = str.split(' ')
  let iLine = 0
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    if (!lines[iLine]) lines[iLine] = ''

    // если кто-то воткнет супер длинное слово
    if (word.length > lettersPerLine) {
      const letters = word.split('')
      const chunks = []
      for (let i = 0; i < letters.length; i += lettersPerLine) {
        var chunk = letters.slice(i, i + lettersPerLine).join('')
        chunks.push(chunk)
      }
      const countNewLanes = chunks.length
      lines = [...lines, ...chunks]
      iLine += countNewLanes
    } else if (lines[iLine].length + word.length + 1 <= lettersPerLine) {
      // +1 -> because insert space in next line
      lines[iLine] += `${lines[iLine] ? ' ' : ''}${word}`
    } else {
      // make new line
      iLine++
      i--
    }
  }

  lines = lines.filter(Boolean)

  return lines
}

export const processText = async (
  text: string = '',
  options: Options = {}
): Promise<ProcessResponse> => {
  const {
    fontFamily = FONT_TYPE_MEDIUM,
    svgOptions = {},
    multiline = {},
  } = options

  const svgProcessor = TTSVG[fontFamily]
  let buffer = Buffer.from(
    svgProcessor.getSVG(text, { ...defaultOptions, ...svgOptions })
  )

  let image = sharp(buffer)
  let meta = await image.metadata()
  const oneLineTextWidth = Number(meta.width)

  // process multiline text
  if (multiline.maxWidth && oneLineTextWidth > multiline.maxWidth) {
    const { maxWidth } = multiline
    const lines = processMultilineString(text, oneLineTextWidth, maxWidth)
    const lineHeight = Number(meta.height)
    const nLines = lines.length

    if (!lines) throw new Error('Could not split text for multiple lines')

    const linesToCompose: OverlayOptions[] = lines.map((str, i) => ({
      input: Buffer.from(
        svgProcessor.getSVG(str, { ...defaultOptions, ...svgOptions })
      ),
      left: 0,
      top: lineHeight * i,
    }))

    image = sharp({
      create: {
        height: lineHeight * nLines,
        width: maxWidth,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })
      .composite(linesToCompose)
      .png()

    meta = await image.metadata()
    buffer = await image.clone().toBuffer()
  }

  return {
    image,
    buffer,
    meta,
  }
}
