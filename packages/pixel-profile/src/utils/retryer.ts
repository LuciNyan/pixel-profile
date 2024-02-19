/**
 * Copyright (c) 2020 Anurag Hazra
 * https://github.com/anuraghazra/github-readme-stats/blob/master/src/common/retryer.js
 */
import {AxiosResponse} from 'axios';

// Count the number of GitHub API tokens available.
const PATs = Object.keys(process.env).filter((key) =>
  /PAT_\d*$/.exec(key),
).length;
const RETRIES = process.env.NODE_ENV === 'test' ? 7 : PATs;

type FetcherFunction = (variables: Record<PropertyKey, unknown>, token: string) => Promise<AxiosResponse>

const retryer = async (fetcher: FetcherFunction, variables: Record<PropertyKey, unknown>, retries = 0): Promise<AxiosResponse> => {
  if (!RETRIES) {
    throw new Error('No GitHub API tokens found');
  }
  if (retries > RETRIES) {
    throw new Error('Downtime due to GitHub API rate limiting');
  }
  try {
    // try to fetch with the first token since RETRIES is 0 index i'm adding +1
    const response = await fetcher(
      variables,
      process.env[`PAT_${retries + 1}`] as string,
    );

    // prettier-ignore
    const isRateExceeded = response.data.errors && response.data.errors[0].type === 'RATE_LIMITED';

    // if rate limit is hit increase the RETRIES and recursively call the retryer
    // with username, and current RETRIES
    if (isRateExceeded) {
      console.log(`PAT_${retries + 1} Failed`);
      retries++;
      // directly return from the function
      return retryer(fetcher, variables, retries);
    }

    // finally return the response
    return response;
  } catch (err: any) {
    // prettier-ignore
    // also checking for bad credentials if any tokens gets invalidated
    const isBadCredential = err.response.data && err.response.data.message === 'Bad credentials';
    const isAccountSuspended =
      err.response.data &&
      err.response.data.message === 'Sorry. Your account was suspended.';

    if (isBadCredential || isAccountSuspended) {
      console.log(`PAT_${retries + 1} Failed`);
      retries++;
      // directly return from the function
      return retryer(fetcher, variables, retries);
    } else {
      return err.response;
    }
  }
};

export { retryer, RETRIES };
