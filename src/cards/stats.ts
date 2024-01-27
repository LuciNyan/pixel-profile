import { kFormatter } from '../common/index.js';
import { template } from '../template/index.js';
import {
  curve,
  getBase64FromPixels,
  getPixelsFromPngBuffer,
  getPngBufferFromPixels,
  pixelate, Rank,
} from '../utils/index.js';
import { Resvg } from '@resvg/resvg-js';
import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';

const CARD_WIDTH = 1220
const CARD_HEIGHT = 460
const AVATAR_WIDTH = 280
const AVATAR_HEIGHT = 280

type Stats = {
  name: string
  username: string
  totalStars: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  avatarUrl: string
  contributedTo: number
  rank: Rank
}

export async function renderStats(stats: Stats): Promise<Buffer> {
  const {
    name,
    username,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    avatarUrl,
    contributedTo,
    rank,
  } = stats;

  const width = CARD_WIDTH;
  const height = CARD_HEIGHT;

  const fontPath = join(process.cwd(), 'fonts', 'PressStart2P-Regular.ttf');

  const [fontData, imgUrl] = await Promise.all([
    readFile(fontPath),
    makeAvatar(avatarUrl, AVATAR_WIDTH, AVATAR_HEIGHT),
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

  let isMissingFont = false

  let svg = await satori(template(_stats), {
    width,
    height,
    fonts: [
      {
        name: 'PressStart2P',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
    loadAdditionalAsset: async () => {
      isMissingFont = true
      return ''
    }
  });

  if (isMissingFont) {
    _stats.name = username

    svg = await satori(template(_stats), {
      width,
      height,
      fonts: [
        {
          name: 'PressStart2P',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
      loadAdditionalAsset: async () => {
        isMissingFont = true
        return ''
      }
    });
  }



  const opts = {
    fitTo: {
      mode: 'width',
      value: width,
    },
  } as const;

  const pngData = new Resvg(svg, opts).render();
  const pngBuffer = pngData.asPng();

  const pixels = await getPixelsFromPngBuffer(pngBuffer);

  const resultPixels = curve(pixels, width, height);

  return await getPngBufferFromPixels(resultPixels, width, height);
}

async function makeAvatar(url: string, width: number, height: number, blockSize: number = 6.8): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const png = Buffer.from(response.data, 'binary');

  const _pixels = await getPixelsFromPngBuffer(png);

  const pixels = pixelate(_pixels, width, height, blockSize);

  return await getBase64FromPixels(pixels, width, height);
}