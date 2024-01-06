// @ts-check
import { kFormatter } from "../common/utils.js";
import satori from "satori";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { template } from "../../template/index.js";
import { Resvg } from "@resvg/resvg-js";
import axios from "axios";
import Jimp from "jimp";
import { genResultConvert } from "./genWebglConvertResult.js";
import {
  genAvatarConvert,
  getBase64FromBitmap,
} from "./genWebglConvertAvatar.js";
import { hrtime } from "process";

/**
 * @typedef {import('../fetchers/types').StatsData} StatsData
 * @typedef {import('./types').StatCardOptions} StatCardOptions
 */

const avatarConvert = genAvatarConvert(280, 280);

async function getPixelsFromPngBuffer(dataBuffer) {
  const image = await Jimp.read(dataBuffer);

  const width = image.getWidth();
  const height = image.getHeight();
  const pixelBuffer = Buffer.alloc(width * height * 4);

  image.scan(0, 0, width, height, (x, y, idx) => {
    pixelBuffer[idx] = image.bitmap.data[idx];
    pixelBuffer[idx + 1] = image.bitmap.data[idx + 1];
    pixelBuffer[idx + 2] = image.bitmap.data[idx + 2];
    pixelBuffer[idx + 3] = image.bitmap.data[idx + 3];
  });

  return pixelBuffer;
}

function coords2Index(x, y, width) {
  if (x > width) {
    console.log("x > width", x, width);
  }
  return (y * width + x) * 4;
}

function convertAvatar(textureBuffer, blockSize, width, height) {
  const resultBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = coords2Index(x, y, width);
      const posX = Math.floor(x / blockSize);
      const posY = Math.floor(y / blockSize);

      // console.log(':::posX', posX, posX * blockSize)
      // console.log(':::posY', posY, posY * blockSize)

      // const textureIndex = coords2Index(Math.floor(posX * blockSize), Math.floor(posY * blockSize), width)
      const textureIndex = coords2Index(
        Math.min(Math.floor(posX * blockSize + blockSize / 2), width - 1),
        Math.min(Math.floor(posY * blockSize + blockSize / 2), height - 1),
        width,
      );

      resultBuffer[index] = textureBuffer[textureIndex];
      resultBuffer[index + 1] = textureBuffer[textureIndex + 1];
      resultBuffer[index + 2] = textureBuffer[textureIndex + 2];
      resultBuffer[index + 3] = textureBuffer[textureIndex + 3];
    }
  }

  return resultBuffer;
}

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

  // const imgUrl = `data:image/png;base64,${dataBuffer.toString("base64")}`;
  // console.log('avatar img', imgUrl)
  //
  // return imgUrl

  // const base64 = await avatarConvert({
  //   width: 280,
  //   height: 280,
  //   data: pixels,
  // });
  const pixels2 = convertAvatar(pixels, 6.8, 280, 280);
  const base64 = await getBase64FromBitmap(pixels2, 280, 280);

  const end = hrtime.bigint();

  // console.log('base64', base64)
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

  const convert = genResultConvert(width, height);

  const { width: _width, height: _height, pixels } = pngData;

  return await convert({ width: _width, height: _height, data: pixels });
};

export { renderStatsCard };
export default renderStatsCard;
