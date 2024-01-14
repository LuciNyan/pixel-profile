export const template = (stats) => {
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
        background: '#434343',
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
            color: 'white',
            width: '92%',
            height: '80%',
            padding: 40,
            border: 'white 4px solid',
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalStars}`,
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalCommits}`,
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalPRs}`,
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${totalIssues}`,
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${contributedTo}`,
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
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
                        _owner: null,
                        _store: {},
                      },
                    },
                    _owner: null,
                    _store: {},
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: 'div',
                          key: null,
                          ref: null,
                          props: {
                            children: `${rank.score}`,
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
                  },
                ],
              },
              _owner: null,
              _store: {},
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
              _owner: null,
              _store: {},
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
                  background: '#434343',
                  padding: '0 4px',
                },
                children: `${name}'s GitHub Stats`,
              },
              _owner: null,
              _store: {},
            },
          ],
        },
        _owner: null,
        _store: {},
      },
    },
    _owner: null,
    _store: {},
  };
};
