/* =========================================================================
   LAB/rinth Studio — session S-2026-10-03-01
   Real measurements from the 3 October 2026 range session.

   Peak levels are unweighted (Z-weighted) peak decibels. 6 dB halves the
   peak pressure; about 1 dB is near the smallest change most listeners
   notice. Averages exclude each string's first-round-pop shot, voided
   shots and 2 outliers. A difference is called CLEAR only when it exceeds
   twice its combined standard error; otherwise it is within shot-to-shot
   noise.

   Microphone positions are never combined — placement and windscreen moved
   the bare-muzzle reading from 167.1 dB at P4 to 161.0 dB at P7.

   Edit this file alone to load a new session; the page renders from it.
   ========================================================================= */
(function (global) {
  'use strict';

  var SESSION = {
    id: 'S-2026-10-03-01',
    date: 'Saturday, 3 October 2026',
    window: '1:56 PM – 5:36 PM',
    validShots: 249,
    capturedShots: 259,
    setupsFired: 24,
    setupsConfirmed: 25,
    models: 8,
    labModels: 5,
    competitorModels: 3,
    positions: 4
  };

  var POSITIONS = [
    { id:'P4', name:'Muzzle side',   detail:'9.8 ft left of muzzle, 3.3 ft high',    windscreen:'off', bare:167.1 },
    { id:'P5', name:'At ear',        detail:"At the shooter's ear",                  windscreen:'on',  bare:null  },
    { id:'P6', name:'Pew Pew setup', detail:"6 ft left, 5.5 ft high (Pew Pew Tactical's placement)", windscreen:'on', bare:null },
    { id:'P7', name:'At ear, tripod',detail:"Shooter's ear position, tripod",        windscreen:'on',  bare:161.0 }
  ];

  /* Peak level by configuration. db = mean peak, se = ±2 standard errors
     as plotted, n = shots in the average, vsBare = dB below bare muzzle. */
  var P6 = [
    { label:'LAB 106 · 7 baffles', db:135.5, se:0.8, n:5,  lab:true  },
    { label:'LAB 106 · 6 baffles', db:136.5, se:0.8, n:8,  lab:true  },
    { label:'Polo · 5 baffles',    db:137.2, se:1.4, n:11, lab:false },
    { label:'LAB 106 · 5 baffles', db:138.0, se:0.8, n:6,  lab:true  },
    { label:'Tuna · 6 baffles',    db:139.7, se:1.6, n:6,  lab:false },
    { label:'LAB 101 · 10 baffles',db:139.8, se:1.0, n:5,  lab:true  },
    { label:'LAB 102 · 8 baffles', db:141.1, se:1.2, n:8,  lab:true  },
    { label:'Helios',              db:141.3, se:1.2, n:10, lab:false }
  ];

  var P4 = [
    { label:'Polo · 5 baffles',              db:138.3, se:1.0, n:12, lab:false, vsBare:-28.9 },
    { label:'Polo · 5 baffles (alt. hub)',   db:138.6, se:1.0, n:14, lab:false, vsBare:-28.5 },
    { label:'LAB 106 · 6 baffles (alt. hub)',db:138.7, se:0.9, n:9,  lab:true,  vsBare:-28.5 },
    { label:'LAB 104 · 6 baffles',           db:139.0, se:1.1, n:10, lab:true,  vsBare:-28.2 },
    { label:'LAB 106 · 6 baffles',           db:139.4, se:1.3, n:10, lab:true,  vsBare:-27.8 },
    { label:'LAB 106 · 5 baffles',           db:141.1, se:0.9, n:14, lab:true,  vsBare:-26.0 }
  ];

  /* Baffle-count sweep for the LAB 106, within each position.
     polo = that position's Polo average, drawn as the reference line. */
  var BAFFLES = [
    { pos:'P4', name:'Muzzle side',   polo:138.3, slope:-1.7,
      points:[{b:5,db:141.1},{b:6,db:139.4},{b:6,db:138.7,alt:true}], note:'−1.7 dB per baffle' },
    { pos:'P5', name:'At ear',        polo:138.9, slope:0,
      points:[{b:5,db:139.0},{b:7,db:139.1}], note:'No change' },
    { pos:'P6', name:'Pew Pew setup', polo:137.2, slope:-1.2,
      points:[{b:5,db:138.0},{b:6,db:136.5},{b:7,db:135.5}], note:'−1.2 dB per baffle' },
    { pos:'P7', name:'At ear, tripod',polo:136.9, slope:-0.9,
      points:[{b:5,db:137.2},{b:6,db:137.2},{b:7,db:135.5}], note:'−0.9 dB per baffle' }
  ];

  /* Size versus sound, all eight configurations at P6.
     Lengths and weights are listed silencer values; LAB hubs and caps are
     not included, while the competitors' listed lengths include their
     built-in caps. */
  var SIZE = [
    { label:'LAB 106 · 7 baffles',  db:135.5, inches:6.66, oz:18.0, lab:true,  dLen:'+0.73', dOz:'+2.8', dDb:-1.7 },
    { label:'LAB 106 · 6 baffles',  db:136.5, inches:6.04, oz:16.1, lab:true,  dLen:'+0.11', dOz:'+0.9', dDb:-0.7 },
    { label:'Polo · 5 baffles',     db:137.2, inches:5.93, oz:15.2, lab:false, dLen:'—',     dOz:'—',    dDb:0, ref:true },
    { label:'LAB 106 · 5 baffles',  db:138.0, inches:5.41, oz:14.2, lab:true,  dLen:'−0.52', dOz:'−1.0', dDb:0.8 },
    { label:'Tuna · 6 baffles',     db:139.7, inches:6.36, oz:18.1, lab:false, dLen:'+0.43', dOz:'+2.9', dDb:2.5 },
    { label:'LAB 101 · 10 baffles', db:139.8, inches:5.04, oz:15.1, lab:true,  dLen:'−0.89', dOz:'−0.1', dDb:2.6 },
    { label:'LAB 102 · 8 baffles',  db:141.1, inches:5.54, oz:16.1, lab:true,  dLen:'−0.39', dOz:'+0.9', dDb:3.9 },
    { label:'Helios',               db:141.3, inches:6.74, oz:11.8, lab:false, dLen:'+0.81', dOz:'−3.4', dDb:4.1 }
  ];

  /* LAB 106 against the Polo. Negative = the 106 is quieter. */
  var VS_POLO = [
    { label:'7 baffles', pos:'P5 · at ear',         diff:+0.2, clear:false },
    { label:'7 baffles', pos:'P6 · Pew Pew setup',  diff:-1.7, clear:true  },
    { label:'7 baffles', pos:'P7 · at ear, tripod', diff:-1.4, clear:true  },
    { label:'6 baffles', pos:'P4 · same hub',       diff:+1.1, clear:true  },
    { label:'6 baffles', pos:'P4 · alt. hub',       diff:+0.1, clear:false },
    { label:'6 baffles', pos:'P6',                  diff:-0.7, clear:false },
    { label:'6 baffles', pos:'P7',                  diff:+0.3, clear:false },
    { label:'5 baffles', pos:'P4',                  diff:+2.8, clear:true  },
    { label:'5 baffles', pos:'P5',                  diff:+0.1, clear:false },
    { label:'5 baffles', pos:'P6',                  diff:+0.8, clear:false },
    { label:'5 baffles', pos:'P7',                  diff:+0.3, clear:false }
  ];

  /* One design change at a time. Difference = changed minus original. */
  var CHANGES = [
    { label:'+1 baffle (5 → 6)',  ctx:'LAB 106 · P4', diff:-1.7, clear:true  },
    { label:'+2 baffles (5 → 7)', ctx:'LAB 106 · P5', diff:+0.1, clear:false },
    { label:'+1 baffle (5 → 6)',  ctx:'LAB 106 · P6', diff:-1.5, clear:true  },
    { label:'+1 baffle (6 → 7)',  ctx:'LAB 106 · P6', diff:-0.9, clear:false },
    { label:'+1 baffle (5 → 6)',  ctx:'LAB 106 · P7', diff:-0.0, clear:false },
    { label:'+1 baffle (6 → 7)',  ctx:'LAB 106 · P7', diff:-1.7, clear:true  },
    { label:'106 vs 104',         ctx:'Ports + ribs · 6 baffles · P4', diff:+0.4, clear:false },
    { label:'Alternate hub',      ctx:'LAB 106 · 6 baffles · P4', diff:-0.7, clear:false },
    { label:'Alternate hub',      ctx:'Polo · P4', diff:+0.4, clear:false }
  ];

  /* First shot minus the settled string average, averaged per position.
     The positions carried different silencers, so they do not compare. */
  var POP = [
    { pos:'P4', db:1.5 }, { pos:'P5', db:0.4 },
    { pos:'P6', db:2.0 }, { pos:'P7', db:0.5 }
  ];
  var POP_MAX = { label:'LAB 101', db:4.9 };

  var BAFFLE_COST = { inches:0.63, oz:1.9 };

  var METHODS = [
    ['Sound level meter', 'Larson Davis Spartan 821'],
    ['Weighting',         'Unweighted (Z-weighted) peak, dB'],
    ['Host rifle',        '5.56, ArmaLite pattern'],
    ['Ammunition',        'PMC Bronze .223 Remington, 55-grain FMJ boat-tail'],
    ['Chronograph',       'Garmin Xero C2'],
    ['Weather meter',     'Kestrel 5500'],
    ['Ambient',           '78 °F · 40 % relative humidity · wind 1.7 mph'],
    ['Station pressure',  '25.28 inHg · density altitude ≈ 7,000 ft']
  ];

  global.LAB_STUDIO = {
    SESSION:SESSION, POSITIONS:POSITIONS, P4:P4, P6:P6, BAFFLES:BAFFLES,
    SIZE:SIZE, VS_POLO:VS_POLO, CHANGES:CHANGES, POP:POP, POP_MAX:POP_MAX,
    BAFFLE_COST:BAFFLE_COST, METHODS:METHODS
  };
}(window));
