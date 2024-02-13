import {Rank} from '../utils';

type Stats = {
  name: string
  totalStars: string
  totalCommits: string
  totalPRs: string
  totalIssues: string
  contributedTo: string
  rank: Rank
  imgUrl: string
}

type Options = {
  color: string
  background: string
}

export const template = (stats: Stats, options: Options) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalPRs,
    totalIssues,
    contributedTo,
    rank,
    imgUrl,
  } = stats;

  const {
    color,
    background
  } = options

  return {
    type: 'div',
    key: null,
    ref: null,
    props: {
      style: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background,
      },
      children: {
        type: 'div',
        key: null,
        ref: null,
        props: {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            fontSize: '23px',
            color,
            width: '92%',
            height: '80%',
            padding: 40,
            border: `${color} 4px solid`,
            position: 'relative',
          },
          children: [
            {
              type: 'div',
              key: null,
              ref: null,
              props: {
                style: {
                  marginTop: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  flexGrow: 1,
                  paddingRight: 40,
                },
                children: [
                  {
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: [
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: 'Total Stars Earned: ',
                          },
                        },
                        {
                          type: 'div',
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
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: [
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: 'Total Commits: ',
                          },
                        },
                        {
                          type: 'div',
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
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: [
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: 'Total PRs: ',
                          },
                        },
                        {
                          type: 'div',
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
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: [
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: 'Total Issues: ',
                          },
                        },
                        {
                          type: 'div',
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
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: [
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: 'Contributed to (last year): ',
                          },
                        },
                        {
                          type: 'div',
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
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: {
                        type: 'div',
                        key: null,
                        ref: null,
                        props: {
                          children: '-------------------------------',
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    key: null,
                    ref: null,
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                      },
                      children: [
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: 'Score: ',
                          },
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${rank.score}`,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: 'img',
              key: null,
              ref: null,
              props: {
                src: `${imgUrl}`,
                style: {
                  height: '100%',
                },
              },
            },
            {
              type: 'div',
              key: null,
              ref: null,
              props: {
                style: {
                  lineHeight: 2,
                  position: 'absolute',
                  top: '-6px',
                  left: '33px',
                  background,
                  padding: '0 4px',
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
