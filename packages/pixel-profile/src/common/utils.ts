import axios, { type AxiosRequestConfig } from 'axios';

type AxiosRequestConfigData = AxiosRequestConfig['data']
type AxiosRequestConfigHeaders = AxiosRequestConfig['headers']

const kFormatter = (num: number): string => {
  return Math.abs(num) > 999
    ? Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1)) + 'K'
    : `${Math.sign(num) * Math.abs(num)}`;
};

const request = (data: AxiosRequestConfigData, headers: AxiosRequestConfigHeaders) => {
  return axios({
    url: 'https://api.github.com/graphql',
    method: 'post',
    headers,
    data,
  });
};

const noop = () => {};
// return console instance based on the environment
const logger =
  process.env.NODE_ENV === 'test' ? { log: noop, error: noop } : console;

const clampValue = (number, min, max) => {
  if (Number.isNaN(parseInt(number, 10))) {
    return min;
  }
  return Math.max(min, Math.min(number, max));
};

const ONE_MINUTE = 60;
const FIVE_MINUTES = 300;
const TEN_MINUTES = 600;
const FIFTEEN_MINUTES = 900;
const THIRTY_MINUTES = 1800;
const TWO_HOURS = 7200;
const FOUR_HOURS = 14400;
const SIX_HOURS = 21600;
const EIGHT_HOURS = 28800;
const ONE_DAY = 86400;

const CONSTANTS = {
  ONE_MINUTE,
  FIVE_MINUTES,
  TEN_MINUTES,
  FIFTEEN_MINUTES,
  THIRTY_MINUTES,
  TWO_HOURS,
  FOUR_HOURS,
  SIX_HOURS,
  EIGHT_HOURS,
  ONE_DAY,
  CARD_CACHE_SECONDS: SIX_HOURS,
  ERROR_CACHE_SECONDS: TEN_MINUTES,
};

const parseArray = (str) => {
  if (!str) {
    return [];
  }
  return str.split(',');
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    } else if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  return undefined;
};

const dateDiff = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diff = date1.getTime() - date2.getTime();
  return Math.round(diff / (1000 * 60));
};

export {
  CONSTANTS,
  clampValue,
  kFormatter,
  request,
  logger,
  parseArray,
  parseBoolean,
  dateDiff
};
