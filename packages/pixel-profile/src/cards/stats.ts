import { kFormatter } from '../common';
import { makeGithubStats } from '../templates/github-stats';
import {
  curve,
  getBase64FromPixels,
  getPixelsFromPngBuffer,
  getPngBufferFromPixels,
  pixelate, Rank,
} from '../utils';
import { Resvg } from '@resvg/resvg-js';
import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';

const CARD_WIDTH = 1226
const CARD_HEIGHT = 430
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

type Options = {
  screenEffect?: boolean
  color?: string
  showRank?: boolean
  background?: string
  showAvatar?: boolean
  pixelateAvatar?: boolean
  includeAllCommits?: boolean
}

export async function renderStats(stats: Stats, options: Options): Promise<Buffer> {
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

  const {
    screenEffect = true,
    color = 'white',
    showRank = true,
    background = '#434343',
    showAvatar = true,
    pixelateAvatar = true,
    includeAllCommits = false
  } = options

  const width = CARD_WIDTH;
  const height = CARD_HEIGHT;

  const fontPath = join(process.cwd(), 'packages', 'pixel-profile', 'fonts', 'PressStart2P-Regular.ttf');

  const [fontData, imgUrl] = await Promise.all([
    readFile(fontPath),
    makeAvatar(showAvatar ? avatarUrl : '', pixelateAvatar, AVATAR_WIDTH, AVATAR_HEIGHT),
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

  const templateOptions = {
    color,
    showRank,
    background,
    includeAllCommits
  }

  let svg = await satori(makeGithubStats(_stats, templateOptions), {
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

    svg = await satori(
      makeGithubStats(_stats, templateOptions),
      {
      width,
      height,
      fonts: [
        {
          name: 'PressStart2P',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ]
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

  let pixels = await getPixelsFromPngBuffer(pngBuffer);

  if (screenEffect) {
    pixels = curve(pixels, width, height);
  }

  return await getPngBufferFromPixels(pixels, width, height);
}

async function makeAvatar(url: string, pixelateAvatar: boolean, width: number, height: number, blockSize: number = 6.8): Promise<string> {
  if (!url) {
    return ''
  }

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const png = Buffer.from(response.data, 'binary');

  let pixels = await getPixelsFromPngBuffer(png);

  if (pixelateAvatar) {
    pixels = pixelate(pixels, width, height, blockSize);
  }

  return await getBase64FromPixels(pixels, width, height);
}
