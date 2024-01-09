// @ts-check
import { kFormatter } from "../common/utils.js";
import satori from "satori";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { template } from "../../template/index.js";
import { Resvg } from "@resvg/resvg-js";
import axios from "axios";
import { hrtime } from "process";
import {
  curveImage,
  getBase64FromPixels,
  getPixelsFromPngBuffer,
  getPngBufferFromPixels,
  pixelate,
} from "./utils.js";

/**
 * @typedef {import('../fetchers/types').StatsData} StatsData
 * @typedef {import('./types').StatCardOptions} StatCardOptions
 */

/**
 * gen base64 img data
 *
 * @param {string} avatarUrl s
 * @returns {Promise<string>} base64 data
 */
async function genAvatarData(avatarUrl) {
  const startFetch = hrtime.bigint();
  const response = await axios.get(avatarUrl, {
    responseType: "arraybuffer",
  });
  const startConvert = hrtime.bigint();
  console.log(
    `fetch ${(startConvert - startFetch) / BigInt(Math.pow(10, 6))} ms`,
  );
  const dataBuffer = Buffer.from(response.data, "binary");

  const pixels = await getPixelsFromPngBuffer(dataBuffer);

  const pixels2 = pixelate(pixels, 280, 280, 6.8);
  const base64 = await getBase64FromPixels(pixels2, 280, 280);

  const end = hrtime.bigint();

  console.log(`convert ${(end - startConvert) / BigInt(Math.pow(10, 6))} ms`);

  return base64;
}

/**
 * Renders the stats card.
 *
 * @param {StatsData} stats The stats data.
 * @param {Partial<StatCardOptions>} options The card options.
 * @returns {Promise<string>} The stats card SVG object.
 */
const renderStatsCard = async (stats, options = {}) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    avatarUrl,
    contributedTo,
    rank,
  } = stats;

  const width = 1220;
  const height = 460;

  const fontPath = join(process.cwd(), "fonts", "PressStart2P-Regular.ttf");

  const [fontData, imgUrl] = await Promise.all([
    readFile(fontPath),
    genAvatarData(avatarUrl),
  ]);

  const _stats = {
    name,
    imgUrl,
    totalStars: kFormatter(totalStars),
    totalCommits: kFormatter(totalCommits),
    totalIssues: kFormatter(totalIssues),
    totalPRs: kFormatter(totalPRs),
    contributedTo: kFormatter(contributedTo),
    rank,
  };

  const svg = await satori(template(_stats), {
    width,
    height,
    fonts: [
      {
        name: "Roboto",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const opts = {
    fitTo: {
      mode: "width",
      value: width,
    },
  };

  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const { width: _width, height: _height, pixels } = pngData;

  console.log("pixels", pixels.length, _width * _height * 4);
  console.log("pixels detail", pixels[0], pixels[1], pixels[2], pixels[3]);

  const pixels4 = await getPixelsFromPngBuffer(pngBuffer);

  const resultPixels = curveImage(pixels4, _width, _height);

  const result = await getPngBufferFromPixels(resultPixels, _width, _height);

  return result;
};

export { renderStatsCard };
