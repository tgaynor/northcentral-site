/* =========================================================================
   LAB/rinth Studio — chart renderers
   Inline SVG in the page's own visual language: #111 ink, #A3A3A3 for
   competitor / within-noise, #E6E6E6 rules, #6B6B6B axis labels.
   Every chart reads from window.LAB_STUDIO — see studio-data.js.
   ========================================================================= */
(function (global) {
  'use strict';
  var D = global.LAB_STUDIO;

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  /* Signed to match the axis: −1.7, +0.4, 0.0 */
  function n1(v){
    var r = Math.abs(v).toFixed(1);
    if (r === '0.0') return '0.0';
    return (v < 0 ? '−' : '+') + r;
  }

  function svg(vb, inner, label){
    return '<svg viewBox="'+vb+'" width="100%" role="img" aria-label="'+esc(label)+'">'+inner+'</svg>';
  }

  /* ---- horizontal dot plot with ±2 SE bars ---------------------------- */
  function dotPlot(rows, opts){
    var W=opts.W||600, L=opts.left, R=opts.right, top=28, rowH=28;
    var H = top + rows.length*rowH + 52;
    var lo=opts.lo, hi=opts.hi;
    var x=function(v){return L + (R-L)*(v-lo)/(hi-lo);};
    var s='';
    // vertical gridlines at each tick
    var ticks=opts.ticks;
    s+='<g stroke="#E6E6E6">';
    ticks.forEach(function(t){ s+='<line x1="'+x(t).toFixed(1)+'" y1="'+(top-8)+'" x2="'+x(t).toFixed(1)+'" y2="'+(top+rows.length*rowH)+'"></line>'; });
    s+='</g>';
    s+='<line x1="'+L+'" y1="'+(top+rows.length*rowH)+'" x2="'+R+'" y2="'+(top+rows.length*rowH)+'" stroke="#111111" stroke-width="0.75"></line>';
    rows.forEach(function(r,i){
      var cy=top+i*rowH+rowH/2;
      var c=r.lab?'#111111':'#A3A3A3';
      // error bar
      s+='<line x1="'+x(r.db-r.se).toFixed(1)+'" y1="'+cy+'" x2="'+x(r.db+r.se).toFixed(1)+'" y2="'+cy+'" stroke="'+c+'" stroke-width="1"></line>';
      // dot: filled for LAB, open for competitor
      s+= r.lab
        ? '<circle cx="'+x(r.db).toFixed(1)+'" cy="'+cy+'" r="5.5" fill="#111111"></circle>'
        : '<circle cx="'+x(r.db).toFixed(1)+'" cy="'+cy+'" r="5.5" fill="#FFFFFF" stroke="#8C8C8C" stroke-width="1.5"></circle>';
      // label + n
      s+='<text x="'+(L-14)+'" y="'+(cy+4)+'" text-anchor="end" font-size="13" fill="#111111">'+esc(r.label)+'</text>';
      s+='<text x="'+(x(r.db+r.se)+10).toFixed(1)+'" y="'+(cy+4)+'" font-size="12" fill="#6B6B6B">'+r.db.toFixed(1)+' · '+r.n+' shots</text>';
    });
    // axis
    s+='<g font-size="12" fill="#6B6B6B">';
    ticks.forEach(function(t){ s+='<text x="'+x(t).toFixed(1)+'" y="'+(top+rows.length*rowH+20)+'" text-anchor="middle">'+t+'</text>'; });
    s+='<text x="'+((L+R)/2)+'" y="'+(top+rows.length*rowH+40)+'" text-anchor="middle">Peak level, dB · bar = ±2 standard errors · further left = quieter</text>';
    s+='</g>';
    return svg('0 0 '+W+' '+H, s, opts.label);
  }

  /* ---- diverging difference bars -------------------------------------- */
  function diffPlot(rows, opts){
    var W=opts.W||600, L=opts.left, R=opts.right, top=26, rowH=26;
    var H = top + rows.length*rowH + 52;
    var lo=-opts.span, hi=opts.span;
    var x=function(v){return L + (R-L)*(v-lo)/(hi-lo);};
    var zero=x(0);
    var s='';
    s+='<g stroke="#E6E6E6">';
    for(var t=-opts.span;t<=opts.span;t++){ if(t!==0) s+='<line x1="'+x(t).toFixed(1)+'" y1="'+(top-6)+'" x2="'+x(t).toFixed(1)+'" y2="'+(top+rows.length*rowH)+'"></line>'; }
    s+='</g>';
    s+='<line x1="'+zero.toFixed(1)+'" y1="'+(top-6)+'" x2="'+zero.toFixed(1)+'" y2="'+(top+rows.length*rowH)+'" stroke="#111111" stroke-width="0.75"></line>';
    rows.forEach(function(r,i){
      var cy=top+i*rowH+rowH/2;
      var c=r.clear?'#111111':'#A3A3A3';
      s+='<line x1="'+zero.toFixed(1)+'" y1="'+cy+'" x2="'+x(r.diff).toFixed(1)+'" y2="'+cy+'" stroke="'+c+'" stroke-width="'+(r.clear?2:1)+'"></line>';
      s+= r.clear
        ? '<circle cx="'+x(r.diff).toFixed(1)+'" cy="'+cy+'" r="5" fill="#111111"></circle>'
        : '<circle cx="'+x(r.diff).toFixed(1)+'" cy="'+cy+'" r="5" fill="#FFFFFF" stroke="#8C8C8C" stroke-width="1.5"></circle>';
      s+='<text x="'+(L-14)+'" y="'+(cy+4)+'" text-anchor="end" font-size="13" fill="#111111">'+esc(r.label)+'</text>';
      s+='<text x="'+(L-14)+'" y="'+(cy+16)+'" text-anchor="end" font-size="11" fill="#8C8C8C">'+esc(r.ctx||r.pos||'')+'</text>';
      var tx = r.diff<0 ? x(r.diff)-10 : x(r.diff)+10;
      s+='<text x="'+tx.toFixed(1)+'" y="'+(cy+4)+'" text-anchor="'+(r.diff<0?'end':'start')+'" font-size="12" fill="#6B6B6B">'+n1(r.diff)+'</text>';
    });
    s+='<g font-size="12" fill="#6B6B6B">';
    for(var t2=-opts.span;t2<=opts.span;t2++){ s+='<text x="'+x(t2).toFixed(1)+'" y="'+(top+rows.length*rowH+20)+'" text-anchor="middle">'+(t2>0?'+':'')+t2+'</text>'; }
    s+='<text x="'+((L+R)/2)+'" y="'+(top+rows.length*rowH+40)+'" text-anchor="middle">Difference, dB · ← quieter · louder →</text>';
    s+='</g>';
    return svg('0 0 '+W+' '+H, s, opts.label);
  }

  /* ---- baffle-count slope panels -------------------------------------- */
  function bafflePanels(){
    return D.BAFFLES.map(function(p){
      var L=52,R=270,top=26,bot=150;
      var all=p.points.map(function(q){return q.db;}).concat([p.polo]);
      var lo=Math.floor(Math.min.apply(null,all)-0.8), hi=Math.ceil(Math.max.apply(null,all)+0.8);
      var x=function(b){return L+(R-L)*(b-4.6)/(7.4-4.6);};
      /* Quieter is up, as on the size-versus-sound chart: lower dB sits
         higher, so the axis runs lo at the top and hi at the bottom. */
      var y=function(v){return top+(bot-top)*(v-lo)/(hi-lo);};
      var s='';
      s+='<g stroke="#E6E6E6">';
      for(var v=lo;v<=hi;v++) s+='<line x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+R+'" y2="'+y(v).toFixed(1)+'"></line>';
      s+='</g>';
      s+='<line x1="'+L+'" y1="'+bot+'" x2="'+R+'" y2="'+bot+'" stroke="#111111" stroke-width="0.75"></line>';
      s+='<line x1="'+L+'" y1="'+top+'" x2="'+L+'" y2="'+bot+'" stroke="#111111" stroke-width="0.75"></line>';
      // Polo reference
      s+='<line x1="'+L+'" y1="'+y(p.polo).toFixed(1)+'" x2="'+R+'" y2="'+y(p.polo).toFixed(1)+'" stroke="#8C8C8C" stroke-dasharray="4 4"></line>';
      s+='<text x="'+(L+4)+'" y="'+(y(p.polo)-6).toFixed(1)+'" font-size="11" fill="#6B6B6B">Polo '+p.polo.toFixed(1)+'</text>';
      // connecting line through solid points only
      var solid=p.points.filter(function(q){return !q.alt;});
      if(solid.length>1){
        s+='<polyline points="'+solid.map(function(q){return x(q.b).toFixed(1)+','+y(q.db).toFixed(1);}).join(' ')+'" fill="none" stroke="#111111" stroke-width="1.25"></polyline>';
      }
      p.points.forEach(function(q){
        var px = x(q.b + (q.alt ? 0.3 : 0));
        s+= q.alt
          ? '<circle cx="'+px.toFixed(1)+'" cy="'+y(q.db).toFixed(1)+'" r="5" fill="#FFFFFF" stroke="#111111" stroke-width="1.5"></circle>'
          : '<circle cx="'+px.toFixed(1)+'" cy="'+y(q.db).toFixed(1)+'" r="5" fill="#111111"></circle>';
        /* Keep each value label clear of the Polo reference line: points
           louder than the Polo sit below it, so their labels hang below. */
        var ly = (q.db > p.polo) ? y(q.db)+17 : y(q.db)-11;
        s+='<text x="'+px.toFixed(1)+'" y="'+ly.toFixed(1)+'" text-anchor="middle" font-size="11" fill="#111111">'+q.db.toFixed(1)+'</text>';
      });
      s+='<g font-size="11" fill="#6B6B6B">';
      [5,6,7].forEach(function(b){ s+='<text x="'+x(b).toFixed(1)+'" y="'+(bot+16)+'" text-anchor="middle">'+b+'</text>'; });
      s+='<text x="'+((L+R)/2)+'" y="'+(bot+32)+'" text-anchor="middle">baffles</text>';
      s+='<text x="'+(L-6)+'" y="'+(y(lo)+4).toFixed(1)+'" text-anchor="end">'+lo+'</text>';
      s+='<text x="'+(L-6)+'" y="'+y(hi).toFixed(1)+'" text-anchor="end">'+hi+'</text>';
      s+='<text x="'+(L-6)+'" y="'+(top+16)+'" text-anchor="end" font-size="10">quieter ▲</text>';
      s+='<text x="'+L+'" y="16" font-size="12" fill="#111111">'+esc(p.pos+' · '+p.name)+'</text>';
      s+='<text x="'+R+'" y="16" text-anchor="end" font-size="11">'+esc(p.note)+'</text>';
      s+='</g>';
      return '<div class="lab-panel-chart">'+svg('0 0 300 190', s,
        p.pos+' '+p.name+': LAB 106 peak level against baffle count, with the Polo average as a dashed reference. '+p.note)+'</div>';
    }).join('');
  }

  /* ---- size versus sound scatter -------------------------------------- */
  function sizeScatter(){
    var W=1240, L=64, R=W-40, top=30, bot=300;
    var x=function(v){return L+(R-L)*(v-4.8)/(7.0-4.8);};
    var y=function(v){return top+(bot-top)*(v-134.8)/(142.0-134.8);};
    var s='';
    s+='<g stroke="#E6E6E6">';
    [136,138,140,142].forEach(function(v){ s+='<line x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+R+'" y2="'+y(v).toFixed(1)+'"></line>'; });
    [5,5.5,6,6.5,7].forEach(function(v){ s+='<line x1="'+x(v).toFixed(1)+'" y1="'+top+'" x2="'+x(v).toFixed(1)+'" y2="'+bot+'"></line>'; });
    s+='</g>';
    s+='<line x1="'+L+'" y1="'+bot+'" x2="'+R+'" y2="'+bot+'" stroke="#111111" stroke-width="0.75"></line>';
    s+='<line x1="'+L+'" y1="'+top+'" x2="'+L+'" y2="'+bot+'" stroke="#111111" stroke-width="0.75"></line>';
    // the 106 trend line through 5 → 6 → 7 baffles
    var line=D.SIZE.filter(function(r){return /LAB 106/.test(r.label);})
                   .sort(function(a,b){return a.inches-b.inches;});
    s+='<polyline points="'+line.map(function(r){return x(r.inches).toFixed(1)+','+y(r.db).toFixed(1);}).join(' ')+'" fill="none" stroke="#111111" stroke-width="1" stroke-dasharray="3 3"></polyline>';
    D.SIZE.forEach(function(r){
      var cx=x(r.inches), cy=y(r.db);
      s+= r.lab
        ? '<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="5.5" fill="#111111"></circle>'
        : '<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="5.5" fill="#FFFFFF" stroke="#8C8C8C" stroke-width="1.5"></circle>';
      var anchor = cx>R-110?'end':'start';
      var dx = anchor==='end'?-10:10;
      /* The Polo sits between two LAB 106 points; hang its label below so the
         three label blocks do not overlap. */
      var y1 = r.ref ? cy+17 : cy-3, y2 = r.ref ? cy+29 : cy+9;
      s+='<text x="'+(cx+dx).toFixed(1)+'" y="'+y1.toFixed(1)+'" text-anchor="'+anchor+'" font-size="11.5" fill="#111111">'+esc(r.label)+'</text>';
      s+='<text x="'+(cx+dx).toFixed(1)+'" y="'+y2.toFixed(1)+'" text-anchor="'+anchor+'" font-size="11" fill="#8C8C8C">'+r.db.toFixed(1)+' dB · '+r.inches.toFixed(2)+' in · '+r.oz.toFixed(1)+' oz</text>';
    });
    s+='<g font-size="12" fill="#6B6B6B">';
    [5,5.5,6,6.5,7].forEach(function(v){ s+='<text x="'+x(v).toFixed(1)+'" y="'+(bot+18)+'" text-anchor="middle">'+v+'</text>'; });
    s+='<text x="'+((L+R)/2)+'" y="'+(bot+36)+'" text-anchor="middle">Listed silencer length, inches (hub and cap not included)</text>';
    [136,138,140,142].forEach(function(v){ s+='<text x="'+(L-8)+'" y="'+(y(v)+4).toFixed(1)+'" text-anchor="end">'+v+'</text>'; });
    s+='<text x="'+(L+4)+'" y="20" fill="#111111">Peak level, dB (quieter ▲)</text>';
    s+='</g>';
    return svg('0 0 '+W+' '+(bot+46), s,
      'Size versus sound at P6. Peak level against listed silencer length for all eight configurations; the LAB 106 tracks the Polo at about the same length.');
  }

  /* ---- first-round pop ------------------------------------------------- */
  function popChart(){
    var W=600, L=58, R=W-25, top=30, bot=150;
    var x=function(i){return L+(R-L)*(i+0.5)/D.POP.length;};
    var y=function(v){return bot-(bot-top)*v/2.4;};
    var s='';
    s+='<g stroke="#E6E6E6">';
    [0.5,1,1.5,2].forEach(function(v){ s+='<line x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+R+'" y2="'+y(v).toFixed(1)+'"></line>'; });
    s+='</g>';
    s+='<line x1="'+L+'" y1="'+bot+'" x2="'+R+'" y2="'+bot+'" stroke="#111111" stroke-width="0.75"></line>';
    s+='<line x1="'+L+'" y1="'+top+'" x2="'+L+'" y2="'+bot+'" stroke="#111111" stroke-width="0.75"></line>';
    D.POP.forEach(function(p,i){
      var cx=x(i);
      s+='<line x1="'+cx.toFixed(1)+'" y1="'+bot+'" x2="'+cx.toFixed(1)+'" y2="'+y(p.db).toFixed(1)+'" stroke="#111111" stroke-width="1"></line>';
      s+='<circle cx="'+cx.toFixed(1)+'" cy="'+y(p.db).toFixed(1)+'" r="5" fill="#111111"></circle>';
      s+='<text x="'+cx.toFixed(1)+'" y="'+(y(p.db)-11).toFixed(1)+'" text-anchor="middle" font-size="12" fill="#111111">+'+p.db.toFixed(1)+'</text>';
      s+='<text x="'+cx.toFixed(1)+'" y="'+(bot+18)+'" text-anchor="middle" font-size="12" fill="#6B6B6B">'+p.pos+'</text>';
    });
    s+='<g font-size="12" fill="#6B6B6B">';
    [0,1,2].forEach(function(v){ s+='<text x="'+(L-8)+'" y="'+(y(v)+4).toFixed(1)+'" text-anchor="end">'+v+'</text>'; });
    s+='<text x="'+(L+4)+'" y="20" fill="#111111">dB above the settled string average</text>';
    s+='</g>';
    return svg('0 0 '+W+' '+(bot+34), s,
      'Average first-round pop by microphone position: P4 plus 1.5, P5 plus 0.4, P6 plus 2.0 and P7 plus 0.5 decibels.');
  }

  global.LAB_CHARTS = {
    p6: function(){ return dotPlot(D.P6, {W:1240, left:300, right:950, lo:134, hi:143, ticks:[134,136,138,140,142],
      label:'Peak level by configuration at P6, the Pew Pew setup. The LAB 106 at 7 baffles reads lowest at 135.5 dB; the Polo reads 137.2 dB.'}); },
    p4: function(){ return dotPlot(D.P4, {W:1240, left:300, right:950, lo:137, hi:143, ticks:[137,138,139,140,141,142],
      label:'Peak level by configuration at P4, muzzle side. Readings run from 138.3 to 141.1 dB against a bare muzzle of 167.1 dB.'}); },
    baffles: bafflePanels,
    size: sizeScatter,
    vsPolo: function(){ return diffPlot(D.VS_POLO.map(function(r){
      return {label:r.label, ctx:r.pos, diff:r.diff, clear:r.clear};}), {W:600, left:235, right:560, span:4,
      label:'LAB 106 against the Polo by baffle count and position. Negative values mean the 106 is quieter; filled markers are clear differences.'}); },
    changes: function(){ return diffPlot(D.CHANGES, {W:600, left:235, right:560, span:4,
      label:'One design change at a time. Baffle steps produced the clear differences; porting, ribs and hub swaps did not.'}); },
    pop: popChart
  };
}(window));
