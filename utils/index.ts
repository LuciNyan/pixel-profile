import { isString, objectOf, optional } from 'ts-known'

export const hasMessage = objectOf({
  message: isString
})

export const isPATError = objectOf({
  response: optional(objectOf({
    data: optional(objectOf({
      message: optional(isString)
    }))
  }))
})

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

export const CONSTANTS = {
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

export function dateDiff(d1: number | string | Date, d2: number | string | Date) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diff = date1.getTime() - date2.getTime();
  return Math.round(diff / (1000 * 60));
}

export function parseArray(str: string | string[]): string[] {
  if (Array.isArray(str)) {
    return []
  }

  if (!str) {
    return [];
  }
  return str.split(',');
}

export function parseBoolean(value: string | string[]): boolean | undefined {
  if (!isString(value)) {
    return undefined;
  }

  if (value.toLowerCase() === 'true') {
    return true;
  } else if (value.toLowerCase() === 'false') {
    return false;
  }
}

export function parseString(value: string | string[]): string | undefined {
  return isString(value) ? value : undefined
}
