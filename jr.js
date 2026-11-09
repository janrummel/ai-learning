/* Darstellungs-Schalter hell/dunkel/auto. Speichert nur die Wahl (Schlüssel jr-modus) im localStorage, keine Cookies.
   Auto = folgt der Systemeinstellung; dann wird nichts gespeichert. */
(function () {
  var K = 'jr-modus', root = document.documentElement;
  function lies() { try { return localStorage.getItem(K) || 'auto'; } catch (e) { return 'auto'; } }
  function setze(m) {
    if (m === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', m);
    try { if (m === 'auto') localStorage.removeItem(K); else localStorage.setItem(K, m); } catch (e) {}
    var g = document.querySelector('iframe.giscus-frame');
    if (g) g.contentWindow.postMessage({ giscus: { setConfig: { theme: m === 'auto' ? 'preferred_color_scheme' : m } } }, 'https://giscus.app');
    document.querySelectorAll('.jr-modus button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === m)); b.classList.toggle('active', b.dataset.m === m); });
  }
  var start = lies(); if (start !== 'auto') root.setAttribute('data-theme', start);
  document.addEventListener('DOMContentLoaded', function () {
    var de = (root.lang || 'de').slice(0, 2) === 'de';
    var L = { light: de ? 'Hell' : 'Light', dark: de ? 'Dunkel' : 'Dark', auto: de ? 'Wie System' : 'System' };
    var g = document.createElement('span'); g.className = 'jr-modus'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', de ? 'Darstellung' : 'Appearance');
    [['light', '☀'], ['dark', '☾'], ['auto', '◐']].forEach(function (x) {
      var b = document.createElement('button'); b.type = 'button'; b.dataset.m = x[0]; b.textContent = x[1];
      b.title = L[x[0]]; b.setAttribute('aria-label', L[x[0]]); b.setAttribute('aria-pressed', String(x[0] === start)); if (x[0] === start) b.classList.add('active');
      b.addEventListener('click', function () { setze(x[0]); }); g.appendChild(b);
    });
    var ziel = document.querySelector('.lang-switch');
    if (ziel) ziel.appendChild(g); else { g.classList.add('jr-modus-allein'); document.body.appendChild(g); }
  });
})();
