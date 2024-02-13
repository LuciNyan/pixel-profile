// src/common/utils.ts
import axios from "axios";
var kFormatter = (num) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * parseFloat((Math.abs(num) / 1e3).toFixed(1)) + "K"
    : `${Math.sign(num) * Math.abs(num)}`;
};
var request = (data, headers) => {
  return axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers,
    data,
  });
};
var noop = () => {};
var logger =
  process.env.NODE_ENV === "test" ? { log: noop, error: noop } : console;
var clampValue = (number, min, max) => {
  if (Number.isNaN(parseInt(number, 10))) {
    return min;
  }
  return Math.max(min, Math.min(number, max));
};
var ONE_MINUTE = 60;
var FIVE_MINUTES = 300;
var TEN_MINUTES = 600;
var FIFTEEN_MINUTES = 900;
var THIRTY_MINUTES = 1800;
var TWO_HOURS = 7200;
var FOUR_HOURS = 14400;
var SIX_HOURS = 21600;
var EIGHT_HOURS = 28800;
var ONE_DAY = 86400;
var CONSTANTS = {
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
var parseArray = (str) => {
  if (!str) {
    return [];
  }
  return str.split(",");
};
var parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    } else if (value.toLowerCase() === "false") {
      return false;
    }
  }
  return void 0;
};
var dateDiff = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diff = date1.getTime() - date2.getTime();
  return Math.round(diff / (1e3 * 60));
};

// src/common/retryer.ts
var PATs = Object.keys(process.env).filter((key) =>
  /PAT_\d*$/.exec(key),
).length;
var RETRIES = process.env.NODE_ENV === "test" ? 7 : PATs;
var retryer = async (fetcher2, variables, retries = 0) => {
  if (!RETRIES) {
    throw new Error("No GitHub API tokens found");
  }
  if (retries > RETRIES) {
    throw new Error("Downtime due to GitHub API rate limiting");
  }
  try {
    const response = await fetcher2(
      variables,
      process.env[`PAT_${retries + 1}`],
      retries,
    );
    const isRateExceeded =
      response.data.errors && response.data.errors[0].type === "RATE_LIMITED";
    if (isRateExceeded) {
      logger.log(`PAT_${retries + 1} Failed`);
      retries++;
      return retryer(fetcher2, variables, retries);
    }
    return response;
  } catch (err) {
    const isBadCredential =
      err.response.data && err.response.data.message === "Bad credentials";
    const isAccountSuspended =
      err.response.data &&
      err.response.data.message === "Sorry. Your account was suspended.";
    if (isBadCredential || isAccountSuspended) {
      logger.log(`PAT_${retries + 1} Failed`);
      retries++;
      return retryer(fetcher2, variables, retries);
    } else {
      return err.response;
    }
  }
};

// src/template/index.ts
var template = (stats, options) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalPRs,
    totalIssues,
    contributedTo,
    rank: rank2,
    imgUrl,
  } = stats;
  const { color, background } = options;
  return {
    type: "div",
    key: null,
    ref: null,
    props: {
      style: {
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        background,
      },
      children: {
        type: "div",
        key: null,
        ref: null,
        props: {
          style: {
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            fontSize: "23px",
            color,
            width: "92%",
            height: "80%",
            padding: 40,
            border: `${color} 4px solid`,
            position: "relative",
          },
          children: [
            {
              type: "div",
              key: null,
              ref: null,
              props: {
                style: {
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  flexGrow: 1,
                  paddingRight: 40,
                },
                children: [
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: [
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: "Total Stars Earned: ",
                          },
                        },
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalStars}`,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: [
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: "Total Commits: ",
                          },
                        },
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalCommits}`,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: [
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: "Total PRs: ",
                          },
                        },
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalPRs}`,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: [
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: "Total Issues: ",
                          },
                        },
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalIssues}`,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: [
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: "Contributed to (last year): ",
                          },
                        },
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: `${contributedTo}`,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: {
                        type: "div",
                        key: null,
                        ref: null,
                        props: {
                          children: "-------------------------------",
                        },
                      },
                    },
                  },
                  {
                    type: "div",
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "100%",
                      },
                      children: [
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: "Score: ",
                          },
                        },
                        {
                          type: "div",
                          key: null,
                          ref: null,
                          props: {
                            children: `${rank2.score}`,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "img",
              key: null,
              ref: null,
              props: {
                src: `${imgUrl}`,
                style: {
                  height: "100%",
                },
              },
            },
            {
              type: "div",
              key: null,
              ref: null,
              props: {
                style: {
                  lineHeight: 2,
                  position: "absolute",
                  top: "-6px",
                  left: "33px",
                  background,
                  padding: "0 4px",
                },
                children: `${name}'s GitHub Stats`,
              },
            },
          ],
        },
      },
    },
  };
};

