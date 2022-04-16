import { TTSVG } from "./utils/processText";

export type RequestData = {
  from: string;
  to: string;
  type: string;
  clarification: string;
  withRespect: string;
  date: Date;
};

export type FontFamilyType = keyof typeof TTSVG;
