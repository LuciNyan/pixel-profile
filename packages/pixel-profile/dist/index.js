var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
);

// ../../node_modules/.pnpm/object-assign@4.1.1/node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "../../node_modules/.pnpm/object-assign@4.1.1/node_modules/object-assign/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError(
          "Object.assign cannot be called with null or undefined",
        );
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function (letter) {
          test3[letter] = letter;
        });
        if (
          Object.keys(Object.assign({}, test3)).join("") !==
          "abcdefghijklmnopqrst"
        ) {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = shouldUseNative()
      ? Object.assign
      : function (target, source) {
          var from;
          var to = toObject(target);
          var symbols;
          for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
            for (var key in from) {
              if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
              }
            }
            if (getOwnPropertySymbols) {
              symbols = getOwnPropertySymbols(from);
              for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                  to[symbols[i]] = from[symbols[i]];
                }
              }
            }
          }
          return to;
        };
  },
});

// ../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react.production.min.js
var require_react_production_min = __commonJS({
  "../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react.production.min.js"(
    exports,
  ) {
    "use strict";
    var l = require_object_assign();
    var n = 60103;
    var p = 60106;
    exports.Fragment = 60107;
    exports.StrictMode = 60108;
    exports.Profiler = 60114;
    var q = 60109;
    var r = 60110;
    var t = 60112;
    exports.Suspense = 60113;
    var u = 60115;
    var v = 60116;
    if ("function" === typeof Symbol && Symbol.for) {
      w = Symbol.for;
      n = w("react.element");
      p = w("react.portal");
      exports.Fragment = w("react.fragment");
      exports.StrictMode = w("react.strict_mode");
      exports.Profiler = w("react.profiler");
      q = w("react.provider");
      r = w("react.context");
      t = w("react.forward_ref");
      exports.Suspense = w("react.suspense");
      u = w("react.memo");
      v = w("react.lazy");
    }
    var w;
    var x = "function" === typeof Symbol && Symbol.iterator;
    function y(a) {
      if (null === a || "object" !== typeof a) return null;
      a = (x && a[x]) || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    function z(a) {
      for (
        var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a,
          c = 1;
        c < arguments.length;
        c++
      )
        b += "&args[]=" + encodeURIComponent(arguments[c]);
      return (
        "Minified React error #" +
        a +
        "; visit " +
        b +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    var A = {
      isMounted: function () {
        return false;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    };
    var B = {};
    function C(a, b, c) {
      this.props = a;
      this.context = b;
      this.refs = B;
      this.updater = c || A;
    }
    C.prototype.isReactComponent = {};
    C.prototype.setState = function (a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a)
        throw Error(z(85));
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    C.prototype.forceUpdate = function (a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function D() {}
    D.prototype = C.prototype;
    function E(a, b, c) {
      this.props = a;
      this.context = b;
      this.refs = B;
      this.updater = c || A;
    }
    var F = (E.prototype = new D());
    F.constructor = E;
    l(F, C.prototype);
    F.isPureReactComponent = true;
    var G = { current: null };
    var H = Object.prototype.hasOwnProperty;
    var I = { key: true, ref: true, __self: true, __source: true };
    function J(a, b, c) {
      var e,
        d = {},
        k = null,
        h = null;
      if (null != b)
        for (e in (void 0 !== b.ref && (h = b.ref),
        void 0 !== b.key && (k = "" + b.key),
        b))
          H.call(b, e) && !I.hasOwnProperty(e) && (d[e] = b[e]);
      var g = arguments.length - 2;
      if (1 === g) d.children = c;
      else if (1 < g) {
        for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
        d.children = f;
      }
      if (a && a.defaultProps)
        for (e in ((g = a.defaultProps), g)) void 0 === d[e] && (d[e] = g[e]);
      return {
        $$typeof: n,
        type: a,
        key: k,
        ref: h,
        props: d,
        _owner: G.current,
      };
    }
    function K(a, b) {
      return {
        $$typeof: n,
        type: a.type,
        key: b,
        ref: a.ref,
        props: a.props,
        _owner: a._owner,
      };
    }
    function L(a) {
      return "object" === typeof a && null !== a && a.$$typeof === n;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return (
        "$" +
        a.replace(/[=:]/g, function (a2) {
          return b[a2];
        })
      );
    }
    var M = /\/+/g;
    function N(a, b) {
      return "object" === typeof a && null !== a && null != a.key
        ? escape("" + a.key)
        : b.toString(36);
    }
    function O(a, b, c, e, d) {
      var k = typeof a;
      if ("undefined" === k || "boolean" === k) a = null;
      var h = false;
      if (null === a) h = true;
      else
        switch (k) {
          case "string":
          case "number":
            h = true;
            break;
          case "object":
            switch (a.$$typeof) {
              case n:
              case p:
                h = true;
            }
        }
      if (h)
        return (
          (h = a),
          (d = d(h)),
          (a = "" === e ? "." + N(h, 0) : e),
          Array.isArray(d)
            ? ((c = ""),
              null != a && (c = a.replace(M, "$&/") + "/"),
              O(d, b, c, "", function (a2) {
                return a2;
              }))
            : null != d &&
              (L(d) &&
                (d = K(
                  d,
                  c +
                    (!d.key || (h && h.key === d.key)
                      ? ""
                      : ("" + d.key).replace(M, "$&/") + "/") +
                    a,
                )),
              b.push(d)),
          1
        );
      h = 0;
      e = "" === e ? "." : e + ":";
      if (Array.isArray(a))
        for (var g = 0; g < a.length; g++) {
          k = a[g];
          var f = e + N(k, g);
          h += O(k, b, c, f, d);
        }
      else if (((f = y(a)), "function" === typeof f))
        for (a = f.call(a), g = 0; !(k = a.next()).done; )
          (k = k.value), (f = e + N(k, g++)), (h += O(k, b, c, f, d));
      else if ("object" === k)
        throw (
          ((b = "" + a),
          Error(
            z(
              31,
              "[object Object]" === b
                ? "object with keys {" + Object.keys(a).join(", ") + "}"
                : b,
            ),
          ))
        );
      return h;
    }
    function P(a, b, c) {
      if (null == a) return a;
      var e = [],
        d = 0;
      O(a, e, "", "", function (a2) {
        return b.call(c, a2, d++);
      });
      return e;
    }
    function Q(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        a._status = 0;
        a._result = b;
        b.then(
          function (b2) {
            0 === a._status &&
              ((b2 = b2.default), (a._status = 1), (a._result = b2));
          },
          function (b2) {
            0 === a._status && ((a._status = 2), (a._result = b2));
          },
        );
      }
      if (1 === a._status) return a._result;
      throw a._result;
    }
    var R = { current: null };
    function S() {
      var a = R.current;
      if (null === a) throw Error(z(321));
      return a;
    }
    var T = {
      ReactCurrentDispatcher: R,
      ReactCurrentBatchConfig: { transition: 0 },
      ReactCurrentOwner: G,
      IsSomeRendererActing: { current: false },
      assign: l,
    };
    exports.Children = {
      map: P,
      forEach: function (a, b, c) {
        P(
          a,
          function () {
            b.apply(this, arguments);
          },
          c,
        );
      },
      count: function (a) {
        var b = 0;
        P(a, function () {
          b++;
        });
        return b;
      },
      toArray: function (a) {
        return (
          P(a, function (a2) {
            return a2;
          }) || []
        );
      },
      only: function (a) {
        if (!L(a)) throw Error(z(143));
        return a;
      },
    };
    exports.Component = C;
    exports.PureComponent = E;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T;
    exports.cloneElement = function (a, b, c) {
      if (null === a || void 0 === a) throw Error(z(267, a));
      var e = l({}, a.props),
        d = a.key,
        k = a.ref,
        h = a._owner;
      if (null != b) {
        void 0 !== b.ref && ((k = b.ref), (h = G.current));
        void 0 !== b.key && (d = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f in b)
          H.call(b, f) &&
            !I.hasOwnProperty(f) &&
            (e[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f) e.children = c;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
        e.children = g;
      }
      return {
        $$typeof: n,
        type: a.type,
        key: d,
        ref: k,
        props: e,
        _owner: h,
      };
    };
    exports.createContext = function (a, b) {
      void 0 === b && (b = null);
      a = {
        $$typeof: r,
        _calculateChangedBits: b,
        _currentValue: a,
        _currentValue2: a,
        _threadCount: 0,
        Provider: null,
        Consumer: null,
      };
      a.Provider = { $$typeof: q, _context: a };
      return (a.Consumer = a);
    };
    exports.createElement = J;
    exports.createFactory = function (a) {
      var b = J.bind(null, a);
      b.type = a;
      return b;
    };
    exports.createRef = function () {
      return { current: null };
    };
    exports.forwardRef = function (a) {
      return { $$typeof: t, render: a };
    };
    exports.isValidElement = L;
    exports.lazy = function (a) {
      return { $$typeof: v, _payload: { _status: -1, _result: a }, _init: Q };
    };
    exports.memo = function (a, b) {
      return { $$typeof: u, type: a, compare: void 0 === b ? null : b };
    };
    exports.useCallback = function (a, b) {
      return S().useCallback(a, b);
    };
    exports.useContext = function (a, b) {
      return S().useContext(a, b);
    };
    exports.useDebugValue = function () {};
    exports.useEffect = function (a, b) {
      return S().useEffect(a, b);
    };
    exports.useImperativeHandle = function (a, b, c) {
      return S().useImperativeHandle(a, b, c);
    };
    exports.useLayoutEffect = function (a, b) {
      return S().useLayoutEffect(a, b);
    };
    exports.useMemo = function (a, b) {
      return S().useMemo(a, b);
    };
    exports.useReducer = function (a, b, c) {
      return S().useReducer(a, b, c);
    };
    exports.useRef = function (a) {
      return S().useRef(a);
    };
    exports.useState = function (a) {
      return S().useState(a);
    };
    exports.version = "17.0.2";
  },
});

// ../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react.development.js"(
    exports,
  ) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function () {
        "use strict";
        var _assign = require_object_assign();
        var ReactVersion = "17.0.2";
        var REACT_ELEMENT_TYPE = 60103;
        var REACT_PORTAL_TYPE = 60106;
        exports.Fragment = 60107;
        exports.StrictMode = 60108;
        exports.Profiler = 60114;
        var REACT_PROVIDER_TYPE = 60109;
        var REACT_CONTEXT_TYPE = 60110;
        var REACT_FORWARD_REF_TYPE = 60112;
        exports.Suspense = 60113;
        var REACT_SUSPENSE_LIST_TYPE = 60120;
        var REACT_MEMO_TYPE = 60115;
        var REACT_LAZY_TYPE = 60116;
        var REACT_BLOCK_TYPE = 60121;
        var REACT_SERVER_BLOCK_TYPE = 60122;
        var REACT_FUNDAMENTAL_TYPE = 60117;
        var REACT_SCOPE_TYPE = 60119;
        var REACT_OPAQUE_ID_TYPE = 60128;
        var REACT_DEBUG_TRACING_MODE_TYPE = 60129;
        var REACT_OFFSCREEN_TYPE = 60130;
        var REACT_LEGACY_HIDDEN_TYPE = 60131;
        if (typeof Symbol === "function" && Symbol.for) {
          var symbolFor = Symbol.for;
          REACT_ELEMENT_TYPE = symbolFor("react.element");
          REACT_PORTAL_TYPE = symbolFor("react.portal");
          exports.Fragment = symbolFor("react.fragment");
          exports.StrictMode = symbolFor("react.strict_mode");
          exports.Profiler = symbolFor("react.profiler");
          REACT_PROVIDER_TYPE = symbolFor("react.provider");
          REACT_CONTEXT_TYPE = symbolFor("react.context");
          REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
          exports.Suspense = symbolFor("react.suspense");
          REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
          REACT_MEMO_TYPE = symbolFor("react.memo");
          REACT_LAZY_TYPE = symbolFor("react.lazy");
          REACT_BLOCK_TYPE = symbolFor("react.block");
          REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
          REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
          REACT_SCOPE_TYPE = symbolFor("react.scope");
          REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
          REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
          REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
          REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
        }
        var MAYBE_ITERATOR_SYMBOL =
          typeof Symbol === "function" && Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator =
            (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
            maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactCurrentDispatcher = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null,
        };
        var ReactCurrentBatchConfig = {
          transition: 0,
        };
        var ReactCurrentOwner = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null,
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function () {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var IsSomeRendererActing = {
          current: false,
        };
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner,
          IsSomeRendererActing,
          // Used by renderers to avoid bundling object-assign twice in UMD bundles:
          assign: _assign,
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
        }
        function warn(format) {
          {
            for (
              var _len = arguments.length,
                args = new Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              args[_key - 1] = arguments[_key];
            }
            printWarning("warn", format, args);
          }
        }
        function error(format) {
          {
            for (
              var _len2 = arguments.length,
                args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                _key2 = 1;
              _key2 < _len2;
              _key2++
            ) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 =
              ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function (item) {
              return "" + item;
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(
              console[level],
              console,
              argsWithFormat,
            );
          }
        }
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName =
              (_constructor &&
                (_constructor.displayName || _constructor.name)) ||
              "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error(
              "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
              callerName,
              componentName,
            );
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        var ReactNoopUpdateQueue = {
          /**
           * Checks whether or not this composite component is mounted.
           * @param {ReactClass} publicInstance The instance we want to test.
           * @return {boolean} True if mounted, false otherwise.
           * @protected
           * @final
           */
          isMounted: function (publicInstance) {
            return false;
          },
          /**
           * Forces an update. This should only be invoked when it is known with
           * certainty that we are **not** in a DOM transaction.
           *
           * You may want to call this when you know that some deeper aspect of the
           * component's state has changed but `setState` was not called.
           *
           * This will not invoke `shouldComponentUpdate`, but it will invoke
           * `componentWillUpdate` and `componentDidUpdate`.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueForceUpdate: function (publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          },
          /**
           * Replaces all of the state. Always use this or `setState` to mutate state.
           * You should treat `this.state` as immutable.
           *
           * There is no guarantee that `this.state` will be immediately updated, so
           * accessing `this.state` after calling this method may return the old value.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} completeState Next state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueReplaceState: function (
            publicInstance,
            completeState,
            callback,
            callerName,
          ) {
            warnNoop(publicInstance, "replaceState");
          },
          /**
           * Sets a subset of the state. This only exists because _pendingState is
           * internal. This provides a merging strategy that is not available to deep
           * properties which is confusing. TODO: Expose pendingState or don't use it
           * during the merge.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} partialState Next partial state to be merged with state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} Name of the calling function in the public API.
           * @internal
           */
          enqueueSetState: function (
            publicInstance,
            partialState,
            callback,
            callerName,
          ) {
            warnNoop(publicInstance, "setState");
          },
        };
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function (partialState, callback) {
          if (
            !(
              typeof partialState === "object" ||
              typeof partialState === "function" ||
              partialState == null
            )
          ) {
            {
              throw Error(
                "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
              );
            }
          }
          this.updater.enqueueSetState(
            this,
            partialState,
            callback,
            "setState",
          );
        };
        Component.prototype.forceUpdate = function (callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: [
              "isMounted",
              "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.",
            ],
            replaceState: [
              "replaceState",
              "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236).",
            ],
          };
          var defineDeprecationWarning = function (methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: function () {
                warn(
                  "%s(...) is deprecated in plain JavaScript React classes. %s",
                  info[0],
                  info[1],
                );
                return void 0;
              },
            });
          };
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {}
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        var pureComponentPrototype = (PureComponent.prototype =
          new ComponentDummy());
        pureComponentPrototype.constructor = PureComponent;
        _assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null,
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var functionName = innerType.displayName || innerType.name || "";
          return (
            outerType.displayName ||
            (functionName !== ""
              ? wrapperName + "(" + functionName + ")"
              : wrapperName)
          );
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentName(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error(
                "Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue.",
              );
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case exports.Fragment:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case exports.Profiler:
              return "Profiler";
            case exports.StrictMode:
              return "StrictMode";
            case exports.Suspense:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                return getComponentName(type.type);
              case REACT_BLOCK_TYPE:
                return getComponentName(type._render);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentName(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true,
        };
        var specialPropKeyWarningShown,
          specialPropRefWarningShown,
          didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config2) {
          {
            if (hasOwnProperty.call(config2, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config2, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config2.ref !== void 0;
        }
        function hasValidKey(config2) {
          {
            if (hasOwnProperty.call(config2, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config2, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config2.key !== void 0;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = function () {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error(
                  "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                  displayName,
                );
              }
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true,
          });
        }
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = function () {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error(
                  "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                  displayName,
                );
              }
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true,
          });
        }
        function warnIfStringRefCannotBeAutoConverted(config2) {
          {
            if (
              typeof config2.ref === "string" &&
              ReactCurrentOwner.current &&
              config2.__self &&
              ReactCurrentOwner.current.stateNode !== config2.__self
            ) {
              var componentName = getComponentName(
                ReactCurrentOwner.current.type,
              );
              if (!didWarnAboutStringRefs[componentName]) {
                error(
                  'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                  componentName,
                  config2.ref,
                );
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        var ReactElement = function (
          type,
          key,
          ref,
          self,
          source,
          owner,
          props,
        ) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner,
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false,
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self,
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source,
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function createElement(type, config2, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self = null;
          var source = null;
          if (config2 != null) {
            if (hasValidRef(config2)) {
              ref = config2.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config2);
              }
            }
            if (hasValidKey(config2)) {
              key = "" + config2.key;
            }
            self = config2.__self === void 0 ? null : config2.__self;
            source = config2.__source === void 0 ? null : config2.__source;
            for (propName in config2) {
              if (
                hasOwnProperty.call(config2, propName) &&
                !RESERVED_PROPS.hasOwnProperty(propName)
              ) {
                props[propName] = config2[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName =
                typeof type === "function"
                  ? type.displayName || type.name || "Unknown"
                  : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(
            type,
            key,
            ref,
            self,
            source,
            ReactCurrentOwner.current,
            props,
          );
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(
            oldElement.type,
            newKey,
            oldElement.ref,
            oldElement._self,
            oldElement._source,
            oldElement._owner,
            oldElement.props,
          );
          return newElement;
        }
        function cloneElement(element, config2, children) {
          if (!!(element === null || element === void 0)) {
            {
              throw Error(
                "React.cloneElement(...): The argument must be a React element, but you passed " +
                  element +
                  ".",
              );
            }
          }
          var propName;
          var props = _assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config2 != null) {
            if (hasValidRef(config2)) {
              ref = config2.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config2)) {
              key = "" + config2.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config2) {
              if (
                hasOwnProperty.call(config2, propName) &&
                !RESERVED_PROPS.hasOwnProperty(propName)
              ) {
                if (config2[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config2[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
          }
          return ReactElement(
            element.type,
            key,
            ref,
            self,
            source,
            owner,
            props,
          );
        }
        function isValidElement(object) {
          return (
            typeof object === "object" &&
            object !== null &&
            object.$$typeof === REACT_ELEMENT_TYPE
          );
        }
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape(key) {
          var escapeRegex = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2",
          };
          var escapedString = key.replace(escapeRegex, function (match) {
            return escaperLookup[match];
          });
          return "$" + escapedString;
        }
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        function getElementKey(element, index) {
          if (
            typeof element === "object" &&
            element !== null &&
            element.key != null
          ) {
            return escape("" + element.key);
          }
          return index.toString(36);
        }
        function mapIntoArray(
          children,
          array,
          escapedPrefix,
          nameSoFar,
          callback,
        ) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey =
              nameSoFar === ""
                ? SEPARATOR + getElementKey(_child, 0)
                : nameSoFar;
            if (Array.isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(
                mappedChild,
                array,
                escapedChildKey,
                "",
                function (c) {
                  return c;
                },
              );
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  // Keep both the (mapped) and old keys if they differ, just as
                  // traverseAllChildren used to do for objects as children
                  escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                    (mappedChild.key &&
                    (!_child || _child.key !== mappedChild.key)
                      ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                        escapeUserProvidedKey("" + mappedChild.key) + "/"
                      : "") +
                    childKey,
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix =
            nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              child = children[i];
              nextName = nextNamePrefix + getElementKey(child, i);
              subtreeCount += mapIntoArray(
                child,
                array,
                escapedPrefix,
                nextName,
                callback,
              );
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn(
                      "Using Maps as children is not supported. Use an array of keyed ReactElements instead.",
                    );
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(
                  child,
                  array,
                  escapedPrefix,
                  nextName,
                  callback,
                );
              }
            } else if (type === "object") {
              var childrenString = "" + children;
              {
                {
                  throw Error(
                    "Objects are not valid as a React child (found: " +
                      (childrenString === "[object Object]"
                        ? "object with keys {" +
                          Object.keys(children).join(", ") +
                          "}"
                        : childrenString) +
                      "). If you meant to render a collection of children, use an array instead.",
                  );
                }
              }
            }
          }
          return subtreeCount;
        }
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function (child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function () {
            n++;
          });
          return n;
        }
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function () {
              forEachFunc.apply(this, arguments);
            },
            forEachContext,
          );
        }
        function toArray(children) {
          return (
            mapChildren(children, function (child) {
              return child;
            }) || []
          );
        }
        function onlyChild(children) {
          if (!isValidElement(children)) {
            {
              throw Error(
                "React.Children.only expected to receive a single React element child.",
              );
            }
          }
          return children;
        }
        function createContext(defaultValue, calculateChangedBits) {
          if (calculateChangedBits === void 0) {
            calculateChangedBits = null;
          } else {
            {
              if (
                calculateChangedBits !== null &&
                typeof calculateChangedBits !== "function"
              ) {
                error(
                  "createContext: Expected the optional second argument to be a function. Instead received: %s",
                  calculateChangedBits,
                );
              }
            }
          }
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            _calculateChangedBits: calculateChangedBits,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null,
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context,
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context,
              _calculateChangedBits: context._calculateChangedBits,
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: function () {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error(
                      "Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?",
                    );
                  }
                  return context.Provider;
                },
                set: function (_Provider) {
                  context.Provider = _Provider;
                },
              },
              _currentValue: {
                get: function () {
                  return context._currentValue;
                },
                set: function (_currentValue) {
                  context._currentValue = _currentValue;
                },
              },
              _currentValue2: {
                get: function () {
                  return context._currentValue2;
                },
                set: function (_currentValue2) {
                  context._currentValue2 = _currentValue2;
                },
              },
              _threadCount: {
                get: function () {
                  return context._threadCount;
                },
                set: function (_threadCount) {
                  context._threadCount = _threadCount;
                },
              },
              Consumer: {
                get: function () {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error(
                      "Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?",
                    );
                  }
                  return context.Consumer;
                },
              },
              displayName: {
                get: function () {
                  return context.displayName;
                },
                set: function (displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn(
                      "Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.",
                      displayName,
                    );
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                },
              },
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            var pending = payload;
            pending._status = Pending;
            pending._result = thenable;
            thenable.then(
              function (moduleObject) {
                if (payload._status === Pending) {
                  var defaultExport = moduleObject.default;
                  {
                    if (defaultExport === void 0) {
                      error(
                        "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
                        moduleObject,
                      );
                    }
                  }
                  var resolved = payload;
                  resolved._status = Resolved;
                  resolved._result = defaultExport;
                }
              },
              function (error2) {
                if (payload._status === Pending) {
                  var rejected = payload;
                  rejected._status = Rejected;
                  rejected._result = error2;
                }
              },
            );
          }
          if (payload._status === Resolved) {
            return payload._result;
          } else {
            throw payload._result;
          }
        }
        function lazy(ctor) {
          var payload = {
            // We use these fields to store the result.
            _status: -1,
            _result: ctor,
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer,
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: function () {
                  return defaultProps;
                },
                set: function (newDefaultProps) {
                  error(
                    "React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.",
                  );
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true,
                  });
                },
              },
              propTypes: {
                configurable: true,
                get: function () {
                  return propTypes;
                },
                set: function (newPropTypes) {
                  error(
                    "React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.",
                  );
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true,
                  });
                },
              },
            });
          }
          return lazyType;
        }
        function forwardRef(render2) {
          {
            if (render2 != null && render2.$$typeof === REACT_MEMO_TYPE) {
              error(
                "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).",
              );
            } else if (typeof render2 !== "function") {
              error(
                "forwardRef requires a render function but was given %s.",
                render2 === null ? "null" : typeof render2,
              );
            } else {
              if (render2.length !== 0 && render2.length !== 2) {
                error(
                  "forwardRef render functions accept exactly two parameters: props and ref. %s",
                  render2.length === 1
                    ? "Did you forget to use the ref parameter?"
                    : "Any additional parameter will be undefined.",
                );
              }
            }
            if (render2 != null) {
              if (render2.defaultProps != null || render2.propTypes != null) {
                error(
                  "forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?",
                );
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render: render2,
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function () {
                return ownName;
              },
              set: function (name) {
                ownName = name;
                if (render2.displayName == null) {
                  render2.displayName = name;
                }
              },
            });
          }
          return elementType;
        }
        var enableScopeAPI = false;
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (
            type === exports.Fragment ||
            type === exports.Profiler ||
            type === REACT_DEBUG_TRACING_MODE_TYPE ||
            type === exports.StrictMode ||
            type === exports.Suspense ||
            type === REACT_SUSPENSE_LIST_TYPE ||
            type === REACT_LEGACY_HIDDEN_TYPE ||
            enableScopeAPI
          ) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (
              type.$$typeof === REACT_LAZY_TYPE ||
              type.$$typeof === REACT_MEMO_TYPE ||
              type.$$typeof === REACT_PROVIDER_TYPE ||
              type.$$typeof === REACT_CONTEXT_TYPE ||
              type.$$typeof === REACT_FORWARD_REF_TYPE ||
              type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
              type.$$typeof === REACT_BLOCK_TYPE ||
              type[0] === REACT_SERVER_BLOCK_TYPE
            ) {
              return true;
            }
          }
          return false;
        }
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error(
                "memo: The first argument must be a component. Instead received: %s",
                type === null ? "null" : typeof type,
              );
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare,
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function () {
                return ownName;
              },
              set: function (name) {
                ownName = name;
                if (type.displayName == null) {
                  type.displayName = name;
                }
              },
            });
          }
          return elementType;
        }
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          if (!(dispatcher !== null)) {
            {
              throw Error(
                "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.",
              );
            }
          }
          return dispatcher;
        }
        function useContext(Context, unstable_observedBits) {
          var dispatcher = resolveDispatcher();
          {
            if (unstable_observedBits !== void 0) {
              error(
                "useContext() second argument is reserved for future use in React. Passing it is not supported. You passed: %s.%s",
                unstable_observedBits,
                typeof unstable_observedBits === "number" &&
                  Array.isArray(arguments[2])
                  ? "\n\nDid you call array.map(useContext)? Calling Hooks inside a loop is not supported. Learn more at https://reactjs.org/link/rules-of-hooks"
                  : "",
              );
            }
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error(
                  "Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?",
                );
              } else if (realContext.Provider === Context) {
                error(
                  "Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?",
                );
              }
            }
          }
          return dispatcher.useContext(Context, unstable_observedBits);
        }
        function useState(initialState) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState);
        }
        function useReducer(reducer, initialArg, init) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init);
        }
        function useRef(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        function useEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create, deps);
        }
        function useLayoutEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create, deps);
        }
        function useCallback(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        function useMemo(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create, deps);
        }
        function useImperativeHandle(ref, create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create, deps);
        }
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {}
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true,
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props,
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true,
              };
              Object.defineProperties(console, {
                log: _assign({}, props, {
                  value: prevLog,
                }),
                info: _assign({}, props, {
                  value: prevInfo,
                }),
                warn: _assign({}, props, {
                  value: prevWarn,
                }),
                error: _assign({}, props, {
                  value: prevError,
                }),
                group: _assign({}, props, {
                  value: prevGroup,
                }),
                groupCollapsed: _assign({}, props, {
                  value: prevGroupCollapsed,
                }),
                groupEnd: _assign({}, props, {
                  value: prevGroupEnd,
                }),
              });
            }
            if (disabledDepth < 0) {
              error(
                "disabledDepth fell below zero. This is a bug in React. Please file an issue.",
              );
            }
          }
        }
        var ReactCurrentDispatcher$1 =
          ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = (match && match[1]) || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function () {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function () {
                  throw Error();
                },
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame =
                          "\n" + sampleLines[s].replace(" at new ", " at ");
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case exports.Suspense:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(
                  type.type,
                  source,
                  ownerFn,
                );
              case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(type._render);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(
                    init(payload),
                    source,
                    ownerFn,
                  );
                } catch (x) {}
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 =
          ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(
                element.type,
                element._source,
                owner ? owner.type : null,
              );
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(
          typeSpecs,
          values,
          location,
          componentName,
          element,
        ) {
          {
            var has = Function.call.bind(Object.prototype.hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error(
                      (componentName || "React class") +
                        ": " +
                        location +
                        " type `" +
                        typeSpecName +
                        "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                        typeof typeSpecs[typeSpecName] +
                        "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.",
                    );
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](
                    values,
                    typeSpecName,
                    componentName,
                    location,
                    null,
                    "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
                  );
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error(
                    "%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",
                    componentName || "React class",
                    location,
                    typeSpecName,
                    typeof error$1,
                  );
                  setCurrentlyValidatingElement(null);
                }
                if (
                  error$1 instanceof Error &&
                  !(error$1.message in loggedTypeFailures)
                ) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(
                element.type,
                element._source,
                owner ? owner.type : null,
              );
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentName(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return (
              "\n\nCheck your code at " + fileName + ":" + lineNumber + "."
            );
          }
          return "";
        }
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName =
              typeof parentType === "string"
                ? parentType
                : parentType.displayName || parentType.name;
            if (parentName) {
              info =
                "\n\nCheck the top-level render call using <" +
                parentName +
                ">.";
            }
          }
          return info;
        }
        function validateExplicitKey(element, parentType) {
          if (
            !element._store ||
            element._store.validated ||
            element.key != null
          ) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo =
            getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (
            element &&
            element._owner &&
            element._owner !== ReactCurrentOwner.current
          ) {
            childOwner =
              " It was passed a child from " +
              getComponentName(element._owner.type) +
              ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error(
              'Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',
              currentComponentErrorInfo,
              childOwner,
            );
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (Array.isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (
              typeof type === "object" &&
              (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
                // Inner props are checked in the reconciler.
                type.$$typeof === REACT_MEMO_TYPE)
            ) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentName(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (
              type.PropTypes !== void 0 &&
              !propTypesMisspellWarningShown
            ) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentName(type);
              error(
                "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                _name || "Unknown",
              );
            }
            if (
              typeof type.getDefaultProps === "function" &&
              !type.getDefaultProps.isReactClassApproved
            ) {
              error(
                "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.",
              );
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error(
                  "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                  key,
                );
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (
              type === void 0 ||
              (typeof type === "object" &&
                type !== null &&
                Object.keys(type).length === 0)
            ) {
              info +=
                " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (Array.isArray(type)) {
              typeString = "array";
            } else if (
              type !== void 0 &&
              type.$$typeof === REACT_ELEMENT_TYPE
            ) {
              typeString =
                "<" + (getComponentName(type.type) || "Unknown") + " />";
              info =
                " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error(
                "React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
                typeString,
                info,
              );
            }
          }
          var element = createElement.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }
          if (type === exports.Fragment) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn(
                "React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.",
              );
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: function () {
                warn(
                  "Factory.type is deprecated. Access the class directly before passing it to createFactory.",
                );
                Object.defineProperty(this, "type", {
                  value: type,
                });
                return type;
              },
            });
          }
          return validatedFactory;
        }
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        {
          try {
            var frozenObject = Object.freeze({});
            /* @__PURE__ */ new Map([[frozenObject, null]]);
            /* @__PURE__ */ new Set([frozenObject]);
          } catch (e) {}
        }
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild,
        };
        exports.Children = Children;
        exports.Component = Component;
        exports.PureComponent = PureComponent;
        exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
          ReactSharedInternals;
        exports.cloneElement = cloneElement$1;
        exports.createContext = createContext;
        exports.createElement = createElement$1;
        exports.createFactory = createFactory;
        exports.createRef = createRef;
        exports.forwardRef = forwardRef;
        exports.isValidElement = isValidElement;
        exports.lazy = lazy;
        exports.memo = memo;
        exports.useCallback = useCallback;
        exports.useContext = useContext;
        exports.useDebugValue = useDebugValue;
        exports.useEffect = useEffect;
        exports.useImperativeHandle = useImperativeHandle;
        exports.useLayoutEffect = useLayoutEffect;
        exports.useMemo = useMemo;
        exports.useReducer = useReducer;
        exports.useRef = useRef;
        exports.useState = useState;
        exports.version = ReactVersion;
      })();
    }
  },
});

