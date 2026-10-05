/* =========================================================================
   LAB/rinth Studio — test data and curve generators
   Ported from design-reference/labconcept/Studio.dc.html renderVals().
   The generator functions are unchanged from the design.

   ALL VALUES BELOW ARE PLACEHOLDERS. To drop in real measurements, edit
   LAB_DATA only — the generators and the page markup need no changes.
   ========================================================================= */
(function (global) {
  'use strict';

  /* ---- the only thing to edit when real test results arrive ---- */
  var LAB_DATA = {
    /* Figure 1 — pressure trace: amp, tau, f, delay */
    traceUnsuppressed: { amp: 1.8,  tau: 0.55, f: 2.1, delay: 0.35 },
    traceSuppressed:   { amp: 0.55, tau: 0.32, f: 2.6, delay: 0.42 },

    /* Figure 3 — 1/3-octave spectrum, dB per band (bands below) */
    bands:            [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000],
    spectrumUnsupp:   [112, 120, 128, 134, 138, 139, 136, 130, 122],
    spectrumSupp:     [104, 109, 113, 114, 112, 108, 103, 98, 92],

    /* Figure 5 — ten-shot string, precomputed points in the design */
    popLine: '82,48 136,118 190,127 244,124 298,131 352,127 406,134 460,124 514,130 568,127',

    /* Figure 6 — outer surface temperature, degrees C */
    heatVals: [22, 70, 125, 180, 225, 262, 290, 312, 328, 260, 200, 155, 120]
  };

  /* ---- generators, ported verbatim from the design's renderVals() ---- */

  function trace(amp, tau, f, delay) {
    var pts = [];
    for (var i = 0; i <= 400; i++) {
      var t = i / 400 * 5;
      var p = 0;
      if (t >= delay) {
        var u = t - delay;
        p = amp * Math.exp(-u / tau) * Math.sin(2 * Math.PI * f * u + 1.2) +
            amp * 0.35 * Math.exp(-u / (tau * 0.25)) * Math.cos(2 * Math.PI * f * 2.3 * u);
      }
      var x = 70 + 1270 * i / 400;
      var y = 200 - 80 * Math.max(-2, Math.min(2, p));
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    return pts.join(' ');
  }

  function logx(hz) {
    return 60 + 520 * (Math.log(hz / 31.5) / Math.log(8000 / 31.5));
  }

  function yv(v) {
    return 200 - 180 * (v - 80) / 67.5;
  }

  function spec(vals) {
    return LAB_DATA.bands.map(function (b, i) {
      return logx(b).toFixed(1) + ',' + yv(vals[i]).toFixed(1);
    }).join(' ');
  }

  function heatCurve(heatVals) {
    return heatVals.map(function (v, i) {
      var x = i <= 8 ? 60 + 340 * i / 8 : 400 + 180 * (i - 8) / 4;
      return x.toFixed(1) + ',' + (200 - 180 * v / 400).toFixed(1);
    }).join(' ');
  }

  /* ---- computed point strings, keyed to the polyline ids in the page ---- */
  var a = LAB_DATA.traceUnsuppressed;
  var b = LAB_DATA.traceSuppressed;

  global.LAB_DATA = LAB_DATA;
  global.LAB_CURVES = {
    traceA:  trace(a.amp, a.tau, a.f, a.delay),
    traceB:  trace(b.amp, b.tau, b.f, b.delay),
    specA:   spec(LAB_DATA.spectrumUnsupp),
    specB:   spec(LAB_DATA.spectrumSupp),
    popLine: LAB_DATA.popLine,
    heat:    heatCurve(LAB_DATA.heatVals)
  };
}(window));
