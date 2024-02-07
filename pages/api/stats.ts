import { renderStats } from '../../../src/cards/stats.js';
import {
  clampValue,
  CONSTANTS,
  parseArray,
  parseBoolean,
} from '../../../src/common/utils.js';
import { fetchStats } from '../../../src/fetchers/stats-fetcher.js';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, screen_effect, include_all_commits, cache_seconds, exclude_repo, show } =
    req.query;
  res.setHeader('Content-Type', 'image/png');

  try {
    const showStats = parseArray(show);
    const stats = await fetchStats(
      typeof username === 'string' ? username : '',
      parseBoolean(include_all_commits),
      parseArray(exclude_repo),
      showStats.includes('prs_merged') ||
        showStats.includes('prs_merged_percentage'),
      showStats.includes('discussions_started'),
      showStats.includes('discussions_answered'),
    );

    let cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.CARD_CACHE_SECONDS, 10),
      CONSTANTS.SIX_HOURS,
      CONSTANTS.ONE_DAY,
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      'Cache-Control',
      `max-age=${
        cacheSeconds / 2
      }, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );

    const options = {
      screenEffect: parseBoolean(screen_effect)
    }

    const result = await renderStats(stats, options);

    return res.send(result);
  } catch (err) {
    console.log(err);
    res.setHeader(
      'Cache-Control',
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    ); // Use lower cache period for errors.
    return res.send(1);
  }
};