// src/utils/converter.ts
import Jimp from "jimp";
async function getPixelsFromPngBuffer(dataBuffer) {
  const image = await Jimp.read(dataBuffer);
  const width = image.getWidth();
  const height = image.getHeight();
  const pixelBuffer = Buffer.alloc(width * height * 4);
  image.scan(0, 0, width, height, (x, y, idx) => {
    pixelBuffer[idx] = image.bitmap.data[idx];
    pixelBuffer[idx + 1] = image.bitmap.data[idx + 1];
    pixelBuffer[idx + 2] = image.bitmap.data[idx + 2];
    pixelBuffer[idx + 3] = image.bitmap.data[idx + 3];
  });
  return pixelBuffer;
}
function getBase64FromPixels(bitmapData, width, height) {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = bitmapData;
      image.getBase64("image/png", function (error, str) {
        resolve(str);
      });
    });
  });
}
function getPngBufferFromPixels(bitmapData, width, height) {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = bitmapData;
      image.getBuffer("image/png", function (error, buffer) {
        resolve(buffer);
      });
    });
  });
}

// src/utils/vec.ts
function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

// src/utils/renderer.ts
function coordsToIndex(x, y, width) {
  return (y * width + x) * 4;
}
function render(sourcePixels, width, height, fragShader) {
  const targetBuffer = Buffer.alloc(width * height * 4);
  function biLinearInterpolate(v1, v2, v3, v4, sx, sy) {
    const tmp1 = v1 * (1 - sx) + v2 * sx;
    const tmp2 = v3 * (1 - sx) + v4 * sx;
    return tmp1 * (1 - sy) + tmp2 * sy;
  }
  function biLinearFilter(coords) {
    const x = coords[0] * width;
    const y = coords[1] * height;
    const x0 = clamp(Math.floor(x), 0, width - 1);
    const x1 = clamp(x0 + 1, 0, width - 1);
    const y0 = clamp(Math.floor(y), 0, height - 1);
    const y1 = clamp(y0 + 1, 0, height - 1);
    const sx = x - x0;
    const sy = y - y0;
    const p00 = (y0 * width + x0) * 4;
    const p01 = (y1 * width + x0) * 4;
    const p10 = (y0 * width + x1) * 4;
    const p11 = (y1 * width + x1) * 4;
    const r = biLinearInterpolate(
      sourcePixels[p00],
      sourcePixels[p10],
      sourcePixels[p01],
      sourcePixels[p11],
      sx,
      sy,
    );
    const g = biLinearInterpolate(
      sourcePixels[p00 + 1],
      sourcePixels[p10 + 1],
      sourcePixels[p01 + 1],
      sourcePixels[p11 + 1],
      sx,
      sy,
    );
    const b = biLinearInterpolate(
      sourcePixels[p00 + 2],
      sourcePixels[p10 + 2],
      sourcePixels[p01 + 2],
      sourcePixels[p11 + 2],
      sx,
      sy,
    );
    const a = biLinearInterpolate(
      sourcePixels[p00 + 3],
      sourcePixels[p10 + 3],
      sourcePixels[p01 + 3],
      sourcePixels[p11 + 3],
      sx,
      sy,
    );
    return [r, g, b, a];
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgba = fragShader([x / width, y / height], biLinearFilter);
      const index = coordsToIndex(x, y, width);
      targetBuffer[index] = rgba[0];
      targetBuffer[index + 1] = rgba[1];
      targetBuffer[index + 2] = rgba[2];
      targetBuffer[index + 3] = rgba[3];
    }
  }
  return targetBuffer;
}