// ../../node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var require_react = __commonJS({
  "../../node_modules/.pnpm/react@17.0.2/node_modules/react/index.js"(
    exports,
    module,
  ) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production_min();
    } else {
      module.exports = require_react_development();
    }
  },
});

// ../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react-jsx-runtime.production.min.js
var require_react_jsx_runtime_production_min = __commonJS({
  "../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react-jsx-runtime.production.min.js"(
    exports,
  ) {
    "use strict";
    require_object_assign();
    var f = require_react();
    var g = 60103;
    exports.Fragment = 60107;
    if ("function" === typeof Symbol && Symbol.for) {
      h = Symbol.for;
      g = h("react.element");
      exports.Fragment = h("react.fragment");
    }
    var h;
    var m =
      f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
    var n = Object.prototype.hasOwnProperty;
    var p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, k) {
      var b,
        d = {},
        e = null,
        l = null;
      void 0 !== k && (e = "" + k);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (l = a.ref);
      for (b in a) n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps)
        for (b in ((a = c.defaultProps), a)) void 0 === d[b] && (d[b] = a[b]);
      return {
        $$typeof: g,
        type: c,
        key: e,
        ref: l,
        props: d,
        _owner: m.current,
      };
    }
    exports.jsx = q;
    exports.jsxs = q;
  },
});

