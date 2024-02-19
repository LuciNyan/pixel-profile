/**
 * Copyright (c) 2020 Anurag Hazra
 * https://github.com/anuraghazra/github-readme-stats/blob/master/api/status/up.js
 */
import {hasMessage, parseString} from '../../utils/index.js';
import {VercelRequest, VercelResponse} from '@vercel/node';
import {AxiosResponse} from 'axios';
import { request, retryer } from 'pixel-profile';

export const RATE_LIMIT_SECONDS = 60 * 5;

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const _type = parseString(req.query.type)

  const type = _type ? _type.toLowerCase() : 'boolean'

  res.setHeader('Content-Type', 'application/json');

  try {
    let PATsValid = true;
    try {
      await retryer(uptimeFetcher, {});
    } catch (err) {
      PATsValid = false;
    }

    if (PATsValid) {
      res.setHeader(
        'Cache-Control',
        `max-age=0, s-maxage=${RATE_LIMIT_SECONDS}`,
      );
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }

    switch (type) {
      case 'shields':
        res.send(shieldsUptimeBadge(PATsValid));
        break;
      case 'json':
        res.send({ up: PATsValid });
        break;
      default:
        res.send(PATsValid);
        break;
    }
  } catch (err) {
    console.error(err);

    res.setHeader('Cache-Control', 'no-store');

    if (hasMessage(err)) {
      res.send('Something went wrong: ' + err.message);
    }
  }
};

const uptimeFetcher = (variables: Record<PropertyKey, unknown>, github_token: string): Promise<AxiosResponse> => {
  return request(
    {
      query: `
        query {
          rateLimit {
              remaining
          }
        }
        `,
      variables,
    },
    {
      Authorization: `bearer ${github_token}`,
    },
  );
};

type ShieldsResponse = {
  schemaVersion: number;
  label: string;
  message: 'up' | 'down';
  color: 'brightgreen' | 'red';
  isError: boolean
}

const shieldsUptimeBadge = (up: boolean): ShieldsResponse => {
  const schemaVersion = 1;
  const isError = true;
  const label = 'Public Instance';
  const message = up ? 'up' : 'down';
  const color = up ? 'brightgreen' : 'red';
  return {
    schemaVersion,
    label,
    message,
    color,
    isError,
  };
};