// src/utils/shader.ts
function pixelate(sourceBuffer, width, height, blockSize) {
  return render(sourceBuffer, width, height, (uv, texture2D) => {
    const blockW = blockSize / width;
    const blockH = blockSize / height;
    const x = Math.floor(uv[0] / blockW);
    const y = Math.floor(uv[1] / blockH);
    return texture2D([x * blockW + blockW / 2, y * blockH + blockH / 2]);
  });
}
var margin = [0, 0];
var screenCurvature = 0.1;
function curve(sourcePixels, width, height) {
  return render(sourcePixels, width, height, (uv, texture2D) => {
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }
    function prod2(v) {
      return v[0] * v[1];
    }
    function subtract(vec1, vec2) {
      return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
    }
    function distortCoordinates(coords2) {
      const cc = subtract(coords2, [0.5, 0.5]);
      const dist = dot(cc, cc) * screenCurvature;
      const temp = (1 + dist) * dist;
      cc[0] = cc[0] * temp;
      cc[1] = cc[1] * temp;
      return [coords2[0] + cc[0], coords2[1] + cc[1]];
    }
    const coords = distortCoordinates(uv);
    coords[0] = coords[0] * (margin[0] * 2 + 1) - margin[0];
    coords[1] = coords[1] * (margin[1] * 2 + 1) - margin[1];
    const vignetteCoords = [uv[0] * (1 - uv[1]), uv[1] * (1 - uv[0])];
    const vignette = Math.pow(prod2(vignetteCoords) * 15, 0.25);
    const samplerColor = texture2D(coords);
    return [
      samplerColor[0] * vignette,
      samplerColor[1] * vignette,
      samplerColor[2] * vignette,
      255,
    ];
  });
}

// src/utils/rank.ts
function calcExponentialCDF(x) {
  return 1 - 2 ** -x;
}
function calcLogNormalCDF(x) {
  return x / (1 + x);
}
function formatScore(score) {
  if (score % 1 === 0) {
    return Math.floor(score);
  }
  return score;
}
function rank({
  all_commits,
  commits,
  prs,
  issues,
  reviews,
  // eslint-disable-next-line no-unused-vars
  repos,
  stars,
  followers,
}) {
  const COMMITS_MEDIAN = all_commits ? 1e3 : 250,
    COMMITS_WEIGHT = 2;
  const PRS_MEDIAN = 50,
    PRS_WEIGHT = 3;
  const ISSUES_MEDIAN = 25,
    ISSUES_WEIGHT = 1;
  const REVIEWS_MEDIAN = 2,
    REVIEWS_WEIGHT = 1;
  const STARS_MEDIAN = 50,
    STARS_WEIGHT = 4;
  const FOLLOWERS_MEDIAN = 10,
    FOLLOWERS_WEIGHT = 1;
  const TOTAL_WEIGHT =
    COMMITS_WEIGHT +
    PRS_WEIGHT +
    ISSUES_WEIGHT +
    REVIEWS_WEIGHT +
    STARS_WEIGHT +
    FOLLOWERS_WEIGHT;
  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];
  const score =
    (COMMITS_WEIGHT * calcExponentialCDF(commits / COMMITS_MEDIAN) +
      PRS_WEIGHT * calcExponentialCDF(prs / PRS_MEDIAN) +
      ISSUES_WEIGHT * calcExponentialCDF(issues / ISSUES_MEDIAN) +
      REVIEWS_WEIGHT * calcExponentialCDF(reviews / REVIEWS_MEDIAN) +
      STARS_WEIGHT * calcLogNormalCDF(stars / STARS_MEDIAN) +
      FOLLOWERS_WEIGHT * calcLogNormalCDF(followers / FOLLOWERS_MEDIAN)) /
    TOTAL_WEIGHT;
  const rank2 = 1 - score;
  const level = LEVELS[THRESHOLDS.findIndex((t) => rank2 * 100 <= t)];
  return {
    level,
    percentile: rank2 * 100,
    score: formatScore(Number((score * 100).toFixed(1))),
  };
}