// ../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "../../node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react-jsx-runtime.development.js"(
    exports,
  ) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function () {
        "use strict";
        var React = require_react();
        var _assign = require_object_assign();
        var REACT_ELEMENT_TYPE = 60103;
        var REACT_PORTAL_TYPE = 60106;
        exports.Fragment = 60107;
        var REACT_STRICT_MODE_TYPE = 60108;
        var REACT_PROFILER_TYPE = 60114;
        var REACT_PROVIDER_TYPE = 60109;
        var REACT_CONTEXT_TYPE = 60110;
        var REACT_FORWARD_REF_TYPE = 60112;
        var REACT_SUSPENSE_TYPE = 60113;
        var REACT_SUSPENSE_LIST_TYPE = 60120;
        var REACT_MEMO_TYPE = 60115;
        var REACT_LAZY_TYPE = 60116;
        var REACT_BLOCK_TYPE = 60121;
        var REACT_SERVER_BLOCK_TYPE = 60122;
        var REACT_FUNDAMENTAL_TYPE = 60117;
        var REACT_SCOPE_TYPE = 60119;
        var REACT_OPAQUE_ID_TYPE = 60128;
        var REACT_DEBUG_TRACING_MODE_TYPE = 60129;
        var REACT_OFFSCREEN_TYPE = 60130;
        var REACT_LEGACY_HIDDEN_TYPE = 60131;
        if (typeof Symbol === "function" && Symbol.for) {
          var symbolFor = Symbol.for;
          REACT_ELEMENT_TYPE = symbolFor("react.element");
          REACT_PORTAL_TYPE = symbolFor("react.portal");
          exports.Fragment = symbolFor("react.fragment");
          REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
          REACT_PROFILER_TYPE = symbolFor("react.profiler");
          REACT_PROVIDER_TYPE = symbolFor("react.provider");
          REACT_CONTEXT_TYPE = symbolFor("react.context");
          REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
          REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
          REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
          REACT_MEMO_TYPE = symbolFor("react.memo");
          REACT_LAZY_TYPE = symbolFor("react.lazy");
          REACT_BLOCK_TYPE = symbolFor("react.block");
          REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
          REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
          REACT_SCOPE_TYPE = symbolFor("react.scope");
          REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
          REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
          REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
          REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
        }
        var MAYBE_ITERATOR_SYMBOL =
          typeof Symbol === "function" && Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator =
            (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
            maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactSharedInternals =
          React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            for (
              var _len2 = arguments.length,
                args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                _key2 = 1;
              _key2 < _len2;
              _key2++
            ) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 =
              ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function (item) {
              return "" + item;
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(
              console[level],
              console,
              argsWithFormat,
            );
          }
        }
        var enableScopeAPI = false;
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (
            type === exports.Fragment ||
            type === REACT_PROFILER_TYPE ||
            type === REACT_DEBUG_TRACING_MODE_TYPE ||
            type === REACT_STRICT_MODE_TYPE ||
            type === REACT_SUSPENSE_TYPE ||
            type === REACT_SUSPENSE_LIST_TYPE ||
            type === REACT_LEGACY_HIDDEN_TYPE ||
            enableScopeAPI
          ) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (
              type.$$typeof === REACT_LAZY_TYPE ||
              type.$$typeof === REACT_MEMO_TYPE ||
              type.$$typeof === REACT_PROVIDER_TYPE ||
              type.$$typeof === REACT_CONTEXT_TYPE ||
              type.$$typeof === REACT_FORWARD_REF_TYPE ||
              type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
              type.$$typeof === REACT_BLOCK_TYPE ||
              type[0] === REACT_SERVER_BLOCK_TYPE
            ) {
              return true;
            }
          }
          return false;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var functionName = innerType.displayName || innerType.name || "";
          return (
            outerType.displayName ||
            (functionName !== ""
              ? wrapperName + "(" + functionName + ")"
              : wrapperName)
          );
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentName(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error(
                "Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue.",
              );
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case exports.Fragment:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                return getComponentName(type.type);
              case REACT_BLOCK_TYPE:
                return getComponentName(type._render);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentName(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {}
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true,
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props,
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true,
              };
              Object.defineProperties(console, {
                log: _assign({}, props, {
                  value: prevLog,
                }),
                info: _assign({}, props, {
                  value: prevInfo,
                }),
                warn: _assign({}, props, {
                  value: prevWarn,
                }),
                error: _assign({}, props, {
                  value: prevError,
                }),
                group: _assign({}, props, {
                  value: prevGroup,
                }),
                groupCollapsed: _assign({}, props, {
                  value: prevGroupCollapsed,
                }),
                groupEnd: _assign({}, props, {
                  value: prevGroupEnd,
                }),
              });
            }
            if (disabledDepth < 0) {
              error(
                "disabledDepth fell below zero. This is a bug in React. Please file an issue.",
              );
            }
          }
        }
        var ReactCurrentDispatcher =
          ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = (match && match[1]) || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function () {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function () {
                  throw Error();
                },
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame =
                          "\n" + sampleLines[s].replace(" at new ", " at ");
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(
                  type.type,
                  source,
                  ownerFn,
                );
              case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(type._render);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(
                    init(payload),
                    source,
                    ownerFn,
                  );
                } catch (x) {}
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame =
          ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(
                element.type,
                element._source,
                owner ? owner.type : null,
              );
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(
          typeSpecs,
          values,
          location,
          componentName,
          element,
        ) {
          {
            var has = Function.call.bind(Object.prototype.hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error(
                      (componentName || "React class") +
                        ": " +
                        location +
                        " type `" +
                        typeSpecName +
                        "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                        typeof typeSpecs[typeSpecName] +
                        "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.",
                    );
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](
                    values,
                    typeSpecName,
                    componentName,
                    location,
                    null,
                    "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
                  );
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error(
                    "%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",
                    componentName || "React class",
                    location,
                    typeSpecName,
                    typeof error$1,
                  );
                  setCurrentlyValidatingElement(null);
                }
                if (
                  error$1 instanceof Error &&
                  !(error$1.message in loggedTypeFailures)
                ) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true,
        };
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        var didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config2) {
          {
            if (hasOwnProperty.call(config2, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config2, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config2.ref !== void 0;
        }
        function hasValidKey(config2) {
          {
            if (hasOwnProperty.call(config2, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config2, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config2.key !== void 0;
        }
        function warnIfStringRefCannotBeAutoConverted(config2, self) {
          {
            if (
              typeof config2.ref === "string" &&
              ReactCurrentOwner.current &&
              self &&
              ReactCurrentOwner.current.stateNode !== self
            ) {
              var componentName = getComponentName(
                ReactCurrentOwner.current.type,
              );
              if (!didWarnAboutStringRefs[componentName]) {
                error(
                  'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                  getComponentName(ReactCurrentOwner.current.type),
                  config2.ref,
                );
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = function () {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error(
                  "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                  displayName,
                );
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true,
            });
          }
        }
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = function () {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error(
                  "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                  displayName,
                );
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true,
            });
          }
        }
        var ReactElement = function (
          type,
          key,
          ref,
          self,
          source,
          owner,
          props,
        ) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner,
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false,
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self,
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source,
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function jsxDEV(type, config2, maybeKey, source, self) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              key = "" + maybeKey;
            }
            if (hasValidKey(config2)) {
              key = "" + config2.key;
            }
            if (hasValidRef(config2)) {
              ref = config2.ref;
              warnIfStringRefCannotBeAutoConverted(config2, self);
            }
            for (propName in config2) {
              if (
                hasOwnProperty.call(config2, propName) &&
                !RESERVED_PROPS.hasOwnProperty(propName)
              ) {
                props[propName] = config2[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName =
                typeof type === "function"
                  ? type.displayName || type.name || "Unknown"
                  : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(
              type,
              key,
              ref,
              self,
              source,
              ReactCurrentOwner.current,
              props,
            );
          }
        }
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame$1 =
          ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(
                element.type,
                element._source,
                owner ? owner.type : null,
              );
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return (
              typeof object === "object" &&
              object !== null &&
              object.$$typeof === REACT_ELEMENT_TYPE
            );
          }
        }
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner$1.current) {
              var name = getComponentName(ReactCurrentOwner$1.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
        }
        function getSourceInfoErrorAddendum(source) {
          {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return (
                "\n\nCheck your code at " + fileName + ":" + lineNumber + "."
              );
            }
            return "";
          }
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName =
                typeof parentType === "string"
                  ? parentType
                  : parentType.displayName || parentType.name;
              if (parentName) {
                info =
                  "\n\nCheck the top-level render call using <" +
                  parentName +
                  ">.";
              }
            }
            return info;
          }
        }
        function validateExplicitKey(element, parentType) {
          {
            if (
              !element._store ||
              element._store.validated ||
              element.key != null
            ) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo =
              getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (
              element &&
              element._owner &&
              element._owner !== ReactCurrentOwner$1.current
            ) {
              childOwner =
                " It was passed a child from " +
                getComponentName(element._owner.type) +
                ".";
            }
            setCurrentlyValidatingElement$1(element);
            error(
              'Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',
              currentComponentErrorInfo,
              childOwner,
            );
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object") {
              return;
            }
            if (Array.isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (
              typeof type === "object" &&
              (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
                // Inner props are checked in the reconciler.
                type.$$typeof === REACT_MEMO_TYPE)
            ) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentName(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (
              type.PropTypes !== void 0 &&
              !propTypesMisspellWarningShown
            ) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentName(type);
              error(
                "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                _name || "Unknown",
              );
            }
            if (
              typeof type.getDefaultProps === "function" &&
              !type.getDefaultProps.isReactClassApproved
            ) {
              error(
                "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.",
              );
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error(
                  "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                  key,
                );
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function jsxWithValidation(
          type,
          props,
          key,
          isStaticChildren,
          source,
          self,
        ) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (
                type === void 0 ||
                (typeof type === "object" &&
                  type !== null &&
                  Object.keys(type).length === 0)
              ) {
                info +=
                  " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum(source);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (Array.isArray(type)) {
                typeString = "array";
              } else if (
                type !== void 0 &&
                type.$$typeof === REACT_ELEMENT_TYPE
              ) {
                typeString =
                  "<" + (getComponentName(type.type) || "Unknown") + " />";
                info =
                  " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error(
                "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
                typeString,
                info,
              );
            }
            var element = jsxDEV(type, props, key, source, self);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (Array.isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error(
                      "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.",
                    );
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            if (type === exports.Fragment) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        function jsxWithValidationStatic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, true);
          }
        }
        function jsxWithValidationDynamic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, false);
          }
        }
        var jsx2 = jsxWithValidationDynamic;
        var jsxs2 = jsxWithValidationStatic;
        exports.jsx = jsx2;
        exports.jsxs = jsxs2;
      })();
    }
  },
});

