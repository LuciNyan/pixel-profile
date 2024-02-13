import * as axios from 'axios';
import { AxiosRequestConfig } from 'axios';

type Rank = {
    level: string;
    percentile: number;
    score: number;
};

type Stats = {
    name: string;
    username: string;
    totalStars: number;
    totalCommits: number;
    totalIssues: number;
    totalPRs: number;
    avatarUrl: string;
    contributedTo: number;
    rank: Rank;
};
type Options = {
    screenEffect?: boolean;
};
declare function renderStats(stats: Stats, options: Options): Promise<Buffer>;

type StatsData = {
    name: string;
    username: any;
    bio: string;
    avatarUrl: string;
    totalPRs: number;
    totalPRsMerged: number;
    mergedPRsPercentage: number;
    totalReviews: number;
    totalCommits: number;
    totalIssues: number;
    totalStars: number;
    totalDiscussionsStarted: number;
    totalDiscussionsAnswered: number;
    contributedTo: number;
    rank: Rank;
};
declare function fetchStats(username: string, include_all_commits?: boolean, exclude_repo?: string[], include_merged_pull_requests?: boolean, include_discussions?: boolean, include_discussions_answers?: boolean): Promise<StatsData>;

/**
 * @typedef {import("axios").AxiosResponse} AxiosResponse Axios response.
 * @typedef {(variables: object, token: string) => Promise<AxiosResponse>} FetcherFunction Fetcher function.
 */
/**
 * Try to execute the fetcher function until it succeeds or the max number of retries is reached.
 *
 * @param {FetcherFunction} fetcher The fetcher function.
 * @param {object} variables Object with arguments to pass to the fetcher function.
 * @param {number} retries How many times to retry.
 * @returns {Promise<T>} The response from the fetcher function.
 */
declare const retryer: (fetcher: any, variables: any, retries?: number) => any;

type AxiosRequestConfigData = AxiosRequestConfig['data'];
type AxiosRequestConfigHeaders = AxiosRequestConfig['headers'];
declare const kFormatter: (num: number) => string;
declare const request: (data: AxiosRequestConfigData, headers: AxiosRequestConfigHeaders) => Promise<axios.AxiosResponse<any, any>>;
declare const logger: Console | {
    log: () => void;
    error: () => void;
};
declare const clampValue: (number: any, min: any, max: any) => any;
declare const CONSTANTS: {
    ONE_MINUTE: number;
    FIVE_MINUTES: number;
    TEN_MINUTES: number;
    FIFTEEN_MINUTES: number;
    THIRTY_MINUTES: number;
    TWO_HOURS: number;
    FOUR_HOURS: number;
    SIX_HOURS: number;
    EIGHT_HOURS: number;
    ONE_DAY: number;
    CARD_CACHE_SECONDS: number;
    ERROR_CACHE_SECONDS: number;
};
declare const parseArray: (str: any) => any;
declare const parseBoolean: (value: any) => boolean | undefined;
declare const dateDiff: (d1: any, d2: any) => number;

export { CONSTANTS, clampValue, dateDiff, fetchStats, kFormatter, logger, parseArray, parseBoolean, renderStats, request, retryer };
