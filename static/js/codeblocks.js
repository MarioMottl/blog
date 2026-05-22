(function () {
  document.querySelectorAll('pre').forEach(function (pre) {
    var outerWrap = pre.closest('.codeblock-wrap');
    var link      = outerWrap ? outerWrap.dataset.link      : null;
    var linkLabel = outerWrap ? outerWrap.dataset.linkLabel : null;
    var filename  = outerWrap ? outerWrap.dataset.filename  : null;

    var preWrap = document.createElement('div');
    preWrap.className = 'pre-wrap';
    pre.parentNode.insertBefore(preWrap, pre);
    preWrap.appendChild(pre);

    var codeEl = pre.querySelector('code');

    if (filename) {
      var filenameBar = document.createElement('div');
      filenameBar.className = 'code-filename';
      filenameBar.textContent = filename;
      preWrap.insertBefore(filenameBar, pre);
    }

    var actions = document.createElement('div');
    actions.className = 'code-actions';

    var copyBtn = document.createElement('button');
    copyBtn.className = 'code-btn';
    copyBtn.textContent = 'copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    copyBtn.addEventListener('click', function () {
      var text = codeEl ? codeEl.innerText : pre.innerText;
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.textContent = 'copied!';
        setTimeout(function () { copyBtn.textContent = 'copy'; }, 2000);
      });
    });
    actions.appendChild(copyBtn);

    if (link) {
      var linkBtn = document.createElement('a');
      linkBtn.className = 'code-btn';
      linkBtn.href      = link;
      linkBtn.textContent = linkLabel || 'open';
      linkBtn.target    = '_blank';
      linkBtn.rel       = 'noopener noreferrer';
      actions.appendChild(linkBtn);
    }

    preWrap.appendChild(actions);
  });
})();
