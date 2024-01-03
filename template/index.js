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
        background: "#434343",
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
            color: "white",
            width: "92%",
            height: "80%",
            padding: 40,
            border: "white 4px solid",
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: "div",
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: "div",
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: "div",
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: "div",
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: "div",
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
                        _owner: null,
                        _store: {},
                      },
                    },
                    _owner: null,
                    _store: {},
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
                          _owner: null,
                          _store: {},
                        },
                        {
                          type: "div",
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
              type: "img",
              key: null,
              ref: null,
              props: {
                // src: "data:image/png;base64,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",
                src: `${imgUrl}`,
                style: {
                  height: "100%",
                },
              },
              _owner: null,
              _store: {},
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
                  background: "#434343",
                  padding: "0 4px",
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