// ../../node_modules/.pnpm/react@17.0.2/node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "../../node_modules/.pnpm/react@17.0.2/node_modules/react/jsx-runtime.js"(
    exports,
    module,
  ) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_jsx_runtime_production_min();
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  },
});

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

// src/templates/github-stats.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function makeGithubStats(stats, options) {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    style: {
      display: "flex",
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      background,
    },
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          style: {
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            flexGrow: 1,
            paddingRight: 40,
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: "Total Stars Earned: ",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: `${totalStars}`,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: "Total Commits: ",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: `${totalCommits}`,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: "Total PRs: ",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: `${totalPRs}`,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: "Total Issues: ",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: `${totalIssues}`,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: "Contributed to (last year): ",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: `${contributedTo}`,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                children: "-------------------------------",
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: "Score: ",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  children: `${rank2.score}`,
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
          src: imgUrl,
          style: {
            height: "100%",
          },
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          style: {
            lineHeight: 2,
            position: "absolute",
            top: "-6px",
            left: "33px",
            background,
            padding: "0 4px",
          },
          children: `${name}'s GitHub Stats`,
        }),
      ],
    }),
  });
}

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
  let svg = await satori(makeGithubStats(_stats, templateOptions), {
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
    svg = await satori(makeGithubStats(_stats, templateOptions), {
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
