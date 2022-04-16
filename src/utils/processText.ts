import sharp, { OverlayOptions } from "sharp";
import path from "path";
import {
  ASSETS_DIR,
  FONT_TYPE_BOLD,
  FONT_TYPE_MEDIUM,
  FONT_TYPE_SEMIBOLD,
  TEXT_COLOR,
} from '../const';
import { GenerationOptions } from "text-to-svg";
import { FontFamilyType } from "../types";
const TextToSVG = require("text-to-svg");

export const TTSVG = {
  [FONT_TYPE_MEDIUM]: TextToSVG.loadSync(
    path.resolve(ASSETS_DIR, "fonts/OpenSans-Medium.ttf")
  ),
  [FONT_TYPE_SEMIBOLD]: TextToSVG.loadSync(
    path.resolve(ASSETS_DIR, "fonts/OpenSans-SemiBold.ttf")
  ),
  [FONT_TYPE_BOLD]: TextToSVG.loadSync(
    path.resolve(ASSETS_DIR, "fonts/OpenSans-Bold.ttf")
  ),
};

const attributes: GenerationOptions["attributes"] = {
  fill: TEXT_COLOR,
  stroke: "transparent",
  kek: "mek",
};

const defaultOptions: GenerationOptions = {
  x: 0,
  y: 0,
  fontSize: 80,
  anchor: "top",
  attributes,
};

type ProcessResponse = {
  image: sharp.Sharp;
  buffer: Buffer;
  meta: sharp.Metadata;
};

type Options = {
  svgOptions?: GenerationOptions;
  fontFamily?: FontFamilyType;
  multiline?: {
    maxWidth?: number;
  };
};

const processMultilineString = (
  str: string,
  oneLineWidth: number,
  maxWidth: number
) => {
  var letterWidth = oneLineWidth / str.length;
  let arr = [];
  let pos = 0;
  for (var i = 0; i < Math.ceil(oneLineWidth / maxWidth); i++) {
    let res = "";
    let width = 0;
    while (true) {
      if (width > maxWidth || !str[pos]) break;
      res += str[pos];
      pos++;
      width += letterWidth;
    }
    arr.push(res.trim());
  }
  return arr.filter(Boolean);
};

export const processText = async (
  text: string,
  options: Options = {}
): Promise<ProcessResponse> => {
  const {
    fontFamily = FONT_TYPE_MEDIUM,
    svgOptions = {},
    multiline = {},
  } = options;

  const svgProcessor = TTSVG[fontFamily];
  let buffer = Buffer.from(
    svgProcessor.getSVG(text, { ...defaultOptions, ...svgOptions })
  );

  let image = sharp(buffer);
  let meta = await image.metadata();
  const oneLineTextWidth = Number(meta.width);

  // process multiline text
  if (multiline.maxWidth && oneLineTextWidth > multiline.maxWidth) {
    const { maxWidth } = multiline;
    const lines = processMultilineString(text, oneLineTextWidth, maxWidth);
    const lineHeight = Number(meta.height);
    const nLines = lines.length;

    if (!lines) throw new Error("Could not split text for multiple lines");

    const linesToCompose: OverlayOptions[] = lines.map((str, i) => ({
      input: Buffer.from(
        svgProcessor.getSVG(str, { ...defaultOptions, ...svgOptions })
      ),
      left: 0,
      top: lineHeight * i,
    }));

    image = sharp({
      create: {
        height: lineHeight * nLines,
        width: maxWidth + 100, // 100 - погрешность в рассчете длинны строки. Видимо что-то не так после конвертации из svg.
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })
      .composite(linesToCompose)
      .png();

    meta = await image.metadata();
    buffer = await image.clone().toBuffer();
  }

  return {
    image,
    buffer,
    meta,
  };
};
