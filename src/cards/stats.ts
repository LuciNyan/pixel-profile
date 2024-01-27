import { kFormatter } from '../common/index.js';
import { template } from '../template/index.js';
import {
  curve,
  getBase64FromPixels,
  getPixelsFromPngBuffer,
  getPngBufferFromPixels,
  pixelate,
} from '../utils/index.js';
import { Resvg } from '@resvg/resvg-js';
import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';

async function genAvatar(url: string, width: number, height: number, blockSize: number = 6.8): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const png = Buffer.from(response.data, 'binary');

  const _pixels = await getPixelsFromPngBuffer(png);

  const pixels = pixelate(_pixels, width, height, blockSize);

  return await getBase64FromPixels(pixels, width, height);
}

/**
 * Renders the stats card.
 *
 * @param {StatsData} stats The stats data.
 * @param {Partial<StatCardOptions>} options The card options.
 * @returns {Promise<string>} The stats card SVG object.
 */
const renderStats = async (stats) => {
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

  const fontPath = join(process.cwd(), 'fonts', 'PressStart2P-Regular.ttf');

  const [fontData, imgUrl] = await Promise.all([
    readFile(fontPath),
    genAvatar(avatarUrl, 280, 280),
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
        name: 'Roboto',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  const opts = {
    fitTo: {
      mode: 'width',
      value: width,
    },
  } as const;

  const resvg = new Resvg(svg, opts);

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const { width: _width, height: _height } = pngData;

  const pixels4 = await getPixelsFromPngBuffer(pngBuffer);

  const resultPixels = curve(pixels4, _width, _height);

  return await getPngBufferFromPixels(resultPixels, _width, _height);
};

export { renderStats };