// src/cards/stats.ts
import { Resvg } from "@resvg/resvg-js";
import axios2 from "axios";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
var CARD_WIDTH = 1220;
var CARD_HEIGHT = 460;
var AVATAR_WIDTH = 280;
var AVATAR_HEIGHT = 280;
async function renderStats(stats, options) {
  const {
    name,
    username,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    avatarUrl,
    contributedTo,
    rank: rank2,
  } = stats;
  const { screenEffect = true } = options;
  const width = CARD_WIDTH;
  const height = CARD_HEIGHT;
  const fontPath = join(process.cwd(), "fonts", "PressStart2P-Regular.ttf");
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
    rank: rank2,
  };
  let isMissingFont = false;
  const templateOptions = {
    color: "white",
    background: "#434343",
    // #00a7d0
  };
  let svg = await satori(template(_stats, templateOptions), {
    width,
    height,
    fonts: [
      {
        name: "PressStart2P",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
    loadAdditionalAsset: async () => {
      isMissingFont = true;
      return "";
    },
  });
  if (isMissingFont) {
    _stats.name = username;
    svg = await satori(template(_stats, templateOptions), {
      width,
      height,
      fonts: [
        {
          name: "PressStart2P",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    });
  }
  const opts = {
    fitTo: {
      mode: "width",
      value: width,
    },
  };
  const pngData = new Resvg(svg, opts).render();
  const pngBuffer = pngData.asPng();
  let pixels = await getPixelsFromPngBuffer(pngBuffer);
  if (screenEffect) {
    pixels = curve(pixels, width, height);
  }
  return await getPngBufferFromPixels(pixels, width, height);
}
async function makeAvatar(url, width, height, blockSize = 6.8) {
  const response = await axios2.get(url, {
    responseType: "arraybuffer",
  });
  const png = Buffer.from(response.data, "binary");
  const _pixels = await getPixelsFromPngBuffer(png);
  const pixels = pixelate(_pixels, width, height, blockSize);
  return await getBase64FromPixels(pixels, width, height);
}

// src/fetchers/stats-fetcher.ts
import axios3 from "axios";
import * as dotenv from "dotenv";
import githubUsernameRegex from "github-username-regex";
dotenv.config();
var GRAPHQL_REPOS_FIELD = `
  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: $after) {
    totalCount
    nodes {
      name
      stargazers {
        totalCount
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`;
var GRAPHQL_REPOS_QUERY = `
  query userInfo($login: String!, $after: String) {
    user(login: $login) {
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`;
var GRAPHQL_STATS_QUERY = `
  query userInfo($login: String!, $after: String, $includeMergedPullRequests: Boolean!, $includeDiscussions: Boolean!, $includeDiscussionsAnswers: Boolean!) {
    user(login: $login) {
      name
      login
      avatarUrl(size: 280)
      bio
      contributionsCollection {
        totalCommitContributions,
        totalPullRequestReviewContributions
      }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
      }
      pullRequests(first: 1) {
        totalCount
      }
      mergedPullRequests: pullRequests(states: MERGED) @include(if: $includeMergedPullRequests) {
        totalCount
      }
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      followers {
        totalCount
      }
      repositoryDiscussions @include(if: $includeDiscussions) {
        totalCount
      }
      repositoryDiscussionComments(onlyAnswers: true) @include(if: $includeDiscussionsAnswers) {
        totalCount
      }
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`;
var fetcher = (variables, token) => {
  const query = variables.after ? GRAPHQL_REPOS_QUERY : GRAPHQL_STATS_QUERY;
  return request(
    {
      query,
      variables,
    },
    {
      Authorization: `bearer ${token}`,
    },
  );
};
var statsFetcher = async ({
  username,
  includeMergedPullRequests,
  includeDiscussions,
  includeDiscussionsAnswers,
}) => {
  let stats;
  let hasNextPage = true;
  let endCursor = null;
  while (hasNextPage) {
    const variables = {
      login: username,
      first: 100,
      after: endCursor,
      includeMergedPullRequests,
      includeDiscussions,
      includeDiscussionsAnswers,
    };
    const res = await retryer(fetcher, variables);
    if (res.data.errors) {
      return res;
    }
    const repoNodes = res.data.data.user.repositories.nodes;
    if (stats) {
      stats.data.data.user.repositories.nodes.push(...repoNodes);
    } else {
      stats = res;
    }
    const repoNodesWithStars = repoNodes.filter(
      (node) => node.stargazers.totalCount !== 0,
    );
    hasNextPage =
      process.env.FETCH_MULTI_PAGE_STARS === "true" &&
      repoNodes.length === repoNodesWithStars.length &&
      res.data.data.user.repositories.pageInfo.hasNextPage;
    endCursor = res.data.data.user.repositories.pageInfo.endCursor;
  }
  return stats;
};
var totalCommitsFetcher = async (username) => {
  if (!githubUsernameRegex.test(username)) {
    logger.log("Invalid username provided.");
    throw new Error("Invalid username provided.");
  }
  const fetchTotalCommits = (variables, token) => {
    return axios3({
      method: "get",
      url: `https://api.github.com/search/commits?q=author:${variables.login}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
        Authorization: `token ${token}`,
      },
    });
  };
  let res;
  try {
    res = await retryer(fetchTotalCommits, { login: username });
  } catch (err) {
    logger.log(err);
    throw new Error(err);
  }
  const totalCount = res.data.total_count;
  if (!totalCount || isNaN(totalCount)) {
    throw new Error("Could not fetch total commits.");
  }
  return totalCount;
};
async function fetchStats(
  username,
  include_all_commits = false,
  exclude_repo = [],
  include_merged_pull_requests = false,
  include_discussions = false,
  include_discussions_answers = false,
) {
  if (!username) {
    throw new Error("needs a username");
  }
  const stats = {
    name: "",
    username,
    avatarUrl: "",
    bio: "",
    totalPRs: 0,
    totalPRsMerged: 0,
    mergedPRsPercentage: 0,
    totalReviews: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    totalDiscussionsStarted: 0,
    totalDiscussionsAnswered: 0,
    contributedTo: 0,
    rank: { level: "C", percentile: 100, score: 0 },
  };
  const res = await statsFetcher({
    username,
    includeMergedPullRequests: include_merged_pull_requests,
    includeDiscussions: include_discussions,
    includeDiscussionsAnswers: include_discussions_answers,
  });
  if (res.data.errors) {
    logger.error(res.data.errors);
    if (res.data.errors[0].type === "NOT_FOUND") {
      throw new Error(res.data.errors[0].message || "Could not fetch user.");
    }
    if (res.data.errors[0].message) {
      throw new Error(res.data.errors[0].message);
    }
    throw new Error(
      "Something went wrong while trying to retrieve the stats data using the GraphQL API.",
    );
  }
  const user = res.data.data.user;
  stats.name = user.name || user.login;
  stats.avatarUrl = user.avatarUrl;
  stats.bio = user.bio;
  if (include_all_commits) {
    stats.totalCommits = await totalCommitsFetcher(username);
  } else {
    stats.totalCommits = user.contributionsCollection.totalCommitContributions;
  }
  stats.totalPRs = user.pullRequests.totalCount;
  if (include_merged_pull_requests) {
    stats.totalPRsMerged = user.mergedPullRequests.totalCount;
    stats.mergedPRsPercentage =
      (user.mergedPullRequests.totalCount / user.pullRequests.totalCount) * 100;
  }
  stats.totalReviews =
    user.contributionsCollection.totalPullRequestReviewContributions;
  stats.totalIssues = user.openIssues.totalCount + user.closedIssues.totalCount;
  if (include_discussions) {
    stats.totalDiscussionsStarted = user.repositoryDiscussions.totalCount;
  }
  if (include_discussions_answers) {
    stats.totalDiscussionsAnswered =
      user.repositoryDiscussionComments.totalCount;
  }
  stats.contributedTo = user.repositoriesContributedTo.totalCount;
  const repoToHide = new Set(exclude_repo);
  stats.totalStars = user.repositories.nodes
    .filter((data) => {
      return !repoToHide.has(data.name);
    })
    .reduce((prev, curr) => {
      return prev + curr.stargazers.totalCount;
    }, 0);
  stats.rank = rank({
    all_commits: include_all_commits,
    commits: stats.totalCommits,
    prs: stats.totalPRs,
    reviews: stats.totalReviews,
    issues: stats.totalIssues,
    repos: user.repositories.totalCount,
    stars: stats.totalStars,
    followers: user.followers.totalCount,
  });
  return stats;
}
export {
  CONSTANTS,
  clampValue,
  dateDiff,
  fetchStats,
  kFormatter,
  logger,
  parseArray,
  parseBoolean,
  renderStats,
  request,
  retryer,
};
//# sourceMappingURL=index.js.map
