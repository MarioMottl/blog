(function () {
  var TYPO_CHANCE  = 0.09;
  var BASE_DELAY   = 52;
  var JITTER       = 45;
  var PAUSE_TYPO   = 130;
  var BACK_DELAY   = 75;
  var ENTRY_GAP    = 180;
  var START_DELAY  = 250;

  var adjacent = {
    a:'sqwz',  b:'vghn',  c:'xdfv',  d:'serfcx', e:'wsdr',  f:'drtgvc',
    g:'ftyhbv',h:'gyujnb',i:'ujko',  j:'huikm',  k:'jiol',  l:'kop',
    m:'njk',   n:'bhjm',  o:'iklp',  p:'ol',     q:'wa',    r:'edft',
    s:'awedxz',t:'rfgy',  u:'yhji',  v:'cfgb',   w:'qase',  x:'zsdc',
    y:'tghu',  z:'asx'
  };

  function wrongChar(ch) {
    var lower = ch.toLowerCase();
    var pool  = adjacent[lower];
    if (!pool) return ch;
    var w = pool[Math.floor(Math.random() * pool.length)];
    return ch === ch.toUpperCase() ? w.toUpperCase() : w;
  }

  function buildSeq(text) {
    var seq = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch !== ' ' && ch !== '_' && ch !== '.' && ch !== ',' && Math.random() < TYPO_CHANCE) {
        seq.push({ ch: wrongChar(ch), delay: PAUSE_TYPO });
        seq.push({ backspace: true,   delay: BACK_DELAY });
      }
      seq.push({ ch: ch, delay: BASE_DELAY + Math.random() * JITTER });
    }
    return seq;
  }

  function typeEl(el, onDone) {
    var fullText = el.textContent.trim();
    el.textContent = '';

    var textNode = document.createTextNode('');
    var caret    = document.createElement('span');
    caret.className = 'type-caret';
    el.appendChild(textNode);
    el.appendChild(caret);

    var seq     = buildSeq(fullText);
    var current = '';
    var idx     = 0;

    function step() {
      if (idx >= seq.length) {
        if (onDone) onDone();
        return;
      }
      var item = seq[idx++];
      if (item.backspace) {
        current = current.slice(0, -1);
      } else {
        current += item.ch;
      }
      textNode.textContent = current;
      setTimeout(step, item.delay);
    }

    step();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var els = Array.from(document.querySelectorAll('.post-title'));
    if (!els.length) return;

    var i = 0;
    function next() {
      if (i >= els.length) return;
      typeEl(els[i++], function () { setTimeout(next, ENTRY_GAP); });
    }

    setTimeout(next, START_DELAY);
  });
})();
