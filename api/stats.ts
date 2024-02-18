import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  clampValue,
  CONSTANTS,
  fetchStats,
  parseArray,
  parseBoolean,
  renderStats} from 'pixel-profile';
import {isString} from 'ts-known';

export default async (req: VercelRequest, res: VercelResponse) => {
  const {
    username,
    screen_effect,
    show_avatar,
    pixelate_avatar,
    color,
    background,
    include_all_commits,
    cache_seconds = `${CONSTANTS.CARD_CACHE_SECONDS}`,
    exclude_repo,
    show
  } = req.query;

  res.setHeader('Content-Type', 'image/png');

  try {
    const showStats = parseArray(show);
    const includeAllCommits = parseBoolean(include_all_commits)

    const stats = await fetchStats(
      typeof username === 'string' ? username : '',
      includeAllCommits,
      parseArray(exclude_repo),
      showStats.includes('prs_merged') ||
        showStats.includes('prs_merged_percentage'),
      showStats.includes('discussions_started'),
      showStats.includes('discussions_answered'),
    );

    let cacheSeconds = clampValue(
      parseInt(isString(cache_seconds) ? cache_seconds : cache_seconds[0], 10),
      CONSTANTS.SIX_HOURS,
      CONSTANTS.ONE_DAY,
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      'Cache-Control',
      `max-age=${cacheSeconds / 2}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );

    const options = {
      screenEffect: parseBoolean(screen_effect),
      color: isString(color) ? color : undefined,
      background: isString(background) ? background : undefined,
      showAvatar: parseBoolean(show_avatar),
      pixelateAvatar: parseBoolean(pixelate_avatar),
      includeAllCommits
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
