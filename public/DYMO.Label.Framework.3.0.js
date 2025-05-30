/*Copyright (c), 2011 Sanford, L.P. All Rights Reserved.*/
(function () {
  var n,
    aa = aa || {},
    p = this;
  p.Aa = !0;

  function q() {}

  function ba(a) {
    var b = typeof a;
    if ('object' == b)
      if (a) {
        if (a instanceof Array) return 'array';
        if (a instanceof Object) return b;
        var d = Object.prototype.toString.call(a);
        if ('[object Window]' == d) return 'object';
        if (
          '[object Array]' == d ||
          ('number' == typeof a.length &&
            'undefined' != typeof a.splice &&
            'undefined' != typeof a.propertyIsEnumerable &&
            !a.propertyIsEnumerable('splice'))
        )
          return 'array';
        if (
          '[object Function]' == d ||
          ('undefined' != typeof a.call &&
            'undefined' != typeof a.propertyIsEnumerable &&
            !a.propertyIsEnumerable('call'))
        )
          return 'function';
      } else return 'null';
    else if ('function' == b && 'undefined' == typeof a.call) return 'object';
    return b;
  }

  function ca(a) {
    return 'array' == ba(a);
  }

  function da(a) {
    var b = ba(a);
    return 'array' == b || ('object' == b && 'number' == typeof a.length);
  }

  function t(a) {
    return 'string' == typeof a;
  }

  function ea(a) {
    return 'number' == typeof a;
  }

  function u(a) {
    return 'function' == ba(a);
  }
  var fa = 'closure_uid_' + ((1e9 * Math.random()) >>> 0),
    ga = 0;

  function ha(a, b, d) {
    return a.call.apply(a.bind, arguments);
  }

  function ia(a, b, d) {
    if (!a) throw Error();
    if (2 < arguments.length) {
      var e = Array.prototype.slice.call(arguments, 2);
      return function () {
        var d = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(d, e);
        return a.apply(b, d);
      };
    }
    return function () {
      return a.apply(b, arguments);
    };
  }

  function v(a, b, d) {
    v =
      Function.prototype.bind &&
      -1 != Function.prototype.bind.toString().indexOf('native code')
        ? ha
        : ia;
    return v.apply(null, arguments);
  }

  function ja(a, b) {
    var d = Array.prototype.slice.call(arguments, 1);
    return function () {
      var b = d.slice();
      b.push.apply(b, arguments);
      return a.apply(this, b);
    };
  }
  var ka =
    Date.now ||
    function () {
      return +new Date();
    };

  function w(a, b) {
    var d = a.split('.'),
      e = p;
    d[0] in e || !e.execScript || e.execScript('var ' + d[0]);
    for (var g; d.length && (g = d.shift()); )
      d.length || void 0 === b
        ? e[g]
          ? (e = e[g])
          : (e = e[g] = {})
        : (e[g] = b);
  }

  function x(a, b) {
    function d() {}
    d.prototype = b.prototype;
    a.ca = b.prototype;
    a.prototype = new d();
    a.prototype.constructor = a;
    a.Ba = function (a, d, h) {
      for (
        var k = Array(arguments.length - 2), l = 2;
        l < arguments.length;
        l++
      )
        k[l - 2] = arguments[l];
      return b.prototype[d].apply(a, k);
    };
  }

  function z(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, z);
    else {
      var b = Error().stack;
      b && (this.stack = b);
    }
    a && (this.message = String(a));
  }
  x(z, Error);
  z.prototype.name = 'CustomError';

  function la(a, b) {
    for (
      var d = a.split('%s'),
        e = '',
        g = Array.prototype.slice.call(arguments, 1);
      g.length && 1 < d.length;

    )
      e += d.shift() + g.shift();
    return e + d.join('%s');
  }
  var ma = String.prototype.trim
    ? function (a) {
        return a.trim();
      }
    : function (a) {
        return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
      };

  function A(a, b) {
    return -1 != a.indexOf(b);
  }

  function na(a) {
    return Array.prototype.join.call(arguments, '');
  }

  function oa(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function pa(a, b) {
    b.unshift(a);
    z.call(this, la.apply(null, b));
    b.shift();
  }
  x(pa, z);
  pa.prototype.name = 'AssertionError';

  function qa(a, b) {
    throw new pa(
      'Failure' + (a ? ': ' + a : ''),
      Array.prototype.slice.call(arguments, 1),
    );
  }
  var B = Array.prototype,
    ra = B.indexOf
      ? function (a, b, d) {
          return B.indexOf.call(a, b, d);
        }
      : function (a, b, d) {
          d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
          if (t(a)) return t(b) && 1 == b.length ? a.indexOf(b, d) : -1;
          for (; d < a.length; d++) if (d in a && a[d] === b) return d;
          return -1;
        },
    sa = B.forEach
      ? function (a, b, d) {
          B.forEach.call(a, b, d);
        }
      : function (a, b, d) {
          for (var e = a.length, g = t(a) ? a.split('') : a, h = 0; h < e; h++)
            h in g && b.call(d, g[h], h, a);
        },
    ta = B.reduce
      ? function (a, b, d, e) {
          e && (b = v(b, e));
          return B.reduce.call(a, b, d);
        }
      : function (a, b, d, e) {
          var g = d;
          sa(a, function (d, k) {
            g = b.call(e, g, d, k, a);
          });
          return g;
        },
    ua = B.some
      ? function (a, b, d) {
          return B.some.call(a, b, d);
        }
      : function (a, b, d) {
          for (var e = a.length, g = t(a) ? a.split('') : a, h = 0; h < e; h++)
            if (h in g && b.call(d, g[h], h, a)) return !0;
          return !1;
        };

  function va(a) {
    var b;
    a: {
      b = wa;
      for (var d = a.length, e = t(a) ? a.split('') : a, g = 0; g < d; g++)
        if (g in e && b.call(void 0, e[g], g, a)) {
          b = g;
          break a;
        }
      b = -1;
    }
    return 0 > b ? null : t(a) ? a.charAt(b) : a[b];
  }

  function xa(a, b) {
    var d = ra(a, b),
      e;
    (e = 0 <= d) && B.splice.call(a, d, 1);
    return e;
  }

  function ya(a) {
    return B.concat.apply(B, arguments);
  }
  var C;
  a: {
    var za = p.navigator;
    if (za) {
      var Ba = za.userAgent;
      if (Ba) {
        C = Ba;
        break a;
      }
    }
    C = '';
  }

  function Ca(a, b) {
    for (var d in a) b.call(void 0, a[d], d, a);
  }

  function Da(a) {
    var b = [],
      d = 0,
      e;
    for (e in a) b[d++] = a[e];
    return b;
  }

  function Ea(a) {
    var b = [],
      d = 0,
      e;
    for (e in a) b[d++] = e;
    return b;
  }
  var Fa =
    'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
      ' ',
    );

  function Ga(a, b) {
    for (var d, e, g = 1; g < arguments.length; g++) {
      e = arguments[g];
      for (d in e) a[d] = e[d];
      for (var h = 0; h < Fa.length; h++)
        (d = Fa[h]),
          Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }

  function Ha(a) {
    var b = arguments.length;
    if (1 == b && ca(arguments[0])) return Ha.apply(null, arguments[0]);
    for (var d = {}, e = 0; e < b; e++) d[arguments[e]] = !0;
    return d;
  }

  function Ia() {
    return A(C, 'Edge') || A(C, 'Trident') || A(C, 'MSIE');
  }

  function D() {
    return A(C, 'Edge');
  }
  var Ja = A(C, 'Opera') || A(C, 'OPR'),
    E = Ia(),
    Ka =
      A(C, 'Gecko') &&
      !(A(C.toLowerCase(), 'webkit') && !D()) &&
      !(A(C, 'Trident') || A(C, 'MSIE')) &&
      !D(),
    La = A(C.toLowerCase(), 'webkit') && !D();

  function Ma() {
    var a = C;
    if (Ka) return /rv\:([^\);]+)(\)|;)/.exec(a);
    if (E && D()) return /Edge\/([\d\.]+)/.exec(a);
    if (E) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    if (La) return /WebKit\/(\S+)/.exec(a);
  }

  function Na() {
    var a = p.document;
    return a ? a.documentMode : void 0;
  }
  var Oa = (function () {
      if (Ja && p.opera) {
        var a = p.opera.version;
        return u(a) ? a() : a;
      }
      var a = '',
        b = Ma();
      b && (a = b ? b[1] : '');
      return E && !D() && ((b = Na()), b > parseFloat(a)) ? String(b) : a;
    })(),
    Pa = {};

  function F(a) {
    var b;
    if (!(b = Pa[a])) {
      b = 0;
      for (
        var d = ma(String(Oa)).split('.'),
          e = ma(String(a)).split('.'),
          g = Math.max(d.length, e.length),
          h = 0;
        0 == b && h < g;
        h++
      ) {
        var k = d[h] || '',
          l = e[h] || '',
          m = RegExp('(\\d*)(\\D*)', 'g'),
          r = RegExp('(\\d*)(\\D*)', 'g');
        do {
          var J = m.exec(k) || ['', '', ''],
            y = r.exec(l) || ['', '', ''];
          if (0 == J[0].length && 0 == y[0].length) break;
          b =
            oa(
              0 == J[1].length ? 0 : parseInt(J[1], 10),
              0 == y[1].length ? 0 : parseInt(y[1], 10),
            ) ||
            oa(0 == J[2].length, 0 == y[2].length) ||
            oa(J[2], y[2]);
        } while (0 == b);
      }
      b = Pa[a] = 0 <= b;
    }
    return b;
  }
  var Qa = p.document,
    Ra = Na(),
    Sa =
      !Qa || !E || (!Ra && D())
        ? void 0
        : Ra || ('CSS1Compat' == Qa.compatMode ? parseInt(Oa, 10) : 5);
  (!Ka && !E) || (E && E && (D() || 9 <= Sa)) || (Ka && F('1.9.1'));
  E && F('9');
  Ha(
    'area base br col command embed hr img input keygen link meta param source track wbr'.split(
      ' ',
    ),
  );

  function Ta() {
    this.c = '';
    this.f = null;
  }
  Ta.prototype.toString = function () {
    return 'SafeHtml{' + this.c + '}';
  };

  function Ua(a) {
    var b = new Ta();
    b.c = a;
    b.f = 0;
  }
  Ua('<!DOCTYPE html>');
  Ua('');

  function Va(a, b) {
    Ca(b, function (b, e) {
      'style' == e
        ? (a.style.cssText = b)
        : 'class' == e
          ? (a.className = b)
          : 'for' == e
            ? (a.htmlFor = b)
            : e in Wa
              ? a.setAttribute(Wa[e], b)
              : 0 == e.lastIndexOf('aria-', 0) || 0 == e.lastIndexOf('data-', 0)
                ? a.setAttribute(e, b)
                : (a[e] = b);
    });
  }
  var Wa = {
    cellpadding: 'cellPadding',
    cellspacing: 'cellSpacing',
    colspan: 'colSpan',
    frameborder: 'frameBorder',
    height: 'height',
    maxlength: 'maxLength',
    role: 'role',
    rowspan: 'rowSpan',
    type: 'type',
    usemap: 'useMap',
    valign: 'vAlign',
    width: 'width',
  };

  function Xa(a, b) {
    var d = [];
    Ya(a, b, d, !1);
    return d;
  }

  function Ya(a, b, d, e) {
    if (null != a)
      for (a = a.firstChild; a; ) {
        if ((b(a) && (d.push(a), e)) || Ya(a, b, d, e)) return !0;
        a = a.nextSibling;
      }
    return !1;
  }
  var Za = { SCRIPT: 1, STYLE: 1, HEAD: 1, IFRAME: 1, OBJECT: 1 },
    $a = { IMG: ' ', BR: '\n' };

  function ab(a, b, d) {
    if (!(a.nodeName in Za))
      if (3 == a.nodeType)
        d
          ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, ''))
          : b.push(a.nodeValue);
      else if (a.nodeName in $a) b.push($a[a.nodeName]);
      else for (a = a.firstChild; a; ) ab(a, b, d), (a = a.nextSibling);
  }

  function bb(a) {
    a.prototype.then = a.prototype.then;
    a.prototype.$goog_Thenable = !0;
  }

  function cb(a) {
    if (!a) return !1;
    try {
      return !!a.$goog_Thenable;
    } catch (b) {
      return !1;
    }
  }

  function db(a, b) {
    this.h = a;
    this.i = b;
    this.f = 0;
    this.c = null;
  }

  function eb(a) {
    var b;
    0 < a.f ? (a.f--, (b = a.c), (a.c = b.next), (b.next = null)) : (b = a.h());
    return b;
  }

  function fb(a, b) {
    a.i(b);
    100 > a.f && (a.f++, (b.next = a.c), (a.c = b));
  }
  var hb = new db(
    function () {
      return new gb();
    },
    function (a) {
      a.reset();
    },
  );

  function ib() {
    var a = jb,
      b = null;
    a.c && ((b = a.c), (a.c = a.c.next), a.c || (a.f = null), (b.next = null));
    return b;
  }

  function gb() {
    this.next = this.f = this.c = null;
  }
  gb.prototype.reset = function () {
    this.next = this.f = this.c = null;
  };

  function kb(a) {
    p.setTimeout(function () {
      throw a;
    }, 0);
  }
  var lb;

  function mb() {
    var a = p.MessageChannel;
    'undefined' === typeof a &&
      'undefined' !== typeof window &&
      window.postMessage &&
      window.addEventListener &&
      !A(C, 'Presto') &&
      (a = function () {
        var a = document.createElement('IFRAME');
        a.style.display = 'none';
        a.src = '';
        document.documentElement.appendChild(a);
        var b = a.contentWindow,
          a = b.document;
        a.open();
        a.write('');
        a.close();
        var d = 'callImmediate' + Math.random(),
          e =
            'file:' == b.location.protocol
              ? '*'
              : b.location.protocol + '//' + b.location.host,
          a = v(function (a) {
            if (('*' == e || a.origin == e) && a.data == d)
              this.port1.onmessage();
          }, this);
        b.addEventListener('message', a, !1);
        this.port1 = {};
        this.port2 = {
          postMessage: function () {
            b.postMessage(d, e);
          },
        };
      });
    if ('undefined' !== typeof a && !Ia()) {
      var b = new a(),
        d = {},
        e = d;
      b.port1.onmessage = function () {
        if (void 0 !== d.next) {
          d = d.next;
          var a = d.fa;
          d.fa = null;
          a();
        }
      };
      return function (a) {
        e.next = { fa: a };
        e = e.next;
        b.port2.postMessage(0);
      };
    }
    return 'undefined' !== typeof document &&
      'onreadystatechange' in document.createElement('SCRIPT')
      ? function (a) {
          var b = document.createElement('SCRIPT');
          b.onreadystatechange = function () {
            b.onreadystatechange = null;
            b.parentNode.removeChild(b);
            b = null;
            a();
            a = null;
          };
          document.documentElement.appendChild(b);
        }
      : function (a) {
          p.setTimeout(a, 0);
        };
  }

  function nb(a, b) {
    ob || pb();
    qb || (ob(), (qb = !0));
    var d = jb,
      e = eb(hb);
    e.c = a;
    e.f = b;
    e.next = null;
    d.f ? (d.f.next = e) : (d.c = e);
    d.f = e;
  }
  var ob;

  function pb() {
    if (p.Promise && p.Promise.resolve) {
      var a = p.Promise.resolve();
      ob = function () {
        a.then(rb);
      };
    } else
      ob = function () {
        var a = rb;
        !u(p.setImmediate) ||
        (p.Window &&
          p.Window.prototype &&
          p.Window.prototype.setImmediate == p.setImmediate)
          ? (lb || (lb = mb()), lb(a))
          : p.setImmediate(a);
      };
  }
  var qb = !1,
    jb = new (function () {
      this.f = this.c = null;
    })();

  function rb() {
    for (var a = null; (a = ib()); ) {
      try {
        a.c.call(a.f);
      } catch (b) {
        kb(b);
      }
      fb(hb, a);
    }
    qb = !1;
  }

  function G(a, b) {
    this.c = sb;
    this.o = void 0;
    this.i = this.f = this.h = null;
    this.l = this.m = !1;
    if (a == tb) ub(this, vb, b);
    else
      try {
        var d = this;
        a.call(
          b,
          function (a) {
            ub(d, vb, a);
          },
          function (a) {
            if (!(a instanceof wb))
              try {
                if (a instanceof Error) throw a;
                throw Error('Promise rejected.');
              } catch (b) {}
            ub(d, H, a);
          },
        );
      } catch (e) {
        ub(this, H, e);
      }
  }
  var sb = 0,
    vb = 2,
    H = 3;

  function xb() {
    this.next = this.h = this.f = this.i = this.c = null;
    this.l = !1;
  }
  xb.prototype.reset = function () {
    this.h = this.f = this.i = this.c = null;
    this.l = !1;
  };
  var yb = new db(
    function () {
      return new xb();
    },
    function (a) {
      a.reset();
    },
  );

  function zb(a, b, d) {
    var e = eb(yb);
    e.i = a;
    e.f = b;
    e.h = d;
    return e;
  }

  function tb() {}

  function Ab(a) {
    return new G(function (b, d) {
      var e = a.length,
        g = [];
      if (e)
        for (
          var h = function (a, d) {
              e--;
              g[a] = d;
              0 == e && b(g);
            },
            k = function (a) {
              d(a);
            },
            l = 0,
            m;
          (m = a[l]);
          l++
        )
          Bb(m, ja(h, l), k);
      else b(g);
    });
  }
  G.prototype.then = function (a, b, d) {
    return Cb(this, u(a) ? a : null, u(b) ? b : null, d);
  };
  bb(G);

  function Bb(a, b, d, e) {
    a instanceof G ? Db(a, zb(b || q, d || null, e)) : a.then(b, d, e);
  }
  n = G.prototype;
  n.ka = function (a, b) {
    return Cb(this, null, a, b);
  };
  n.cancel = function (a) {
    this.c == sb &&
      nb(function () {
        var b = new wb(a);
        Eb(this, b);
      }, this);
  };

  function Eb(a, b) {
    if (a.c == sb)
      if (a.h) {
        var d = a.h;
        if (d.f) {
          for (
            var e = 0, g = null, h = null, k = d.f;
            k && (k.l || (e++, k.c == a && (g = k), !(g && 1 < e)));
            k = k.next
          )
            g || (h = k);
          g &&
            (d.c == sb && 1 == e
              ? Eb(d, b)
              : (h
                  ? ((e = h),
                    e.next == d.i && (d.i = e),
                    (e.next = e.next.next))
                  : Fb(d),
                Gb(d, g, H, b)));
        }
        a.h = null;
      } else ub(a, H, b);
  }

  function Db(a, b) {
    a.f || (a.c != vb && a.c != H) || Hb(a);
    a.i ? (a.i.next = b) : (a.f = b);
    a.i = b;
  }

  function Cb(a, b, d, e) {
    var g = zb(null, null, null);
    g.c = new G(function (a, k) {
      g.i = b
        ? function (d) {
            try {
              var g = b.call(e, d);
              a(g);
            } catch (r) {
              k(r);
            }
          }
        : a;
      g.f = d
        ? function (b) {
            try {
              var g = d.call(e, b);
              void 0 === g && b instanceof wb ? k(b) : a(g);
            } catch (r) {
              k(r);
            }
          }
        : k;
    });
    g.c.h = a;
    Db(a, g);
    return g.c;
  }
  n.la = function (a) {
    this.c = sb;
    ub(this, vb, a);
  };
  n.ma = function (a) {
    this.c = sb;
    ub(this, H, a);
  };

  function ub(a, b, d) {
    if (a.c == sb) {
      if (a == d)
        (b = H), (d = new TypeError('Promise cannot resolve to itself'));
      else {
        if (cb(d)) {
          a.c = 1;
          Bb(d, a.la, a.ma, a);
          return;
        }
        var e = typeof d;
        if (('object' == e && null != d) || 'function' == e)
          try {
            var g = d.then;
            if (u(g)) {
              Ib(a, d, g);
              return;
            }
          } catch (h) {
            (b = H), (d = h);
          }
      }
      a.o = d;
      a.c = b;
      a.h = null;
      Hb(a);
      b != H || d instanceof wb || Jb(a, d);
    }
  }

  function Ib(a, b, d) {
    function e(b) {
      h || ((h = !0), a.ma(b));
    }

    function g(b) {
      h || ((h = !0), a.la(b));
    }
    a.c = 1;
    var h = !1;
    try {
      d.call(b, g, e);
    } catch (k) {
      e(k);
    }
  }

  function Hb(a) {
    a.m || ((a.m = !0), nb(a.ya, a));
  }

  function Fb(a) {
    var b = null;
    a.f && ((b = a.f), (a.f = b.next), (b.next = null));
    a.f || (a.i = null);
    return b;
  }
  n.ya = function () {
    for (var a = null; (a = Fb(this)); ) Gb(this, a, this.c, this.o);
    this.m = !1;
  };

  function Gb(a, b, d, e) {
    if (d == H && b.f && !b.l) for (; a && a.l; a = a.h) a.l = !1;
    if (b.c) (b.c.h = null), Kb(b, d, e);
    else
      try {
        b.l ? b.i.call(b.h) : Kb(b, d, e);
      } catch (g) {
        Lb.call(null, g);
      }
    fb(yb, b);
  }

  function Kb(a, b, d) {
    b == vb ? a.i.call(a.h, d) : a.f && a.f.call(a.h, d);
  }

  function Jb(a, b) {
    a.l = !0;
    nb(function () {
      a.l && Lb.call(null, b);
    });
  }
  var Lb = kb;

  function wb(a) {
    z.call(this, a);
  }
  x(wb, z);
  wb.prototype.name = 'cancel';

  function Mb() {
    0 != Nb && (Ob[this[fa] || (this[fa] = ++ga)] = this);
    this.l = this.l;
    this.A = this.A;
  }
  var Nb = 0,
    Ob = {};
  Mb.prototype.l = !1;

  function Pb(a) {
    a.l ||
      ((a.l = !0),
      a.K(),
      0 != Nb && ((a = a[fa] || (a[fa] = ++ga)), delete Ob[a]));
  }
  Mb.prototype.K = function () {
    if (this.A) for (; this.A.length; ) this.A.shift()();
  };
  var Qb = !E || (E && (D() || 9 <= Sa)),
    Rb = E && !F('9');
  !La || F('528');
  (Ka && F('1.9b')) || (E && F('8')) || (Ja && F('9.5')) || (La && F('528'));
  (Ka && !F('8')) || (E && F('9'));

  function Sb(a, b) {
    this.type = a;
    this.c = this.target = b;
    this.ia = !0;
  }
  Sb.prototype.f = function () {
    this.ia = !1;
  };

  function Tb(a) {
    Tb[' '](a);
    return a;
  }
  Tb[' '] = q;

  function Ub(a, b) {
    Sb.call(this, a ? a.type : '');
    this.h = this.state = this.c = this.target = null;
    if (a) {
      this.type = a.type;
      this.target = a.target || a.srcElement;
      this.c = b;
      var d = a.relatedTarget;
      if (d && Ka)
        try {
          Tb(d.nodeName);
        } catch (e) {}
      this.state = a.state;
      this.h = a;
      a.defaultPrevented && this.f();
    }
  }
  x(Ub, Sb);
  Ub.prototype.f = function () {
    Ub.ca.f.call(this);
    var a = this.h;
    if (a.preventDefault) a.preventDefault();
    else if (((a.returnValue = !1), Rb))
      try {
        if (a.ctrlKey || (112 <= a.keyCode && 123 >= a.keyCode)) a.keyCode = -1;
      } catch (b) {}
  };
  var Vb = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
    Wb = 0;

  function Xb(a, b, d, e, g) {
    this.listener = a;
    this.c = null;
    this.src = b;
    this.type = d;
    this.aa = !!e;
    this.ba = g;
    ++Wb;
    this.N = this.$ = !1;
  }

  function Yb(a) {
    a.N = !0;
    a.listener = null;
    a.c = null;
    a.src = null;
    a.ba = null;
  }

  function Zb(a) {
    this.src = a;
    this.c = {};
    this.f = 0;
  }

  function $b(a, b, d, e, g, h) {
    var k = b.toString();
    b = a.c[k];
    b || ((b = a.c[k] = []), a.f++);
    var l = ac(b, d, g, h);
    -1 < l
      ? ((a = b[l]), e || (a.$ = !1))
      : ((a = new Xb(d, a.src, k, !!g, h)), (a.$ = e), b.push(a));
    return a;
  }

  function bc(a, b) {
    var d = b.type;
    d in a.c &&
      xa(a.c[d], b) &&
      (Yb(b), 0 == a.c[d].length && (delete a.c[d], a.f--));
  }

  function ac(a, b, d, e) {
    for (var g = 0; g < a.length; ++g) {
      var h = a[g];
      if (!h.N && h.listener == b && h.aa == !!d && h.ba == e) return g;
    }
    return -1;
  }
  var cc = 'closure_lm_' + ((1e6 * Math.random()) | 0),
    dc = {},
    ec = 0;

  function fc(a, b, d, e, g) {
    if (ca(b)) for (var h = 0; h < b.length; h++) fc(a, b[h], d, e, g);
    else if (((d = gc(d)), a && a[Vb])) $b(a.D, String(b), d, !1, e, g);
    else {
      if (!b) throw Error('Invalid event type');
      var h = !!e,
        k = hc(a);
      k || (a[cc] = k = new Zb(a));
      d = $b(k, b, d, !1, e, g);
      if (!d.c) {
        e = ic();
        d.c = e;
        e.src = a;
        e.listener = d;
        if (a.addEventListener) a.addEventListener(b.toString(), e, h);
        else if (a.attachEvent) a.attachEvent(jc(b.toString()), e);
        else throw Error('addEventListener and attachEvent are unavailable.');
        ec++;
      }
    }
  }

  function ic() {
    var a = kc,
      b = Qb
        ? function (d) {
            return a.call(b.src, b.listener, d);
          }
        : function (d) {
            d = a.call(b.src, b.listener, d);
            if (!d) return d;
          };
    return b;
  }

  function lc(a, b, d, e, g) {
    if (ca(b)) for (var h = 0; h < b.length; h++) lc(a, b[h], d, e, g);
    else
      ((d = gc(d)), a && a[Vb])
        ? ((a = a.D),
          (b = String(b).toString()),
          b in a.c &&
            ((h = a.c[b]),
            (d = ac(h, d, e, g)),
            -1 < d &&
              (Yb(h[d]),
              B.splice.call(h, d, 1),
              0 == h.length && (delete a.c[b], a.f--))))
        : a &&
          (a = hc(a)) &&
          ((b = a.c[b.toString()]),
          (a = -1),
          b && (a = ac(b, d, !!e, g)),
          (d = -1 < a ? b[a] : null) && mc(d));
  }

  function mc(a) {
    if (!ea(a) && a && !a.N) {
      var b = a.src;
      if (b && b[Vb]) bc(b.D, a);
      else {
        var d = a.type,
          e = a.c;
        b.removeEventListener
          ? b.removeEventListener(d, e, a.aa)
          : b.detachEvent && b.detachEvent(jc(d), e);
        ec--;
        (d = hc(b))
          ? (bc(d, a), 0 == d.f && ((d.src = null), (b[cc] = null)))
          : Yb(a);
      }
    }
  }

  function jc(a) {
    return a in dc ? dc[a] : (dc[a] = 'on' + a);
  }

  function nc(a, b, d, e) {
    var g = !0;
    if ((a = hc(a)))
      if ((b = a.c[b.toString()]))
        for (b = b.concat(), a = 0; a < b.length; a++) {
          var h = b[a];
          h && h.aa == d && !h.N && ((h = oc(h, e)), (g = g && !1 !== h));
        }
    return g;
  }

  function oc(a, b) {
    var d = a.listener,
      e = a.ba || a.src;
    a.$ && mc(a);
    return d.call(e, b);
  }

  function kc(a, b) {
    if (a.N) return !0;
    if (!Qb) {
      var d;
      if (!(d = b))
        a: {
          d = ['window', 'event'];
          for (var e = p, g; (g = d.shift()); )
            if (null != e[g]) e = e[g];
            else {
              d = null;
              break a;
            }
          d = e;
        }
      g = d;
      d = new Ub(g, this);
      e = !0;
      if (!(0 > g.keyCode || void 0 != g.returnValue)) {
        a: {
          var h = !1;
          if (0 == g.keyCode)
            try {
              g.keyCode = -1;
              break a;
            } catch (k) {
              h = !0;
            }
          if (h || void 0 == g.returnValue) g.returnValue = !0;
        }
        g = [];
        for (h = d.c; h; h = h.parentNode) g.push(h);
        for (var h = a.type, l = g.length - 1; 0 <= l; l--) {
          d.c = g[l];
          var m = nc(g[l], h, !0, d),
            e = e && m;
        }
        for (l = 0; l < g.length; l++)
          (d.c = g[l]), (m = nc(g[l], h, !1, d)), (e = e && m);
      }
      return e;
    }
    return oc(a, new Ub(b, this));
  }

  function hc(a) {
    a = a[cc];
    return a instanceof Zb ? a : null;
  }
  var pc = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0);

  function gc(a) {
    if (u(a)) return a;
    a[pc] ||
      (a[pc] = function (b) {
        return a.handleEvent(b);
      });
    return a[pc];
  }

  function I() {
    Mb.call(this);
    this.D = new Zb(this);
    this.da = this;
    this.R = null;
  }
  x(I, Mb);
  I.prototype[Vb] = !0;
  I.prototype.addEventListener = function (a, b, d, e) {
    fc(this, a, b, d, e);
  };
  I.prototype.removeEventListener = function (a, b, d, e) {
    lc(this, a, b, d, e);
  };

  function K(a, b) {
    var d,
      e = a.R;
    if (e) for (d = []; e; e = e.R) d.push(e);
    var e = a.da,
      g = b,
      h = g.type || g;
    if (t(g)) g = new Sb(g, e);
    else if (g instanceof Sb) g.target = g.target || e;
    else {
      var k = g,
        g = new Sb(h, e);
      Ga(g, k);
    }
    var k = !0,
      l;
    if (d)
      for (var m = d.length - 1; 0 <= m; m--)
        (l = g.c = d[m]), (k = qc(l, h, !0, g) && k);
    l = g.c = e;
    k = qc(l, h, !0, g) && k;
    k = qc(l, h, !1, g) && k;
    if (d)
      for (m = 0; m < d.length; m++)
        (l = g.c = d[m]), (k = qc(l, h, !1, g) && k);
  }
  I.prototype.K = function () {
    I.ca.K.call(this);
    if (this.D) {
      var a = this.D,
        b = 0,
        d;
      for (d in a.c) {
        for (var e = a.c[d], g = 0; g < e.length; g++) ++b, Yb(e[g]);
        delete a.c[d];
        a.f--;
      }
    }
    this.R = null;
  };

  function qc(a, b, d, e) {
    b = a.D.c[String(b)];
    if (!b) return !0;
    b = b.concat();
    for (var g = !0, h = 0; h < b.length; ++h) {
      var k = b[h];
      if (k && !k.N && k.aa == d) {
        var l = k.listener,
          m = k.ba || k.src;
        k.$ && bc(a.D, k);
        g = !1 !== l.call(m, e) && g;
      }
    }
    return g && 0 != e.ia;
  }

  function rc(a, b, d) {
    if (u(a)) d && (a = v(a, d));
    else if (a && 'function' == typeof a.handleEvent) a = v(a.handleEvent, a);
    else throw Error('Invalid listener argument');
    return 2147483647 < b ? -1 : p.setTimeout(a, b || 0);
  }

  function sc(a) {
    var b = [];
    tc(new uc(), a, b);
    return b.join('');
  }

  function uc() {}

  function tc(a, b, d) {
    if (null == b) d.push('null');
    else {
      if ('object' == typeof b) {
        if (ca(b)) {
          var e = b;
          b = e.length;
          d.push('[');
          for (var g = '', h = 0; h < b; h++)
            d.push(g), tc(a, e[h], d), (g = ',');
          d.push(']');
          return;
        }
        if (b instanceof String || b instanceof Number || b instanceof Boolean)
          b = b.valueOf();
        else {
          d.push('{');
          g = '';
          for (e in b)
            Object.prototype.hasOwnProperty.call(b, e) &&
              ((h = b[e]),
              'function' != typeof h &&
                (d.push(g), vc(e, d), d.push(':'), tc(a, h, d), (g = ',')));
          d.push('}');
          return;
        }
      }
      switch (typeof b) {
        case 'string':
          vc(b, d);
          break;
        case 'number':
          d.push(isFinite(b) && !isNaN(b) ? b : 'null');
          break;
        case 'boolean':
          d.push(b);
          break;
        case 'function':
          break;
        default:
          throw Error('Unknown type: ' + typeof b);
      }
    }
  }
  var wc = {
      '"': '\\"',
      '\\': '\\\\',
      '/': '\\/',
      '\b': '\\b',
      '\f': '\\f',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\x0B': '\\u000b',
    },
    xc = /\uffff/.test('\uffff')
      ? /[\\\"\x00-\x1f\x7f-\uffff]/g
      : /[\\\"\x00-\x1f\x7f-\xff]/g;

  function vc(a, b) {
    b.push(
      '"',
      a.replace(xc, function (a) {
        var b = wc[a];
        b ||
          ((b = '\\u' + (a.charCodeAt(0) | 65536).toString(16).substr(1)),
          (wc[a] = b));
        return b;
      }),
      '"',
    );
  }

  function yc(a) {
    if ('function' == typeof a.J) return a.J();
    if (t(a)) return a.split('');
    if (da(a)) {
      for (var b = [], d = a.length, e = 0; e < d; e++) b.push(a[e]);
      return b;
    }
    return Da(a);
  }

  function zc(a, b) {
    if ('function' == typeof a.forEach) a.forEach(b, void 0);
    else if (da(a) || t(a)) sa(a, b, void 0);
    else {
      var d;
      if ('function' == typeof a.I) d = a.I();
      else if ('function' != typeof a.J)
        if (da(a) || t(a)) {
          d = [];
          for (var e = a.length, g = 0; g < e; g++) d.push(g);
        } else d = Ea(a);
      else d = void 0;
      for (var e = yc(a), g = e.length, h = 0; h < g; h++)
        b.call(void 0, e[h], d && d[h], a);
    }
  }

  function Ac(a, b) {
    this.f = {};
    this.c = [];
    this.i = this.h = 0;
    var d = arguments.length;
    if (1 < d) {
      if (d % 2) throw Error('Uneven number of arguments');
      for (var e = 0; e < d; e += 2) Bc(this, arguments[e], arguments[e + 1]);
    } else if (a) {
      a instanceof Ac ? ((d = a.I()), (e = a.J())) : ((d = Ea(a)), (e = Da(a)));
      for (var g = 0; g < d.length; g++) Bc(this, d[g], e[g]);
    }
  }
  n = Ac.prototype;
  n.J = function () {
    Cc(this);
    for (var a = [], b = 0; b < this.c.length; b++) a.push(this.f[this.c[b]]);
    return a;
  };
  n.I = function () {
    Cc(this);
    return this.c.concat();
  };
  n.clear = function () {
    this.f = {};
    this.i = this.h = this.c.length = 0;
  };

  function Cc(a) {
    if (a.h != a.c.length) {
      for (var b = 0, d = 0; b < a.c.length; ) {
        var e = a.c[b];
        Dc(a.f, e) && (a.c[d++] = e);
        b++;
      }
      a.c.length = d;
    }
    if (a.h != a.c.length) {
      for (var g = {}, d = (b = 0); b < a.c.length; )
        (e = a.c[b]), Dc(g, e) || ((a.c[d++] = e), (g[e] = 1)), b++;
      a.c.length = d;
    }
  }

  function Ec(a, b) {
    return Dc(a.f, b) ? a.f[b] : void 0;
  }

  function Bc(a, b, d) {
    Dc(a.f, b) || (a.h++, a.c.push(b), a.i++);
    a.f[b] = d;
  }
  n.forEach = function (a, b) {
    for (var d = this.I(), e = 0; e < d.length; e++) {
      var g = d[e];
      a.call(b, Ec(this, g), g, this);
    }
  };
  n.clone = function () {
    return new Ac(this);
  };

  function Dc(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }

  function Fc(a, b, d, e, g) {
    this.reset(a, b, d, e, g);
  }
  Fc.prototype.c = null;
  var Gc = 0;
  Fc.prototype.reset = function (a, b, d, e, g) {
    'number' == typeof g || Gc++;
    e || ka();
    this.f = b;
    delete this.c;
  };

  function Hc(a) {
    this.i = a;
    this.h = this.c = this.f = null;
  }

  function Ic(a, b) {
    this.name = a;
    this.value = b;
  }
  Ic.prototype.toString = function () {
    return this.name;
  };
  var Jc = new Ic('SEVERE', 1e3),
    Kc = new Ic('WARNING', 900),
    Lc = new Ic('INFO', 800),
    Mc = new Ic('CONFIG', 700),
    Nc = new Ic('FINE', 500);

  function Oc(a) {
    if (a.c) return a.c;
    if (a.f) return Oc(a.f);
    qa('Root logger has no level set.');
    return null;
  }
  Hc.prototype.log = function (a, b, d) {
    if (a.value >= Oc(this).value)
      for (
        u(b) && (b = b()),
          a = new Fc(a, String(b), this.i),
          d && (a.c = d),
          d = 'log:' + a.f,
          p.console &&
            (p.console.timeStamp
              ? p.console.timeStamp(d)
              : p.console.markTimeline && p.console.markTimeline(d)),
          p.msWriteProfilerMark && p.msWriteProfilerMark(d),
          d = this;
        d;

      )
        d = d.f;
  };
  var Pc = {},
    Qc = null;

  function Rc(a) {
    Qc || ((Qc = new Hc('')), (Pc[''] = Qc), (Qc.c = Mc));
    var b;
    if (!(b = Pc[a])) {
      b = new Hc(a);
      var d = a.lastIndexOf('.'),
        e = a.substr(d + 1),
        d = Rc(a.substr(0, d));
      d.h || (d.h = {});
      d.h[e] = b;
      b.f = d;
      Pc[a] = b;
    }
    return b;
  }

  function L(a, b) {
    a && a.log(Nc, b, void 0);
  }

  function Sc() {}
  Sc.prototype.c = null;

  function Tc(a) {
    var b;
    (b = a.c) || ((b = {}), Uc(a) && ((b[0] = !0), (b[1] = !0)), (b = a.c = b));
    return b;
  }
  var Vc;

  function Wc() {}
  x(Wc, Sc);

  function Xc(a) {
    return (a = Uc(a)) ? new ActiveXObject(a) : new XMLHttpRequest();
  }

  function Uc(a) {
    if (
      !a.f &&
      'undefined' == typeof XMLHttpRequest &&
      'undefined' != typeof ActiveXObject
    ) {
      for (
        var b = [
            'MSXML2.XMLHTTP.6.0',
            'MSXML2.XMLHTTP.3.0',
            'MSXML2.XMLHTTP',
            'Microsoft.XMLHTTP',
          ],
          d = 0;
        d < b.length;
        d++
      ) {
        var e = b[d];
        try {
          return new ActiveXObject(e), (a.f = e);
        } catch (g) {}
      }
      throw Error(
        'Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed',
      );
    }
    return a.f;
  }
  Vc = new Wc();
  var Yc =
    /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;

  function Zc(a) {
    if ($c) {
      $c = !1;
      var b = p.location;
      if (b) {
        var d = b.href;
        if (
          d &&
          (d = (d = Zc(d)[3] || null) ? decodeURI(d) : d) &&
          d != b.hostname
        )
          throw (($c = !0), Error());
      }
    }
    return a.match(Yc);
  }
  var $c = La;

  function ad(a, b) {
    for (var d = a.split('&'), e = 0; e < d.length; e++) {
      var g = d[e].indexOf('='),
        h = null,
        k = null;
      0 <= g
        ? ((h = d[e].substring(0, g)), (k = d[e].substring(g + 1)))
        : (h = d[e]);
      b(h, k ? decodeURIComponent(k.replace(/\+/g, ' ')) : '');
    }
  }

  function bd(a) {
    var b = 'getPrinters';
    if (0 <= a.indexOf('#') || 0 <= a.indexOf('?'))
      throw Error(
        'goog.uri.utils: Fragment or query identifiers are not supported: [' +
          a +
          ']',
      );
    var d = a.length - 1;
    0 <= d && a.indexOf('/', d) == d && (a = a.substr(0, a.length - 1));
    0 == b.lastIndexOf('/', 0) && (b = b.substr(1));
    return na(a, '/', b);
  }

  function cd(a) {
    I.call(this);
    this.qa = new Ac();
    this.M = a || null;
    this.f = !1;
    this.H = this.c = null;
    this.m = this.Z = this.o = '';
    this.h = this.P = this.s = this.O = !1;
    this.i = 0;
    this.G = null;
    this.F = dd;
    this.B = this.ra = !1;
  }
  x(cd, I);
  var dd = '',
    ed = cd.prototype,
    fd = Rc('goog.net.XhrIo');
  ed.v = fd;
  var gd = /^https?$/i,
    hd = ['POST', 'PUT'],
    id = [];

  function jd(a, b, d, e, g) {
    var h = new cd();
    id.push(h);
    b && $b(h.D, 'complete', b, !1, void 0, void 0);
    $b(h.D, 'ready', h.wa, !0, void 0, void 0);
    g && (h.i = Math.max(0, g));
    h.send(a, d, e, void 0);
  }
  n = cd.prototype;
  n.wa = function () {
    Pb(this);
    xa(id, this);
  };
  n.send = function (a, b, d, e) {
    if (this.c)
      throw Error(
        '[goog.net.XhrIo] Object is active with another request=' +
          this.o +
          '; newUri=' +
          a,
      );
    b = b ? b.toUpperCase() : 'GET';
    this.o = a;
    this.m = '';
    this.Z = b;
    this.O = !1;
    this.f = !0;
    this.c = this.M ? Xc(this.M) : Xc(Vc);
    this.H = this.M ? Tc(this.M) : Tc(Vc);
    this.c.onreadystatechange = v(this.ha, this);
    try {
      L(this.v, M(this, 'Opening Xhr')),
        (this.P = !0),
        this.c.open(b, String(a), !0),
        (this.P = !1);
    } catch (g) {
      L(this.v, M(this, 'Error opening Xhr: ' + g.message));
      kd(this, g);
      return;
    }
    a = d || '';
    var h = this.qa.clone();
    e &&
      zc(e, function (a, b) {
        Bc(h, b, a);
      });
    e = va(h.I());
    d = p.FormData && a instanceof p.FormData;
    !(0 <= ra(hd, b)) ||
      e ||
      d ||
      Bc(h, 'Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    h.forEach(function (a, b) {
      this.c.setRequestHeader(b, a);
    }, this);
    this.F && (this.c.responseType = this.F);
    'withCredentials' in this.c && (this.c.withCredentials = this.ra);
    try {
      ld(this),
        0 < this.i &&
          ((this.B = md(this.c)),
          L(
            this.v,
            M(
              this,
              'Will abort after ' + this.i + 'ms if incomplete, xhr2 ' + this.B,
            ),
          ),
          this.B
            ? ((this.c.timeout = this.i), (this.c.ontimeout = v(this.L, this)))
            : (this.G = rc(this.L, this.i, this))),
        L(this.v, M(this, 'Sending request')),
        (this.s = !0),
        this.c.send(a),
        (this.s = !1);
    } catch (k) {
      L(this.v, M(this, 'Send error: ' + k.message)), kd(this, k);
    }
  };

  function md(a) {
    return E && F(9) && ea(a.timeout) && void 0 !== a.ontimeout;
  }

  function wa(a) {
    return 'content-type' == a.toLowerCase();
  }
  n.L = function () {
    'undefined' != typeof aa &&
      this.c &&
      ((this.m = 'Timed out after ' + this.i + 'ms, aborting'),
      L(this.v, M(this, this.m)),
      K(this, 'timeout'),
      this.c &&
        this.f &&
        (L(this.v, M(this, 'Aborting')),
        (this.f = !1),
        (this.h = !0),
        this.c.abort(),
        (this.h = !1),
        K(this, 'complete'),
        K(this, 'abort'),
        nd(this)));
  };

  function kd(a, b) {
    a.f = !1;
    a.c && ((a.h = !0), a.c.abort(), (a.h = !1));
    a.m = b;
    od(a);
    nd(a);
  }

  function od(a) {
    a.O || ((a.O = !0), K(a, 'complete'), K(a, 'error'));
  }
  n.K = function () {
    this.c &&
      (this.f && ((this.f = !1), (this.h = !0), this.c.abort(), (this.h = !1)),
      nd(this, !0));
    cd.ca.K.call(this);
  };
  n.ha = function () {
    this.l || (this.P || this.s || this.h ? pd(this) : this.za());
  };
  n.za = function () {
    pd(this);
  };

  function pd(a) {
    if (a.f && 'undefined' != typeof aa)
      if (a.H[1] && 4 == qd(a) && 2 == a.w())
        L(a.v, M(a, 'Local request error detected and ignored'));
      else if (a.s && 4 == qd(a)) rc(a.ha, 0, a);
      else if ((K(a, 'readystatechange'), 4 == qd(a))) {
        L(a.v, M(a, 'Request complete'));
        a.f = !1;
        try {
          if (rd(a)) K(a, 'complete'), K(a, 'success');
          else {
            var b;
            try {
              b = 2 < qd(a) ? a.c.statusText : '';
            } catch (d) {
              L(a.v, 'Can not get status: ' + d.message), (b = '');
            }
            a.m = b + ' [' + a.w() + ']';
            od(a);
          }
        } finally {
          nd(a);
        }
      }
  }

  function nd(a, b) {
    if (a.c) {
      ld(a);
      var d = a.c,
        e = a.H[0] ? q : null;
      a.c = null;
      a.H = null;
      b || K(a, 'ready');
      try {
        d.onreadystatechange = e;
      } catch (g) {
        (d = a.v) &&
          d.log(
            Jc,
            'Problem encountered resetting onreadystatechange: ' + g.message,
            void 0,
          );
      }
    }
  }

  function ld(a) {
    a.c && a.B && (a.c.ontimeout = null);
    ea(a.G) && (p.clearTimeout(a.G), (a.G = null));
  }

  function rd(a) {
    var b = a.w(),
      d;
    a: switch (b) {
      case 200:
      case 201:
      case 202:
      case 204:
      case 206:
      case 304:
      case 1223:
        d = !0;
        break a;
      default:
        d = !1;
    }
    if (!d) {
      if ((b = 0 === b))
        (a = Zc(String(a.o))[1] || null),
          !a &&
            self.location &&
            ((a = self.location.protocol), (a = a.substr(0, a.length - 1))),
          (b = !gd.test(a ? a.toLowerCase() : ''));
      d = b;
    }
    return d;
  }

  function qd(a) {
    return a.c ? a.c.readyState : 0;
  }
  n.w = function () {
    try {
      return 2 < qd(this) ? this.c.status : -1;
    } catch (a) {
      return -1;
    }
  };

  function sd(a) {
    try {
      if (!a.c) return null;
      if ('response' in a.c) return a.c.response;
      switch (a.F) {
        case dd:
        case 'text':
          return a.c.responseText;
        case 'arraybuffer':
          if ('mozResponseArrayBuffer' in a.c)
            return a.c.mozResponseArrayBuffer;
      }
      var b = a.v;
      b &&
        b.log(
          Jc,
          'Response type ' + a.F + ' is not supported on this browser',
          void 0,
        );
      return null;
    } catch (d) {
      return L(a.v, 'Can not get response: ' + d.message), null;
    }
  }

  function M(a, b) {
    return b + ' [' + a.Z + ' ' + a.o + ' ' + a.w() + ']';
  }

  function N(a, b) {
    this.c = this.o = this.i = '';
    this.s = null;
    this.l = this.f = '';
    this.m = !1;
    var d;
    a instanceof N
      ? ((this.m = void 0 !== b ? b : a.m),
        td(this, a.i),
        (this.o = a.o),
        (this.c = a.c),
        ud(this, a.s),
        (this.f = a.f),
        vd(this, a.h.clone()),
        (this.l = a.l))
      : a && (d = Zc(String(a)))
        ? ((this.m = !!b),
          td(this, d[1] || '', !0),
          (this.o = wd(d[2] || '')),
          (this.c = wd(d[3] || '', !0)),
          ud(this, d[4]),
          (this.f = wd(d[5] || '', !0)),
          vd(this, d[6] || '', !0),
          (this.l = wd(d[7] || '')))
        : ((this.m = !!b), (this.h = new xd(null, 0, this.m)));
  }
  N.prototype.toString = function () {
    var a = [],
      b = this.i;
    b && a.push(yd(b, zd, !0), ':');
    if ((b = this.c)) {
      a.push('//');
      var d = this.o;
      d && a.push(yd(d, zd, !0), '@');
      a.push(
        encodeURIComponent(String(b)).replace(/%25([0-9a-fA-F]{2})/g, '%$1'),
      );
      b = this.s;
      null != b && a.push(':', String(b));
    }
    if ((b = this.f))
      this.c && '/' != b.charAt(0) && a.push('/'),
        a.push(yd(b, '/' == b.charAt(0) ? Ad : Bd, !0));
    (b = this.h.toString()) && a.push('?', b);
    (b = this.l) && a.push('#', yd(b, Cd));
    return a.join('');
  };
  N.prototype.clone = function () {
    return new N(this);
  };

  function td(a, b, d) {
    a.i = d ? wd(b, !0) : b;
    a.i && (a.i = a.i.replace(/:$/, ''));
  }

  function ud(a, b) {
    if (b) {
      b = Number(b);
      if (isNaN(b) || 0 > b) throw Error('Bad port number ' + b);
      a.s = b;
    } else a.s = null;
  }

  function vd(a, b, d) {
    b instanceof xd
      ? ((a.h = b), Dd(a.h, a.m))
      : (d || (b = yd(b, Ed)), (a.h = new xd(b, 0, a.m)));
  }

  function Fd(a) {
    return a instanceof N ? a.clone() : new N(a, void 0);
  }

  function Gd(a, b) {
    a instanceof N || (a = Fd(a));
    b instanceof N || (b = Fd(b));
    var d = a,
      e = b,
      g = d.clone(),
      h = !!e.i;
    h ? td(g, e.i) : (h = !!e.o);
    h ? (g.o = e.o) : (h = !!e.c);
    h ? (g.c = e.c) : (h = null != e.s);
    var k = e.f;
    if (h) ud(g, e.s);
    else if ((h = !!e.f))
      if (
        ('/' != k.charAt(0) &&
          (d.c && !d.f
            ? (k = '/' + k)
            : ((d = g.f.lastIndexOf('/')),
              -1 != d && (k = g.f.substr(0, d + 1) + k))),
        (d = k),
        '..' == d || '.' == d)
      )
        k = '';
      else if (A(d, './') || A(d, '/.')) {
        for (
          var k = 0 == d.lastIndexOf('/', 0), d = d.split('/'), l = [], m = 0;
          m < d.length;

        ) {
          var r = d[m++];
          '.' == r
            ? k && m == d.length && l.push('')
            : '..' == r
              ? ((1 < l.length || (1 == l.length && '' != l[0])) && l.pop(),
                k && m == d.length && l.push(''))
              : (l.push(r), (k = !0));
        }
        k = l.join('/');
      } else k = d;
    h ? (g.f = k) : (h = '' !== e.h.toString());
    h ? vd(g, wd(e.h.toString())) : (h = !!e.l);
    h && (g.l = e.l);
    return g;
  }

  function wd(a, b) {
    return a
      ? b
        ? decodeURI(a.replace(/%25/g, '%2525'))
        : decodeURIComponent(a)
      : '';
  }

  function yd(a, b, d) {
    return t(a)
      ? ((a = encodeURI(a).replace(b, Hd)),
        d && (a = a.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
        a)
      : null;
  }

  function Hd(a) {
    a = a.charCodeAt(0);
    return '%' + ((a >> 4) & 15).toString(16) + (a & 15).toString(16);
  }
  var zd = /[#\/\?@]/g,
    Bd = /[\#\?:]/g,
    Ad = /[\#\?]/g,
    Ed = /[\#\?@]/g,
    Cd = /#/g;

  function xd(a, b, d) {
    this.h = this.c = null;
    this.f = a || null;
    this.i = !!d;
  }

  function Id(a) {
    a.c ||
      ((a.c = new Ac()),
      (a.h = 0),
      a.f &&
        ad(a.f, function (b, d) {
          var e = decodeURIComponent(b.replace(/\+/g, ' '));
          Id(a);
          a.f = null;
          var e = Kd(a, e),
            g = Ec(a.c, e);
          g || Bc(a.c, e, (g = []));
          g.push(d);
          a.h++;
        }));
  }

  function Ld(a, b) {
    Id(a);
    b = Kd(a, b);
    if (Dc(a.c.f, b)) {
      a.f = null;
      a.h -= Ec(a.c, b).length;
      var d = a.c;
      Dc(d.f, b) &&
        (delete d.f[b], d.h--, d.i++, d.c.length > 2 * d.h && Cc(d));
    }
  }
  n = xd.prototype;
  n.clear = function () {
    this.c = this.f = null;
    this.h = 0;
  };
  n.I = function () {
    Id(this);
    for (var a = this.c.J(), b = this.c.I(), d = [], e = 0; e < b.length; e++)
      for (var g = a[e], h = 0; h < g.length; h++) d.push(b[e]);
    return d;
  };
  n.J = function (a) {
    Id(this);
    var b = [];
    if (t(a)) {
      var d = a;
      Id(this);
      d = Kd(this, d);
      Dc(this.c.f, d) && (b = ya(b, Ec(this.c, Kd(this, a))));
    } else for (a = this.c.J(), d = 0; d < a.length; d++) b = ya(b, a[d]);
    return b;
  };

  function Md(a, b, d) {
    Ld(a, b);
    if (0 < d.length) {
      a.f = null;
      var e = a.c;
      b = Kd(a, b);
      var g;
      g = d.length;
      if (0 < g) {
        for (var h = Array(g), k = 0; k < g; k++) h[k] = d[k];
        g = h;
      } else g = [];
      Bc(e, b, g);
      a.h += d.length;
    }
  }
  n.toString = function () {
    if (this.f) return this.f;
    if (!this.c) return '';
    for (var a = [], b = this.c.I(), d = 0; d < b.length; d++)
      for (
        var e = b[d], g = encodeURIComponent(String(e)), e = this.J(e), h = 0;
        h < e.length;
        h++
      ) {
        var k = g;
        '' !== e[h] && (k += '=' + encodeURIComponent(String(e[h])));
        a.push(k);
      }
    return (this.f = a.join('&'));
  };
  n.clone = function () {
    var a = new xd();
    a.f = this.f;
    this.c && ((a.c = this.c.clone()), (a.h = this.h));
    return a;
  };

  function Kd(a, b) {
    var d = String(b);
    a.i && (d = d.toLowerCase());
    return d;
  }

  function Dd(a, b) {
    b &&
      !a.i &&
      (Id(a),
      (a.f = null),
      a.c.forEach(function (a, b) {
        var g = b.toLowerCase();
        b != g && (Ld(this, b), Md(this, g, a));
      }, a));
    a.i = b;
  }
  G.prototype.thenCatch = G.prototype.ka;

  function Nd() {
    Od('testCookie', 'test', 1);
    return 'test' == Pd('testCookie');
  }

  function Od(a, b, d) {
    var e = new Date();
    e.setTime(e.getTime() + 864e5 * d);
    document.cookie = a + '=' + b + '; ' + ('expires=' + e.toUTCString());
  }

  function Pd(a) {
    a = a + '=';
    for (var b = document.cookie.split(';'), d = 0; d < b.length; d++) {
      for (var e = b[d]; ' ' == e.charAt(0); ) e = e.substring(1);
      if (0 == e.indexOf(a)) return e.substring(a.length, e.length);
    }
    return '';
  }

  function Qd() {
    return 'undefined' !== typeof window.localStorage && window.localStorage
      ? window.localStorage
      : null;
  }

  function Rd(a, b) {
    var d = Qd();
    if (d)
      if (a && b) (d.ServicePort = a), (d.ServiceHost = b);
      else
        try {
          delete d.ServicePort, delete d.ServiceHost;
        } catch (e) {}
    else
      Nd()
        ? a && b
          ? (Od('ServicePort', a, 100), Od('ServiceHost', b, 100))
          : (Od('ServicePort', '', 100), Od('ServiceHost', '', 100))
        : ((window.f = a), (window.c = b));
  }

  function Sd() {
    var a = Qd();
    return a
      ? { Port: a.ServicePort, Host: a.ServiceHost }
      : Nd()
        ? { Port: Pd('ServicePort'), Host: Pd('ServiceHost') }
        : { Port: window.f, Host: window.c };
  }

  function Td(a, b, d) {
    var e;
    if ('undefined' !== typeof XMLHttpRequest) e = new XMLHttpRequest();
    else {
      e =
        'MSXML2.XmlHttp.6.0 MSXML2.XmlHttp.5.0 MSXML2.XmlHttp.4.0 MSXML2.XmlHttp.3.0 MSXML2.XmlHttp.2.0 Microsoft.XmlHttp'.split(
          ' ',
        );
      for (var g, h = 0; h < e.length; h++)
        try {
          g = new ActiveXObject(e[h]);
          break;
        } catch (k) {}
      e = g;
    }
    g = [];
    var h = null,
      l;
    for (l in b) g.push(encodeURIComponent(l) + '=' + encodeURIComponent(b[l]));
    'POST' == d
      ? (h = g.length ? g.join('&') : '')
      : (a += g.length ? '?' + g.join('&') : '');
    e.open(d || 'GET', a, !1);
    'POST' == d &&
      e.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    e.send(h);
    if (200 != e.status)
      throw (
        ((a = e.responseText),
        (a = a.split(':', 1)[0]),
        Error('' + a + '\n\n' + e.responseText + ': ' + e.statusText))
      );
    return e.responseText;
  }

  function Ud(a, b) {
    function d() {
      Vd('localhost', a, b);
    }
    var e = Sd(),
      g = e.Port,
      e = e.Host;
    O('checkEnvironment > cachedWebPort : ' + e + '/' + g);
    O('checkEnvironment > trying async service discovery');
    g
      ? jd(
          'https://' + e + ':' + g + '/DYMO/DLS/Printing/StatusConnected',
          function (b) {
            rd(b.target) ? a() : (Rd(null, null), Vd('127.0.0.1', a, d));
          },
          'GET',
          void 0,
          3e3,
        )
      : Vd('127.0.0.1', a, d);
  }

  function Wd(a, b) {
    function d(b, d) {
      O('checkEnvironment > web service found at :' + d + '/' + b);
      Rd(b, d);
      a();
      Xd || P.c();
    }
    var e = Sd(),
      g = e.Port,
      e = e.Host;
    O('checkEnvironment > cachedWebPort : ' + e + '/' + g);
    O('checkEnvironment > trying synchronous service discovery');
    var g = g || 41951,
      e = e || '127.0.0.1',
      h = '127.0.0.1' === e;
    Yd(g, e)
      ? d(g, e)
      : h && Yd(g, 'localhost')
        ? d(g, 'localhost')
        : (Rd(null, null), b());
  }

  function Yd(a, b) {
    try {
      return (
        'true' ===
        Td(
          'https://' + b + ':' + a + '/DYMO/DLS/Printing/StatusConnected',
          {},
          'GET',
        )
      );
    } catch (d) {
      return !1;
    }
  }

  function Vd(a, b, d) {
    for (var e = [], g = 41951; 41960 >= g; ++g) e.push(Zd(g, a));
    Ab(e)
      .then(function () {
        setTimeout(d, 0);
      })
      .ka(function (e) {
        ea(e) ? (Rd(e, a), b()) : d();
      });
  }

  function Zd(a, b) {
    var d = 'https://' + b + ':' + a + '/DYMO/DLS/Printing/StatusConnected';
    return new G(function (b, g) {
      jd(
        d,
        function (d) {
          rd(d.target) ? g(a) : b(a);
        },
        'GET',
        void 0,
        3e3,
      );
    });
  }

  function $d(a, b, d) {
    var e = Sd(),
      g = 'https://' + e.Host + ':' + e.Port + '/DYMO/DLS/Printing/' + b;
    return new G(function (e, k) {
      var l = [],
        m = null,
        r;
      for (r in d)
        l.push(encodeURIComponent(r) + '=' + encodeURIComponent(d[r]));
      'POST' == a
        ? (m = l.length ? l.join('&') : '')
        : (g += l.length ? '?' + l.join('&') : '');
      jd(
        g,
        function (a) {
          var d = a.target;
          a = null;
          if (rd(d)) {
            d = sd(d);
            try {
              a = window.JSON.parse(d);
            } catch (g) {
              a = d;
            }
            e(a);
          } else
            (a =
              'Failed to execute webservice command: ' +
              b +
              '. Error: ' +
              d.w()),
              O('invokeWsCommandAsync > ' + a),
              k(Error(a));
        },
        a || 'GET',
        m,
        1e4,
      );
    });
  }

  function ae(a, b, d) {
    var e = Sd();
    a = Td(
      'https://' + e.Host + ':' + e.Port + '/DYMO/DLS/Printing/' + b,
      d,
      a,
    );
    try {
      return window.JSON.parse(a);
    } catch (g) {
      return a;
    }
  }

  function be() {
    this.getPrinters = function () {
      return ae('GET', 'GetPrinters', {});
    };
    this.openLabelFile = function (a) {
      return ae('GET', 'OpenLabelFile', { fileName: a });
    };
    this.printLabel = function (a, b, d, e) {
      return ae('POST', 'PrintLabel', {
        printerName: a,
        printParamsXml: b,
        labelXml: d,
        labelSetXml: e,
      });
    };
    this.printLabel2 = function (a, b, d, e) {
      return ae('POST', 'PrintLabel2', {
        printerName: a,
        printParamsXml: b,
        labelXml: d,
        labelSetXml: e,
      });
    };
    this.renderLabel = function (a, b, d) {
      return ae('POST', 'RenderLabel', {
        labelXml: a,
        renderParamsXml: b,
        printerName: d,
      });
    };
    this.loadImageAsPngBase64 = function (a) {
      return ae('GET', 'LoadImageAsPngBase64', { imageUri: a });
    };
    this.T = function () {
      return $d('GET', 'GetPrinters', {});
    };
    this.V = function (a) {
      return $d('GET', 'OpenLabelFile', { fileName: a });
    };
    this.X = function (a, b, d, e) {
      return $d('POST', 'PrintLabel', {
        printerName: a,
        printParamsXml: b,
        labelXml: d,
        labelSetXml: e,
      });
    };
    this.W = function (a, b, d, e) {
      return $d('POST', 'PrintLabel2', {
        printerName: a,
        printParamsXml: b,
        labelXml: d,
        labelSetXml: e,
      });
    };
    this.Y = function (a, b, d) {
      return $d('POST', 'RenderLabel', {
        labelXml: a,
        renderParamsXml: b,
        printerName: d,
      });
    };
    this.U = function (a) {
      return $d('GET', 'LoadImageAsPngBase64', { imageUri: a });
    };
  }
  var ce = {};
  w('dymo.label.framework.FlowDirection', ce);
  ce.LeftToRight = 'LeftToRight';
  ce.RightToLeft = 'RightToLeft';
  var de = {};
  w('dymo.label.framework.LabelWriterPrintQuality', de);
  de.Auto = 'Auto';
  de.Text = 'Text';
  de.BarcodeAndGraphics = 'BarcodeAndGraphics';
  var ee = {};
  w('dymo.label.framework.TwinTurboRoll', ee);
  ee.Auto = 'Auto';
  ee.Left = 'Left';
  ee.Right = 'Right';
  var fe = {};
  w('dymo.label.framework.TapeAlignment', fe);
  fe.Center = 'Center';
  fe.Left = 'Left';
  fe.Right = 'Right';
  var ge = {};
  w('dymo.label.framework.TapeCutMode', ge);
  ge.AutoCut = 'AutoCut';
  ge.ChainMarks = 'ChainMarks';
  var he = {};
  w('dymo.label.framework.AddressBarcodePosition', he);
  he.AboveAddress = 'AboveAddress';
  he.BelowAddress = 'BelowAddress';
  he.Suppress = 'Suppress';
  var Q = {};
  w('dymo.label.framework.PrintJobStatus', Q);
  Q.S = 0;
  Q.Unknown = Q.S;
  Q.va = 1;
  Q.Printing = Q.va;
  Q.na = 2;
  Q.Finished = Q.na;
  Q.Error = 3;
  Q.Error = Q.Error;
  Q.ta = 4;
  Q.PaperOut = Q.ta;
  Q.oa = 5;
  Q.InQueue = Q.oa;
  Q.ea = -1;
  Q.ProcessingError = Q.ea;
  Q.ua = -2;
  Q.PrinterBusy = Q.ua;
  Q.pa = -3;
  Q.InvalidJobId = Q.pa;
  Q.sa = -4;
  Q.NotSpooled = Q.sa;

  function R(a) {
    if ('undefined' != typeof DOMParser)
      return new DOMParser().parseFromString(a, 'application/xml');
    if ('undefined' != typeof ActiveXObject) {
      var b = new ActiveXObject('MSXML2.DOMDocument');
      if (b) {
        b.resolveExternals = !1;
        b.validateOnParse = !1;
        try {
          b.setProperty('ProhibitDTD', !0),
            b.setProperty('MaxXMLSize', 2048),
            b.setProperty('MaxElementDepth', 256);
        } catch (d) {}
      }
      b.loadXML(a);
      return b;
    }
    throw Error('Your browser does not support loading xml documents');
  }

  function ie(a) {
    if ('undefined' != typeof XMLSerializer)
      return new XMLSerializer().serializeToString(a);
    if ((a = a.xml)) return a;
    throw Error('Your browser does not support serializing XML documents');
  }

  function S(a, b, d, e) {
    b = a.ownerDocument.createElement(b);
    d && b.appendChild(a.ownerDocument.createTextNode(d));
    if (e) for (var g in e) b.setAttribute(g, e[g]);
    a.appendChild(b);
  }

  function T(a) {
    if (a) {
      var b = [];
      ab(a, b, !1);
      a = b.join('');
    } else a = '';
    return a;
  }

  function U(a, b) {
    var d = a.getElementsByTagName(b);
    if (0 < d.length) return d[0];
  }

  function V(a, b) {
    for (; a.firstChild; ) a.removeChild(a.firstChild);
    a.appendChild(a.ownerDocument.createTextNode(b));
  }

  function W() {
    this.c = [];
  }
  w('dymo.label.framework.LabelSetBuilder', W);
  W.prototype.h = function () {
    return this.c;
  };
  W.prototype.getRecords = W.prototype.h;
  W.prototype.f = function () {
    var a = new X();
    this.c.push(a);
    return a;
  };
  W.prototype.addRecord = W.prototype.f;

  function je(a) {
    for (
      var b = R('<LabelSet/>'), d = b.documentElement, e = 0;
      e < a.length;
      e++
    ) {
      var g = a[e],
        h = b.createElement('LabelRecord'),
        k;
      for (k in g) {
        var l = g[k];
        if ('function' != typeof l) {
          var l = l.toString(),
            m = b.createElement('ObjectData');
          m.setAttribute('Name', k);
          0 == l.indexOf('<TextMarkup>')
            ? ((l = R(l)), m.appendChild(l.documentElement.cloneNode(!0)))
            : m.appendChild(b.createTextNode(l));
          h.appendChild(m);
        }
      }
      d.appendChild(h);
    }
    return ie(b);
  }
  W.toXml = je;
  W.prototype.toString = function () {
    return je(this.c);
  };

  function X() {}
  X.prototype.h = function (a, b) {
    b = b.toString();
    0 != b.indexOf('<TextMarkup>') &&
      (b = '<TextMarkup>' + b + '</TextMarkup>');
    this[a] = b;
    return this;
  };
  X.prototype.setTextMarkup = X.prototype.h;
  X.prototype.f = function (a, b) {
    this[a] = b;
    return this;
  };
  X.prototype.setText = X.prototype.f;
  X.prototype.c = function (a, b) {
    this[a] = b;
    return this;
  };
  X.prototype.setBase64Image = X.prototype.c;

  function Y(a) {
    this.f = R(a);
  }
  Y.prototype.c = function () {
    return ie(this.f);
  };
  Y.prototype.getLabelXml = Y.prototype.c;
  Y.prototype.M = function (a, b) {
    return ke(this.c(), a, b);
  };
  Y.prototype.render = Y.prototype.M;
  Y.prototype.O = function (a, b) {
    return le(this.c(), a, b);
  };
  Y.prototype.renderAsync = Y.prototype.O;
  Y.prototype.h = function (a, b, d) {
    me(a, b, this.c(), d);
  };
  Y.prototype.print = Y.prototype.h;
  Y.prototype.H = function (a, b, d) {
    return ne(a, b, this.c(), d);
  };
  Y.prototype.printAsync = Y.prototype.H;
  Y.prototype.A = function (a, b, d) {
    return oe(a, b, this.c(), d);
  };
  Y.prototype.print2 = Y.prototype.A;
  Y.prototype.F = function (a, b, d) {
    return pe(a, b, this.c(), d);
  };
  Y.prototype.print2Async = Y.prototype.F;
  Y.prototype.G = function (a, b, d, e, g) {
    return qe(a, b, this.c(), d, e, g);
  };
  Y.prototype.printAndPollStatus = Y.prototype.G;
  Y.prototype.B = function (a, b, d, e, g) {
    return re(a, b, this.c(), d, e, g);
  };
  Y.prototype.printAndPollStatusAsync = Y.prototype.B;
  var se =
    'AddressObject TextObject BarcodeObject ShapeObject CounterObject ImageObject CircularTextObject DateTimeObject'.split(
      ' ',
    );

  function te(a, b) {
    var d = b || se;
    return Xa(a.f.documentElement, function (a) {
      return 1 == a.nodeType && 0 <= ra(d, a.tagName);
    });
  }
  Y.prototype.o = function () {
    for (var a = te(this), b = [], d = 0; d < a.length; d++)
      b.push(T(U(a[d], 'Name')));
    return b;
  };
  Y.prototype.getObjectNames = Y.prototype.o;
  Y.prototype.l = function () {
    return te(this, ['AddressObject']).length;
  };
  Y.prototype.getAddressObjectCount = Y.prototype.l;

  function ue(a, b) {
    return te(a, ['AddressObject'])[b];
  }
  Y.prototype.i = function (a) {
    return T(U(ue(this, a), 'BarcodePosition'));
  };
  Y.prototype.getAddressBarcodePosition = Y.prototype.i;
  Y.prototype.P = function (a, b) {
    if ('AboveAddress' != b && 'BelowAddress' != b && 'Suppress' != b)
      throw Error(
        "verifyAddressBarcodePosition(): barcode position '" +
          b +
          "' is invalid value",
      );
    V(U(ue(this, a), 'BarcodePosition'), b);
    return this;
  };
  Y.prototype.setAddressBarcodePosition = Y.prototype.P;
  Y.prototype.m = function (a) {
    return ve(ue(this, a));
  };
  Y.prototype.getAddressText = Y.prototype.m;
  Y.prototype.R = function (a, b) {
    return we(this, ue(this, a), b);
  };
  Y.prototype.setAddressText = Y.prototype.R;

  function xe(a, b) {
    for (var d = te(a), e = 0; e < d.length; e++) {
      var g = d[e];
      if (T(U(g, 'Name')) == b) return g;
    }
    throw Error(
      "getObjectByNameElement(): no object with name '" + b + "' was found",
    );
  }

  function ve(a) {
    return ta(
      U(a, 'StyledText').getElementsByTagName('String'),
      function (a, d) {
        return a + T(d);
      },
      '',
    );
  }
  Y.prototype.s = function (a) {
    a = xe(this, a);
    switch (a.tagName) {
      case 'AddressObject':
      case 'TextObject':
        return ve(a);
      case 'BarcodeObject':
        return T(U(a, 'Text'));
      case 'ImageObject':
        if ((a = U(a, 'Image'))) return T(a);
        break;
      case 'CircularTextObject':
        return T(U(a, 'Text'));
    }
    return '';
  };
  Y.prototype.getObjectText = Y.prototype.s;

  function we(a, b, d) {
    var e = U(b, 'StyledText'),
      g = [],
      h;
    h = e.getElementsByTagName('Element');
    for (var k = !0, l = 0; l < h.length; l++) {
      var m = h[l],
        r = T(U(m, 'String'));
      if (r && r.length) {
        var r = r.split('\n'),
          J = r.length;
        if (1 != J || k) {
          var y = 0;
          k || (y = 1);
          for (k = U(m, 'Attributes'); y < J - 1; y++) g.push(k);
          0 < r[J - 1].length ? (g.push(k), (k = !1)) : (k = !0);
        }
      }
    }
    h = U(b, 'LineFonts');
    b = [];
    h && (b = h.getElementsByTagName('Font'));
    var Jd;
    0 == b.length &&
      (Jd = R(
        '<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />',
      ).documentElement);
    for (
      h = R(
        '<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />',
      ).documentElement;
      e.firstChild;

    )
      e.removeChild(e.firstChild);
    d = d.split('\n');
    for (l = 0; l < d.length; l++)
      (y = d[l].replace('\r', '')),
        l < d.length - 1 && (y += '\n'),
        (k = Jd),
        0 < b.length
          ? (k = l < b.length ? b[l] : b[b.length - 1])
          : 0 < g.length &&
            (k = l < g.length ? U(g[l], 'Font') : U(g[g.length - 1], 'Font')),
        (m = h),
        l < g.length && (m = U(g[l], 'ForeColor')),
        (r = e.ownerDocument.createElement('Element')),
        (J = e.ownerDocument.createElement('String')),
        V(J, y),
        (y = e.ownerDocument.createElement('Attributes')),
        y.appendChild(k.cloneNode(!0)),
        y.appendChild(m.cloneNode(!0)),
        r.appendChild(J),
        r.appendChild(y),
        e.appendChild(r);
    return a;
  }
  Y.prototype.da = function (a, b) {
    var d = xe(this, a);
    switch (d.tagName) {
      case 'AddressObject':
        we(this, d, b);
        break;
      case 'TextObject':
        we(this, d, b);
        break;
      case 'BarcodeObject':
        V(U(d, 'Text'), b);
        break;
      case 'ImageObject':
        var e = U(d, 'Image');
        if (e) V(e, b);
        else {
          var g = U(d, 'ImageLocation');
          if (!g)
            throw Error(
              'setObjectText(): <ImageLocation> is expected but not found: ' +
                ie(e),
            );
          e = g.ownerDocument.createElement('Image');
          V(e, b);
          d.replaceChild(e, g);
        }
        break;
      case 'CircularTextObject':
        V(U(d, 'Text'), b);
        break;
      case 'DateTimeObject':
        V(U(d, 'PreText'), b);
        break;
      case 'CounterObject':
        V(U(d, 'PreText'), b);
    }
    return this;
  };
  Y.prototype.setObjectText = Y.prototype.da;
  Y.prototype.Z = function (a) {
    var b = this.f.documentElement;
    if ('ContinuousLabel' != b.nodeName)
      throw Error('Cannot set length on non-continuous label.');
    var d = 0 == a ? 'Auto' : 'Fixed';
    a = 0 == a ? 7200 : a;
    V(U(b, 'LengthMode'), d);
    V(U(b, 'LabelLength'), a);
    b = U(b, 'RootCell');
    V(U(b, 'Length'), a);
    V(U(b, 'LengthMode'), d);
    return this;
  };
  Y.prototype.setLabelLength = Y.prototype.Z;
  Y.prototype.toString = function () {
    return this.c();
  };
  /*
     Portions of this code are from MochiKit, received by
     The Closure Authors under the MIT license. All other code is Copyright
     2005-2009 The Closure Authors. All Rights Reserved.
    */
  function ye(a, b) {
    this.l = [];
    this.B = a;
    this.G = b || null;
    this.i = this.c = !1;
    this.h = void 0;
    this.A = this.H = this.o = !1;
    this.m = 0;
    this.f = null;
    this.s = 0;
  }
  ye.prototype.cancel = function (a) {
    if (this.c) this.h instanceof ye && this.h.cancel();
    else {
      if (this.f) {
        var b = this.f;
        delete this.f;
        a ? b.cancel(a) : (b.s--, 0 >= b.s && b.cancel());
      }
      this.B ? this.B.call(this.G, this) : (this.A = !0);
      this.c || ((a = new ze()), Ae(this), Be(this, !1, a));
    }
  };
  ye.prototype.F = function (a, b) {
    this.o = !1;
    Be(this, a, b);
  };

  function Be(a, b, d) {
    a.c = !0;
    a.h = d;
    a.i = !b;
    Ce(a);
  }

  function Ae(a) {
    if (a.c) {
      if (!a.A) throw new De();
      a.A = !1;
    }
  }

  function Ee(a, b, d, e) {
    a.l.push([b, d, e]);
    a.c && Ce(a);
  }
  ye.prototype.then = function (a, b, d) {
    var e,
      g,
      h = new G(function (a, b) {
        e = a;
        g = b;
      });
    Ee(this, e, function (a) {
      a instanceof ze ? h.cancel() : g(a);
    });
    return h.then(a, b, d);
  };
  bb(ye);

  function Fe(a) {
    return ua(a.l, function (a) {
      return u(a[1]);
    });
  }

  function Ce(a) {
    if (a.m && a.c && Fe(a)) {
      var b = a.m,
        d = Ge[b];
      d && (p.clearTimeout(d.u), delete Ge[b]);
      a.m = 0;
    }
    a.f && (a.f.s--, delete a.f);
    for (var b = a.h, e = (d = !1); a.l.length && !a.o; ) {
      var g = a.l.shift(),
        h = g[0],
        k = g[1],
        g = g[2];
      if ((h = a.i ? k : h))
        try {
          var l = h.call(g || a.G, b);
          void 0 !== l &&
            ((a.i = a.i && (l == b || l instanceof Error)), (a.h = b = l));
          if (
            cb(b) ||
            ('function' === typeof p.Promise && b instanceof p.Promise)
          )
            (e = !0), (a.o = !0);
        } catch (m) {
          (b = m), (a.i = !0), Fe(a) || (d = !0);
        }
    }
    a.h = b;
    e &&
      ((l = v(a.F, a, !0)),
      (e = v(a.F, a, !1)),
      b instanceof ye ? (Ee(b, l, e), (b.H = !0)) : b.then(l, e));
    d && ((b = new He(b)), (Ge[b.u] = b), (a.m = b.u));
  }

  function De() {
    z.call(this);
  }
  x(De, z);
  De.prototype.message = 'Deferred has already fired';
  De.prototype.name = 'AlreadyCalledError';

  function ze() {
    z.call(this);
  }
  x(ze, z);
  ze.prototype.message = 'Deferred was canceled';
  ze.prototype.name = 'CanceledError';

  function He(a) {
    this.u = p.setTimeout(v(this.f, this), 0);
    this.c = a;
  }
  He.prototype.f = function () {
    delete Ge[this.u];
    throw this.c;
  };
  var Ge = {};

  function Ie(a, b) {
    var d = b || {},
      e = d.document || document,
      g = document.createElement('SCRIPT'),
      h = { ja: g, L: void 0 },
      k = new ye(Je, h),
      l = null,
      m = null != d.timeout ? d.timeout : 5e3;
    0 < m &&
      ((l = window.setTimeout(function () {
        Ke(g, !0);
        var b = new Le(Me, 'Timeout reached for loading script ' + a);
        Ae(k);
        Be(k, !1, b);
      }, m)),
      (h.L = l));
    g.onload = g.onreadystatechange = function () {
      (g.readyState &&
        'loaded' != g.readyState &&
        'complete' != g.readyState) ||
        (Ke(g, d.xa || !1, l), Ae(k), Be(k, !0, null));
    };
    g.onerror = function () {
      Ke(g, !0, l);
      var b = new Le(Ne, 'Error while loading script ' + a);
      Ae(k);
      Be(k, !1, b);
    };
    Va(g, { type: 'text/javascript', charset: 'UTF-8', src: a });
    Oe(e).appendChild(g);
    return k;
  }

  function Oe(a) {
    var b = a.getElementsByTagName('HEAD');
    return b && 0 != b.length ? b[0] : a.documentElement;
  }

  function Je() {
    if (this && this.ja) {
      var a = this.ja;
      a && 'SCRIPT' == a.tagName && Ke(a, !0, this.L);
    }
  }

  function Ke(a, b, d) {
    null != d && p.clearTimeout(d);
    a.onload = q;
    a.onerror = q;
    a.onreadystatechange = q;
    b &&
      window.setTimeout(function () {
        a && a.parentNode && a.parentNode.removeChild(a);
      }, 0);
  }
  var Ne = 0,
    Me = 1;

  function Le(a, b) {
    var d = 'Jsloader error (code #' + a + ')';
    b && (d += ': ' + b);
    z.call(this, d);
  }
  x(Le, z);

  function Pe(a, b) {
    this.f = new N(a);
    this.c = b ? b : 'callback';
    this.L = 5e3;
  }
  var Qe = 0;
  Pe.prototype.send = function (a, b, d, e) {
    a = a || null;
    e = e || '_' + (Qe++).toString(36) + ka().toString(36);
    p._callbacks_ || (p._callbacks_ = {});
    var g = this.f.clone();
    if (a)
      for (var h in a)
        if (!a.hasOwnProperty || a.hasOwnProperty(h)) {
          var k = g,
            l = h,
            m = a[h];
          ca(m) || (m = [String(m)]);
          Md(k.h, l, m);
        }
    b &&
      ((p._callbacks_[e] = Re(e, b)),
      (b = this.c),
      (h = '_callbacks_.' + e),
      ca(h) || (h = [String(h)]),
      Md(g.h, b, h));
    b = Ie(g.toString(), { timeout: this.L, xa: !0 });
    Ee(b, null, Se(e, a, d), void 0);
    return { u: e, ga: b };
  };
  Pe.prototype.cancel = function (a) {
    a && (a.ga && a.ga.cancel(), a.u && Te(a.u, !1));
  };

  function Se(a, b, d) {
    return function () {
      Te(a, !1);
      d && d(b);
    };
  }

  function Re(a, b) {
    return function (d) {
      Te(a, !0);
      b.apply(void 0, arguments);
    };
  }

  function Te(a, b) {
    p._callbacks_[a] && (b ? delete p._callbacks_[a] : (p._callbacks_[a] = q));
  }

  function Ue(a, b, d) {
    Mb.call(this);
    this.c = a;
    this.m = b || 0;
    this.f = d;
    this.h = v(this.i, this);
  }
  x(Ue, Mb);
  Ue.prototype.u = 0;
  Ue.prototype.K = function () {
    Ue.ca.K.call(this);
    0 != this.u && p.clearTimeout(this.u);
    this.u = 0;
    delete this.c;
    delete this.f;
  };

  function Ve(a) {
    0 != a.u && p.clearTimeout(a.u);
    a.u = 0;
    a.u = rc(a.h, a.m);
  }
  Ue.prototype.i = function () {
    this.u = 0;
    this.c && this.c.call(this.f);
  };
  var We = (function () {
    function a(a) {
      var b = g;
      return (
        b[a[0]] +
        b[a[1]] +
        b[a[2]] +
        b[a[3]] +
        '-' +
        b[a[4]] +
        b[a[5]] +
        '-' +
        b[a[6]] +
        b[a[7]] +
        '-' +
        b[a[8]] +
        b[a[9]] +
        '-' +
        b[a[10]] +
        b[a[11]] +
        b[a[12]] +
        b[a[13]] +
        b[a[14]] +
        b[a[15]]
      );
    }

    function b(b, g, h) {
      var k = 'binary' != b ? e : g ? g : new d(16);
      g = (g && h) || 0;
      h = 4294967296 * Math.random();
      k[g++] = h & 255;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = (h >>> 8) & 255;
      h = 4294967296 * Math.random();
      k[g++] = h & 255;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = ((h >>>= 8) & 15) | 64;
      k[g++] = (h >>> 8) & 255;
      h = 4294967296 * Math.random();
      k[g++] = (h & 63) | 128;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = (h >>> 8) & 255;
      h = 4294967296 * Math.random();
      k[g++] = h & 255;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = (h >>>= 8) & 255;
      k[g++] = (h >>> 8) & 255;
      return void 0 === b ? a(k) : k;
    }
    for (var d = Array, e = new d(16), g = [], h = {}, k = 0; 256 > k; k++)
      (g[k] = (k + 256).toString(16).substr(1).toUpperCase()), (h[g[k]] = k);
    b.f = function (a) {
      var b = new d(16),
        e = 0;
      a.toUpperCase().replace(/[0-9A-F][0-9A-F]/g, function (a) {
        b[e++] = h[a];
      });
      return b;
    };
    b.h = a;
    b.c = d;
    return b;
  })();

  function Xe(a, b, d, e) {
    this.printerName = a;
    this.jobId = b;
    this.status = d;
    this.statusMessage = e;
  }

  function Ye(a) {
    var b = {};
    a = a.split(' ');
    1 <= a.length && (b.status = parseInt(a[0], 10));
    b.statusMessage = a.slice(1).join(' ');
    return b;
  }

  function Ze(a) {
    for (var b = 0; b < navigator.plugins.length; ++b)
      for (var d = navigator.plugins[b], e = 0; e < d.length; ++e)
        if (d[e].type == a) return !0;
    return !1;
  }

  function $e() {
    if (!document.getElementById('_DymoLabelFrameworkJslSafariPlugin')) {
      var a = document.createElement('embed');
      a.type = 'application/x-dymolabel';
      a.id = '_DymoLabelFrameworkJslSafariPlugin';
      a.width = 1;
      a.height = 1;
      a.hidden = !0;
      document.body.appendChild(a);
    }
    return window._DymoLabelFrameworkJslSafariPlugin;
  }

  function af(a) {
    if (!document.getElementById('_DymoLabelFrameworkJslPlugin')) {
      var b = document.createElement('embed');
      b.type = 'application/x-dymolabel';
      b.id = '_DymoLabelFrameworkJslPlugin';
      a
        ? ((b.width = 1), (b.height = 1), (b.hidden = !0))
        : ((b.width = 0), (b.height = 0), (b.hidden = !1));
      document.body.appendChild(b);
    }
    return document.getElementById('_DymoLabelFrameworkJslPlugin');
  }

  function bf() {
    var a = af(!0);
    a.getPrinters || (document.body.removeChild(a), (a = af(!1)));
    return a;
  }

  function cf(a) {
    if (!document.getElementById('_DymoLabelFrameworkJslPlugin')) {
      var b = document.createElement('embed');
      b.type = 'application/x-npapi-dymolabel';
      b.id = '_DymoLabelFrameworkJslPlugin';
      a
        ? ((b.width = 1), (b.height = 1), (b.hidden = !0))
        : ((b.width = 0), (b.height = 0), (b.hidden = !1));
      document.body.appendChild(b);
      b.getPrinters || ((b.width = 1), (b.height = 1), (b.hidden = !1));
    }
    return document.getElementById('_DymoLabelFrameworkJslPlugin');
  }

  function df() {
    var a = cf(!0);
    a.getPrinters || (document.body.removeChild(a), (a = cf(!1)));
    return a;
  }

  function ef() {
    var a = new ActiveXObject('DYMOLabelFrameworkIEPlugin.Plugin');
    if ('object' != typeof a)
      throw Error(
        'createFramework(): unable to create DYMO.Label.Framework object. Check DYMO Label Framework is installed',
      );
    return a;
  }

  function ff(a) {
    function b(a) {
      return function () {
        var b = arguments;
        return new G(function (d) {
          d(a.apply(null, b));
        });
      };
    }
    if ('' != a.errorDetails) throw Error(a.errorDetails);
    if (a.isWebServicePresent) {
      O('chooseEnvironment > WebServicePresent');
      var d = new be();
      if (d)
        a = {
          getPrinters: function () {
            return d.getPrinters();
          },
          openLabelFile: function (a) {
            return d.openLabelFile(a);
          },
          printLabel: function (a, b, e, g) {
            d.printLabel(a, b, e, g);
          },
          printLabel2: function (a, b, e, g) {
            d.printLabel2(a, b, e, g);
          },
          renderLabel: function (a, b, e) {
            return d.renderLabel(a, b, e);
          },
          loadImageAsPngBase64: function (a) {
            return d.loadImageAsPngBase64(a);
          },
          getJobStatus: function (a, b) {
            var e;
            u(d.getJobStatus)
              ? (e = Ye(d.getJobStatus(a, parseInt(b, 10))))
              : (e = { status: Q.S, statusMessage: 'not implemented' });
            return new Xe(a, b, e.status, e.statusMessage);
          },
          T: function () {
            return d.T();
          },
          V: function (a) {
            return d.V(a);
          },
          X: function (a, b, e, g) {
            return d.X(a, b, e, g);
          },
          W: function (a, b, e, g) {
            return d.W(a, b, e, g);
          },
          Y: function (a, b, e) {
            return d.Y(a, b, e);
          },
          U: function (a) {
            return d.U(a);
          },
        };
      else
        throw Error(
          'Cannot establish connection to the web service. Is DYMO Label Framework installed?',
        );
      return a;
    }
    if ('ActiveXObject' in window) {
      O('chooseEnvironment > ActiveXObject');
      a = {};
      var e = ef();
      a.getPrinters = function () {
        return e.GetPrinters();
      };
      a.openLabelFile = function (a) {
        return e.OpenLabelFile(a);
      };
      a.printLabel = function (a, b, d, g) {
        e.PrintLabel(a, b, d, g);
      };
      a.renderLabel = function (a, b, d) {
        return e.RenderLabel(a, b, d);
      };
      a.loadImageAsPngBase64 = function (a) {
        return e.LoadImageAsPngBase64(a);
      };
      a.printLabel2 = function (a, b, d, g) {
        if (u(e.PrintLabel2)) return e.PrintLabel2(a, b, d, g).toString();
        e.PrintLabel(a, b, d, g);
      };
      a.getJobStatus = function (a, b) {
        var d;
        u(e.GetJobStatus)
          ? (d = Ye(e.GetJobStatus(a, parseInt(b, 10))))
          : (d = { status: Q.S, statusMessage: 'not implemented' });
        return new Xe(a, b, d.status, d.statusMessage);
      };
    } else if (-1 != navigator.platform.indexOf('Win')) {
      O('chooseEnvironment > WIN');
      var g = bf();
      if (g)
        a = {
          getPrinters: function () {
            return g.getPrinters();
          },
          openLabelFile: function (a) {
            return g.openLabelFile(a);
          },
          printLabel: function (a, b, d, e) {
            g.printLabel(a, b, d, e);
          },
          renderLabel: function (a, b, d) {
            return g.renderLabel(a, b, d);
          },
          loadImageAsPngBase64: function (a) {
            return g.loadImageAsPngBase64(a);
          },
          printLabel2: function (a, b, d, e) {
            if (u(g.printLabel2)) return g.printLabel2(a, b, d, e).toString();
            g.printLabel(a, b, d, e);
          },
          getJobStatus: function (a, b) {
            var d;
            u(g.getJobStatus)
              ? (d = Ye(g.getJobStatus(a, parseInt(b, 10))))
              : (d = { status: Q.S, statusMessage: 'not implemented' });
            return new Xe(a, b, d.status, d.statusMessage);
          },
        };
      else throw Error('DYMO Label Framework is not installed');
    } else {
      O('chooseEnvironment > not WIN');
      var h;
      Ze('application/x-dymolabel')
        ? (O('chooseEnvironment > _createSafariPlugin'), (h = $e()))
        : (O('chooseEnvironment > _createMacNsapiPlugin'), (h = df()));
      O('chooseEnvironment > safariPlugin : ' + !!h);
      if (h)
        a = {
          getPrinters: function () {
            return h.getPrinters();
          },
          openLabelFile: function (a) {
            var b = h.openLabelFile(a);
            if (!b) throw Error("Unable to open label file '" + a + "'");
            return b;
          },
          printLabel: function (a, b, d, e) {
            h.printLabel(d, a, b, e);
          },
          renderLabel: function (a, b, d) {
            return h.renderLabel(a, b, d);
          },
          loadImageAsPngBase64: function (a) {
            var b = h.loadImageAsPngBase64(a);
            if (!b) throw Error("Unable to load image from uri '" + a + "'");
            return b;
          },
          printLabel2: function (a, b, d, e) {
            if (u(h.printLabel2)) return h.printLabel2(d, a, b, e).toString();
            h.printLabel(d, a, b, e);
          },
          getJobStatus: function (a, b) {
            var d;
            u(h.getJobStatus)
              ? (d = Ye(h.getJobStatus(a, parseInt(b, 10))))
              : (d = { status: Q.S, statusMessage: 'not implemented' });
            return new Xe(a, b, d.status, d.statusMessage);
          },
        };
      else throw Error('DYMO Label Framework is not installed');
    }
    a.T = b(a.getPrinters);
    a.V = b(a.openLabelFile);
    a.X = b(a.printLabel);
    a.W = b(a.printLabel2);
    a.Y = b(a.renderLabel);
    a.U = b(a.loadImageAsPngBase64);
    return a;
  }
  w('dymo.label.framework.trace', !1);
  var Xd = 0;

  function O(a) {
    window.dymo.label.framework.trace &&
      window.console &&
      window.console.log &&
      console.log(a);
  }

  function gf(a) {
    function b() {
      throw d;
    }
    var d =
      a || Error('DYMO Label Framework Plugin or WebService are not installed');
    return {
      getPrinters: b,
      openLabelFile: b,
      printLabel: b,
      printLabel2: b,
      renderLabel: b,
      loadImageAsPngBase64: b,
      getJobStatus: b,
      T: b,
      V: b,
      X: b,
      W: b,
      Y: b,
      U: b,
    };
  }
  var P = (function () {
    function a(g, h) {
      if (d)
        throw (
          (O('_createFramework > Error service discovery is in progress. '),
          Error('DYMO Label Framework service discovery is in progress.'))
        );
      return b
        ? (O(
            '_createFramework > returning existing instance of _framework, has callBack: ' +
              !!g,
          ),
          g && g(e),
          b)
        : this && this.constructor == a
          ? ((d = !0),
            (P.c = function () {
              e = b = null;
              Xd = 0;
            }),
            hf(function (a) {
              e = a;
              O(
                'onEnvironmentChecked > checkResult isBrowserSupported : ' +
                  a.isBrowserSupported +
                  ', isFrameworkInstalled: ' +
                  a.isFrameworkInstalled +
                  ', isWebServicePresent: ' +
                  a.isWebServicePresent +
                  ', errorDetails: ' +
                  a.errorDetails,
              );
              try {
                (b = ff(a)), (Xd = a.isWebServicePresent ? 2 : 1);
              } catch (l) {
                O(
                  'onEnvironmentChecked > exception e : ' +
                    (l.description || l.message || l),
                );
                if (!h) throw l;
                b = gf(l);
                O('onEnvironmentChecked > fall back to createFaultyFramework');
              } finally {
                d = !1;
              }
              g && g(e);
            }, h),
            O(
              '_createFramework > return _framework : ' +
                b +
                (h ? ' (async)' : ' (sync)'),
            ),
            b)
          : new a(g, h);
    }
    var b,
      d = !1,
      e = null;
    return a;
  })();
  w('dymo.label.framework.init', function (a) {
    P(a, !0);
  });

  function jf(a, b, d, e, g) {
    this.printerType = a;
    this.name = b;
    this.modelName = d;
    this.isConnected = e;
    this.isLocal = g;
    this.c = this.C = '';
  }

  function kf(a, b, d, e, g) {
    jf.call(this, 'LabelWriterPrinter', a, b, d, e);
    this.isTwinTurbo = g;
  }
  x(kf, jf);

  function lf(a, b, d, e, g) {
    jf.call(this, 'TapePrinter', a, b, d, e);
    this.isAutoCutSupported = g;
  }
  x(lf, jf);

  function mf(a, b, d, e, g) {
    jf.call(this, 'DZPrinter', a, b, d, e);
    this.isAutoCutSupported = g;
  }
  x(mf, jf);

  function Z(a, b) {
    this.c = a;
    this.f = b;
  }
  Z.prototype.h = function () {
    return this.c.name;
  };
  Z.prototype.getPrinterName = Z.prototype.h;
  Z.prototype.i = function () {
    return this.f;
  };
  Z.prototype.getJobId = Z.prototype.i;
  Z.prototype.w = function (a) {
    if ('' != this.c.C) nf(this, a);
    else {
      var b;
      try {
        b = P().getJobStatus(this.c.name, this.f);
      } catch (d) {
        b = new Xe(this.h(), this.f, Q.ea, d.message || d);
      }
      a(b);
    }
  };
  Z.prototype.getStatus = Z.prototype.w;

  function nf(a, b) {
    var d = a.h(),
      e = a.f,
      g = a.c.C;
    new Pe(Gd(g, 'getPrintJobStatus'), 'callback').send(
      { jobId: e, printerName: a.c.c },
      function (a) {
        b(new Xe(d, e, a.status, a.statusMessage));
      },
      function () {
        b(
          new Xe(
            d,
            e,
            Q.ea,
            'Error processing getPrintJobStatus(): Unable to contact "' +
              g +
              '"',
          ),
        );
      },
    );
  }
  w('dymo.label.framework.VERSION', '3.0.0');

  function hf(a, b) {
    function d() {
      O('checkLegacyPlugins');
      g.isWebServicePresent = !1;
      var b = window.navigator.platform;
      if (-1 != b.indexOf('Win'))
        if (
          (O('checkLegacyPlugins > WIN platform '), 'ActiveXObject' in window)
        ) {
          O('checkLegacyPlugins > ActiveXObject');
          g.isBrowserSupported = !0;
          try {
            'object' !=
            typeof new ActiveXObject('DYMOLabelFrameworkIEPlugin.Plugin')
              ? (g.errorDetails =
                  'Unable to create DYMO.Label.Framework ActiveX object. Check that DYMO.Label.Framework is installed')
              : (g.isFrameworkInstalled = !0);
          } catch (d) {
            g.errorDetails =
              'Unable to create DYMO.Label.Framework ActiveX object. Check that DYMO.Label.Framework is installed. Exception details: ' +
              d;
          }
        } else
          O('checkLegacyPlugins > non-IE'),
            (g.isBrowserSupported = !0),
            Ze('application/x-dymolabel')
              ? (O("checkLegacyPlugins > 'application/x-dymolabel'"),
                (g.isFrameworkInstalled = !0))
              : (g.errorDetails =
                  'DYMO Label Framework Plugin is not installed');
      else
        -1 != b.indexOf('Mac')
          ? (O('checkLegacyPlugins > Mac platform'),
            (g.isBrowserSupported = !0),
            Ze('application/x-dymolabel')
              ? (O('checkLegacyPlugins > safariPluginFound'),
                (b = $e()),
                '2.0' <= b.GetAPIVersion()
                  ? (g.isFrameworkInstalled = !0)
                  : (g.errorDetails =
                      'DYMO Label Safari Plugin is installed but outdated. Install the latest version.'))
              : Ze('application/x-npapi-dymolabel')
                ? (O("checkLegacyPlugins > 'application/x-npapi-dymolabel'"),
                  (b = df()) && b.getPrinters
                    ? (g.isFrameworkInstalled = !0)
                    : (g.errorDetails =
                        'DYMO NSAPI plugin is loaded but no callable functions found. If running Safari, then run it in 64-bit mode (MacOS X >= 10.7) or set "Open using Rosetta" option'))
                : (g.errorDetails = 'DYMO Label Plugin is not installed.'))
          : (g.errorDetails = 'The operating system is not supported.');
      a && a(g);
    }

    function e() {
      g.isBrowserSupported = !0;
      g.isFrameworkInstalled = !0;
      g.isWebServicePresent = !0;
      a && a(g);
    }
    var g = {
      isBrowserSupported: !1,
      isFrameworkInstalled: !1,
      isWebServicePresent: !1,
      errorDetails: '',
    };
    if (Xd)
      return (
        O('checkEnvironment > return existing instance of framework'),
        2 == Xd
          ? e()
          : ((g.isBrowserSupported = !0),
            (g.isFrameworkInstalled = !0),
            (g.isWebServicePresent = !1),
            a && a(g)),
        g
      );
    b ? Ud(e, d) : Wd(e, d);
    return g;
  }
  w('dymo.label.framework.checkEnvironment', hf);
  var of = {};

  function pf(a, b, d) {
    this.c = a;
    this.f = b;
    this.h = d;
  }
  pf.prototype.getPrinters = function () {
    var a = qf(this.h),
      b = new N(this.c),
      d = this.f;
    '' == d && (d = b.c);
    for (b = 0; b < a.length; ++b) {
      var e = a[b],
        g = e.name;
      e.name = g + ' @ ' + d;
      e.C = this.c;
      e.location = d;
      e.c = g;
      e.printerUri = e.C;
      e.location = e.location;
      e.localName = e.c;
    }
    return a;
  };
  w('dymo.label.framework.addPrinterUri', function (a, b, d, e) {
    var g = b || '';
    t(g) || (g = g.toString());
    b = null;
    e &&
      (b = function () {
        e(a);
      });
    var h = bd(a);
    new Pe(h, 'callback').send(
      null,
      function (b) {
        of[a] = new pf(a, g, b);
        d && d(a);
      },
      b,
    );
  });
  w('dymo.label.framework.removePrinterUri', function (a) {
    delete of[a];
  });
  w('dymo.label.framework.removeAllPrinterUri', function () {
    of = {};
  });

  function rf() {
    var a = [];
    a.byIndex = [];
    Object.defineProperty(a, 'byIndex', { enumerable: !1, value: [] });
    return a;
  }

  function sf(a, b) {
    var d = a.name;
    b.push(a);
    b.byIndex.push(a);
    d.match(/^\d+$/) &&
      console.error(
        'Printer name consisting of numbers only (' +
          d +
          ') will break proper array behavior. Consider using "byIndex" property for accessing elements by index reliably.',
      );
    'length' === d &&
      console.error(
        'Using "length" as printer name overrides Array.length property!',
      );
    b[d] = a;
  }

  function qf(a) {
    function b(a, b) {
      return T(U(a, b));
    }
    var d = R(a);
    a = rf();
    for (
      var e,
        g,
        h,
        k,
        l,
        m = U(d, 'Printers'),
        r = m.getElementsByTagName('LabelWriterPrinter'),
        d = 0;
      d < r.length;
      d++
    )
      (e = b(r[d], 'Name')),
        (g = b(r[d], 'ModelName')),
        (h = 'True' == b(r[d], 'IsConnected')),
        (k = 'True' == b(r[d], 'IsLocal')),
        (l = 'True' == b(r[d], 'IsTwinTurbo')),
        sf(new kf(e, g, h, k, l), a);
    r = m.getElementsByTagName('TapePrinter');
    for (d = 0; d < r.length; d++)
      (e = b(r[d], 'Name')),
        (g = b(r[d], 'ModelName')),
        (h = 'True' == b(r[d], 'IsConnected')),
        (k = 'True' == b(r[d], 'IsLocal')),
        (l = 'True' == b(r[d], 'IsAutoCutSupported')),
        sf(new lf(e, g, h, k, l), a);
    m = m.getElementsByTagName('DZPrinter');
    for (d = 0; d < m.length; d++)
      (e = b(m[d], 'Name')),
        (g = b(m[d], 'ModelName')),
        (h = 'True' == b(m[d], 'IsConnected')),
        (k = 'True' == b(m[d], 'IsLocal')),
        (l = 'True' == b(m[d], 'IsAutoCutSupported')),
        sf(new mf(e, g, h, k, l), a);
    return a;
  }

  function tf(a) {
    for (var b in of)
      for (var d = of[b].getPrinters(), e = 0; e < d.length; ++e) sf(d[e], a);
  }

  function uf() {
    var a = rf();
    try {
      var b = P().getPrinters(),
        a = qf(b);
    } catch (d) {}
    tf(a);
    return a;
  }
  w('dymo.label.framework.getPrinters', uf);

  function vf() {
    return P()
      .T()
      .then(function (a) {
        try {
          var b = qf(a);
          tf(b);
        } catch (d) {}
        return b;
      });
  }
  w('dymo.label.framework.getPrintersAsync', vf);

  function wf(a) {
    for (var b = [], d = uf(), e = 0; e < d.length; e++) {
      var g = d[e];
      g.printerType && g.printerType == a && b.push(g);
    }
    return b;
  }

  function xf(a) {
    return vf().then(function (b) {
      b = b.byIndex;
      for (var d = [], e = 0; e < b.length; e++) {
        var g = b[e];
        g.printerType && g.printerType == a && d.push(g);
      }
      return d;
    });
  }
  w('dymo.label.framework.getLabelWriterPrinters', function () {
    return wf('LabelWriterPrinter');
  });
  w('dymo.label.framework.getTapePrinters', function () {
    return wf('TapePrinter');
  });
  w('dymo.label.framework.getDZPrinters', function () {
    return wf('DZPrinter');
  });
  w('dymo.label.framework.getLabelWriterPrintersAsync', function () {
    return xf('LabelWriterPrinter');
  });
  w('dymo.label.framework.getTapePrintersAsync', function () {
    return xf('TapePrinter');
  });
  w('dymo.label.framework.getDZPrintersAsync', function () {
    return xf('DZPrinter');
  });
  w('dymo.label.framework.openLabelFile', function (a) {
    return new Y(P().openLabelFile(a));
  });
  w('dymo.label.framework.openLabelFileAsync', function (a) {
    return P()
      .V(a)
      .then(function (a) {
        return new Y(a);
      });
  });
  w('dymo.label.framework.openLabelXml', function (a) {
    var b = new Hc('dymo.label.framework');
    b.c = Lc;
    b.log(Lc, a, void 0);
    return new Y(a);
  });

  function me(a, b, d, e) {
    b = b || '';
    e = e || '';
    'string' != typeof e && (e = e.toString());
    if ('undefined' == typeof d)
      throw Error('printLabel(): labelXml parameter should be specified');
    'string' != typeof d && (d = d.toString());
    var g = uf()[a];
    if (null != g) '' != g.C ? yf(g, b, d, e) : P().printLabel(g.name, b, d, e);
    else throw Error("printLabel(): unknown printer '" + a + "'");
  }
  w('dymo.label.framework.printLabel', me);

  function ne(a, b, d, e) {
    b = b || '';
    e = e || '';
    'string' != typeof e && (e = e.toString());
    if ('undefined' == typeof d)
      throw Error('printLabelAsync(): labelXml parameter should be specified');
    'string' != typeof d && (d = d.toString());
    return vf().then(function (g) {
      g = g[a];
      if (null != g) return '' != g.C ? yf(g, b, d, e) : P().X(g.name, b, d, e);
      throw Error("printLabelAsync(): unknown printer '" + a + "'");
    });
  }
  w('dymo.label.framework.printLabelAsync', ne);

  function oe(a, b, d, e) {
    b = b || '';
    e = e || '';
    'string' != typeof e && (e = e.toString());
    if ('undefined' == typeof d)
      throw Error('printLabel2(): labelXml parameter should be specified');
    'string' != typeof d && (d = d.toString());
    var g = uf()[a];
    if (null != g)
      return '' != g.C ? yf(g, b, d, e) : new Z(g, P().printLabel2(a, b, d, e));
    throw Error("printLabel(): unknown printer '" + a + "'");
  }
  w('dymo.label.framework.printLabel2', oe);

  function pe(a, b, d, e) {
    b = b || '';
    e = e || '';
    'string' != typeof e && (e = e.toString());
    if ('undefined' == typeof d)
      throw Error('printLabel2Async(): labelXml parameter should be specified');
    'string' != typeof d && (d = d.toString());
    return vf().then(function (g) {
      var h = g[a];
      if (null != h)
        return '' != h.C
          ? yf(h, b, d, e)
          : P()
              .W(a, b, d, e)
              .then(function (a) {
                return new Z(h, a);
              });
      throw Error("printLabel2Async(): unknown printer '" + a + "'");
    });
  }
  w('dymo.label.framework.printLabel2Async', pe);

  function yf(a, b, d, e) {
    function g(a, b) {
      var d = 4e3 * a,
        e = '';
      d >= l.length ? (a = -1) : (e = l.substr(d, 4e3));
      new Pe(k, 'c').send(
        { j: h, cid: a, pl: e },
        function (d) {
          var e = d.status,
            k = new Hc('dymo.label.framework');
          k.c = Lc;
          0 == e
            ? -1 != a
              ? g(++a, 0)
              : k.log(Lc, 'Finished sending job payload for ' + h, void 0)
            : -5 == e
              ? 10 > b
                ? g(++d.lastAckChunkId, ++b)
                : k.log(
                    Kc,
                    'Unable to send print job data for "' +
                      h +
                      '": STATUS_INVALID_CHUNK_ID: Max retry count reached',
                    void 0,
                  )
              : 10 > b
                ? g(a, ++b)
                : k.log(
                    Kc,
                    'Unable to send print job data for "' +
                      h +
                      '": Max retry count reached',
                    void 0,
                  );
        },
        function () {
          var d = new Hc('dymo.label.framework');
          d.c = Lc;
          10 > b
            ? g(a, ++b)
            : d.log(
                Kc,
                'Unable to send print job data for "' +
                  h +
                  '": error: Max retry count reached',
                void 0,
              );
        },
      );
    }
    var h = We();
    b = { printerName: a.c, labelXml: d, printParamsXml: b, labelSetXml: e };
    var k = Gd(a.C, 'pl'),
      l = sc(b);
    g(0, 0);
    return new Z(a, h);
  }

  function qe(a, b, d, e, g, h) {
    function k(a) {
      if (g(l, a)) {
        var b = new Ue(function () {
          l.w(k);
          Pb(b);
        }, h);
        Ve(b);
      }
    }
    var l = oe(a, b, d, e);
    l.w(k);
    return l;
  }
  w('dymo.label.framework.printLabelAndPollStatus', qe);

  function re(a, b, d, e, g, h) {
    return pe(a, b, d, e).then(function (a) {
      function b(d) {
        if (g(a, d)) {
          var e = new Ue(function () {
            a.w(b);
            Pb(e);
          }, h);
          Ve(e);
        }
      }
      a.w(b);
      return a;
    });
  }
  w('dymo.label.framework.printLabelAndPollStatusAsync', re);

  function ke(a, b, d) {
    if ('undefined' == typeof a)
      throw Error('renderLabel(): labelXml parameter should be specified');
    'string' != typeof a && (a = a.toString());
    b = b || '';
    d = d || '';
    return P().renderLabel(a, b, d);
  }
  w('dymo.label.framework.renderLabel', ke);

  function le(a, b, d) {
    if ('undefined' == typeof a)
      throw Error('renderLabelAsync(): labelXml parameter should be specified');
    'string' != typeof a && (a = a.toString());
    b = b || '';
    d = d || '';
    return P().Y(a, b, d);
  }
  w('dymo.label.framework.renderLabelAsync', le);
  w('dymo.label.framework.loadImageAsPngBase64', function (a) {
    return P().loadImageAsPngBase64(a);
  });
  w('dymo.label.framework.loadImageAsPngBase64Async', function (a) {
    return P().U(a);
  });
  w('dymo.label.framework.createLabelWriterPrintParamsXml', function (a) {
    if (!a) return '';
    var b = R('<LabelWriterPrintParams/>'),
      d = b.documentElement;
    a.copies && S(d, 'Copies', a.copies.toString());
    a.jobTitle && S(d, 'JobTitle', a.jobTitle);
    a.flowDirection && S(d, 'FlowDirection', a.flowDirection);
    a.printQuality && S(d, 'PrintQuality', a.printQuality);
    a.twinTurboRoll && S(d, 'TwinTurboRoll', a.twinTurboRoll);
    return ie(b);
  });
  w('dymo.label.framework.createTapePrintParamsXml', function (a) {
    if (!a) return '';
    var b = R('<TapePrintParams/>'),
      d = b.documentElement;
    a.copies && S(d, 'Copies', a.copies.toString());
    a.jobTitle && S(d, 'JobTitle', a.jobTitle);
    a.flowDirection && S(d, 'FlowDirection', a.flowDirection);
    a.alignment && S(d, 'Alignment', a.alignment);
    a.cutMode && S(d, 'CutMode', a.cutMode);
    return ie(b);
  });
  w('dymo.label.framework.createDZPrintParamsXml', function (a) {
    if (!a) return '';
    var b = R('<DZPrintParams/>'),
      d = b.documentElement;
    a.copies && S(d, 'Copies', a.copies.toString());
    a.jobTitle && S(d, 'JobTitle', a.jobTitle);
    a.flowDirection && S(d, 'FlowDirection', a.flowDirection);
    a.alignment && S(d, 'Alignment', a.alignment);
    a.cutMode && S(d, 'CutMode', a.cutMode);
    return ie(b);
  });
  w('dymo.label.framework.createLabelRenderParamsXml', function (a) {
    function b(a, b) {
      S(e, a, void 0, {
        Alpha: b.a || b.alpha || 255,
        Red: b.r || b.red || 0,
        Green: b.g || b.green || 0,
        Blue: b.b || b.blue || 0,
      });
    }
    if (!a) return '';
    var d = R('<LabelRenderParams/>'),
      e = d.documentElement;
    a.labelColor && b('LabelColor', a.labelColor);
    a.shadowColor && b('ShadowColor', a.shadowColor);
    'undefined' != typeof a.shadowDepth &&
      S(e, 'ShadowDepth', a.shadowDepth.toString());
    a.flowDirection && S(e, 'FlowDirection', a.flowDirection);
    'undefined' != typeof a.pngUseDisplayResolution &&
      S(
        e,
        'PngUseDisplayResolution',
        a.pngUseDisplayResolution ? 'True' : 'False',
      );
    return ie(d);
  });
})();
