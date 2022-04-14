import sharp from "sharp";
import path from "path";
import {
  ASSETS_DIR,
  BLANK_COLOR,
  BLANK_PADDING,
  BLANK_SIZE_X,
  BLANK_SIZE_Y,
  BOTTOM_EDGE,
  FONT_TYPE_BOLD,
  LEFT_EDGE,
  RIGHT_EDGE,
  TOP_EDGE,
} from '../const';
import { processText } from "./processText";
import { RequestData } from "../types";
import { capitalizeFirstLetter } from "./lib";

const TOP_POSITIONS = {
  from: TOP_EDGE,
  to: TOP_EDGE + 100,
  type: TOP_EDGE + 800,
  clarification: TOP_EDGE + 1000,
  date: BOTTOM_EDGE,
};

export async function createRequestBlank(props: RequestData) {
  const formattedDate = capitalizeFirstLetter(
    new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "full",
    }).format(props.date)
  );

  // process all text lines
  const [from, to, type, clarification, date] = await Promise.all([
    processText(`От ${props.from}`),
    processText(`Для ${props.to}`),
    processText(capitalizeFirstLetter("test"), {
      fontFamily: FONT_TYPE_BOLD,
      svgOptions: {
        fontSize: 100,
      },
    }),
    processText(props.clarification, {
      multiline: {
        maxWidth: BLANK_SIZE_X - BLANK_PADDING * 2,
      },
    }),
    processText(formattedDate),
  ]);

  const titleTextLeft =
    Number(from.meta.width) > Number(to.meta.width)
      ? Number(from.meta.width)
      : Number(to.meta.width);

  // create a blank and compose it with text lines
  const armsBuffer = await sharp(path.resolve(ASSETS_DIR, "images/arms.png"))
    .resize(2e3, 2e3)
    .toBuffer();

  return await sharp({
    create: {
      width: BLANK_SIZE_X,
      height: BLANK_SIZE_Y,
      channels: 4,
      background: BLANK_COLOR,
    },
  }).composite([
    {
      input: armsBuffer,
    },
    {
      input: from.buffer,
      top: TOP_POSITIONS.from,
      left: Math.floor(RIGHT_EDGE - titleTextLeft),
    },
    {
      input: to.buffer,
      top: TOP_POSITIONS.to,
      left: Math.floor(RIGHT_EDGE - titleTextLeft),
    },
    {
      input: type.buffer,
      top: TOP_POSITIONS.type,
      left: Math.floor(RIGHT_EDGE / 2 - Number(type.meta.width) / 2),
    },
    {
      input: clarification.buffer,
      top: TOP_POSITIONS.clarification,
      left: LEFT_EDGE,
    },
    {
      input: date.buffer,
      top: Math.floor(TOP_POSITIONS.date - Number(date.meta.height)),
      left: LEFT_EDGE,
    },
  ]);
}
