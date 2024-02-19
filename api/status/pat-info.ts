/**
 * Copyright (c) 2020 Anurag Hazra
 * https://github.com/anuraghazra/github-readme-stats/blob/master/api/status/pat-info.js
 */
import {dateDiff, hasMessage, isPATError} from '../../utils/index.js';
import {VercelResponse} from '@vercel/node';
import type {AxiosResponse } from 'axios';
import {request} from 'pixel-profile';

export const RATE_LIMIT_SECONDS = 60 * 5;

export default async (_, res: VercelResponse): Promise<void> => {
  res.setHeader('Content-Type', 'application/json');
  try {
    // Add header to prevent abuse.
    const PATsInfo = await getPATInfo(uptimeFetcher, {});
    if (PATsInfo) {
      res.setHeader(
        'Cache-Control',
        `max-age=0, s-maxage=${RATE_LIMIT_SECONDS}`,
      );
    }
    res.send(JSON.stringify(PATsInfo, null, 2));
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
            resetAt
          },
        }`,
      variables,
    },
    {
      Authorization: `bearer ${github_token}`,
    },
  );
};

const getAllPATs = () => {
  return Object.keys(process.env).filter((key) => /PAT_\d*$/.exec(key));
};

type PATInfo = {validPATs: string[], expiredPATs: string[], exhaustedPATs: string[], suspendedPATs: string[], errorPATs: string[], details: any}

/**
 * Check whether any of the PATs is expired.
 */
const getPATInfo = async (fetcher: typeof uptimeFetcher, variables: Record<PropertyKey, unknown>): Promise<PATInfo> => {
  const details = {};
  const PATs = getAllPATs();

  for (const pat of PATs) {
    try {
      const response = await fetcher(variables, process.env[pat] as string);
      const errors = response.data.errors;
      const hasErrors = Boolean(errors);
      const errorType = errors?.[0]?.type;
      const isRateLimited =
        (hasErrors && errorType === 'RATE_LIMITED') ||
        response.data.data?.rateLimit?.remaining === 0;

      // Store PATs with errors.
      if (hasErrors && errorType !== 'RATE_LIMITED') {
        details[pat] = {
          status: 'error',
          error: {
            type: errors[0].type,
            message: errors[0].message,
          },
        };
        continue;
      } else if (isRateLimited) {
        const date1 = new Date();
        const date2 = new Date(response.data?.data?.rateLimit?.resetAt);
        details[pat] = {
          status: 'exhausted',
          remaining: 0,
          resetIn: dateDiff(date2, date1) + ' minutes',
        };
      } else {
        details[pat] = {
          status: 'valid',
          remaining: response.data.data.rateLimit.remaining,
        };
      }
    } catch (err) {
      if (isPATError(err)) {
        const errorMessage = err.response?.data?.message?.toLowerCase();
        if (errorMessage === 'bad credentials') {
          details[pat] = {
            status: 'expired',
          };
        } else if (errorMessage === 'sorry. your account was suspended.') {
          details[pat] = {
            status: 'suspended',
          };
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  }

  const filterPATsByStatus = (status) => {
    return Object.keys(details).filter((pat) => details[pat].status === status);
  };

  const sortedDetails = Object.keys(details)
    .sort()
    .reduce((obj, key) => {
      obj[key] = details[key];
      return obj;
    }, {});

  return {
    validPATs: filterPATsByStatus('valid'),
    expiredPATs: filterPATsByStatus('expired'),
    exhaustedPATs: filterPATsByStatus('exhausted'),
    suspendedPATs: filterPATsByStatus('suspended'),
    errorPATs: filterPATsByStatus('error'),
    details: sortedDetails,
  };
};
